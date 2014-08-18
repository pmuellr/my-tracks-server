my-tracks-server - a web server to present your GPS tracks
================================================================================

This repo contains a node.js web server which will serve up a nice presentation
of your GPS tracks.  If you have pictures associated with the tracks,
available at [flickr][], the pictures will be displayed
along with the tracks.

The GPS tracks are not stored with this server; instead, the GPS tracks are
assumed to be available in a git repo.  When the server starts, it will clone
the repo into a transient directory, and process the files in the directory.



processing tracks
================================================================================

Processing starts by reading the file `my-tracks.json` in the root directory
of the git repo.  The JSON file can contain the following properties:

* `title` - the title of the web site
* `tracks` - the directory in the git repo containing the GPS tracks
* `flickr-user` - the flickr username to search for pictures

Currently only `*.GPX` files (any case) will be considered when looking for
track data.  The name of the track data file, sans the extension, will be used
as the "name" of the track.



running the server
================================================================================

See the file [lib/my-tracks-server-help.txt](lib/my-tracks-server-help.txt)
for more information on running the server.



rebuilding the site
================================================================================

The site will be "rebuilt" when the server is started.  Transient files used by
the server are stored in the `work` directory, so

* you shouldn't store anything you want to keep in the `work` directory
* you will probably want to add the `work` directory to `.gitignore`, `.cfignore`,
  etc files, to keep the files from being persisted.

The site will also be rebuilt if a git webhook `push` event arrives.

To otherwise force the site to be rebuilt, stop and restart the server.  For
Cloud Foundry, you can issue a `cf restart` command.

During a rebuild, if the `work` directory exists, it's contents will be used
as a cache, so the rebuild should take longer.

Because the rebuild via git webhook can only affect a single instance of this
server, if running as a multi-instance app in Cloud Foundry, or some other
server farm scenario, the webhook rebuild won't be useful in those cases.



hacking
================================================================================

If you want to modify the source to play with it, you'll also want to have the
`jbuild` program installed.

To install `jbuild` on Windows, use the command

    npm -g install jbuild

To install `jbuild` on Mac or Linux, use the command

    sudo npm -g install jbuild

The `jbuild` command runs tasks defined in the `jbuild.coffee` file.  The
task you will most likely use is `watch`, which you can run with the
command:

    jbuild watch

When you run this command, the application will be built from source, the server
started, and tests run.  When you subsequently edit and then save one of the
source files, the application will be re-built, the server re-started, and the
tests re-run.  For ever.  Use Ctrl-C to exit the `jbuild watch` loop.

You can run those build, server, and test tasks separately.  Run `jbuild`
with no arguments to see what tasks are available, along with a short
description of them.



attributions
================================================================================

The bootprint icon is originally from
<http://pixabay.com/en/footprint-tracks-boot-shoe-sole-155457/>
and is licensed
[CC0 1.0 Universal (CC0 1.0) Public Domain Dedication](http://creativecommons.org/publicdomain/zero/1.0/deed.en).


license
================================================================================

Apache License, Version 2.0

<http://www.apache.org/licenses/LICENSE-2.0.html>

<!-- ================ -->

[flickr]:                       http://flickr.com
[flickr api key]:               https://www.flickr.com/services/apps/
[user-provided service]:        http://docs.cloudfoundry.org/devguide/services/user-provided.html
[github webooks documentation]: https://developer.github.com/webhooks/
