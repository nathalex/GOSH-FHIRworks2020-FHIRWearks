/*
 *      Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 *      Licensed under the Flora License, Version 1.1 (the "License");
 *      you may not use this file except in compliance with the License.
 *      You may obtain a copy of the License at
 *
 *              http://floralicense.org/license/
 *
 *      Unless required by applicable law or agreed to in writing, software
 *      distributed under the License is distributed on an "AS IS" BASIS,
 *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *      See the License for the specific language governing permissions and
 *      limitations under the License.
 */

/*global define, document, history */

/**
 * send mode view module.
 *
 * @module views/sendMode
 * @requires {@link helpers/dom}
 * @requires {@link helpers/page}
 * @namespace views/sendMode
 */
define({
    name: 'views/sendMode',
    requires: [
        'helpers/dom',
        'helpers/page'
    ],
    def: function display(req) {
        'use strict';

        /**
         * DOM helper module.
         *
         * @memberof views/sendMode
         * @private
         * @type {Module}
         */
        var domHelper = req.helpers.dom,

            /**
             * Page helper module instance.
             *
             * @memberof views/sendMode
             * @private
             * @type {Module}
             */
            pageHelper = req.helpers.page,

            /**
             * Current mode value.
             *
             * @memberof views/sendMode
             * @private
             * @type {string}
             */
            currentValue = 'manual',

            /**
             * Page element.
             *
             * @memberof views/sendMode
             * @private
             * @type {HTMLElement}
             */
            page = null;

        /**
         * Handles click on the list.
         *
         * @memberof views/sendMode
         * @private
         * @param {Event} ev
         */
        function onListClick(ev) {
            var item = domHelper.closest(ev.target, 'li');

            if (!item) {
                return;
            }

            item = item.querySelector('input');
            currentValue = item.getAttribute('value');
            setReminders();
            history.back();
        }

        /**
         * Returns current value of the send mode.
         *
         * @memberof views/sendMode
         * @public
         * @returns {string}
         */
        function getCurrentValue() {
            return currentValue;
        }

        /**
         * Handles "pagebeforeshow" event.
         *
         * @memberof views/sendMode
         * @private
         */
        function onPageBeforeShow() {
            pageHelper.resetScroll(page);
            page.querySelector('[value="' + currentValue + '"]').checked = true;
        }
        
        /**
         * Checks and sets user reminders on click
         *
         * @memberof views/sendMode
         * @private
         */
        function setReminders(){
        	if (document.getElementById("sendhourly").checked){
    			//console.error("I get here");
    			hourlyReminders();}
    		else if (document.getElementById("senddaily").checked){
    			dailyReminders();}
    		else if (document.getElementById("sendweekly").checked){
    			weeklyReminders();}
    		else{noReminders();}
        }
        
        /**
         * Reminds user to post hourly.
         *
         * @memberof views/sendMode
         * @private
         */
        function hourlyReminders(){
        	var appid = tizen.application.getCurrentApplication().appInfo.id;
        	
        	var appControl = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/view", null, null, null, null, "SINGLE");

        	tizen.alarm.removeAll();
        	
        	var i;
        	
        	var normal =  "This is your hourly reminder to log your heartrate";
        	var last = "This is your LAST hourly reminder to log your heartrate. If you'd like more reminders, please open \"Settings/Send Settings\" in the App and tick \"Auto: hourly\"";
        
        	for (i = 0; i < 24; i++){
        		
        		var date = new Date();
        		date.setSeconds(date.getSeconds() + 20);
        		date.setHours(date.getHours() + i);
        		console.error("time is: " + date);
        		
        		if (i === 23){
        			normal = last;
    		}
	        	var alarm = new tizen.AlarmAbsolute(date);
	        	var notificationGroupDict =
	        	{
	        	  content: normal,
	        	  actions: {
	        		  vibration: true,
	        		  appControl: appControl,
	        		  appId: appid},
	        	  thumbnails: {thumbnailIconPath: "../../icon.png"}
	        	};
	
	        	var notification = new tizen.UserNotification("SIMPLE", "FHIRWearks Hourly Reminder", notificationGroupDict);
	        	tizen.alarm.addAlarmNotification(alarm, notification);
	        	
	        	console.error("Alarm notification added with id: " + alarm.id);
    		}
        }
        
        /**
         * Reminds user to post daily.
         *
         * @memberof views/sendMode
         * @private
         */
        function dailyReminders(){
        	var appid = tizen.application.getCurrentApplication().appInfo.id;
        	
        	var appControl = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/view", null, null, null, null, "SINGLE");

        	
        	tizen.alarm.removeAll();
        	
        	var i;
        	
        	var normal = "This is your daily reminder to log your heartrate";
        	var last = "This is your LAST daily reminder to log your heartrate. If you'd like more reminders, please open \"Settings/Send Settings\" in the App and tick \"Auto: daily\"";
        	
        	for (i = 0; i < 24; i++){
        		
        		
        		var date = new Date();
        		date.setSeconds(date.getSeconds() + 20);
        		date.setDate(date.getDate() + i);
        		console.error("time is: " + date);
        		
        		
        		if (i === 23){
        			normal = last;
        		}
	        	var alarm = new tizen.AlarmAbsolute(date);
	        	var notificationGroupDict =
	        	{
	        	  content: normal,
	        	  actions: {
	        		  vibration: true,
	        		  appControl: appControl,
	        		  appId: appid},
	        	  thumbnails: {thumbnailIconPath: "../../icon.png"}
	        	};
	
	        	var notification = new tizen.UserNotification("SIMPLE", "FHIRWearks Daily Reminder", notificationGroupDict);
	
	        	tizen.alarm.addAlarmNotification(alarm, notification);
	        	console.error("Alarm notification added with id: " + alarm.id);
        	}
        }
        
        /**
         * Reminds user to post weekly.
         *
         * @memberof views/send
         * @private
         */
        function weeklyReminders(){
        	var appid = tizen.application.getCurrentApplication().appInfo.id;
        	
        	var appControl = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/view", null, null, null, null, "SINGLE");

        	
        	tizen.alarm.removeAll();
        	
        	var i;
        	
        	var normal = "This is your weekly reminder to log your heartrate";
        	var last = "This is your LAST weekly reminder to log your heartrate. If you'd like more reminders, please open \"Settings/Send Settings\" in the App and tick \"Auto: hourly\"";
        	
        	for (i = 0; i < 24; i++){
        		
        		
        		var date = new Date();
        		date.setSeconds(date.getSeconds() + 20);
        		date.setDate(date.getDate() + (7*i));
        		console.error("time is: " + date);
        		
        		
        		if (i === 23){
        			normal = last;
        		}
        		
	        	var alarm = new tizen.AlarmAbsolute(date);
	        	var notificationGroupDict =
	        	{
	        	  content: normal,
	        	  actions: {
	        		  vibration: true,
	        		  appControl: appControl,
	        		  appId: appid},
	        	  thumbnails: {thumbnailIconPath: "../../icon.png"}
	        	};
	
	        	var notification = new tizen.UserNotification("SIMPLE", "FHIRWearks Weekly Reminder", notificationGroupDict);
	
	        	tizen.alarm.addAlarmNotification(alarm, notification);
	        	console.error("Alarm notification added with id: " + alarm.id);
        	}
        }
        
        /**
         * Removes user post reminders.
         *
         * @memberof views/sendMode
         * @private
         */
        function noReminders(){
        	tizen.alarm.removeAll();
        	console.error("Removed all registered alarms in the storage.");
        }

        /**
         * Registers module's event listeners.
         *
         * @memberof views/sendMode
         * @private
         */
        function bindEvents() {
            page.addEventListener('pagebeforeshow', onPageBeforeShow);
            page.querySelector('ul').addEventListener('click', onListClick);
        }

        /**
         * Initializes module.
         *
         * @memberof views/sendMode
         * @public
         */
        function init() {
            page = document.getElementById('sendsettings');

            bindEvents();
        }

        return {
            init: init,
            getCurrentValue: getCurrentValue
        };
    }
});
