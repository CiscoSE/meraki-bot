/**
 * @license
 * Copyright (c) 2018 Cisco and/or its affiliates.
 *
 * This software is licensed to you under the terms of the Cisco Sample
 * Code License, Version 1.0 (the "License"). You may obtain a copy of the
 * License at
 *
 *                https://developer.cisco.com/docs/licenses
 *
 * All use of the material herein must be in accordance with the terms of
 * the License. All rights not expressly granted by the License are
 * reserved. Unless required by applicable law or agreed to separately in
 * writing, software distributed under the License is distributed on an "AS
 * IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied.
 */
module.exports = function (controller) {

    controller.on('bot_space_join', function (bot, message) {
        var welcome = "Hi";
        if (process.env.BOT_NICKNAME) {
            welcome += ", I am the **"+ process.env.BOT_NICKNAME + "** bot";
        }
        welcome += "! Type `help` to learn more about my skills.";
        bot.reply(message, welcome
            , function (err, newMessage) {
                if (newMessage.roomType == "group") {
                    bot.reply(message, "_Note that this is a 'Group' Space. \
                       I will answer only if mentionned:<br/> \
                       for help, type "+ bot.enrichCommand(newMessage, "help") + "_");
                }
            });
    });
}
