export function formatDate(date, fmt) {
  // 年份截取
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) // 匹配到括号里面的/(y+)/值
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  // 通过遍历的方法动态构造正则表达式
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '' // 加上单引号表示转换为字符串
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

// 左边是否补零,比如str是6，那就是006，截取下来就是06，比如是12那 str.length就为2，截取下来就是12
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
