const Timer = function (execTime, callback = null) {
  if (!(execTime instanceof Date)) {
    // eslint-disable-next-line no-param-reassign
    execTime = new Date(execTime);
  }

  this.execTime = execTime;
  this.callback = callback;
  this.init();
};

Timer.prototype = {
  callback: null,
  execTime: null,
  _timeout: null,

  init() {
    if (!this.callback) throw new TypeError('No callback was specified.');
    this.checkTimer();
  },
  getExecTime() {
    return this.execTime;
  },
  // eslint-disable-next-line consistent-return
  checkTimer() {
    // eslint-disable-next-line no-underscore-dangle
    clearTimeout(this._timeout);

    const now = new Date();
    let ms = this.getExecTime().getTime() - now.getTime();

    if (ms <= 0) {
      this.callback(this);
      return false;
    }
    const max = (86400 * 1000);
    if (ms > max) {
      ms = max;
    }

    this._timeout = setTimeout(function (self) {
      self.checkTimer();
    }, ms, this);
  },
  stopTimer() {
    // eslint-disable-next-line no-underscore-dangle
    clearTimeout(this._timeout);
  },
};

module.exports = Timer;
