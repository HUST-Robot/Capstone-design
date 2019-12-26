var recipe = {
  transcriptionHook: {
    "SCREEN_ON": {
      pattern: "wake up",
      command: "SCREENON"
    },
    "SCREEN_OFF": {
      pattern: "go to sleep",
      command: "SCREENOFF"
    },
  },
  command: {
    "SCREENON": {
      shellExec: {
        exec: (params, key) => {
          return "~/MagicMirror/modules/MMM-AssistantMk2/scripts/screenon.sh"
          //return "ls -al"
        },
        options: (params, key)=> {
          return ""
        },
      }
    },
    "SCREENOFF": {
      shellExec: {
        exec: "~/MagicMirror/modules/MMM-AssistantMk2/scripts/screenoff.sh",
        options: null,
      }
    },
  }
}

exports.recipe = recipe // Don't remove this line.
