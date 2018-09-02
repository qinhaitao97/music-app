/**
 * dom 相关操作通用代码
 */

// 给 dom 元素添加类名
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return;
  } else {
    let newClass = el.className.split(' ');
    newClass.push(className);
    el.className = newClass.join(' ').trim();
  }
}

// 检查 dom 元素有没有相应的类名
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
}

// 获取(设置)相应 dom 元素的 name 属性，val 无值是获取，有值是设置
export function getData(el, name, val) {
  const prefix = 'data-';
  name = prefix + name;
  if (val) {
    return el.setAttribute(name, val);
  } else {
    return el.getAttribute(name);
  }
}

// 浏览器能力检测特性
let elementStyle = document.createElement('div').style;

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }
  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false;
  }
  if (vendor === 'standard') {
    return style;
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}