# observ-mediastream

An attempt at making a [MediaStream](http://www.w3.org/TR/mediacapture-streams/#mediastream)
represented simply using [observables](https://github.com/Raynos/observ)


[![NPM](https://nodei.co/npm/observ-mediastream.png)](https://nodei.co/npm/observ-mediastream/)

[![unstable](https://img.shields.io/badge/stability-unstable-yellowgreen.svg)](https://github.com/dominictarr/stability#unstable) [![bitHound Score](https://www.bithound.io/github/rtc-io/observ-mediastream/badges/score.svg)](https://www.bithound.io/github/rtc-io/observ-mediastream) 

## Example Usage

```js
var ObservStream = require('observ-mediastream');
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
  }, 1000);

  stream.set(s);
});

```

## License(s)

### Apache 2.0

Copyright 2015 National ICT Australia Limited (NICTA)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
