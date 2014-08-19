// Licensed under the Apache License. See footer for details.

fs     = require("fs")
path   = require("path")
crypto = require('crypto')

utils     = require("./utils")
updater   = require("./updater")
refresher = require("./refresher")

Tracks = {
  lastUpdated: new Date().toISOString(),
  tracks:      []
}

//------------------------------------------------------------------------------
utils.exportFunctions(exports, [
  update,
  setTracks,
  getTracks,
  getTrack,
  refresh,
  postWebhookGit
])

//------------------------------------------------------------------------------
function update(opts) {
  utils.vlog("updating resources")
  updater.update(opts)
}

//------------------------------------------------------------------------------
function setTracks(opts, tracks) {
  utils.vlog("setting tracks")

  Tracks.lastUpdated = new Date().toISOString()
  Tracks.tracks      = JSON.parse(JSON.stringify(tracks))
}

//------------------------------------------------------------------------------
function getTracks(request, reply) {
  reply(Tracks)
}

//------------------------------------------------------------------------------
function getTrack(request, reply) {
  reply({url: request.path})
}

//------------------------------------------------------------------------------
function refresh(request, reply) {
  var success = refresher.refresh(opts, false)

  reply({success: success})
}

//------------------------------------------------------------------------------
function postWebhookGit(request, reply) {
  var headerDigest = request.headers["X-Hub-Signature"] // value: "sha1=..."
  var match        = headerDigest.match(/(.*?)=(.*)/)
  var algorithm    = match[1]
  var headerDigest = match[2]
  var bodyDigest   = hmacDigest(algorithm, secret, body)

  if (headerDigest != bodyDigest) {
    utils.log("git webhook digest incorrect")
    reply({success: false})
    return
  }

  var success = refresher.refresh(opts, true)

  refresher.refresh(opts, true)
  reply({success: sucess})
}

//------------------------------------------------------------------------------
function hmacDigest(algorithm, secret, body) {
  var hmac = crypto.createHmac(algorithm, secret)

  hmac.update(body)

  return hmac.digest("hex")
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
