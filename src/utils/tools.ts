import { formatUnits, parseUnits } from "@ethersproject/units";
export function formatDecimal(num: any, decimal: number) {
  if (isNaN(num)) {
    return num;
  }
  const minnum = 1 / Math.pow(10, decimal);
  // console.log(decimal)
  // console.log(minnum)
  if (!num || Number(num) <= 0) {
    return "0.00";
  }
  if (Number(num) < minnum) {
    return "<" + minnum;
  }
  // num = (num * 10000).toFixed(decimal) / 10000
  num = num.toString();
  const index = num.indexOf(".");
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1);
  } else {
    num = num.substring(0);
  }
  return Number(parseFloat(num).toFixed(decimal));
}

function thousandBitFormat(num: any, dec: any = 8) {
  const numArr = num.toString().split(".");
  const numInt = numArr[0];
  const numDec = numArr[1] ? numArr[1] : "";
  const numStr = numInt
    .toString()
    .replace(/\d{1,3}(?=(\d{3})+$)/g, function (s: any) {
      return s + ",";
    });
  // console.log(num)
  // console.log(numDec)
  // console.log(dec)
  if (isNaN(dec)) {
    return numStr + (numDec ? "." + numDec : "");
  }
  return numStr + (numDec ? "." + numDec.substr(0, dec) : "");
}

export function thousandBit(num: any, dec: any = 8) {
  if (!Number(num)) return "0.00";
  if (Number(num) < 0.00000001) return "<0.00000001";
  if (Number(num) < 0.01) {
    if (isNaN(dec)) {
      return num;
    } else {
      return formatDecimal(num, 6);
    }
  }
  if (Number(num) < 1) {
    if (isNaN(dec)) {
      return num;
    } else {
      return formatDecimal(num, 4);
    }
  }
  if (Number(num) < 1000) {
    if (isNaN(dec)) {
      return num;
    } else {
      return formatDecimal(num, dec);
    }
  }
  const _num = (num = Number(num));
  if (isNaN(num)) {
    num = 0;
    num = formatDecimal(num, dec);
  } else {
    num = thousandBitFormat(num, dec);
    // if (isNaN(dec)) {
    //   if (num.toString().indexOf('.') === -1) {
    //     num = Number(num).toString().replace(/\d{1,3}(?=(\d{3})+$)/g,function(s:any){
    //       return s+','
    //     })
    //   } else {
    //     const numSplit = num.toString().split('.')
    //     numSplit[1] = numSplit[1].length > 9 ? numSplit[1].substr(0, 8) : numSplit[1]
    //     num = Number(numSplit[0]).toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toLocaleString()
    //     // num = Number(numSplit[0]).toString().replace(/\d{1,3}(?=(\d{3})+$)/g,function(s:any){
    //     //   return s+','
    //     // })
    //     num = num.toString().split('.')[0] + '.' + numSplit[1]
    //   }
    // } else {
    //   if (num.toString().indexOf('.') === -1) {
    //     num = formatDecimal(num, dec).toString().replace(/\d{1,3}(?=(\d{3})+$)/g,function(s:any){
    //       return s+','
    //     })
    //   } else {
    //     num = formatDecimal(num, dec).toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toLocaleString()
    //   }
    // }
  }
  if (_num < 0 && num.toString().indexOf("-") < 0) {
    num = "-" + num;
  }
  return num;
}

export function fromWei(value: any, decimals?: number, dec?: number) {
  if (!value || !value) {
    return "";
  }
  if (Number(value) === 0) {
    return 0;
  }
  decimals = decimals !== undefined ? decimals : 18;
  if (dec) {
    return formatDecimal(Number(formatUnits(value.toString(), decimals)), dec);
  }
  // return formatUnits(value.toString(), decimals)
  return Number(formatUnits(value.toString(), decimals));
}
export function toWei(value: any, decimals: number) {
  if (!value || !value) {
    return "";
  }
  if (Number(value) === 0) {
    return 0;
  }
  return parseUnits(value.toString(), decimals);
}
function timeSec(time: any) {
  return time + "s";
}

function timeMin(time: any, type?: any) {
  const seconds = time - Math.floor(time / 60) * 60;
  let callback = Math.floor(time / 60) + "m " + timeSec(seconds);
  if (type === "min") {
    callback = Math.floor(time / 60) + "m ";
  } else {
    callback = Math.floor(time / 60) + "m " + timeSec(seconds);
  }
  return callback;
}

function timeHour(time: any, type?: any) {
  const hours = Math.floor(time / (60 * 60));
  const minute = timeMin(time - hours * 60 * 60, type);
  let callback = hours + "h " + minute;
  if (type === "hour") {
    callback = hours + "h ";
  } else {
    callback = hours + "h " + minute;
  }
  return callback;
}

function timeDay(time: any, type?: any) {
  const days = Math.floor(time / (60 * 60 * 24));
  const hours = timeHour(time - days * 60 * 60 * 24, type);
  const callback = days + " days " + hours;
  return callback;
}
export function timesFun(time: any, now?: any) {
  // let nowTime = Date.parse(now)
  const nowTime = now ? now : Date.parse(new Date().toString());
  // console.log(nowTime)
  time = time.toString().length > 10 ? time : time * 1000;
  // console.log(time)
  let dataTime = 0;
  let callback: any = 0;
  if (isNaN(time)) {
    dataTime = Date.parse(time);
  } else {
    dataTime = time;
  }
  let timeDiffer = (nowTime - dataTime) / 1000;
  timeDiffer = timeDiffer > 0 ? timeDiffer : 1;

  if (timeDiffer < 60) {
    // seconds
    // console.log(1)
    callback = timeSec(timeDiffer);
  } else if (timeDiffer < 60 * 60) {
    // minute
    // console.log(2)
    callback = timeMin(timeDiffer);
  } else if (timeDiffer < 60 * 60 * 24) {
    // hours
    // console.log(3)
    callback = timeHour(timeDiffer, "min");
  } else {
    // day
    // console.log(4)
    callback = timeDay(timeDiffer, "hour");
  }
  // console.log(callback)
  return callback;
}
export function getSymbol(pairid: any) {
  if (pairid === "any") {
    return pairid.toUpperCase();
  }
  // const pairid = row.pairid ? row.pairid.replace('v2', '').replace('v3', '').replace('v4', '').replace('v5', '').replace('v6', '').replace('any', '').toUpperCase() : (obj ? obj.symbol : '')

  // console.log(row.pairid)
  const symbol = pairid
    ? pairid
        .replace(/v[0-9]+$/, "")
        .replace("any", "")
        .toUpperCase()
    : "";
  return symbol;
}
export function safeFormatValue(value, decimal) {
  try {
    const valueFormated = thousandBit(fromWei(value, decimal), 2);
    return valueFormated;
  } catch (error) {
    return value;
  }
}
