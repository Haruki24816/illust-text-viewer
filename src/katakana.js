const HALF_KATA = [
  'ｧ', 'ｱ', 'ｨ', 'ｲ', 'ｩ', 'ｳ', 'ｪ', 'ｴ', 'ｫ', 'ｵ',
  'ｶ', 'ｶﾞ', 'ｷ', 'ｷﾞ', 'ｸ', 'ｸﾞ', 'ｹ', 'ｹﾞ', 'ｺ', 'ｺﾞ',
  'ｻ', 'ｻﾞ', 'ｼ', 'ｼﾞ', 'ｽ', 'ｽﾞ', 'ｾ', 'ｾﾞ', 'ｿ', 'ｿﾞ',
  'ﾀ', 'ﾀﾞ', 'ﾁ', 'ﾁﾞ', 'ｯ', 'ﾂ', 'ﾂﾞ', 'ﾃ', 'ﾃﾞ', 'ﾄ', 'ﾄﾞ',
  'ﾅ', 'ﾆ', 'ﾇ', 'ﾈ', 'ﾉ',
  'ﾊ', 'ﾊﾞ', 'ﾊﾟ', 'ﾋ', 'ﾋﾞ', 'ﾋﾟ', 'ﾌ', 'ﾌﾞ', 'ﾌﾟ', 'ﾍ', 'ﾍﾞ', 'ﾍﾟ', 'ﾎ', 'ﾎﾞ', 'ﾎﾟ',
  'ﾏ', 'ﾐ', 'ﾑ', 'ﾒ', 'ﾓ',
  'ｬ', 'ﾔ', 'ｭ', 'ﾕ', 'ｮ', 'ﾖ',
  'ﾗ', 'ﾘ', 'ﾙ', 'ﾚ', 'ﾛ',
  'ヮ', 'ﾜ', 'ヰ', 'ヱ', 'ｦ', 'ﾝ', 'ｳﾞ', 'ヵ', 'ヶ', 'ﾜﾞ', 'ｲﾞ', 'ｴﾞ', 'ｦﾞ'
]

const halfKataToWide = (text, hira = false) => {
  const firstCharCode = hira === true ? 12353 : 12449
  return text.replace(/[ﾜｲｴｦ]ﾞ/g, m =>
    'ヷヸヹヺ'.charAt('ﾜﾞｲﾞｴﾞｦﾞ'.indexOf(m) / 2)
  ).replace(/([ｦ-ｯｱｲｴｵﾅ-ﾉﾏ-ﾝ]|[ｳｶ-ﾄ]ﾞ?|[ﾊ-ﾎ][ﾞﾟ]?)/g, m =>
    String.fromCharCode(HALF_KATA.indexOf(m) + firstCharCode)
  ).replace(/[ﾞﾟｰ｡｢｣､･]/g, m =>
    '゛゜ー。「」、・'.charAt('ﾞﾟｰ｡｢｣､･'.indexOf(m))
  )
}

const toHira = (text) =>
  halfKataToWide(text, true).replace(/[ァ-ヶ]/g, m => String.fromCharCode(m.charCodeAt(0) - 0x60))

const toWideKata = (text) =>
  halfKataToWide(text).replace(/[ぁ-ゖ]/g, m => String.fromCharCode(m.charCodeAt(0) + 0x60))

const toHalfKata = (text) =>
  text.replace(/[ァ-ヺ]/g, m => HALF_KATA[m.charCodeAt(0) - 12449])
    .replace(/[ぁ-ゖ]/g, m => HALF_KATA[m.charCodeAt(0) - 12353])
    .replace(/[゛゜ー。「」、・]/g, m => 'ﾞﾟｰ｡｢｣､･'.charAt('゛゜ー。「」、・'.indexOf(m)))

export { halfKataToWide, toHira, toWideKata, toHalfKata }
