var Observ = require('observ');
var ObservArray = require('observ-array');
var ObservStruct = require('observ-struct');
var MediaStream = require('feature/detect')('MediaStream');
/**
  # observ-mediastream

  An attempt at making a [MediaStream](http://www.w3.org/TR/mediacapture-streams/#mediastream)
  represented simply using [observables](https://github.com/Raynos/observ)

  ## Example Usage

  <<< examples/simple.js
**/
module.exports = function(mediastream) {
  var muted = Observ(false);
  var tracks = ObservArray([]);
  var s;
  var _set;

  function getAudioTracks() {
    return tracks.filter(function(track) {
      return track.kind === 'audio';
    });
  }

  function set(newStream) {
    var isMuted;

    if (! (newStream instanceof MediaStream)) {
      return _set(newStream);
    }

    s.tracks.set([].concat(newStream.getVideoTracks()).concat(newStream.getAudioTracks()));

    isMuted = s.tracks.filter(function(track) {
      track.kind === 'audio' && (! track.enabled);
    })[0] || false;

    if (s.muted() !== isMuted) {
      s.muted.set(isMuted);
    }
  }

  function toggleMuted(value) {
    getAudioTracks().forEach(function(track) {
      track.enabled = !value;
    });
  }

  if (mediastream) {
    set(newStream);
  }

  // toggle muted state
  muted(toggleMuted);

  s = ObservStruct({ tracks: tracks, muted: muted });
  _set = s.set;
  s.set = set;

  return s;
};
