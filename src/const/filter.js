import dayjs from 'dayjs'

const isNull = function(o) {
  return o === null || o === void 0
}

export function formatDate(time, format = 'YYYY-MM-DD') {
  if (!time) {
    return ''
  }
  return dayjs(time).format(format)
}

export function price(val, cancelFixed) {
  if (isNull(val) || isNaN(val)) return
  let USPrice = Number.parseFloat(val).toLocaleString()

  let lastDot = USPrice.toString().indexOf('.')
  // 完全是整数, 需要添加小数点
  if (lastDot === -1 && !cancelFixed) USPrice += '.00'

  // 返回数据是一位小数，用0补齐为两位小数
  if (USPrice.toString().substring(lastDot + 1).length === 1 && !cancelFixed)
    USPrice += '0'

  return USPrice
}
