/* Magic Mirror
 * Node Helper: Calendar
 *
 * By Susan Howell
 * MIT Licensed.
 */

const CalendarAPI = require('node-google-calendar');
const CONFIG = require('./settings');
const calendarId = CONFIG.calendarId;

const cal = new CalendarAPI(CONFIG);  

var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

    start: function () {
        console.log("Starting node helper for: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_CALENDAR_DATA") {
            this.fetchCalendarData(payload.beginningOfMonth, payload.endOfMonth);
        }
    },

    fetchCalendarData: function(beginningOfMonth, endofMonth) {
        var self = this;

        let params = {
            timeMin: beginningOfMonth,
            timeMax: endofMonth
        };

        cal.Events.list(calendarId, params)
            .then(json => {
                self.sendSocketNotification('SUCCESS_CALENDAR_EVENTS', { events: json });
            }).catch(err => {
                self.sendSocketNotification('ERROR_CALENDAR_EVENTS', { error: err.message });
            })

    }
})