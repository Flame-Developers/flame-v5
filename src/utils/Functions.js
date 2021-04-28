module.exports = {
  getHelp(message, command) {
    return message.client.commands.get('help').run(message, [command]);
  },
  formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
  },
  timeFromNow(time) {
    switch (typeof time) {
      case 'number':
        break;
      case 'string':
        time = +new Date(time);
        break;
      case 'object':
        if (time.constructor === Date) time = time.getTime();
        break;
      default:
        time = +new Date();
    }
    const formats = [
      [50, 'секунд(-ы)', 1],
      [120, '1 минуту назад', 'спустя 1 минуту'],
      [3600, 'минут(-ы)', 60],
      [7200, '1 час назад', 'спустя 1 час'],
      [86400, 'часов', 3600],
      [604800, 'дней', 86400],
      [2419200, 'недель', 604800],
      [29030400, 'месяцев', 2419200],
      [2903040000, 'лет', 29030400],
    ];
    let seconds = (+new Date() - time) / 1000;
    let token = 'назад';
    let choice = 1;
    if (seconds == 0) return 'Только что';
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'спустя',
      choice = 2;
    }
    let i = 0;
    let format;

    while (format = formats[i++]) {
      if (seconds < format[0]) {
        if (typeof format[2] === 'string') return format[choice];
        return `${Math.floor(seconds / format[2])} ${format[1]} ${token}`;
      }
    }
    return time;
  },
  ms(val) {
    /** @see https://github.com/vercel/ms */

    if (typeof val === 'string' && val.length > 0) {
      return parse(val);
    }

    function parse(str) {
      const s = 1000;
      const m = s * 60;
      const h = m * 60;
      const d = h * 24;
      const w = d * 7;
      const y = d * 365.25;

      str = String(str);
      if (str.length > 50) return null;

      const match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|миллисекунд?|мс?|ms|seconds?|с?|secs?|s|minutes?|м?|mins?|m|hours?|ч?|hrs?|h|days?|д?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
      if (!match) return null;

      const n = parseFloat(match[1]);
      const type = (match[2] || 'ms').toLowerCase();

      switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
          return n * y;
        case 'weeks':
        case 'week':
        case 'w':
          return n * w;
        case 'days':
        case 'дней':
        case 'day':
        case 'd':
          return n * d;
        case 'hours':
        case 'hour':
        case 'часов':
        case 'hrs':
        case 'hr':
        case 'h':
          return n * h;
        case 'minutes':
        case 'minute':
        case 'м':
        case 'mins':
        case 'min':
        case 'm':
          return n * m;
        case 'seconds':
        case 'second':
        case 'с':
        case 'secs':
        case 'sec':
        case 's':
          return n * s;
        case 'milliseconds':
        case 'мс':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
          return n;
        default:
          return undefined;
      }
    }
  },
  msToTime(duration) {
    let seconds = parseInt((duration / 1000) % 60);
    let minutes = parseInt((duration / (100060)) % 60);
    let hours = parseInt((duration / (100060 * 60)) % 24);

    hours = (hours < 10) ? `0${hours}` : hours;
    minutes = (minutes < 10) ? `0${minutes}` : minutes;
    seconds = (seconds < 10) ? `0${seconds}` : seconds;

    return `${hours}:${minutes}:${seconds}` || 'Неизвестно';
  },
};
