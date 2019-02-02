// const { analyze } = require('web-audio-beat-detector');
const { login } = require("tplink-cloud-api");
const { Audio } = require("audio")
const uuidV4 = require("uuid/v4");
var AudioContext = require("web-audio-api").AudioContext;
var MusicTempo = require("music-tempo");

var express = require('express');
var fs = require('fs');

var router = express.Router();

var tplink
var devicelist

var state = [
  150, 100, 2, 1, 100, 90, 4, 0
]
var bpm = 60
var flash = true
var resync = false
var count = 0
var hue = 150;
var divisions = 2;
var separation = 0;
var beatDivision = 4;
var brightness = 50;
var sat = 0;
var period = 10;
var colors = []
var flashNum = 0
const EventEmitter = require('events');
class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter();


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// TODO this
async function beatmatch() {
  await sleep((60000 * beatDivision) / bpm)
  // get an audio input stream - this likely should be a parameter that was initialized elsewhere
  // wait for a beat
  // return promise when beat hits
  return
}

async function setColors(base, colorList, listit) {
  colors = []
  if (listit) {
    colors = colorList.split(",")
    for (var i = 0; i < colors.length; i++) {
      colors[i] = parseInt(colors[i])
    }
    divisions = colors.length
  }
  else {
    for (var i = 0; i < divisions; i++) {
      colors.push((base + i * (360 / divisions)) % 360)
    }
  }
}

async function tweakBulbs() {
  var index, currentBrightness
  currentBrightness = brightness * (1 - (count % (1 + flashNum)))
  for (var i = 0; i < devicelist.length; i++) {
    // this doesn't work quite as intended
    if (devicelist[i].deviceType != 'IOT.SMARTBULB' || devicelist[i].status == 0) {
      continue
    }
    index = (count + separation * i) % divisions
    tplink.getLB130(devicelist[i]['alias']).setState(1,
      currentBrightness,
      colors[index],
      sat,
      period);
  }
}

async function metronome() {
  flash = true

  // prompt for this
  var TPLINK_USER = process.argv[2]
  var TPLINK_PASS = process.argv[3]
  var TPLINK_TERM = "TermID";
  
  // log in to cloud, return a connected tplink object
  tplink = await login(TPLINK_USER, TPLINK_PASS, TPLINK_TERM);

  // get a list of raw json objects (must be invoked before .get* works)
  devicelist = await tplink.getDeviceList();
  // console.log(devicelist)
  while (0 == 0) {
    await beatmatch()
    if (flash) {
      myEmitter.emit('beat');
    }
  }
}

var calcTempo = function (buffer) {
  if (buffer == null) {
    return bpm
  }
  var audioData = [];
  // Take the average of the two channels
  if (buffer.numberOfChannels == 2) {
    var channel1Data = buffer.getChannelData(0);
    var channel2Data = buffer.getChannelData(1);
    var length = channel1Data.length;
    for (var i = 0; i < length; i++) {
      audioData[i] = (channel1Data[i] + channel2Data[i]) / 2;
    }
  } else {
    audioData = buffer.getChannelData(0);
  }
  var mt = new MusicTempo(audioData);

  console.log(mt.tempo);
  console.log(mt.beats);
  return mt.tempo
}

async function hypotheticalRecordFunction() {
  return null
}

async function setBPM() {
  // record audio
  global.navigator.mediaDevices.getUserMedia({audio: true}, stream =>
    Audio.record(stream, (err, audio) => {
      audio.save('my-record.wav')
    }).catch(function(error) {
      console.log(error);
    })
  )
  // put it in an AudioBuffer
  var hypotheticalBuffer = hypotheticalRecordFunction()
  // make the function do the thing
  // set the new BPM
  bpm = calcTempo(hypotheticalBuffer)
  return
}

myEmitter.on('beat', () => {
  count++;
  tweakBulbs()
  // console.log((count % 4) + 1)
  if (count % 1 == 0 && resync) {
    setBPM()
    // console.log("New BPM: " + bpm)
  }
});

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index')
})

/* GET program page. */
router.get('/schedule', function (req, res) {
  res.render('schedule')
})

router.post('/', function (req, res, next) {
  var message = ""
  // stores the input
  // {"divisions":"2","hue":"0","separation":"0","bpm":"90","beat":"4"}
  if (req.body.func == "start" || !flash) {
    flash = true
    message = "started server\n"
  }
  else if (req.body.func == "stop") {
    flash = false
    message = "stopped server\n"
  }
  // {
  //   "hue":"150",
  //   "sat":"100",
  //   "divisions":"2",
  //   "separation":"1",
  //   "brightness":"100",
  //   "bpm":"90",
  //   "beat":"4",
  //   "slide":"0",
  //   "func":"start",
  //   "colorlist":""}
  hue = req.body.hue
  divisions = parseInt(req.body.divisions)
  separation = parseInt(req.body.separation)
  bpm = parseInt(req.body.bpm)
  beatDivision = 1 / Math.pow(2, parseInt(req.body.beat) - 4)
  brightness = parseInt(req.body.brightness);
  sat = parseInt(req.body.sat);
  period = Math.floor((60000 * beatDivision) / bpm * parseInt(req.body.slide) / 8)
  if (req.body.Brightness_check) {
    console.log("flashing...")
    beatDivision = 1 / Math.pow(2, parseInt(req.body.beat) - 3)
    flashNum = 1
    period = Math.floor((60000 * beatDivision) / bpm * parseInt(req.body.slide) / 16)
  }
  else {
    flashNum = 0
  }
  setColors(parseInt(hue), req.body.colorlist, req.body.Hue_check)
  console.log(JSON.stringify(req.body))
  res.send(message + JSON.stringify(req.body, null, 4))
});

module.exports = router;
// in a sentimental mood - duke ellington
flash = true
metronome()