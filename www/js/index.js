/* global five,BleSerialPort,VirtualJoystick */
'use strict';

function initCarControl() {
  console.log('initialize car controls');
  var joystickElem = document.getElementById('joystick');
  var joystick = new VirtualJoystick({
    container: joystickElem,
    limitStickTravel: true,
    stickRadius: 60,
    mouseSupport: !window.cordova
  });

  var bsp;
  if (window.cordova) {
    if (window.cordova.platformId == 'ios') {
      bsp = new BleSerialPort({address: CONFIG.DEVICE_ADDRESS_IOS});
    } else {
      bsp = new BleSerialPort({address: CONFIG.DEVICE_ADDRESS});
    }
  }
  //This is for testing in the browser
  else {
    var socket = io(CONFIG.SOCKET_IO_SERVER);

    bsp = new SocketIoSerialPort({
      client: socket,
      device: {   //put your device channel/address here
        channel: 'ble',
        name: CONFIG.DEVICE_NAME,
        address: CONFIG.DEVICE_ADDRESS
      }
    });
  }

  bsp.connect().then(function() {
    console.log('BSP connected');
    var board = new five.Board({port: bsp, repl: false});
    board.on('ready', function() {
      console.log('Arduino connected!');
      joystickElem.style.background = '#000000';
      var led = new five.Led(7);
      led.on();
      var motorLeft = new five.Motor({
        invertPWM: true,
        pins: {
          pwm: 5,
          dir: 4
        }
      });
      var motorRight = new five.Motor({
        invertPWM: true,
        pins: {
          pwm: 3,
          dir: 2
        }
      });

      var COMMAND_INTERVAL = 100;
      var MOVE_THRESHOLD = 20;
      var MIN_SPEED = 50;
      var MAX_SPEED = 255;
      var FACTOR = 3.5;

      function moveCar() {
        var dx = joystick.deltaX() * FACTOR;
        var dy = joystick.deltaY() * FACTOR;

        if (Math.abs(dx) < MOVE_THRESHOLD && Math.abs(dy) < MOVE_THRESHOLD) {
          motorLeft.stop();
          motorRight.stop();
          return;
        }

        var ls = Math.abs(dy) + MIN_SPEED - MOVE_THRESHOLD;
        var rs = Math.abs(dy) + MIN_SPEED - MOVE_THRESHOLD;
        if (dx > MOVE_THRESHOLD) {
          ls += dx + MIN_SPEED - MOVE_THRESHOLD;
        } else if (dx < -MOVE_THRESHOLD) {
          rs -= dx - MIN_SPEED + MOVE_THRESHOLD;
        }
        ls = ls > MAX_SPEED ? MAX_SPEED : ls;
        rs = rs > MAX_SPEED ? MAX_SPEED : rs;
        if (dy < -MOVE_THRESHOLD) {
          console.log('forward', ls, rs);
          motorLeft.forward(ls);
          motorRight.forward(rs);
        } else if (dy > MOVE_THRESHOLD) {
          console.log('reverse', ls, rs);
          motorLeft.reverse(ls);
          motorRight.reverse(rs);
        }
      }

      var prevMoveTime = new Date().getTime();

      function onJoystickTouch(e) {
        switch (e.type) {
          case 'touchstart':
          case 'mousedown':
            joystick.onTouch = true;
            console.log('start');
            break;
          case 'touchend':
          case 'mouseup':
            joystick.onTouch = false;
            console.log('end');
            setTimeout(function() {
              motorLeft.stop();
              motorRight.stop();
            }, COMMAND_INTERVAL * 2);
            break;
          case 'touchmove':
          case 'mousemove':
            if (joystick.onTouch && new Date().getTime() -
              prevMoveTime > COMMAND_INTERVAL) {
              prevMoveTime = new Date().getTime();
              console.log('move', joystick.deltaX(), joystick.deltaY());
              moveCar();
            }
            break;
        }
      }

      joystickElem.addEventListener('touchstart', onJoystickTouch);
      joystickElem.addEventListener('touchend', onJoystickTouch);
      joystickElem.addEventListener('touchmove', onJoystickTouch);
      joystickElem.addEventListener('mousedown', onJoystickTouch);
      joystickElem.addEventListener('mouseup', onJoystickTouch);
      joystickElem.addEventListener('mousemove', onJoystickTouch);
    });
  });
}

var app = {

  initialize: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },

  onDeviceReady: function() {
    app.receivedEvent('deviceready');
    initCarControl();
  },

  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  }
};

app.initialize();

//This is for testing in the browser
if (!window.cordova) {
  document.dispatchEvent(new CustomEvent('deviceready'));
}