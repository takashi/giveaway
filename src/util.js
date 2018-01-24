const BN = require('ethjs').BN
const zero = new BN(0)

/**
 * Exported from https://github.com/MetaMask/eth-token-tracker/blob/master/lib/util.js
 */
export const stringifyBalance = (balance, bnDecimals) => {
  if (balance.eq(zero)) {
    return '0'
  }

  const decimals = parseInt(bnDecimals.toString())
  if (decimals === 0) {
    return balance.toString()
  }

  let bal = balance.toString()
  let len = bal.length
  let decimalIndex = len - decimals
  let prefix = ''

  if (decimalIndex < 0) {
    while (prefix.length <= decimalIndex * -1) {
      prefix += '0'
      len++
    }
    bal = prefix + bal
    decimalIndex = 1
  }

  const result = `${bal.substr(0, len - decimals) || 0}.${bal.substr(decimalIndex, 3)}`
  return result
}

export const toBN = (value, bnDecimals = 0) => {
  if(value === 0) {
    return '0'
  }
  const decimals = parseInt(bnDecimals.toString());
  if (decimals == 0) {
    return value.toString();
  }

  const result = (value * (10 ** decimals)).toString();

  return result;
}
