//
// Module : MMM-AssistantMk2
//

"use strict"

const path = require("path")
const record = require("node-record-lpcm16")
const GoogleAssistant = require("google-assistant")
const exec = require("child_process").exec
const fs = require("fs")
const serialize = require("./vendor/serialize.js")


var NodeHelper = require("node_helper")

module.exports = NodeHelper.create({
  start: function () {
    this.config = {}
    this.continueConversation = false
    this.currentPayload = null
    this.speaker = null
  },

  play: function(file, command, option, cb=()=>{}) {
    const player = require('play-sound')()
    this.sendSocketNotification("SPEAKER_ON")
    var co = {}
    co[command] = option
    this.speaker = player.play(file, co, (err)=>{
      if (err && !err.killed) {
        console.log("Speaker error:", err)
        throw err
      }
      this.sendSocketNotification("SPEAKER_OFF")
      cb()
    })
  },

  playChime: function (cb) {
    var com = this.config.play.playProgram
    var option = this.config.play.playOption
    var file = path.resolve(__dirname, "resources", this.config.startChime)
    this.play(file, com, option, ()=>{cb()})
  },

  playResponse: function (file, cb) {
    var com = this.config.play.playProgram
    var option = this.config.play.playOption
    if (this.config.responseVoice) {
      this.play(file, com, option, ()=>{
        fs.unlink(file, (err) => {
          if (err) {
            console.log("[AMK2] Clearing response file error:", err)
          }
        })
        cb()
      })
    } else {
      cb()
    }
  },

  clearTmp: function() {
    var dir = path.resolve(__dirname, "tmp")
    var cmd = "cd " + dir + "; rm *.mp3; rm *.html"
    exec(cmd, (e,so,se)=>{
      console.log("[AMK2] Temporal storage directory is clearing.")
      //if (e) console.log(e)
    })
  },

  loadRecipes: function(cb) {
    var recipes = this.config.recipes
    for (var i = 0; i < recipes.length; i++) {
      var p = require("./recipes/" + recipes[i]).recipe
      if (p.transcriptionHook) this.config.transcriptionHook = Object.assign({}, this.config.transcriptionHook, p.transcriptionHook)
      if (p.action) this.config.action = Object.assign({}, this.config.action, p.action)
      if (p.command) this.config.command = Object.assign({}, this.config.command, p.command)
      console.log("[AMK2] Recipe is loaded:", recipes[i])
      this.sendSocketNotification("LOAD_RECIPE", serialize.serialize(p))
    }
    cb()
  },


  initializeAfterLoading: function (config, cb) {
    this.config = config
    if (!this.config.verbose) {
      console.log = function() {}
    }
    this.gactionCLI()
    this.clearTmp()
    this.loadRecipes(cb)
  },

  gactionCLI: function() {
    if (this.config.useGactionCLI) {
      var cdPath = path.resolve(__dirname, "gaction")
      var cmd = "cd " + cdPath + "; ./gactions test --action_package actions.json --project " + this.config.projectId
      exec(cmd, (e, so, se)=>{
        console.log("[AMK2] GAction action package updates:", so, se)
        if (e) console.log(e)
      })
    }
  },

  socketNotificationReceived: function (notification, payload) {
    switch(notification) {
    case "INIT":
      this.initializeAfterLoading(payload, ()=>{
        this.sendSocketNotification("INITIALIZED", this.config)
      })

      break
    case "START":
      this.prepareActivate(payload)
      break
    case "SHELLEXEC":
      var command = payload.command
      command += (payload.options) ? (" " + payload.options) : ""
      exec (command, (e,so,se)=> {
        console.log("[AMK2] ShellExec command:", command)
        if (e) console.log(e)
      })
      break
    case this.config.notifications.ASSISTANT_DEACTIVATED:
      if (this.speaker) {
        this.speaker.kill()
      }
      break
    }
  },

  prepareActivate: function(pObj) {
    var payload = pObj.profile
    var textQuery = pObj.textQuery
    var sender = pObj.sender
    var id = pObj.id

    if (this.continueConversation) {
      payload = this.currentPayload
    }

    var cb = ()=>{
      if (textQuery) {
        this.sendSocketNotification("TRANSCRIPTION", {done:true, transcription:textQuery})
      }
      this.activate(payload, textQuery, sender)
    };
    if (pObj.sayMode == true && this.config.noChimeOnSay) {
      cb()
    } else {
      this.playChime(cb)
    }
  },

  activate: function(payload, textQuery=null, sender=null) {
    var mic
    var transcriptionHook = this.config.transcriptionHook

    var cfgInstance = {
      auth:{
        keyFilePath : path.resolve(__dirname, this.config.auth.keyFilePath),
        savedTokensPath : path.resolve(__dirname, "profiles/" + payload.profileFile),
      },
      conversation : {
        audio : {
          encodingIn: "LINEAR16",
          sampleRateIn: 16000,
          encodingOut: this.config.play.encodingOut,
          sampleRateOut: this.config.play.sampleRateOut,
        },
        lang : payload.lang,
        deviceModelId : this.config.deviceModelId,
        deviceId : this.config.deviceInstanceId,
        deviceLocation : this.config.deviceLocation,
        screen : {
          isOn: this.config.responseScreen
        },
      },
    }

    if (textQuery) {
      cfgInstance.conversation.textQuery = textQuery
    }

    this.currentPayload = payload

    var startConversation = (conversation) => {
      console.log("[AMK2] Conversation starts.")
      if (textQuery) {
        console.log("[AMK2] Started with text query:", textQuery)
      }

      let foundHook = []
      let foundAction = null
      let foundVideo = null
      let foundVideoList = null
      let foundOpenSpotify = null
      let foundTextResponse = ""
      let finalTranscription = ""
      let audioError = null
      let spoken = null
      let screenOutput = null

      let audioBuffer = 0

      var mp3Key = Date.now()
      var mp3FileName = mp3Key + ".mp3"
      var mp3FilePath = "tmp/" + mp3FileName

      var mp3File = path.resolve(__dirname, mp3FilePath)
      var wstream = fs.createWriteStream(mp3File)

      // setup the conversation
      conversation
      .on("audio-data", (data) => {
        audioBuffer += data.length;
        try {
          if (data.length > 0) {
            wstream.write(data)
          }
        } catch (error) {
          wstream.end()
          audioError = error
          console.error("[AMK2] E:", error)
          console.log("[AMK2] Some error happens. Try again.")
        }
      })
      // done speaking, close the mic
      .on("end-of-utterance", () => {
        console.log("[AMK2] end-of-utterance")
        mic.stop()
        this.sendSocketNotification("MIC_OFF")
      })
      // just to spit out to the console what was said (as we say it)
      .on("transcription", (data) => {
        console.log("[AMK2] Transcription:", data.transcription, " --- Done:", data.done)
        this.sendSocketNotification("TRANSCRIPTION", data)
        if (data.done) {
          finalTranscription = data.transcription
          spoken = true
        }
      })

      // what the assistant said back. But currently, GAS doesn"t return text response with screenOut at same time (maybe.)
      .on("response", (text) => {
        console.log("[AMK2] Assistant Text Response:", text)
        foundTextResponse = text
      })
      // if we"ve requested a volume level change, get the percentage of the new level
      // But I"ll not support this feature.
      .on("volume-percent", (percent) => {
        console.log("[AMK2] Volume control... Not yet supported")
      })
      // the device needs to complete an action
      .on("device-action", (action) => {
        console.log(action, payload)
        console.log("[AMK2] Device Action:", action)
        if (typeof action["inputs"] !== "undefined") {
          var intent = action.inputs[0].payload.commands[0].execution[0]
          console.log("[AMK2] Action execution", intent)
          foundAction = intent
        }
      })
      .on("screen-data", (screen) => {
        var self = this
        var file = require("fs")
        var filePath = path.resolve(__dirname, "tmp", "temp.html")
        screenOutput = "temp.html"
        var str = screen.data.toString("utf8")
        str = str.replace("html,body{", "html,body{zoom:" + this.config.screenZoom + ";")


        /*
        // TODO:I'll put some code here for web scrapping for contents reading.
        //For Image Search
        //https://www.google.com/search?tbm=isch

        var re = new RegExp("(tbm=isch[^<]*)", "ig")
        var isch = re.exec(str)
        //console.log("image:", isch)
        if (isch) {
          this.sendSocketNotification("IMAGE_OUTPUT", isch)
        }
        */
        var contents = file.writeFile(filePath, str,
          (error) => {
            if (error) {
             console.error("[AMK2] - temporal HTML creation fails. E: " + error);
             screenOutput = null
            }
          }
        )

        var re = new RegExp("youtube\.com\/watch\\?v\=([0-9a-zA-Z\-\_]+)", "ig")
        var youtubeVideo = re.exec(str)
        if (youtubeVideo && this.config.youtubeAutoplay) {
          console.log("[AMK2] video found:", youtubeVideo[1])
          foundVideo = youtubeVideo[1]
        }

        var re = new RegExp("youtube\.com\/playlist\\?list\=([a-zA-Z0-9\-\_]+)", "ig")
        var youtubeList = re.exec(str)
        if (youtubeList && this.config.youtubeAutoplay) {
          console.log("[AMK2] video list found:", youtubeList[1])
          foundVideoList = youtubeList[1]
        }

        var re = new RegExp("https:\/\/open\.spotify\.com\/([a-zA-Z0-9?\/]+)", "gm")
        var openSpotify = re.exec(str)
        if (openSpotify) {
          console.log("[AMK2] openSpotify found:", openSpotify[0])
          foundOpenSpotify = openSpotify[0]
        }
      }
         )

      // once the conversation is ended, see if we need to follow up
      .on("ended", (error, continueConversation) => {
        if (continueConversation) {
          this.continueConversation = continueConversation
          foundHook = []
          foundVideo = null
          foundVideoList = null
          foundOpenSpotify = null
        } else {
          var tr = (textQuery) ? textQuery : finalTranscription
          foundHook = this.findHook(transcriptionHook, tr)
        }

        if (error) {
          console.error("[AMK2] Conversation Ended Error:", error)
          console.error("[AMK2] Conversation Error:", error)
          this.sendSocketNotification("CONVERSATION_ERROR", error)
          return
        } else {
          error = null
        }

        setTimeout(()=>{
          wstream.end()
          var conversationResult = {
            "screenOutput": screenOutput,
            "foundHook": foundHook,
            "foundAction": foundAction,
            "foundVideo": foundVideo,
            "foundVideoList": foundVideoList,
	          "foundOpenSpotify": foundOpenSpotify,
            "foundTextResponse" : foundTextResponse,
            "finalTranscription" : finalTranscription,
            "spoken": spoken,
            "audioSize" : audioBuffer,
            "audioError" : audioError,
            "responseFile" : mp3FileName,
            "continueConversation": continueConversation,
            "error" : error,
            "sender": sender,
          }

          if (conversationResult.foundHook.length > 0) {
            console.log("[AMK2] Conversation Completed")
            this.sendSocketNotification("CONVERSATION_END", conversationResult)
          } else {
            if (conversationResult.audioSize <= 0) {
              if (!this.config.ignoreNoVoiceError) {
                conversationResult.audioError = "NO RESPONSE AUDIO IS RETURNED."
                conversationResult.error = conversationResult.audioError
                console.log("[AMK2]", conversationResult.audioError)
              }
              this.sendSocketNotification("CONVERSATION_END", conversationResult)
            } else {
              this.sendSocketNotification("RESPONSE_START", conversationResult)
              this.playResponse(mp3File, ()=>{
                console.log("[AMK2] Conversation Completed")
                this.sendSocketNotification("RESPONSE_END", conversationResult)
                setTimeout(()=>{
                  this.sendSocketNotification("CONVERSATION_END", conversationResult)
                }, 10)
              })
            }
          }
        }, 100)
      })

      // catch any errors
      .on("error", (error) => {
        wstream.end()
        console.error("[AMK2] Conversation Error:", error)
        this.sendSocketNotification("CONVERSATION_ERROR", error)
      })
      if (!textQuery) {
        mic = record.record(this.config.record)
        this.sendSocketNotification("MIC_ON")
        mic.stream()
	  .on("data", (data) => {
	/*
          try {
            conversation.write(data)
          } catch (err) {
            mic.stop()
            this.sendSocketNotification("MIC_OFF")
            console.error("[AMK2] mic error:", err)
          }
	*/
	    conversation.write(data) })
	  .on("error", (error) => { console.log("[AMK2] Recorder Error: " + error) }) // for RPI debug (AMk2v3)
	// so there is the same error with RPI and arecord
	// arecord has exited with error code 1.
	// i don't know if you want to set mic.stop() + noti ?
	// Bugsounet
      }
    }

    var assistant = new GoogleAssistant(cfgInstance.auth)
    assistant
    .on("ready", () => {
    // start a conversation!
      console.log("[AMK2] assistant ready")
      this.sendSocketNotification("ASSISTANT_READY")
      assistant.start(cfgInstance.conversation)
    })
    .on("started", startConversation)
    .on("error", (error) => {
      mic.stop()
      this.sendSocketNotification("MIC_OFF")
      console.error("[AMK2] Assistant Error:", error)
      this.sendSocketNotification("ASSISTANT_ERROR", error)
    })
  },

  findHook: function(transcriptionHook, transcription) {
    var foundHook = []
    for (var k in transcriptionHook) {
      if (transcriptionHook.hasOwnProperty(k)) {
        var v = transcriptionHook[k];
        var pattern = new RegExp(v.pattern, "ig")
        var found = pattern.exec(transcription)
        if (found !== null) {
          foundHook.push({"key":k, "match":found})
        }
      }
    }
    console.log("foundHook", foundHook)
    return foundHook
  }
})
