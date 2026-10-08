
const ones = [
    '', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'
  ]
  const tens = [
    '', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'
  ]
  const teens = [
    'ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'
  ]
  const hundreds = [
    '', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'
  ]
  
  // تبدیل عدد به متن فارسی
  function numberToPersian(num) {
    if (num === 0) return 'صفر'
  
    let parts = []
  
    const h = Math.floor(num / 100)
    const t = Math.floor((num % 100) / 10)
    const o = num % 10
  
    if (h > 0) {
      parts.push(hundreds[h])
    }
  
    if (t === 1) {
      parts.push(teens[o])
    } else {
      if (t > 0) parts.push(tens[t])
      if (o > 0) parts.push(ones[o])
    }
  
    return parts.join(' و ')
  }
  
  // تبدیل عدد به انگلیسی با پسوند
  function numberToEnglishOrdinal(num) {
    const v = num % 100
    if (v >= 11 && v <= 13) {
      return num + 'th'
    }
    switch (num % 10) {
      case 1: return num + 'st'
      case 2: return num + 'nd'
      case 3: return num + 'rd'
      default: return num + 'th'
    }
  }
  
  // تابع اصلی ترتیب دهی
  export function convertToOrdinal(number, lang = 'fa') {
    if (number === null || number === undefined || isNaN(number)) return ''
    const num = Number(number)
  
    if (lang === 'en') {
      return numberToEnglishOrdinal(num)
    }
  
    // حالت فارسی
    if (num === 1) return 'اول'
    if (num === 3) return 'سوم'
  
    const persianNumber = numberToPersian(num)
  
    return persianNumber + 'م'
  }
  