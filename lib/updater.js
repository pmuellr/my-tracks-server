// Licensed under the Apache License. See footer for details.

fs     = require("fs")
path   = require("path")
crypto = require("crypto")

_        = require("underscore")
gpxParse = require("gpx-parse")

utils     = require("./utils")
resources = require("./resources")

//------------------------------------------------------------------------------
utils.exportFunctions(exports, [
  update,
])

//------------------------------------------------------------------------------
function update(opts) {
  var config    = getConfig(opts)
  var tracks    = []
  var files     = getGpxFiles(opts, config)
  var processed = 0

  for (var iFile=0; iFile < files.length; iFile++) {
    var relFile = files[iFile]
    var absFile = path.join(opts.gitRepoDir, config.tracks, relFile)

    absFile = path.normalize(absFile)

    var track = {
      id:       md5(relFile),
      fileName: relFile
    }

    tracks.push(track)

    parseGpxData(absFile, track, function() {
      processed++
      if (processed == files.length) {
        resources.setTracks(opts, tracks)
      }
    })
  }

}

//------------------------------------------------------------------------------
function md5(string) {
  var hasher = crypto.createHash("md5")
  hasher.update(string, "utf8")
  return hasher.digest("hex")
}

//------------------------------------------------------------------------------
function parseGpxData(file, track, cb) {
  gpxParse.parseGpxFromFile(file, function(err, data) {
    processGpxData(file, track, err, data)
    cb()
  })
}

//------------------------------------------------------------------------------
function processGpxData(file, track, err, data) {
  utils.vlog("processing file `%s`", track.fileName)
  if (err) {
    utils.log("error parsing gpx file `" + file + "`: " + err)
    data = null
    return
  }

  // track.data = data
}

//------------------------------------------------------------------------------
function getConfig(opts) {
  // opts.buildDir
  // opts.gitRepoDir
  var config

  // parse config file
  var configFile = path.join(opts.gitRepoDir, "my-tracks.json")

  try {
    config = fs.readFileSync(configFile, "utf8")
  }
  catch (err) {
    utils.log("error reading config file `" + configFile + "`: " + err)
    return
  }

  try {
    config = JSON.parse(config)
  }
  catch (err) {
    utils.log("error parsing config file `" + configFile + "`: " + err)
    return
  }

  if (!config.title)         config.title      = "my tracks"
  if (config["flickr-user"]) config.flickrUser = config["flickr-user"]
  if (!config.tracks)        config.tracks     = "."

  config.tracks = sanitizePath(config.tracks)

  return config
}

//------------------------------------------------------------------------------
function getGpxFiles(opts, config) {
  var gpxRootDir = path.join(opts.gitRepoDir, config.tracks)

  return gatherGpxFiles(gpxRootDir)
}

//------------------------------------------------------------------------------
function gatherGpxFiles(rootDir, currDir, allFiles) {
  if (!allFiles) allFiles = []
  if (!currDir)  currDir = ""

  var thisDir = path.join(rootDir, currDir)
  var files

  try {
    files = fs.readdirSync(thisDir)
  }
  catch (err) {
    utils.log("error reading directory `" + thisDir + "`: " + err)
    return allFiles
  }

  for (var iFile=0; iFile < files.length; iFile++) {
    var file     = files[iFile]
    var thisFile = path.join(thisDir, file)
    var currFile = path.join(currDir, file)
    var stats    = fs.statSync(thisFile)

    if (stats.isDirectory()) {
      gatherGpxFiles(rootDir, currFile, allFiles)
    }
    else if (stats.isFile()) {
      if (file.match(/.+\.gpx/i)) {
        allFiles.push(currFile)
      }
    }
  }

  return allFiles
}

//------------------------------------------------------------------------------
function sanitizePath(p) {
  p = path.normalize(p)
  p = p.replace(/\\/g, "/")

  if (p == "") p = "."

  var parts = p.split("/")

  while ((parts[0] == ".") || (parts[0] == "..")) {
    parts.shift()
  }

  if (!parts.length) parts = ["."]

  return parts.join("/")
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
