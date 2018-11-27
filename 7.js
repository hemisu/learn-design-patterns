var each = function(ary, callback) {
  for(var i = 0, l = ary.length; i < l; i++) {
    callback.call(ary[i], i, ary[i]);
  }
}

each([1, 2, 3], function(i, n) {
  console.log(`第${i}个是${n}`);
})

var compare = function(ary1, ary2) {
  if(ary1.length !== ary2.length) {
    throw new Error('ary1和ary2不相等')
  }
  each(ary1, function(i, n) {
    if(n !== ary2[i]) {
      throw new Error('ary1和ary2不相等');
    }
  });
  console.log('ary1和ary2相等');
}

compare([1,2,3], [1,2,3])
try {
  compare([1,2,3], [1,2,4])  
} catch (error) {
  console.log(error.message)
}

var Iterator = function(obj) {
  var current = 0;

  var next = function() {
    current ++;
  }

  var isDone = function() {
    return current >= obj.length;
  }

  var getCurrentItem = function() {
    return obj[current];
  }

  return {
    next,
    isDone,
    getCurrentItem,
    length: obj.length,
  }
}

var compare = function(iterator1, iterator2) {
  if(iterator1.length !== iterator2.length) {
    console.log('iterator1 和 iterator2 不相等');
  }
  while(!iterator1.isDone() && !iterator2.isDone()) {
    if(iterator1.getCurrentItem() !== iterator2.getCurrentItem()) {
      throw new Error('iterator1和iterator2不相等');
    }
    iterator1.next()
    iterator2.next()
  }
  console.log('iterator1和iterator2相等');
}

var iterator1 = Iterator([1,2,3]);
var iterator2 = Iterator([1,2,3]);

compare(iterator1, iterator2);

