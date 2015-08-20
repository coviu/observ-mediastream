var Observ = require('observ');
var ObservArray = require('observ-array');
var ObservStruct = require('observ-struct');
var MediaStream = require('feature/detect')('MediaStream');
var URL = require('feature/detect')('URL');
/**
  # observ-mediastream

  An attempt at making a [MediaStream](http://www.w3.org/TR/mediacapture-streams/#mediastream)
  represented simply using [observables](https://github.com/Raynos/observ)

  ## Example Usage

  <<< examples/simple.js
**/
module.exports = function(mediastream, opts) {
  opts = opts || {};
  var muted = Observ(false);
  var raw = Observ(null);
  var url = Observ(null);
  var tracks = ObservArray([]);
  var tags = ObservArray(opts.tags || []);
  var metadata = ObservStruct(opts.metadata || {});
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

    // if we have an existing url, revoke the url
    if (url()) {
      URL.revokeObjectURL(url());
    }

    raw.set(newStream);
    url.set(URL.createObjectURL(newStream));
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

  s = ObservStruct({ tracks: tracks, muted: muted, raw: raw, url: url, tags: tags, metadata: metadata });
  _set = s.set;
  s.set = set;

  if (mediastream) {
    set(mediastream);
  }

  // toggle muted state
  muted(toggleMuted);

  return s;
};