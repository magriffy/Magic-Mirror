/* Config Sample
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/configuration/introduction.html
 * and https://docs.magicmirror.builders/modules/configuration.html
 *
 * You can use environment variables using a `config.js.template` file instead of `config.js`
 * which will be converted to `config.js` while starting. For more information
 * see https://docs.magicmirror.builders/configuration/introduction.html#enviromnent-variables
 */
let config = {
	address: "0.0.0.0",	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/",	// The URL path where MagicMirror² is hosted. If you are using a Reverse proxy
									// you must set the sub path here. basePath must end with a /
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.1/120", "192.168.1.1/24"],	// Set [] to allow all IP addresses
									// or add a specific IPv4 of 192.168.1.5 :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
									// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false,			// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "",	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "",	// HTTPS Certificate path, only require when useHttps is true

	language: "en",
	locale: "en-US",   // this variable is provided as a consistent location
			   // it is currently only used by 3rd party modules. no MagicMirror code uses this value
			   // as we have no usage, we  have no constraints on what this field holds
			   // see https://en.wikipedia.org/wiki/Locale_(computer_software) for the possibilities

	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 12,
	units: "imperial",

	modules: [
		{
			module: "alert",
		},
		{
			module: "MMM-Cursor",
			config: {
				timeout: 1500
			}
		},
		{
			module: "updatenotification",
			position: "top_bar"
		},
		{
			module: "MMM-BackgroundSwitcher",
			position: "top_center",
		},
		{
			module: "clock",
			position: "top_left"
		},
		{
			module: "calendar",
			header: "US Holidays",
			position: "top_left",
			config: {
				calendars: [
					{
						fetchInterval: 7 * 24 * 60 * 60 * 1000,
						symbol: "calendar-check",
						url: "https://ics.calendarlabs.com/76/mm3137/US_Holidays.ics"
					}
				]
			}
		},
		{
			module: "MMM-Assistant",
			position: "lower_third",
			config: {
				llmEndpoint: "http://localhost:11434/api/generate",
				model: "llama3.1:8b",
				systemPrompt: "You are a helpful voice assistant for a MagicMirror. Answer concisely.",
				responseClearDelay: 5000,
				volume: 0.5,
			}
		},
		// {
		// 	module: "MMM-EasyPix",
		// 	position: "middle_center",
		// 	config: {
		// 		picName: "forest.jpg",
		// 		maxWidth: "100%"
		// 	}
		// },
		{
			module: "MMM-MktIndex",
			position: "bottom_left",
			config: {
				timeFormat: "DD-MM HH:mm",
				symbols: ["^DJI", "^IXIC", "^GSPC", "^TNX", "CL=F", "EURUSD=X"],
				// Label name for each symbol. When you use `alias`, the number of symbols and aliases should be the same.
				// If value is null or "", symbol string will be used by default.
				alias: ["DOW 30", "Nasdaq", "S&P 500", "10yr Bond", "Crude Oil", "EUR/USD"],
				updateInterval: 180,    // Query interval in seconds
			}
		},
		{
			module: 'MMM-SmartTouch',
			position: 'bottom_center',    // This can be any of the regions.(bottom-center Recommended)
			config: {
				// The config property is optional.
				}
		},
		{
			module: 'MMM-Remote-Control',
			position: 'bottom_right', // Required to show URL/QR code on mirror
			// you can hide this module afterwards from the remote control itself
			config: {
				customCommand: {},  // Optional, See "Using Custom Commands" below
				showModuleApiMenu: true, // Optional, Enable the Module Controls menu
				secureEndpoints: true, // Optional, See API/README.md
				// uncomment any of the lines below if you're gonna use it
				// customMenu: "custom_menu.json", // Optional, See "Custom Menu Items" below
				// apiKey: "", // Optional, See API/README.md for details
				// classes: {}, // Optional, See "Custom Classes" below

				// QR Code options (new!)
				showQRCode: true, // Optional, display QR code for easy mobile access (default: true)
				qrCodeSize: 150, // Optional, size of QR code in pixels (default: 150)
				qrCodePosition: "replace" // Optional:
				//   "below" - Show URL above, QR code below (default)
				//   "above" - Show QR code above, URL below
				//   "replace" - Show only QR code, no URL text
			}
		},
		// {
		// 	module: "compliments",
		// 	position: "lower_third"
		// },
		{
			module: "weather",
			position: "top_right",
			config: {
				weatherProvider: "openmeteo",
				type: "current",
				lat: 42.9826,
				lon: -77.4089
			}
		},
		{
			module: "weather",
			position: "top_right",
			header: "Weather Forecast",
			config: {
				weatherProvider: "openmeteo",
				type: "forecast",
				lat: 42.9826,
				lon: -77.4089
			}
		},
		{
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				feeds: [
					{
						title: "New York Times",
						url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"
					}
				],
				showSourceTitle: true,
				showPublishDate: true,
				broadcastNewsFeeds: true,
				broadcastNewsUpdates: true
			}
		},
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
