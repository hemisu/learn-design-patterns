// 通过高阶函数动态创建代理
/* 计算乘积 */
var mult = function(...args) {
  console.log('开始计算乘积');
  var a = 1;
  for (let i = 0, l = args.length; i < l; i ++) {
    a = a * args[i];
  }
  return a;
}
/* 计算加和 */
var plus = function(...args) {
  console.log('开始计算加和');
  var a = 0;
  for(let i = 0, l = args.length;i < l; i ++) {
    a += args[i];
  }
  return a;
}
/* 创建缓存代理的工厂 */
var createProxyFactory = function(fn) {
  var cache = [];
  return function() {
    var args = Array.prototype.join.call(arguments, ',');
    if(args in cache) {
      return cache[args];
    }
    return cache[args] = fn.apply(this, arguments);
  }
}

var proxyMult = createProxyFactory(mult);
var proxyPlus = createProxyFactory(plus);

console.log(proxyMult(2,3,4))
console.log(proxyMult(2,3,4))

console.log(proxyPlus(2,3,4))
console.log(proxyPlus(2,3,4))