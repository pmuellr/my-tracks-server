// Licensed under the Apache License. See footer for details.

fs            = require("fs")
path          = require("path")
child_process = require("child_process")

_      = require("underscore")
mkdirp = require("mkdirp")
rimraf = require("rimraf")

resources = require("./resources")
utils     = require("./utils")

LastRefreshMillis = 0  // milliseconds

//------------------------------------------------------------------------------
utils.exportFunctions(exports, [
  prepare,
])

//------------------------------------------------------------------------------
function prepare(target, opts, preparedCB) {
  utils.log(path.basename(__filename) + ":", target)
  preparedCB(null, target, opts)
}

//------------------------------------------------------------------------------
function refresh(opts, override) {
  var curMillis = Date.now()
  var minMillis  = opts["min-refresh-minutes"] * 60 * 1000

  if (curMillis - LastRefreshMillis < minMillis) {
    if (!override) {
      utils.log("refresh requested too soon")
      return false
    }
  }

  LastRefreshMillis = curMillis

  refreshRepo(opts, function(err) {
    if (err) return utils.logError(err)

    resources.update(opts)
  })

  return true
}

//------------------------------------------------------------------------------
function refreshRepo(opts, cb) {
  var dir
  var cmd

  try {
    mkdirp.sync(opts.buildDir)
  }
  catch(err) {
    cb(new Error("unable to create `" + opts.buildDir + "`: " + err))
    return
  }

  if (fs.existsSync(path.join(opts.gitRepoDir, ".git"))) {
    dir = opts.gitRepoDir
    cmd = "git pull"
  }
  else {
    dir = opts.buildDir
    cmd = 'git clone "' + opts.gitRepo + '" ' + path.basename(opts.gitRepoDir)
  }

  utils.vlog("running git command:", cmd)

  child_process.exec(cmd, {cwd:dir}, gitCallback)

  //-----------------------------------
  function gitCallback(err, stdout, stderr) {
    if (err) {
      cb(new Error("error running cmd `" + cmd + "`: " + err))
      return
    }

    stdout = stdout.trim()
    stderr = stderr.trim()

    if (stdout != "") utils.vlog("git stdout:\n" + stdout)
    if (stderr != "") utils.vlog("git stderr:\n" + stderr)

    cb()
  }

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
