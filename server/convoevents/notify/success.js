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

'use strict';

var config = require('../../config');

module.exports = function (events) {

    var event = {};
    event.isAuth = false;
    event.description = "Nofity Jenkins Build Success";
    event.words = [{
        word: 'success',
        value: 10
    }]
    event.run = function (request) {

        var number = request.question[1];
        console.log( "Text Failure to :"+number);


        return new Promise(function (resolve, reject) {
            
               var client = require('twilio') (
                 config.twilio.accountSid,
                 config.twilio.authToken
           ); 
          
          return resolve(  client.messages.create( {

                from: '+'+config.twilio.phone,
                to:  '+'+number,
                body:  'Open Shift Build/Deploy Success'        

               }).then( function(msg) { console.log(msg);  }  ) );  


        }) 
    }

    events.push(event);

}
