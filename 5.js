// 模仿传统oop语言
var performanceS = function() {};

performanceS.prototype.calculate = function(salary) {
  return salary * 4;
}

var performanceA = function() {};

performanceA.prototype.calculate = function(salary) {
  return salary * 3;
}
var performanceB = function() {};

performanceB.prototype.calculate = function(salary) {
  return salary * 2;
}

// 环境类
var Bonus = function () {
  this.salary = null; // 原始工资
  this.strategy = null; // 绩效等级对应的策略对象
}

Bonus.prototype.setSalary = function (salary) {
  this.salary = salary; // 设置员工的原始工资
}

Bonus.prototype.setStrategy = function (strategy) {
  this.strategy = strategy; // 设置员工绩效等级对应的策略对象
}

Bonus.prototype.getBonus = function() {
  return this.strategy.calculate(this.salary); // 把计算奖金的操作委托给策略对象
}

// 使用策略模式
var bonus = new Bonus();

bonus.setSalary(10000);
bonus.setStrategy(new performanceA());

console.log(bonus.getBonus()); // 查看绩效A的奖金

// js中可以采取的写法
// 因为js中函数也是对象，可以直接把strategy定义为函数
var strategies = {
  "S": function(salary) {
    return salary * 4;
  },
  "A": function(salary) {
    return salary * 3;
  },
  "B": function(salary) {
    return salary * 2;
  },
}

var calculateBonus = function (level, salary) {
  return strategies[level](salary);
}

console.log(calculateBonus('S', 10000));
console.log(calculateBonus('A', 10000));

// 利用高阶函数

var S = (salary) => salary * 4;
var A = (salary) => salary * 3;
var B = (salary) => salary * 2;

var calculateBonus = (func, salary) => func(salary);

console.log(calculateBonus(S, 1000));

// 常见缓动算法
var tween = {
  /**
   * 
   * @param {*} t 已消耗时间
   * @param {*} b 小球原始位置
   * @param {*} c 小球目标位置
   * @param {*} d 持续总时间
   */
  linear: function(t, b, c, d) {
    return c * t / d + b;
  },
  easeIn: function(t, b, c, d) {
    return c * ( t /= d) * t + b;
  },
  strongEaseIn: function(t, b, c, d) {
    return c * ( t /= d ) * t * t * t * t + b;
  },
  strongEaseOut: function(t, b, c, d) {
    return c * ( (t = t /d - 1) * t * t * t * t + 1) + b;
  },
  sineaseIn: function(t, b, c, d) {
    return c * ( t /= d ) * t * t + b;
  },
  sineaseOut: function(t, b, c, d) {
    return c * (( t = t / d - 1 ) * t * t + 1) + b;
  },
}

var Animate = function(dom) {
  this.dom = dom;
  this.startTime = 0; // 开始时间
  this.startPos = 0; // dom开始位置
  this.endPos = 0;
  this.propertyName = null; // dom节点需要被改变的css属性名
  this.easing = null; // 缓动算法
  this.duration = null; // 动画持续时间
}

Animate.prototype.start = function(propertyName, endPos, duration, easing) {
  this.startTime = + new Date; // 动画启动事件
  this.startPos = this.dom.getBoundingClientRect()[propertyName];
  this.endPos = endPos;
  this.duration = duration;
  this.easing = tween[easing];
  this.propertyName = propertyName;

  var self = this;
  var timeId = setInterval(function() {
    if( self.step() === false) {
      clearInterval(timeId);
    }
  }, 19);
}

Animate.prototype.step = function() {
  var t = + new Date;
  if (t >= this.startTime + this.duration) {
    this.update(this.endPos); // 更新css属性 修正最后的位置
    return false;
  }
  var pos = this.easing(t - this.startTime, this.startPos,
    this.endPos, this.duration);
  this.update(pos); // 更新当前的css值
}

Animate.prototype.update = function(pos) {
  this.dom.style[this.propertyName] = pos + 'px';
}

