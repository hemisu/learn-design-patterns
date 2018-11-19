var MyClass = function() {
  this.name = 'seven';
  return {
    name: 'anne', // 显式地返回一个对象
  }
}

var obj = new MyClass();
console.log(obj.name);

function objectFactory() {
  var obj = new Object(),
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  var ret = Constructor.apply(obj, arguments);
  return typeof ret === 'object' ? ret: obj; // 多一行判断
};

var obj2 = objectFactory(MyClass);
console.log(obj2.name);

// document.getElementById = (function(fn) {
//   return  function() {
//     return fn.apply(ctx, arguments);
//   }
// })(document.getElementById)

var getSingle = function(fn) {
  var ret;
  return function(){
    return ret || ( ret = fn.apply( this, arguments ) );
  }
}

var getScript = getSingle(function() {
  return [];
})

var script1 = getScript();
var script2 = getScript();

console.log(`单例模式`, script1 === script2);