/* Magic Mirror
 * Node Helper: Calendar - CalendarFetcher
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var ical = require("./vendor/ical.js");
var moment = require("moment");

var CalendarFetcher = function(url, reloadInterval, excludedEvents, maximumEntries, maximumNumberOfDays, auth, includePastEvents) {
	var self = this;

	var reloadTimer = null;
	var events = [];

	var fetchFailedCallback = function() {};
	var eventsReceivedCallback = function() {};

	/* fetchCalendar()
	 * Initiates calendar fetch.
	 */
	var fetchCalendar = function() {

		clearTimeout(reloadTimer);
		reloadTimer = null;

		nodeVersion = Number(process.version.match(/^v(\d+\.\d+)/)[1]);
		var opts = {
			headers: {
				"User-Agent": "Mozilla/5.0 (Node.js "+ nodeVersion + ") MagicMirror/"  + global.version +  " (https://github.com/MichMich/MagicMirror/)"
			},
			gzip: true
		};

		if (auth) {
			if(auth.method === "bearer"){
				opts.auth = {
					bearer: auth.pass
				};

			} else {
				opts.auth = {
					user: auth.user,
					pass: auth.pass
				};

				if(auth.method === "digest"){
					opts.auth.sendImmediately = false;
				} else {
					opts.auth.sendImmediately = true;
				}
			}
		}

		ical.fromURL(url, opts, function(err, data) {
			if (err) {
				fetchFailedCallback(self, err);
				scheduleTimer();
				return;
			}

			// console.log(data);
			newEvents = [];

			// limitFunction doesn't do much limiting, see comment re: the dates array in rrule section below as to why we need to do the filtering ourselves
			var limitFunction = function(date, i) {return true;};

			var eventDate = function(event, time) {
				return (event[time].length === 8) ? moment(event[time], "YYYYMMDD") : moment(new Date(event[time]));
			};

			for (var e in data) {
				var event = data[e];
				var now = new Date();
				var today = moment().startOf("day").toDate();
				var future = moment().startOf("day").add(maximumNumberOfDays, "days").subtract(1,"seconds").toDate(); // Subtract 1 second so that events that start on the middle of the night will not repeat.
				var past = today;

				if (includePastEvents) {
					past = moment().startOf("day").subtract(maximumNumberOfDays, "days").toDate();
				}

				// FIXME:
				// Ugly fix to solve the facebook birthday issue.
				// Otherwise, the recurring events only show the birthday for next year.
				var isFacebookBirthday = false;
				if (typeof event.uid !== "undefined") {
					if (event.uid.indexOf("@facebook.com") !== -1) {
						isFacebookBirthday = true;
					}
				}

				if (event.type === "VEVENT") {

					var startDate = eventDate(event, "start");
					var endDate;
					if (typeof event.end !== "undefined") {
						endDate = eventDate(event, "end");
					} else if(typeof event.duration !== "undefined") {
						dur=moment.duration(event.duration);
						endDate = startDate.clone().add(dur);
					} else {
						if (!isFacebookBirthday) {
							endDate = startDate;
						} else {
							endDate = moment(startDate).add(1, "days");
						}
					}

					// calculate the duration f the event for use with recurring events.
					var duration = parseInt(endDate.format("x")) - parseInt(startDate.format("x"));

					if (event.start.length === 8) {
						startDate = startDate.startOf("day");
					}

					var title = getTitleFromEvent(event);

					var excluded = false,
						dateFilter = null;

					for (var f in excludedEvents) {
						var filter = excludedEvents[f],
							testTitle = title.toLowerCase(),
							until = null,
							useRegex = false,
							regexFlags = "g";

						if (filter instanceof Object) {
							if (typeof filter.until !== "undefined") {
								until = filter.until;
							}

							if (typeof filter.regex !== "undefined") {
								useRegex = filter.regex;
							}

							// If additional advanced filtering is added in, this section
							// must remain last as we overwrite the filter object with the
							// filterBy string
							if (filter.caseSensitive) {
								filter = filter.filterBy;
								testTitle = title;
							} else if (useRegex) {
								filter = filter.filterBy;
								testTitle = title;
								regexFlags += "i";
							} else {
								filter = filter.filterBy.toLowerCase();
							}
						} else {
							filter = filter.toLowerCase();
						}

						if (testTitleByFilter(testTitle, filter, useRegex, regexFlags)) {
							if (until) {
								dateFilter = until;
							} else {
								excluded = true;
							}
							break;
						}
					}

					if (excluded) {
						continue;
					}

					var location = event.location || false;
					var geo = event.geo || false;
					var description = event.description || false;

					if (typeof event.rrule !== "undefined" && event.rrule !== null && !isFacebookBirthday) {
						var rule = event.rrule;
						var addedEvents = 0;

						// can cause problems with e.g. birthdays before 1900
						if(rule.options && rule.origOptions && rule.origOptions.dtstart && rule.origOptions.dtstart.getFullYear() < 1900 ||
							rule.options && rule.options.dtstart && rule.options.dtstart.getFullYear() < 1900){
							rule.origOptions.dtstart.setYear(1900);
							rule.options.dtstart.setYear(1900);
						}

						// For recurring events, get the set of start dates that fall within the range
						// of dates we"re looking for.
						var dates = rule.between(past, future, true, limitFunction);

						// The "dates" array contains the set of dates within our desired date range range that are valid
						// for the recurrence rule.  *However*, it"s possible for us to have a specific recurrence that
						// had its date changed from outside the range to inside the range.  For the time being,
						// we"ll handle this by adding *all* recurrence entries into the set of dates that we check,
						// because the logic below will filter out any recurrences that don"t actually belong within
						// our display range.
						// Would be great if there was a better way to handle this.
						if (event.recurrences != undefined)
						{
							var pastMoment = moment(past);
							var futureMoment = moment(future);

							for (var r in event.recurrences)
							{
								// Only add dates that weren't already in the range we added from the rrule so that
								// we don"t double-add those events.
								if (moment(new Date(r)).isBetween(pastMoment, futureMoment) != true)
								{
									dates.push(new Date(r));
								}
							}
						}

						// Loop through the set of date entries to see which recurrences should be added to our event list.
						for (var d in dates) {
							var date = dates[d];
							// ical.js started returning recurrences and exdates as ISOStrings without time information.
							// .toISOString().substring(0,10) is the method they use to calculate keys, so we'll do the same
							// (see https://github.com/peterbraden/ical.js/pull/84 )
							var dateKey = date.toISOString().substring(0,10);
							var curEvent = event;
							var showRecurrence = true;

							// Stop parsing this event's recurrences if we've already found maximumEntries worth of recurrences.
							// (The logic below would still filter the extras, but the check is simple since we're already tracking the count)
							if (addedEvents >= maximumEntries) {
								break;
							}

							startDate = moment(date);

							// For each date that we"re checking, it"s possible that there is a recurrence override for that one day.
							if ((curEvent.recurrences != undefined) && (curEvent.recurrences[dateKey] != undefined))
							{
								// We found an override, so for this recurrence, use a potentially different title, start date, and duration.
								curEvent = curEvent.recurrences[dateKey];
								startDate = moment(curEvent.start);
								duration = parseInt(moment(curEvent.end).format("x")) - parseInt(startDate.format("x"));
							}
							// If there"s no recurrence override, check for an exception date.  Exception dates represent exceptions to the rule.
							else if ((curEvent.exdate != undefined) && (curEvent.exdate[dateKey] != undefined))
							{
								// This date is an exception date, which means we should skip it in the recurrence pattern.
								showRecurrence = false;
							}

							endDate  = moment(parseInt(startDate.format("x")) + duration, "x");
							if (startDate.format("x") == endDate.format("x")) {
								endDate = endDate.endOf("day");
							}

							var recurrenceTitle = getTitleFromEvent(curEvent);

							// If this recurrence ends before the start of the date range, or starts after the end of the date range, don"t add
							// it to the event list.
							if (endDate.isBefore(past) || startDate.isAfter(future)) {
								showRecurrence = false;
							}

							if (timeFilterApplies(now, endDate, dateFilter)) {
								showRecurrence = false;
							}

							if ((showRecurrence === true) && (addedEvents < maximumEntries)) {
								addedEvents++;
								newEvents.push({
									title: recurrenceTitle,
									startDate: startDate.format("x"),
									endDate: endDate.format("x"),
									fullDayEvent: isFullDayEvent(event),
									class: event.class,
									firstYear: event.start.getFullYear(),
									location: location,
									geo: geo,
									description: description
								});
							}
						}
						// end recurring event parsing
					} else {
						// console.log("Single event ...");
						// Single event.
						var fullDayEvent = (isFacebookBirthday) ? true : isFullDayEvent(event);

						if (includePastEvents) {
							if (endDate < past) {
								//console.log("Past event is too far in the past.  So skip: " + title);
								continue;
							}
						} else {
							if (!fullDayEvent && endDate < new Date()) {
								//console.log("It's not a fullday event, and it is in the past. So skip: " + title);
								continue;
							}

							if (fullDayEvent && endDate <= today) {
								//console.log("It's a fullday event, and it is before today. So skip: " + title);
								continue;
							}
						}

						if (startDate > future) {
							//console.log("It exceeds the maximumNumberOfDays limit. So skip: " + title);
							continue;
						}

						if (timeFilterApplies(now, endDate, dateFilter)) {
							continue;
						}

						// Every thing is good. Add it to the list.

						newEvents.push({
							title: title,
							startDate: startDate.format("x"),
							endDate: endDate.format("x"),
							fullDayEvent: fullDayEvent,
							class: event.class,
							location: location,
							geo: geo,
							description: description
						});

					}
				}
			}

			newEvents.sort(function(a, b) {
				return a.startDate - b.startDate;
			});

			//console.log(newEvents);

			events = newEvents.slice(0, maximumEntries);

			self.broadcastEvents();
			scheduleTimer();
		});
	};

	/* scheduleTimer()
	 * Schedule the timer for the next update.
	 */
	var scheduleTimer = function() {
		//console.log('Schedule update timer.');
		clearTimeout(reloadTimer);
		reloadTimer = setTimeout(function() {
			fetchCalendar();
		}, reloadInterval);
	};

	/* isFullDayEvent(event)
	 * Checks if an event is a fullday event.
	 *
	 * argument event object - The event object to check.
	 *
	 * return bool - The event is a fullday event.
	 */
	var isFullDayEvent = function(event) {
		if (event.start.length === 8) {
			return true;
		}

		var start = event.start || 0;
		var startDate = new Date(start);
		var end = event.end || 0;
		if (((end - start) % (24 * 60 * 60 * 1000)) === 0 && startDate.getHours() === 0 && startDate.getMinutes() === 0) {
			// Is 24 hours, and starts on the middle of the night.
			return true;
		}

		return false;
	};

	/* timeFilterApplies()
	 * Determines if the user defined time filter should apply
	 *
	 * argument now Date - Date object using previously created object for consistency
	 * argument endDate Moment - Moment object representing the event end date
	 * argument filter string - The time to subtract from the end date to determine if an event should be shown
	 *
	 * return bool - The event should be filtered out
	 */
	var timeFilterApplies = function(now, endDate, filter) {
		if (filter) {
			var until = filter.split(" "),
				value = parseInt(until[0]),
				increment = until[1].slice("-1") === "s" ? until[1] : until[1] + "s", // Massage the data for moment js
				filterUntil = moment(endDate.format()).subtract(value, increment);

			return now < filterUntil.format("x");
		}

		return false;
	};

	/* getTitleFromEvent(event)
	* Gets the title from the event.
	*
	* argument event object - The event object to check.
	*
	* return string - The title of the event, or "Event" if no title is found.
	*/
	var getTitleFromEvent = function (event) {
		var title = "Event";
		if (event.summary) {
			title = (typeof event.summary.val !== "undefined") ? event.summary.val : event.summary;
		} else if (event.description) {
			title = event.description;
		}

		return title;
	};

	var testTitleByFilter = function (title, filter, useRegex, regexFlags) {
		if (useRegex) {
			// Assume if leading slash, there is also trailing slash
			if (filter[0] === "/") {
				// Strip leading and trailing slashes
				filter = filter.substr(1).slice(0, -1);
			}

			filter = new RegExp(filter, regexFlags);

			return filter.test(title);
		} else {
			return title.includes(filter);
		}
	};

	/* public methods */

	/* startFetch()
	 * Initiate fetchCalendar();
	 */
	this.startFetch = function() {
		fetchCalendar();
	};

	/* broadcastItems()
	 * Broadcast the existing events.
	 */
	this.broadcastEvents = function() {
		//console.log('Broadcasting ' + events.length + ' events.');
		eventsReceivedCallback(self);
	};

	/* onReceive(callback)
	 * Sets the on success callback
	 *
	 * argument callback function - The on success callback.
	 */
	this.onReceive = function(callback) {
		eventsReceivedCallback = callback;
	};

	/* onError(callback)
	 * Sets the on error callback
	 *
	 * argument callback function - The on error callback.
	 */
	this.onError = function(callback) {
		fetchFailedCallback = callback;
	};

	/* url()
	 * Returns the url of this fetcher.
	 *
	 * return string - The url of this fetcher.
	 */
	this.url = function() {
		return url;
	};

	/* events()
	 * Returns current available events for this fetcher.
	 *
	 * return array - The current available events for this fetcher.
	 */
	this.events = function() {
		return events;
	};
};

module.exports = CalendarFetcher;
