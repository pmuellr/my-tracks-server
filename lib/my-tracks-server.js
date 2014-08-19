// Licensed under the Apache License. See footer for details.

fs            = require("fs")
child_process = require("child_process")

_      = require("underscore")
hapi   = require("hapi")
cfenv  = require("cfenv")
mkdirp = require("mkdirp")
rimraf = require("rimraf")

utils     = require("./utils")
server    = require("./server")
getOpts   = require("./getOpts")
refresher = require("./refresher")
resources = require("./resources")

//------------------------------------------------------------------------------
utils.exportFunctions(exports, [
  main,
])

//------------------------------------------------------------------------------
function main(cliArgs) {
  utils.setProgramName(__filename)

  process.on("uncaughtException", function(err) {
    if (err.stack)
      utils.log(err.stack)
    else
      utils.log("uncaught exception: " + err)
  })

  var optsSpec = {
    git_webhook: [ "g", String ],
    flickr:      [ "f", String ],
    port:        [ "p", Number ],
    verbose:     [ "v", Boolean ],
    help:        [ "h", Boolean ],
  }

  var cli = getOpts.parse(args, optsSpec)

  if (cli.args.length == 0) getOpts.printHelp()

  if (cli.args.length > 1) utils.log("only the first command-line argument is used")

  var envOpts = getEnvOpts()
  var cfOpts  = getCfOpts()
  var defOpts = getDefOpts()

  var opts = _.defaults(cli.opts, envOpts, cfOpts)

  opts.gitRepo    = cli.args[0]
  opts.buildDir   = path.join(process.cwd(), "build")
  opts.gitRepoDir = path.join(opts.buildDir, "git-repo")

  utils.vlog("opts: ", utils.JL(cli.opts))

  refresher.refresh(opts, true)
  server.start(opts)
}

//    --flickr           FLICKR         /.*flickr.*/          api-key
//    --git-webhook      GIT_WEBHOOK    /.*git-webhook.*/     secret

//------------------------------------------------------------------------------
function getDefOpts() {
  var result = {}

  result["min-refresh-minutes"] = 10

  return result
}

//------------------------------------------------------------------------------
function getEnvOpts() {
  var result = {}

  var flickr = process.env.FLICKR
  if (flickr) result["flickr"] = flickr

  var gitWebhook = process.env.GIT_WEBHOOK
  if (gitWebhook) result["git-webhook"] = gitWebhook

  var minRefreshMinutes = process.env.MIN_REFRESH_MINUTES
  if (minRefreshMinutes) minRefreshMinutes = parseInt(minRefreshMinutes, 10)
  if (!isNaN(minRefreshMinutes)) result["min-refresh-minutes"] = minRefreshMinutes

  return result
}

//------------------------------------------------------------------------------
function getCfOpts() {
  var result = {}
  var appEnv = cfenv.getAppEnv()
  var creds

  result.port = appEnv.port
  result.bind = appEnv.bind
  result.url  = appEnv.url

  var flickr = appEnv.getService(/.*flickr.*/)
  if (flickr) {
    creds = flickr.credentials
    if (creds) {
      var flickr = creds["api-key"]
      if (flickr) result["flickr"] = flickr
    }
  }

  var gitWebhook = appEnv.getService(/.*git-webhook.*/)
  if (gitWebhook) {
    creds = gitWebhook.credentials
    if (creds) {
      var gitWebhook = creds["secret"]
      if (gitWebhook) result["gitWebhook"] = gitWebhook
    }
  }

  return result
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
