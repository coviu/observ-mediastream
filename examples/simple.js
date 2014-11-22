var ObservStream = require('..');
var getUserMedia = require('getusermedia');
var stream = ObservStream();

getUserMedia({ audio: true, video: true }, function(err, s) {
  if (err) {
    return console.error('could not capture media stream: ', err);
  }

  setTimeout(function() {
    stream.muted.set(true);
  }, 1000);

  stream(function(value) {
    console.log('captured changes: ', value);
  });

  // we've patched an update function into the observ-struct so we can
  // supply the complex stream value
  stream.update(s);
});
