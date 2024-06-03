export function throttle(fn: () => void, threshold: number, scope?: any) {
  threshold || (threshold = 250); // 默认阈值为250ms
  var last: number;
  return function () {
    var context = scope;
    var now = new Date().getTime();
    if (last && now - last < threshold) {
      // 如果距离上次执行的时间小于阈值，则不执行
      return;
    }
    last = now;
    fn.apply(context); // 执行函数并应用原始函数的上下文和参数
  };
}