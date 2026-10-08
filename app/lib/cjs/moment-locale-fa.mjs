/**
 * ESM-safe replacement for `moment/locale/fa`.
 * Upstream UMD does `factory(global.moment)` with `this === undefined` under Vite ESM,
 * which throws: Cannot read properties of undefined (reading 'moment').
 */
import moment from './moment.mjs'

const symbolMap = {
  1: '۱',
  2: '۲',
  3: '۳',
  4: '۴',
  5: '۵',
  6: '۶',
  7: '۷',
  8: '۸',
  9: '۹',
  0: '۰',
}
const numberMap = {
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
  '۰': '0',
}

moment.defineLocale('fa', {
  months: 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
  monthsShort: 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
  weekdays: 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
  weekdaysShort: 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
  weekdaysMin: 'ی_د_س_چ_پ_ج_ش'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm',
  },
  meridiemParse: /قبل از ظهر|بعد از ظهر/,
  isPM(input) {
    return /بعد از ظهر/.test(input)
  },
  meridiem(hour) {
    return hour < 12 ? 'قبل از ظهر' : 'بعد از ظهر'
  },
  calendar: {
    sameDay: '[امروز ساعت] LT',
    nextDay: '[فردا ساعت] LT',
    nextWeek: 'dddd [ساعت] LT',
    lastDay: '[دیروز ساعت] LT',
    lastWeek: 'dddd [پیش] [ساعت] LT',
    sameElse: 'L',
  },
  relativeTime: {
    future: 'در %s',
    past: '%s پیش',
    s: 'چند ثانیه',
    ss: '%d ثانیه',
    m: 'یک دقیقه',
    mm: '%d دقیقه',
    h: 'یک ساعت',
    hh: '%d ساعت',
    d: 'یک روز',
    dd: '%d روز',
    M: 'یک ماه',
    MM: '%d ماه',
    y: 'یک سال',
    yy: '%d سال',
  },
  preparse(string) {
    return string
      .replace(/[۰-۹]/g, (match) => numberMap[match])
      .replace(/،/g, ',')
  },
  postformat(string) {
    return string
      .replace(/\d/g, (match) => symbolMap[match])
      .replace(/,/g, '،')
  },
  dayOfMonthOrdinalParse: /\d{1,2}م/,
  ordinal: '%dم',
  week: {
    dow: 6,
    doy: 12,
  },
})

export default moment
