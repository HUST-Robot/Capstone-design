/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information how you can configurate this file
 * See https://github.com/MichMich/MagicMirror#configuration
 *
 */

var config = {
	address: "localhost", // Address to listen on, can be:
	                      // - "localhost", "127.0.0.1", "::1" to listen on loopback interface
	                      // - another specific IPv4/6 to listen on a specific interface
	                      // - "", "0.0.0.0", "::" to listen on any interface
	                      // Default, when address config is left out, is "localhost"
	port: 8080,
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], // Set [] to allow all IP addresses
	                                                       // or add a specific IPv4 of 192.168.1.5 :
	                                                       // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
	                                                       // or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
	                                                       // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],
	language: "kr",
	timeFormat: 24,
	units: "metric",

	modules: [
		{
			module: "MMM-Logging",

		},
		{
			module: "calendar_monthly",
			position: "top_left",
		},
		{
			module: "MMM-CalendarWeek",
			position: "bottom_bar",	// This can be any of the regions. Best results in bottom region.
			config: {
				// The config property is optional.
				// If no config is set, an example calendar is shown.
				// See 'Configuration options' for more information.
				maximumNumberOfDays: "5",
				allowDuplicate: true,
				hideEmptyDays: false,
				fetchInterval: 6000, // 1분 
				maximumDaysPerLine: "5",
				showEndDate: true,
				displayLocation: true,
				displayDescription: true,
				fetchinterval: 2000,
				calendarTitle: "대구 로봇산업 혁신아카데미 1st 일정",
				calendars: [
					{
						// 보여주고 싶은 캘린더 
						symbol: "calendar",
						url: "https://calendar.google.com/calendar/ical/ekisq4uhn82esed2n62irao0as%40group.calendar.google.com/public/basic.ics"
					},
					{

						// 한국 국경일 관련 캘린더 
						symbol: "calendar",
						url: "https://calendar.google.com/calendar/ical/ltm0jrlsamv8mlhrg0bpcgu6ps%40group.calendar.google.com/public/basic.ics"

						
					},
					
				],
			
			}
		},
		{
			module: "clock",
			position: "top_left",
			//classes: 'default everyone'
		},
		{
			module: "weatherforecast",
			header: "Weather Forecast",
			units: "metric",
			position: "top_right",
			config: {
				location:  "Korea",
				locationID: "1835329",
				appid: "32c1932fbbd8bea14d05e59c4d4461dd",
				iconTable: {
					"01d": "wi-day-sunny",
					"02d": "wi-day-cloudy",
					"03d": "wi-cloudy",
					"04d": "wi-cloudy-windy",
					"09d": "wi-showers",
					"10d": "wi-rain",
					"11d": "wi-thunderstorm",
					"13d": "wi-day-sunny",
					"50d": "wi-fog",
					"01n": "wi-night-clear",
					"02n": "wi-night-cloudy",
					"03n": "wi-night-cloudy",
					"04n": "wi-night-cloudy",
					"09n": "wi-night-showers",
					"10n": "wi-night-rain",
					"11n": "wi-night-thunderstorm",
					"13n": "wi-night-snow",
					"50n": "wi-night-alt-cloudy-windy"
				}
			},
			//classes: 'default'
		},
		
		/*
		{
			module: 'MMM-Facial-Recognition-OCV3',
			config: {
				// Threshold for the confidence of a recognized face before it's considered a
				// positive match.  Confidence values below this threshold will be considered
				// a positive match because the lower the confidence value, or distance, the
				// more confident the algorithm is that the face was correctly detected.
				threshold: 80,
				// force the use of a usb webcam on raspberry pi (on other platforms this is always true automatically)
				useUSBCam: true,
				// Path to your training xml
				trainingFile: '/home/pi/Capstone-design/SmartMirror/modules/MMM-Facial-Recognition-OCV3/training.xml',
				// recognition intervall in seconds (smaller number = faster but CPU intens!)
				interval: 2,
				// Logout delay after last recognition so that a user does not get instantly logged out if he turns away from the mirror for a few seconds
				logoutDelay: 15,
				// Array with usernames (copy and paste from training script)
				users: ['kyg'],
				//Module set used for strangers and if no user is detected
				defaultClass: "default",
				//Set of modules which should be shown for every user
				everyoneClass: "everyone",
				// Boolean to toggle welcomeMessage
				welcomeMessage: true
			}
		},
		*/
		/*
		{
			module: 'MMM-Wunderlist-Enhanced',
			position: 'top_right',	// This can be any of the regions. Best results in left or right regions.
			header: 'Wunderlist', // This is optional
			config: {
				// See 'Configuration options' for more information.
			},
			classes: 'default everyone'
		},
		*/
		/*
		{
			module: "MMM-Hotword",
			position: "bottom_left",
			config: {
			    chimeOnFinish:null,
			    mic: {
			      recordProgram : "arecord",  
			      device        : "plughw:1",
			    },
			    models: [
			      {
			        hotwords    : "smart_mirror",
			        file        : "smart_mirror.umdl",
			        sensitivity : "0.5",
			      },
			      {
			        hotwords    : "mirror_mirror",
			        file        : "mirrormirror.pmdl",
			        sensitivity : "0.5",
			      },			      
			    ],
			    defaultCommand: {
			      notificationExec: {
			        notification: "ASSISTANT_ACTIVATE",
			        payload: (detected, afterRecord) => {
			          return {profile:"default"}
			        }
			      },
			      afterRecordLimit: 0,
			      autorestart: true,
			      restart: false
			      //restart: true
			    },
  			},
			//classes: 'default everyone'
		},
		{
			module: "MMM-AssistantMk2",
			position: "bottom_left",
			config:
			{
				// youtube에서 hotword 인식되면 돌아오도록 함.
				pauseOnYoutube: false,
				useScreen: true,
				deviceLocation:{
					coordinates: {
					latitude: 35.8375499,
					longitude: 128.4887422
				},
			},
			profiles: {
				"default": {
					profileFile: "default.json",
					lang: "ko-KR"
				},
			}
			},
			//classes: 'default everyone'
		},		
		*/
		{
			module: 'MMM-AirQuality',
			position: 'top_center', // you may choose any location
			config: {
			  location: 'daegu' // the location to check the index for
			}
		}


	]

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
