/* Magic Mirror Module: mm_event_calendar
 * v1.0 - November 2018
 *
 * By Susan Howell 
 * MIT Licensed.
 */


Module.register("mm_event_calendar", {
    //Module defaults
    defaults: {
        test: "test"
    },

    // Required scripts
	getScripts: function() {
		return ["moment.js"];
	},

   start: function() {
        Log.log("Starting module: " + this.name);

        //Set locale
        moment.locale(config.language);
    },

    //Override dom generator
    getDom: function() {
        this.resetCalendar();
        var wrapper = document.createElement("div");
        wrapper.innerHTML = this.eventData;
        return wrapper;
    },
    
    resetCalendar: function() {
        this.beginningOfMonth = moment().startOf('month');
        this.endOfMonth = moment().endOf("month");
        this.fetchCalendarData();
    },

    fetchCalendarData: function() {
        this.sendSocketNotification("GET_CALENDAR_DATA", { beginningOfMonth: this.beginningOfMonth, endOfMonth: this.endOfMonth });
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "SUCCESS_CALENDAR_EVENTS") {
            this.eventData = JSON.stringify(payload.events);
            Log.log("Event Data: " + this.eventData);
        } else if (notification === "ERROR_CALENDAR_EVENTS") {
            this.eventData = payload.error;
        }

        this.updateDom();
    }

})