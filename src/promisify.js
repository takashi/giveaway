export const promisify = (func, that) => {
  return (...arg) => {
    return new Promise((resolve, reject) => {
      const callback = (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
      let args = [...arg, callback]
      func.apply(that, args);
    })
  }
}
