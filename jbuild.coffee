# Licensed under the Apache License. See footer for details.

#-------------------------------------------------------------------------------
# use this file with jbuild: https://www.npmjs.org/package/jbuild
# install jbuild with:
#    linux/mac: sudo npm -g install jbuild
#    windows:        npm -g install jbuild
#-------------------------------------------------------------------------------

fs   = require "fs"
path = require "path"
zlib = require "zlib"

GIT_REPO = "https://github.com/pmuellr/gps-tracks.git"

cat_source_map = global["cat-source-map"]

#-------------------------------------------------------------------------------
tasks = defineTasks exports,
  watch: "watch for source file changes, then run build, test and server"
  serve: "run the test server stand-alone"
  build: "build the server"
  test:  "run tests"

WatchSpec = "lib lib/**/*"

rebuildTouch = "#{__dirname}/../gps-tracks/tmp/rebuild"

#-------------------------------------------------------------------------------
mkdir "-p", "tmp"

#-------------------------------------------------------------------------------
tasks.build = ->
  log "running build"

  unless test "-d", "node_modules"
    exec "npm install"

  cleanDir "www"

  cp "-R", "www-src/*", "www"

  copyBowerFiles "www/bower"

  buildViews "www-src/views", "www/lib/views.json"

  browserify "www/lib/main.js --outfile tmp/node-modules.js --debug"
  cat_source_map "--fixFileNames tmp/node-modules.js www/node-modules.js"

  rm "-Rf", "www/lib"
  rm "-Rf", "www/views"

  "".to rebuildTouch if test "-f", rebuildTouch

  # gzipize "www"

#-------------------------------------------------------------------------------
tasks.watch = ->
  watchIter()

  watch
    files: WatchSpec.split " "
    run:   watchIter

  watchFiles "jbuild.coffee" :->
    log "jbuild file changed; exiting"
    process.exit 0

#-------------------------------------------------------------------------------
tasks.serve = ->
  log "running server"

  command = "bin/my-tracks-server --verbose #{GIT_REPO}".split(" ")
  server.start "tmp/server.pid", "node", command

#-------------------------------------------------------------------------------
watchIter = ->
  tasks.build()
  # tasks.serve()
  # tasks.test()

#-------------------------------------------------------------------------------
copyBowerFiles = (dir) ->

  bowerConfig = require "./bower-config"

  cleanDir dir

  for name, {version, files} of bowerConfig
    unless test "-d", "bower_components/#{name}"
      exec "bower install #{name}##{version}"
      log ""

  for name, {version, files} of bowerConfig
    for src, dst of files
      src = "bower_components/#{name}/#{src}"

      if dst is "."
        dst = "#{dir}/#{name}"
      else
        dst = "#{dir}/#{name}/#{dst}"

      mkdir "-p", dst

      cp "-R", src, dst

#-------------------------------------------------------------------------------
gzipize = (dir) ->
  files = ls "-R", dir

  exts = "html css js json svg".split(" ")
  compressable = {}
  for ext in exts
    compressable[ext] = true

  for file in files
    ext = file.split(".").pop()
    if compressable[ext]
      gzipFile path.join(dir, file)

#-------------------------------------------------------------------------------
gzipFile = (iFile) ->
  oFile = "#{iFile}.gz"

  gzip = zlib.createGzip()

  iStream = fs.createReadStream(iFile)
  oStream = fs.createWriteStream(oFile)

  iStream.pipe(gzip).pipe(oStream)

#-------------------------------------------------------------------------------
buildViews = (srcDir, outFile) ->
  files = ls srcDir
  data  = {}

  for file in files
    contents   = cat path.join(srcDir, file)
    contents   = contents.replace(/<!--[\s\S]*?-->/g, "")   # remove comments
    contents   = contents.trim()
    data[file] = contents

  data = JSON.stringify(data, null, 4).to outFile

#-------------------------------------------------------------------------------
cleanDir = (dir) ->
  mkdir "-p", dir
  rm "-rf", "#{dir}/*"

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
