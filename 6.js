// var Flower = function() {};

// var xiaoming = {
//   sendFlower: function(target) {
//     var flower = new Flower();
//     target.receiveFlower(flower);
//   }
// }

// var A = {
//   receiveFlower: function(flower) {
//     console.log('收到花了' + flower);
//   }
// }

// xiaoming.sendFlower(A);

/* 加入代理B之后 */

// var Flower = function() {};

// var xiaoming = {
//   sendFlower: function(target) {
//     var flower = new Flower();
//     target.receiveFlower(flower);
//   }
// }

// var B = {
//   receiveFlower: function(flower) {
//     A.receiveFlower(flower);
//   }
// }
// var A = {
//   receiveFlower: function(flower) {
//     console.log('收到花了' + flower);
//   }
// }

// xiaoming.sendFlower(B);

/* 比如B可以监听A的心情变化 */
var Flower = function() {};

var xiaoming = {
  sendFlower: function(target) {
    var flower = new Flower();
    target.receiveFlower(flower);
  }
}

var B = {
  receiveFlower: function(flower) {
    A.listenGoodMood(function() {
      A.receiveFlower(flower);
    })
  }
}
var A = {
  receiveFlower: function(flower) {
    console.log('收到花了' + flower);
  },
  listenGoodMood: function(fn) {
    setTimeout(function() {
      fn();
    }, 5000);
  }
}

xiaoming.sendFlower(B);