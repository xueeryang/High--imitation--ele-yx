/**
 * 存入
 * */

export function saveToLocal(id, key, value) {
  // eslint检查下localstorage一定要指明是哪个空间下的，在浏览器环境下一定要指明是window下的，nodejs是没有localstorge的，只有当运行在windows环境下才有。
  let seller = window.localStorage.__seller__
  // 如果从来没有创建过这个seller则要先创建
  if (!seller) {
    seller = {}
    seller[id] = {}
    seller[id][key] = value
  } else {
    seller = JSON.parse(seller)
    // 拿到对象以后判断是佛有这个商家
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  seller[id][key] = value
  localStorage.__seller__ = JSON.stringify(seller)
}

/**
 * 读取
 * */
export function loadFromLocal(id, key, def) {
  let seller = window.localStorage.__seller__
  // 如果完全没有存取过这个变量，那我们读的时候就读这个默认值
  if (!seller) {
    return def
  }
  seller = JSON.parse(seller)[id]
  // 如果这个商家id不存在的话，还是默认返回默认值
  if (!seller) {
    return def
  }
  // 否则就拿到id下的key值
  let ret = seller[key]
  return ret || def
}
