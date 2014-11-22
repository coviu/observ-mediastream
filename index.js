var Observ = require('observ');
var ObservArray = require('observ-array');
var ObservStruct = require('observ-struct');

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

  function addTrack(target) {
    return function(track) {
      track.addEventListener('mute', function(evt) {
        console.log('captured mute event', evt);
      });

      track.addEventListener('ended', function(evt) {
        console.log('captured track end: ', track, evt);
      });

      if (track && track.kind === 'audio' && (track.enabled === muted())) {
        muted.set(!track.enabled);
      }

      target.push(track);
    };
  }

  function getAudioTracks() {
    return tracks.filter(function(track) {
      return track.kind === 'audio';
    });
  }

  function handleUpdate(newStream) {
    tracks.transaction(function(items) {
      newStream.getVideoTracks().forEach(addTrack(items));
      newStream.getAudioTracks().forEach(addTrack(items));
    });
  }

  function toggleMuted(value) {
    getAudioTracks().forEach(function(track) {
      track.enabled = !value;
    });
  }

  if (mediastream) {
    handleUpdate(mediastream);
  }

  // toggle muted state
  muted(toggleMuted);

  s = ObservStruct({ tracks: tracks, muted: muted });
  s.update = handleUpdate;

  return s;
};
