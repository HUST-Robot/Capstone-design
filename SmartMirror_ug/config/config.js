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

	language: "en",
	timeFormat: 24,
	units: "metric",

	modules: [
		{
			module: "alert",
			// config: {
			// 	welcome_message: "Hello world!"
			// },
			classes: 'kyg testtt'
		},
		{
			module: "clock",
			position: "top_left",
			classes: 'default everyone'
		},
		{
			module: "compliments",
			position: "lower_third",
			classes: 'default'
		},
		{
			module: 'MMM-Facial-Recognition-OCV3',
			config: {
				// Threshold for the confidence of a recognized face before it's considered a
				// positive match.  Confidence values below this threshold will be considered
				// a positive match because the lower the confidence value, or distance, the
				// more confident the algorithm is that the face was correctly detected.
				threshold: 70,
				// force the use of a usb webcam on raspberry pi (on other platforms this is always true automatically)
				useUSBCam: true,
				// Path to your training xml
				trainingFile: '/home/ug/Capstone-design_tmp/SmartMirror_ug/modules/MMM-Facial-Recognition-OCV3/training.xml',
				// recognition intervall in seconds (smaller number = faster but CPU intens!)
				interval: 2,
				// Logout delay after last recognition so that a user does not get instantly logged out if he turns away from the mirror for a few seconds
				logoutDelay: 30,
				// Array with usernames (copy and paste from training script)
				users: ['testtt', 'kyg'],
				//Module set used for strangers and if no user is detected
				defaultClass: "default",
				//Set of modules which should be shown for every user
				everyoneClass: "everyone",
				// Boolean to toggle welcomeMessage
				welcomeMessage: true
    		}
		},
		{
			module: "weatherforecast",
			header: "Weather Forecast",
			units: "metric",
			position: "top_right",
			config: {
				//location: "daegu",
				//locationID: "1835329",
				//location: "London",
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
				},
				colored: true
			},
			classes: 'kyg'
		},
	]

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
