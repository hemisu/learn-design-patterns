// 现在要负责一个售卖手机的电商网站，分别缴纳500定金和200定金的两轮预定，到达正式购买阶段。
// 如果支付过定金，500能获得100优惠券，200能获得50优惠券；如果没有支付，走普通流程

var order = function(orderType, pay, stock) {
  if(orderType === 1) { // 500元定金购买模式
    if(pay === true) {
      console.log('500元定金预购，得到100优惠券')
    } else {
      if(stock > 0) { // 用于普通购买的手机还有库存
        console.log('普通购买，无优惠券')
      } else {
        console.log('手机库存不足')
      }
    }
  }
  else if (orderType === 2) {
    if(pay === tre) {
      console.log('200元定金预购，得到50优惠券')
    } else {
      if(stock > 0) { // 用于普通购买的手机还有库存
        console.log('普通购买，无优惠券')
      } else {
        console.log('手机库存不足')
      }
    }
  }
  else if (orderType === 3) {
    if(stock > 0) { // 用于普通购买的手机还有库存
      console.log('普通购买，无优惠券')
    } else {
      console.log('手机库存不足')
    }
  }
}

order(1, true, 500)

// 用职责链的方式重构
var order500 = function(orderType, pay, stock) {
  if(orderType === 1 && pay === true) {
    console.log('500元定金预购，得到100优惠券')
  } else {
    return 'nextSuccessor';
  }
}
var order200 = function(orderType, pay, stock) {
  if(orderType === 2 && pay === true) {
    console.log('200元定金预购，得到50优惠券')
  } else {
    return 'nextSuccessor';
  }
}
var orderNormal = function(orderType, pay, stock) {
  if(stock > 0) { // 用于普通购买的手机还有库存
    console.log('普通购买，无优惠券')
  } else {
    console.log('手机库存不足')
  }
}

// 包装进职责链节点
var Chain = function(fn) {
  this.fn = fn;
  this.successor = null;
}
Chain.prototype.setNextSuccessor = function(successor) {
  return this.successor = successor;
}
Chain.prototype.passRequest = function() {
  var ret = this.fn.apply(this, arguments);
  if(ret === 'nextSuccessor') {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments);
  }
  return ret;
}

var chainOrder500 = new Chain(order500);
var chainOrder200 = new Chain(order200);
var chainOrderNormal = new Chain(orderNormal);

chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);

chainOrder500.passRequest(1, true, 500);
chainOrder500.passRequest(2, true, 500);
chainOrder500.passRequest(3, true, 500);
chainOrder500.passRequest(1, false, 0);

var order300 = function(orderType, pay, stock) {
  if(orderType === 4 && pay === true) {
    console.log('300元定金预购，得到80优惠券')
  } else {
    return 'nextSuccessor';
  }
}
var chainOrder300 = new Chain(order300);
chainOrder500.setNextSuccessor(chainOrder300);
chainOrder300.setNextSuccessor(chainOrder200);

chainOrder500.passRequest(1, true, 500);
chainOrder500.passRequest(2, true, 500);
chainOrder500.passRequest(3, true, 500);
chainOrder500.passRequest(4, true, 500);
chainOrder500.passRequest(1, false, 0);

Chain.prototype.next = function() {
  return this.successor && this.successor.passRequest.apply(this.successor, arguments);
}

var fn1 = new Chain(function() {
  console.log(1);
  return 'nextSuccessor';
})

var fn2 = new Chain(function() {
  console.log(2);
  setTimeout(() => {
    this.next();
  }, 1000);
})

var fn3 = new Chain(function() {
  console.log(3);
})

fn1.setNextSuccessor(fn2).setNextSuccessor(fn3);
fn1.passRequest();

Function.prototype.after = function(fn) {
  var self = this;
  return function() {
    var ret = self.apply(this, arguments);
    if(ret === 'nextSuccessor') {
      return fn.apply(this, arguments);
    }
    return ret;
  }
}

var order = order500.after(order200).after(orderNormal);

order(1, true, 500);
order(2, true, 500);
order(1, false, 500);

