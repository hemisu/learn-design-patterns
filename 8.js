var event = {
  clientList: [],
  listen: function(key, fn) {
    if(!this.clientList[key]) { // 如果不存在这个key标识
      this.clientList[key] = [];
    }
    this.clientList[key].push(fn); // 订阅消息放入缓存列表
  },
  trigger: function() {
    var key = Array.prototype.shift.call(arguments);
    var fns = this.clientList[key];
    if(!fns || fns.length === 0) {
      return false; // 如果不存在对应标识的信息
    }

    for(var i = 0, fn; fn = fns[i++];) {
      fn.apply(this, arguments); // arguments是去除key标识之后的剩余的参数
    }
  }
}

// mixin给对象安装发布者-订阅者模式的功能
var installEvent = function(obj) {
  for(var i in event) {
    obj[i] = event[i];
  }
}

var saleOffices = {};
installEvent(saleOffices);

saleOffices.listen('squareMeter88', function(price) {
  console.log('88平米的房子 现在的价格是' + price);
})

saleOffices.listen('squareMeter100', function(price) {
  console.log('100平米的房子 现在的价格是' + price);
})

saleOffices.trigger('squareMeter88', 1000);
saleOffices.trigger('squareMeter100', 10000);

var Event = (function(){
  var global = this,
  Event,
  _default = 'default';
  Event = function(){
    var _listen,
    _trigger,
    _remove,
    _slice = Array.prototype.slice,
    _shift = Array.prototype.shift,
    _unshift = Array.prototype.unshift,
    namespaceCache = {},
    _create,
    find,
    each = function( ary, fn ){
      var ret;
      for ( var i = 0, l = ary.length; i < l; i++ ){
        var n = ary[i];
        ret = fn.call( n, i, n);
      }
      return ret;
    };
    _listen = function( key, fn, cache ){
      if ( !cache[ key ] ){
        cache[ key ] = [];
      }
      cache[key].push( fn );
    };
    _remove = function( key, cache ,fn){
      if ( cache[ key ] ){
        if( fn ){
          for( var i = cache[ key ].length; i >= 0; i-- ){
            if( cache[ key ] === fn ){
              cache[ key ].splice( i, 1 );
            }
          }
        }else{
          cache[ key ] = [];
        }
      }
    };
    _trigger = function(){
      var cache = _shift.call(arguments),
      key = _shift.call(arguments),
      args = arguments,
      _self = this,
      ret,
      stack = cache[ key ];
      if ( !stack || !stack.length ){
        return;
      }
      return each( stack, function(){
        return this.apply( _self, args );
      });
    };
    _create = function( namespace ){
      var namespace = namespace || _default;
      var cache = {},
      offlineStack = [], // 离线事件
      ret = {
        listen: function( key, fn, last ){
          _listen( key, fn, cache );
          if ( offlineStack === null ){
            return;
          }
          if ( last === 'last' ){
          }else{
            each( offlineStack, function(){
              this();
            });
          }
          offlineStack = null;
        },
        one: function( key, fn, last ){
          _remove( key, cache );
          this.listen( key, fn ,last );
        },
        remove: function( key, fn ){
          _remove( key, cache ,fn);
        },
        trigger: function(){
          var fn,
          args,
          _self = this;
          _unshift.call( arguments, cache );
          args = arguments;
          fn = function(){
            return _trigger.apply( _self, args );
          };
          if ( offlineStack ){
            return offlineStack.push( fn );
          }
          return fn();
        }
      };
      return namespace ?
      ( namespaceCache[ namespace ] ? namespaceCache[ namespace ] :
        namespaceCache[ namespace ] = ret )
      : ret;
    };
    return {
      create: _create,
      one: function( key,fn, last ){
        var event = this.create( );
        event.one( key,fn,last );
      },
      remove: function( key,fn ){
        var event = this.create( );
        event.remove( key,fn );
      },
      listen: function( key, fn, last ){
        var event = this.create( );
        event.listen( key, fn, last );
      },
      trigger: function(){
        var event = this.create( );
        event.trigger.apply( this, arguments );
      }
    };
  }();
  return Event;
})();

/* 发布后订阅 */
Event.trigger('click', 1);

Event.listen('click', function(a) {
  console.log(a);
})
/* 使用命名空间 */
Event.create('namespace1').listen('click', (a) => console.log(a));
Event.create('namespace1').trigger('click', 1)
Event.create('namespace2').listen('click', (a) => console.log(a));
Event.create('namespace1').trigger('click', 2)