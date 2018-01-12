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
var fs = require('fs');
var config = require('../config');
var timerUtils = require("./timerUtils.js");
var path = require('path');

module.exports = {
    load: function() {
        logger.info('TimerEventLoader: load()');

        var filepath = config.timerevent_dir;

        // Read current directory contents
        fs.readdir(filepath, function (err, filenames) {
            if (err) {
                logger.error(err);
                return;
            }
            
            if(filenames.length > 0) {
                // Loop thru filenames
                filenames.forEach(function (filename, index) {
                        fs.stat(filepath + '/' + filename, function (err, stats) {
                        // Only look at files
                        if(stats.isFile()) {
                            var tmp = require('../../' + filepath + '/' + filename);

                            // If there is a "process()", then setup timer
                            if(typeof tmp.process === 'function') {
                                logger.info('TimerEventLoader: Loading - ' + filepath + '/' + filename);
                                timerUtils.setupTimer(tmp.process, tmp.config);
                            }  else {
                                logger.error('TimerEventLoader: No process() found in: ' + filepath + '/' + filename);
                            }
                        }
                    });
                });
            } else {
                logger.warn('TimerEventLoader: No TimerEvent files to load');
            }
        });
    }
}