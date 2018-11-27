var mult = function(...args) {
  console.log('开始计算乘积');
  var a = 1;
  for (let i = 0, l = args.length; i < l; i++) {
    a = a * args[i];
  }
  return a;
}

console.log(mult(2, 3));
console.log(mult(2, 3, 4));

// 缓存代理函数
var proxyMult = (function() {
  var cache = [];
  return function() {
    var args = Array.prototype.join.call(arguments, ',');
    if(args in cache) {
      return cache[args];
    }
    return cache[args] = mult.apply(this, arguments);
  }
})();

console.log(proxyMult(1, 2, 3, 4));
console.log(proxyMult(1, 2, 3, 4));