/*
Copyright 2017 Keyhole Software LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var log4js = require('log4js');
var logger = log4js.getDefaultLogger();

var timerNameDefault = 'Unnamed Timer';     // Default timerName
var callbackDelayDefault = 60*1000;         // Default callbackDelay is 1 minute
var callbackMaxRunDefault = 0;              // Default callbackMaxRun is to run forever

module.exports = {
    // Usage:
    //      var timerUtils = require("./services/timerUtils.js");
    //
    //      The "callback" can be:
    //          A method of an object
    //          A local method defined
    //          An anonymous method define inline
    //
    //      The "config" is a JSON object consisting of the following:
    //          timerName = Display name for timer
    //          callbackDelay = Delay between calls
    //          callbackMaxRun = Number of times to run (0 = forever)
    //
    //      EXAMPLES:
    //      1. This sets up the callback to be called "Unnamed Timer", to run every minute, forever
    //          timerUtils.setupTimer(timesheetnotification.process);
    //
    //      2. This sets up the callback to be called "Timesheet Timer", to run every minute, forever
    //          timerUtils.setupTimer(timesheetnotification.process, {timerName: 'Timersheet Timer'});
    //
    //      3. This sets up the callback to be called "Timesheet Timer", to run every 5 minutes, forever
    //          timerUtils.setupTimer(timesheetnotification.process, {timerName: 'Timersheet Timer', callbackDelay: 60*1000*5});
    //
    //      4. This sets up the callback to be called "Timesheet Timer", to run every 5 minutes, will run 6 times
    //          timerUtils.setupTimer(timesheetnotification.process, {timerName: 'Timersheet Timer', callbackDelay: 60*1000*5, callbackMaxRun: 6});
    //
    setupTimer: function( callback = null, config = {} ) {
        if (callback !== null) {

            let timerName = typeof config.timerName === 'string' ? config.timerName : timerNameDefault;
            let callbackDelay = typeof config.callbackDelay === 'number' && config.callbackDelay > 0 ? config.callbackDelay : callbackDelayDefault;
            let callbackMaxRun = typeof config.callbackMaxRun === 'number' ? config.callbackMaxRun : callbackMaxRunDefault;
            logger.debug('   setupTimer: timerName: ' + timerName);
            logger.debug('   setupTimer: callbackDelay: ' + callbackDelay);
            logger.debug('   setupTimer: callbackMaxRun: ' + callbackMaxRun);

            let runCallbackCount = 0;

            // Run callback initially
            logger.info('Running: ' + timerName + ': ' + (runCallbackCount+1) + (callbackMaxRun > 0 ? ' of ' + callbackMaxRun : ''));
            callback();
            runCallbackCount++;

            // Create setInterval if needed to run more than 1 time
            if(callbackMaxRun !== 1) {
                // Setup setInterval() using parameters
                let si = setInterval(function() {
                    logger.info('Running: ' + timerName + ': ' + (runCallbackCount+1) + (callbackMaxRun > 0 ? ' of ' + callbackMaxRun : ''));
                    callback();
                    runCallbackCount++;
                
                    // If there is a max number of calls, then evaluate and stop if necessary
                    if(callbackMaxRun > 0 && runCallbackCount >= callbackMaxRun) {
                        logger.info('* Stopping: ' + timerName);
                        clearInterval(si);
                    } 
                }, callbackDelay);
            }
        } 
        else {
            logger.error('No callback passed in');
        }
    }
}
