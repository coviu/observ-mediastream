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
  var version = Observ(1);
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

  function touch() {
    s.version.set(version() + 1);
  }

  function set(newStream) {
    var isMuted;

    if ((MediaStream && !(newStream instanceof MediaStream)) || newStream._diff) {
      return _set(newStream);
    }    

    if (URL) {
      // if we have an existing url, revoke the url
      if (url()) {
        URL.revokeObjectURL(url());
      }
      try {
        url.set(URL.createObjectURL(newStream));
      } catch (e) {
        // Might be in a browser that has issues with creating object URLs with media streams
        // Aka. Safari 11. Instead of using the url, use the raw media stream and `el.srcObject = rawMediaStream`
      }
    }

    // Clean remove the listeners
    const existing = raw();
    if (existing) {
      existing.tracks.map((t) => t.removeListener('ended', touch))
    }

    raw.set(newStream);
    s.tracks.set([].concat(newStream.getVideoTracks()).concat(newStream.getAudioTracks()));

    isMuted = s.tracks.filter(function(track) {
      // Attach the end state listeners on the tracks
      track.addEventListener('ended', touch);
      // Return the track if it matches the mute check
      return track.kind === 'audio' && (! track.enabled);
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

  s = ObservStruct({ tracks: tracks, muted: muted, raw: raw, url: url, tags: tags, metadata: metadata, version: version });
  _set = s.set;
  s.set = set;
  s.touch = touch;

  if (mediastream) {
    set(mediastream);
  }

  // toggle muted state
  muted(toggleMuted);

  return s;
};