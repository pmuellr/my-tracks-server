// Licensed under the Apache License. See footer for details.

_    = require("underscore")
hapi = require("hapi")

utils     = require("./utils")
resources = require("./resources")

//------------------------------------------------------------------------------
utils.exportFunctions(exports, [
  start,
])

//------------------------------------------------------------------------------
function startedCallback(opts) {
  utils.log("server running at", opts.url)
}

//------------------------------------------------------------------------------
function start(opts, startedCB) {
  if (!startedCB) startedCB = function() { startedCallback(opts) }

  var serverOpts = {}
  var server = hapi.createServer(opts.bind, opts.port, serverOpts)

  // tracks
  server.route({
    method:  "GET",
    path:    "/api/tracks.json",
    handler: resources.getTracks
  })

  // track
  server.route({
    method:  "GET",
    path:    "/api/tracks/{track*}",
    handler: resources.getTrack
  })

  // webhook - git
  server.route({
    method:  "POST",
    path:    "/api/webhooks/git",
    handler: resources.postWebhookGit
  })

  // static files
  server.route({
    method:  "GET",
    path:    "/{param*}",
    handler: { directory: { path: "www", index: true } }
  })

  // favicon
  server.route({
    method:  "GET",
    path:    "/favicon.ico",
    handler: { file: "www/images/icon.png" }
  })

  // start the server
  server.start(startedCB)
}

/*
#-------------------------------------------------------------------------------
# Copyright IBM Corp. 2014
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#-------------------------------------------------------------------------------
*/
