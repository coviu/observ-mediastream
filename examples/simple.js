var ObservStream = require('..');
var getUserMedia = require('getusermedia');
var stream = ObservStream();

stream(function(value) {
  console.log('captured changes: ', value);
});

getUserMedia({ audio: true, video: true }, function(err, s) {
  if (err) {
    return console.error('could not capture media stream: ', err);
  }

  setTimeout(function() {
    stream.muted.set(true);
    stream.tags.set(['camera']);
  }, 1000);

  stream.set(s);
});
