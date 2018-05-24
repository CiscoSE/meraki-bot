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

    controller.hears(["help"], 'direct_message,direct_mention', function (bot, message) {
        var text = "Here are my skills 🙂";
        text += "\n- " + bot.enrichCommand(message, ".commons") + ": shows metadata about myself";
        text += "\n- " + bot.enrichCommand(message, "help") + ": spreads the word about my skills";
        text += "\n- " + bot.enrichCommand(message, "meraki") + ": Interact with Meraki organization, networks and devices";
        text += "\n\t- " + bot.enrichCommand(message, "organizations") + ": Show organizations - e.g. meraki organizations";
        text += "\n\t- " + bot.enrichCommand(message, "networks") + ": Show networks within an organization - e.g. meraki networks <b>org_id</b> ";
        text += "\n\t- " + bot.enrichCommand(message, "devices") + ": Show devices within a network - e.g. meraki devices <b>network_id</b>";
        text += "\n\t- " + bot.enrichCommand(message, "clients") + ": Show clients within a device - e.g. meraki clients <b>device_id</b>";
        text += "\n\t- " + bot.enrichCommand(message, "statistics") + ": Show statistics of a network";
        text += "\n\t\t- " + bot.enrichCommand(message, "client") + ": Show client with most usage within a device - e.g. meraki statistics client-usage <b>device_id</b>";
        bot.reply(message, text);
    });
}
