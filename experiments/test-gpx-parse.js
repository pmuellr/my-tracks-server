fs = require("fs")
gp = require("gpx-parse")

file = "../gps-tracks/tracks/2014-08-07-Graveyard-Fields.GPX"

files = fs.readdirSync("../gps-tracks/tracks")
for (var iFile=0; iFile<files.length; iFile++) {
  var file = files[iFile]
  if (!file.match(/.*\.gpx$/i)) continue
  gp.parseGpxFromFile("../gps-tracks/tracks/" + file, cb(file))
}

//------------------------------------------------------------------------------
function cb(file) {
  return function(err, data) {
    cbFile(file, err, data)
  }
}

//------------------------------------------------------------------------------
function cbFile(file, err, data) {
  console.log(file)

  if (err) {
    console.log("   error:", err)
    return
  }

  console.log("   waypoints:", data.waypoints.length)
  console.log("   routes:   ", data.routes.length)
  console.log("   tracks:   ", data.tracks.length)

  for (var iTrack=0; iTrack<data.tracks.length; iTrack++) {
    var track = data.tracks[iTrack]
    for (var iSegment=0; iSegment<track.segments.length; iSegment++) {
      var segment = track.segments[iSegment]

      console.log("   track:    ", iTrack, "; segment:", iSegment, "; points:", segment.length)
    }

  }
}
