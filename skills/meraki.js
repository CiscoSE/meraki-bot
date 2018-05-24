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

  controller.hears(['meraki'], 'direct_message,direct_mention', function (bot, message) {
    var commands = message.text.split(" ")
    var response = "";
    if (commands.length <= 1) {
      response = "What would you like to see?";
      response += "\n- " + bot.enrichCommand(message, "organizations") + ": Show organizations - e.g. meraki organizations";
      response += "\n- " + bot.enrichCommand(message, "networks") + ": Show networks within an organization - e.g. meraki networks <b>org_id</b> ";
      response += "\n- " + bot.enrichCommand(message, "devices") + ": Show devices within a network - e.g. meraki devices <b>network_id</b>";
      response += "\n- " + bot.enrichCommand(message, "clients") + ": Show clients within a device - e.g. meraki clients <b>device_id</b>";
      response += "\n- " + bot.enrichCommand(message, "statistics");
      response += "\n\t- " + bot.enrichCommand(message, "client-usage") + ": Show client with most usage within a device - e.g. meraki statistics client-usage <b>device_id</b>";
    }
    else {
      // Get second word
      switch (commands[1]) {
        case "organizations":
        case "orgs":
          response = "Getting organizations..."
          manageOrgs(bot, message);
          break;
        case "networks":
        case "nets":
          if (commands.length >= 3) {
            response = "Getting networks..."
            manageNets(bot, message, commands[2]);
          }
          else {
            response = "You need to provide organization ID. Example: meraki networks <b>org_id</b>"
          }
          break;
        case "devices":
        case "devs":
          if (commands.length >= 3) {
            response = "Getting devices..."
            manageDevices(bot, message, commands[2]);
          }
          else {
            response = "You need to provide network ID. Example: meraki devices <b>net_id</b>"
          }
          break;
        case "clients":
          if (commands.length >= 3) {
            response = "Getting clients..."
            manageClients(bot, message, commands[2]);
          }
          else {
            response = "You need to provide a device serial number. Example: meraki clients <b>device_serial</b>"
          }
          break;
        case "statistics":
          if (commands.length >= 4) {
            switch (commands[2]) {
              case "client-usage":
               response = "Getting client-usage statistics..."
                manageClientStatistics(bot, message, commands[3])
                break;
              default:
                response = "Sorry, " + commands[2] + " is not supported"
                break;
            }

          }
          else {
            response = "You need to provide statistic type. Example: meraki statistics client-usage"
          }
          break;

        default:
          response = "Sorry, " + commands[1] + " is not supported"
          break;
      }
    }
    bot.reply(message, response);
  });
};

function getOptions(p_path) {
  return {
    host: process.env.MERAKI_URL,
    path: p_path,
    headers: { "x-cisco-meraki-api-key": process.env.MERAKI_TOKEN },
    method: 'GET'
  };
}

// https://n149.meraki.com/api/v0/organizations/549236/networks
function manageOrgs(bot, message) {

  var https = require('https');

  var options = getOptions('/api/v0/organizations/');

  callback = function (response) {
    var str = ''
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      orgs = JSON.parse(str);
      response = "";
      for (var i = 0; i < orgs.length; i++) {
        response += "\n- " + orgs[i]["name"] + " - Id " + orgs[i]["id"]
      }
      bot.reply(message, response);
    });
  }

  var req = https.request(options, callback);
  req.end();
}

function manageNets(bot, message, orgId) {

  var https = require('https');

  var options = getOptions('/api/v0/organizations/' + orgId + '/networks');

  callback = function (response) {
    var str = ''
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
    console.log(str);
      nets = JSON.parse(str);
      response = "";
      for (var i = 0; i < nets.length; i++) {
        response += "\n- " + nets[i]["name"]
        response += "\n\t- " + "Id " + nets[i]["id"]
        response += "\n\t- " + "Type " + nets[i]["type"]
      }
      bot.reply(message, response);
    });
  }

  var req = https.request(options, callback);
  req.end();
}

function manageDevices(bot, message, netId) {

  var https = require('https');

  var options = getOptions('/api/v0/networks/' + netId + '/devices');

  callback = function (response) {
    var str = ''
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      devs = JSON.parse(str);
      response = "";
      for (var i = 0; i < devs.length; i++) {
        response += "\n- " + devs[i]["serial"]
        response += "\n\t- " + "Model " + devs[i]["model"]
        response += "\n\t- " + "MAC " + devs[i]["mac"]
      }
      bot.reply(message, response);
    });
  }

  var req = https.request(options, callback);
  req.end();
}

function manageClients(bot, message, deviceSerial) {

  var https = require('https');

  var options = getOptions('/api/v0/devices/' + deviceSerial + '/clients?timespan=2592000');

  callback = function (response) {
    var str = ''
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      clients = JSON.parse(str);
      response = "";
      for (var i = 0; i < clients.length; i++) {
        response += "\n- " + clients[i]["dhcpHostname"];
        response += "\n\t- " + "Usage: "
        response += "\n\t\t- " + "Sent: " + parseInt(clients[i]["usage"]["sent"]) / 1000 + "Mb";
        response += "\n\t\t- " + "Recieved: " + parseInt(clients[i]["usage"]["recv"]) / 1000 + "Mb";
        response += "\n\t- " + "IP: " + clients[i]["ip"];
        response += "\n\t- " + "MAC: " + clients[i]["mac"];
      }
      bot.reply(message, response);
    });
  }

  var req = https.request(options, callback);
  req.end();
}

function manageClientStatistics(bot, message, deviceSerial) {

  var https = require('https');

  var options = getOptions('/api/v0/devices/' + deviceSerial + '/clients?timespan=2592000');

  callback = function (response) {
    var str = ''
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      clients = JSON.parse(str);
      response = "";
      if (clients.length > 0) {
        max_usage_client = clients[0]
        for (var i = 0; i < clients.length; i++) {
          device_usage = parseInt(clients[i]["usage"]["sent"]) + parseInt(clients[i]["usage"]["recv"])
          max_usage = parseInt(max_usage_client["usage"]["sent"]) + parseInt(max_usage_client["usage"]["recv"])
          if (device_usage > max_usage) {
            max_usage_client = clients[i];
          }
        }
        response += "Max usage client:"
        response += "\n- " + max_usage_client["dhcpHostname"];
        response += "\n\t- " + "Usage: "
        response += "\n\t\t- " + "Sent: " + parseInt(max_usage_client["usage"]["sent"]) / 1000 + "Mb";
        response += "\n\t\t- " + "Recieved: " + parseInt(max_usage_client["usage"]["recv"]) / 1000 + "Mb";
        response += "\n\t- " + "IP: " + max_usage_client["ip"];
        response += "\n\t- " + "MAC: " + max_usage_client["mac"];
      }
      else {
        response = "No clients found";
      }
      bot.reply(message, response);
    });
  }

  var req = https.request(options, callback);
  req.end();
}