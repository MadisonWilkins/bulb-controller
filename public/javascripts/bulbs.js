const { login } = require("tplink-cloud-api");
const uuidV4 = require("uuid/v4");

const TPLINK_USER = "madisonw@vt.edu";
const TPLINK_PASS = "@Stretch502";
const TPLINK_TERM = "TermID";
var beatlength = 2000;
var flash = false

const http = require('http');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// TODO this
function beatmatch() {
    var waitTime = beatlength;
    sleep(waitTime)
    // get an audio input stream - this likely should be a parameter that was initialized elsewhere
    // wait for a beat
    // return promise when beat hits
    return
}

async function main() {
    console.log("Server started on port " + PORT)
    // log in to cloud, return a connected tplink object
    const tplink = await login(TPLINK_USER, TPLINK_PASS, TPLINK_TERM);

    // get a list of raw json objects (must be invoked before .get* works)
    const dl = await tplink.getDeviceList();
    // console.log(dl);
    //   await tplink.getLB130("Couch Bulb Door").setState(0, 100, 150, 80)
    //   await tplink.getLB130("Desk Bulb Door").setState(0, 100, 150, 80)
    var brightness = 50;
    var hue = 150;
    var sat = 80;
    var count = 0;
    var couchBulb = tplink.getLB130("Couch Bulb Door");
    var deskBulb = tplink.getLB130("Desk Bulb Door");
    while (0 == 0) {
        if (flash) {
            await couchBulb.setState(1, brightness, hue, sat);
            await deskBulb.setState(1, brightness, 360 - hue, 100 - sat);
            // brightness = Math.floor((Math.random() * 100) + 1);
            sat = Math.floor((Math.random() * 100) + 1);
            hue = Math.floor((Math.random() * 360) + 1);
            await beatmatch();
            count = count + 1;
            couchBulb.powerOff();
            deskBulb.powerOff();
            await beatmatch();
            count = count + 1;
            // console.log("change " + count);
        }
    }

}

// const server = http.createServer((req, res) => {
// console.log("...........................")
// console.log("req:")
// console.log(req)
// console.log("res:")
// console.log(res)
// console.log("...........................")
// flash = !flash
// main()
// res.end(flash.toString())
//     req.append('Content-Type', 'text/plain')
//     res.end('Hello world!')
//     main()
// });

const server = http.createServer((req, res) => {
    var response = req.
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end(response)
});

server.listen(PORT);