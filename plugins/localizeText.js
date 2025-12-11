const localizeText = (content, toLang) => {
  let resultContent = "";
  content = String(content).split("##");
  for (let i = 0; i < content.length; i++) {
    if (content[i].length === 2) {
      if (content[i] !== toLang) {
        i++;
      }
    } else {
      resultContent += content[i];
    }
  }
  return resultContent;
};
const randomTextParser = (text) => {
  if (text) {
    let timestamp = Date.now();
    let regex = /\[\((.*?)\)\]/g;
    let matches = text.match(regex);

    if (matches && matches.length) {
      for (let i = 0; i < matches.length; i++) {
        let words = matches[i].replace(/[\(\[\]\)]/g, "").split("|");
        let index = Math.floor((timestamp * (i + 1)) % words.length);
        text = text.replace(matches[i], words[index]);
      }
    }
  }
  return text;
};
const parseSeoText = (text, currentRoute) => {
  if (text) {
    text = text
      .replace(/\[\[rate\]\]/g, currentRoute.rate.in + ':' + currentRoute.rate.out.toFixed(3))
      .replace(/\[\[reserve\]\]/g, currentRoute.rate.amount)
      .replace(/\[\[inNameCurrency\]\]/g, currentRoute.from.name)
      .replace(/\[\[outNameCurrency\]\]/g, currentRoute.to.name)
      .replace(/\[\[inSymbol\]\]/g, currentRoute.from.symbol)
      .replace(/\[\[outSymbol\]\]/g, currentRoute.to.symbol);
  }
  text = randomTextParser(text);
  return text;
}

export {localizeText, parseSeoText, randomTextParser}