const events = require('events');
const chokidar = require('chokidar');
const fn = require('./other');
const EventEmitter = events.EventEmitter;

const a = '12332';
const b = '555';
const c = 123213;

function test(b) {
  return 123123;
}

class MyClub {
  constructor() {
    this.abc = '123';
  }

  test() {

  }
}

class Aclub extends MyClub {
  constructor(ctx) {
    this.ctx = ctx;
  }

  abc(bbb = new EventEmitter()) {
    console.info('saasd');
    return '123'
  }

  get bbb() {
    return chokidar.watch();
  }

  [Symbol.for('aaa')]() {
    console.info('sss');
  }
}

/**
 * 6666
 */
function myFn(a = '123', bbb = new events.EventEmitter(), ccc = chokidar.watch()) {
  console.info('asdas');
  // return new events.EventEmitter();
  return chokidar;
}

// module.exports = {
//   abc: 123123,

//   ccccc: 222
// };

// module.exports = function abc(ccc = 123123) {
//   return ccc;
// };

const obj = {
  test: 123,
  aaaa: String(123123),

  ccc: myFn,
  aaa: myFn,
  ddd: myFn,

  /**
   * 666
   * @param {String} bbb asd
   */
  async getFn(bbb) {
    return this;
  },

  async bbb() {
    // return this;
    return async () => {
      return myFn;
    }
  }
}

// /**
//  * @param {string} aa sss
//  */
// class Obj {
//   /**
//    * 666
//    * @param {String} abc asd
//    */
//   constructor(abc) {
//     this.bbb = abc;
//   }

//   /**
//    * 666
//    * @param {String} bbb asd
//    */
//   async getFn(bbb) {
//     return this;
//   }
// }

// module.exports = 123;

// exports.bbb = 123123132;
// exports.aaaaa = () => myFn;
// exports.MyClub = MyClub;

// const Controller = require('egg').Controller;
// const fs = require('mz/fs');

module.exports = () => {
  return new MyClub();
};