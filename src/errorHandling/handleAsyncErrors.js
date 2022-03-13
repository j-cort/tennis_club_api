module.exports = function handleAsyncErrors(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(error => next(error))
  }
}