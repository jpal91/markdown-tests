import hljs from "highlight.js";
import emojis from "./emojis";

export const searchText = (str) => {
  // const bracketRegex = /(`"?<.*>"?`|<.*>|<.*|<)(?!<\/code>)/g
  const openBracketRegex = /.?<.*/g;
  const bracketRegex = /`<.+>.*<\/.+>`/g;
  const headingsRegex = /#+\s.+\n/g;
  const linksRegex = /\[.+\]\(.+\)/g;
  const boldRegex = /(?<!(\*|\S))\*\*[^*\n]+\*\*(?!\*)/g;
  const italicRegex = /(?<!(\*|\S))\*[^*\n]+\*(?!\*)/g;
  const codeRegex = /`[^<>\n`]+`/g;
  const imageRegex = /!\[.*\]\(.+\)/g;
  const blockCodeRegex = /```js\n(?:(?!```)[\s\S])+\n```/g; ///^```js\n(.*\n)+```\n$/gm
  const emojiRegex = /:[\w]+:/g;
  const blockQuoteRegex = /(?<=\n)(?:> .+\n)+/g;
  const lineBreakRegex = /\n---\n/g;
  const highRegex = /(==[^=]+==)/g;
  const strikeRegex = /~~[^~]+~~/g;
  const subRegex = /(?<!~)~[^~]+~(?!~)/g;
  const uoRegex = /(\s*-\s.+\n)+/g;

  const hasOpenBracket = str.match(openBracketRegex);
  hasOpenBracket ? (str = openBrackets(hasOpenBracket, str)) : (str = str);

  const hasBlockCode = str.match(blockCodeRegex);
  hasBlockCode ? (str = blockCode(hasBlockCode, str)) : (str = str);
  // console.log(str)
  const hasBracket = str.match(bracketRegex);
  hasBracket ? (str = bracket(hasBracket, str)) : (str = str);
  //console.log(str)

  // openBracketRegex.test(str) ? str = str.replace(/</g, `<span>&lt;</span>`) : str = str
  // //console.log(openBracketRegex.test(str))
  // console.log(str)

  const hasHeadings = str.match(headingsRegex);
  hasHeadings ? (str = headings(hasHeadings, str)) : (str = str);

  const hasLinks = str.match(linksRegex);
  hasLinks ? (str = links(hasLinks, str)) : (str = str);

  const hasBold = str.match(boldRegex);
  hasBold ? (str = bold(hasBold, str)) : (str = str);

  const hasItalic = str.match(italicRegex);
  hasItalic ? (str = italic(hasItalic, str)) : (str = str);

  const hasCode = str.match(codeRegex);
  hasCode ? (str = code(hasCode, str)) : (str = str);

  const hasImage = str.match(imageRegex);
  hasImage ? (str = image(hasImage, str)) : (str = str);

  const hasEmoji = str.match(emojiRegex);
  hasEmoji ? (str = emoji(hasEmoji, str)) : (str = str);

  const hasBlockQuote = str.match(blockQuoteRegex);
  hasBlockQuote ? (str = blockQuote(hasBlockQuote, str)) : (str = str);

  const hasLineBreak = str.match(lineBreakRegex);
  hasLineBreak ? (str = lineBreak(hasLineBreak, str)) : (str = str);

  const hasHighLight = str.match(highRegex);
  hasHighLight ? (str = highLight(hasHighLight, str)) : (str = str);

  const hasStrikeThru = str.match(strikeRegex);
  hasStrikeThru ? (str = strikeThru(hasStrikeThru, str)) : (str = str);

  const hasSubtext = str.match(subRegex);
  hasSubtext ? (str = subText(hasSubtext, str)) : (str = str);

  const hasUOList = str.match(uoRegex);
  hasUOList ? (str = uoList(hasUOList, str)) : (str = str);

  str = str.replace(/\n{3,}/g, "</br></br>");
  str = str.replace(/\n\n/g, "</br></br>");
  str = str.replace(/(\n|\\\n)/g, "</br>");
  //   str = str.replace(/\n---\n/g, "<hr>");

  return str;
};

// const bracket = (match, str) => {
//     //const bracketOpen = /</g
//     const badBracket = /(<.*>|<.*|<)/g
//     const goodBracket = /(?<=`)"?<.*>.*<.*>"?(?=`)/g
//     const codeMatch = /`?<code.*>.*<\/code>`?/g
//     //const goodBracket = /(?<=`<.*>).*(?=<.*>`)/g

//     match.forEach((m) => {
//         let badMatch = m.match(badBracket)
//         let goodMatch = m.match(goodBracket)
//         console.log(m.match(codeMatch))
//         if (m.match(codeMatch)) {
//             return
//         }

//         if (goodMatch) {
//             //console.log(goodMatch)
//             str = str.replace(m, `<pre><code>${goodMatch[0]}</code></pre>`)
//             return
//         } else if (badMatch) {
//             str = str.replace(m, '')
//             return
//         }
//     })

//     return str
// }

const openBrackets = (match, str) => {
  const quoteTest = /`<.*>`/g;
  const blockCodeTest = /```js\n(?:(?!```)[\s\S])+\n```/g;
  const obMatch = /</g;

  match.forEach((m) => {
    let qMatch = m.match(quoteTest);
    let bcMatch = m.match(blockCodeTest);

    if (!qMatch && !bcMatch) {
      let obTest = m.match(obMatch);
      str = str.replace(obTest[0], `&lt;`);
      return;
    }
  });

  return str;
};

const bracket = (match, str) => {
  const codeMatch = /(?<=`)<.+>.*<\/.+>(?=`)/g;

  match.forEach((m) => {
    let cMatch = m.match(codeMatch);
    console.log(cMatch);
    let hl = hljs.highlightAuto(`${cMatch[0]}`, ["html"]).value;
    str = str.replace(m, `<blockquote><pre>${hl}</pre></blockquote>`);
  });

  return str;
};

const headings = (match, str) => {
  //const h1 = /(?<=#\s).+\n?/g;
  //   const h2 = /(?<=##\s).+\n?/g;
  //   const h3 = /(?<=###\s).+\n?/g;
  const h1 = /(?<=#\s)[^{}]+\n?/g;
  const h2 = /(?<=##\s)[^{}]+\n?/g;
  const h3 = /(?<=###\s)[^{}]+\n?/g;
  const id = /(?<={).+(?=})\n?/;

  match.forEach((m) => {
    let matched;
    const idMatch = m.match(id);

    if (m.match(h3)) {
      matched = m.match(h3);
      str = str.replace(
        m,
        `<h3 ${idMatch ? `id=${idMatch[0]}` : ""}>${matched[0]}</h3>`
      );
      return;
    } else if (m.match(h2)) {
      matched = m.match(h2);
      str = str.replace(
        m,
        `<h2 ${idMatch ? `id=${idMatch[0]}` : ""}>${matched[0]}</h2>`
      );
      return;
    } else if (m.match(h1)) {
      matched = m.match(h1);
      str = str.replace(
        m,
        `<h1 ${idMatch ? `id=${idMatch[0]}` : ""}>${matched[0]}</h1>`
      );
      return;
    }
  });

  return str;
};

const links = (match, str) => {
  const description = /(?<=\[).+(?=\])/g;
  const href = /(?<=\().+(?=\))/g;
  const external = /https?:/g;

  match.forEach((m) => {
    let dMatch = m.match(description);
    let hMatch = m.match(href);
    let externalTest = external.test(m);

    str = str.replace(
      m,
      `<a href=${hMatch[0]} ${
        externalTest ? `target = '_blank'` : ""
      }>${dMatch}</a>`
    );
  });

  return str;
};

const bold = (match, str) => {
  const boldText = /(?<=\*\*)[^*]+(?=\*\*)/g;

  match.forEach((m) => {
    let bMatch = m.match(boldText);

    str = str.replace(m, `<b>${bMatch[0]}</b>`);
  });

  return str;
};

const italic = (match, str) => {
  const italicText = /(?<=\*)[^*]+(?=\*)/g;

  match.forEach((m) => {
    let iMatch = m.match(italicText);

    str = str.replace(m, `<i>${iMatch[0]}</i>`);
  });

  return str;
};

const code = (match, str) => {
  const codeRegex = /(?<=`)[^<>\n]+(?=`)/g;

  match.forEach((m) => {
    let cMatch = m.match(codeRegex);

    str = str.replace(m, `<code id="code_styled">${cMatch[0]}</code>`);
  });

  return str;
};

const image = (match, str) => {
  const description = /(?<=!\[).*(?=\])/g;
  const src = /(?<=\().+(?=\))/g;

  match.forEach((m) => {
    let dMatch = m.match(description);
    let sMatch = m.match(src);

    str = str.replace(m, `<img src=${sMatch[0]} alt=${dMatch[0] || ""} />`);
  });

  return str;
};

const blockCode = (match, str) => {
  const innerCode = /(?<=```js\n)(.+\s*)+\n?(?=```)/gm;

  match.forEach((m) => {
    let bcMatch = m.match(innerCode);
    bcMatch[0] = bcMatch[0].replace(/&lt;/g, "<");
    // console.log(bcMatch)
    let hl = hljs.highlightAuto(`${bcMatch[0]}`, ["html", "javascript"]).value;
    // console.log(hl)
    //str = str.replace(m, `<blockquote style="gray;width:400px;"><pre><code class="language-js" id='block'>${bcMatch}</code></pre></blockquote>`)
    str = str.replace(
      m,
      `<blockquote><pre class="code-block">${hl}</pre></blockquote>`
    );
  });

  return str;
};

const emoji = (match, str) => {
  //const lazyMatch = /:.+:?/

  match.forEach((m) => {
    // let firstMatch = m.match(lazyMatch)
    // console.log(firstMatch)
    let emojiMatch = emojis.find((el) => el.shortname === m);

    if (!emojiMatch) {
      return;
    }

    str = str.replace(m, `<span>${emojiMatch.emoji}</span>`);
  });

  return str;
};

const blockQuote = (match, str) => {
  const bq = /(?<=>\s)(?:(?!>).+\n)+/g;

  match.forEach((m) => {
    let bqMatch = m.match(bq).join("");
    console.log(`<blockquote>${bqMatch}</blockquote>`);
    str = str.replace(
      m,
      `<blockquote style="border-left:5px solid gray;padding-left:1.5em;margin:1.2em;">${bqMatch}</blockquote>`
    );
    //console.log(str)
  });

  return str;
};

const lineBreak = (match, str) => {
  match.forEach((m) => {
    console.log(m);
    str = str.replace(m, "</br><hr></br>");
  });

  return str;
};

const highLight = (match, str) => {
  const highL = /(?<===)[^=]+(?===)/;

  match.forEach((m) => {
    let highLMatch = m.match(highL);
    console.log(highLMatch);
    str = str.replace(m, `<mark>${highLMatch[0]}</mark>`);
  });

  return str;
};

const strikeThru = (match, str) => {
  const strike = /(?<=~~)[^~]+(?=~~)/;

  match.forEach((m) => {
    let strikeMatch = m.match(strike);

    str = str.replace(m, `<strike>${strikeMatch[0]}</strike>`);
  });

  return str;
};

const subText = (match, str) => {
  const sub = /(?<=~)[^~]+(?=~)/;

  match.forEach((m) => {
    let subMatch = m.match(sub);

    str = str.replace(m, `<sub>${subMatch[0]}</sub>`);
  });

  return str;
};

const uoList = (match, str) => {
  let count = 1;
  const firstLevel = /(?<=\n-\s).*\n/;
  const nextLevel = new RegExp(`/(?<=\n\s{${count}}-\s).*\n/`);
  //console.log(match);
  match.forEach((m) => {
    console.log(m);
    let listSection = m.split(/(\s*-\s.+\n)/).filter((el) => el.length > 0);

    if (listSection.length <= 1) {
      return;
    }
    //listSection[2] ? console.log(listSection[2].indexOf('-')) : null
    const newString = listBuilder("", listSection, 0, 0); //listSection[0].indexOf('-') + 1
    str = str.replace(m, newString);
    //console.log(newString)
    // let item = /(?<=-\s).+/
    // let newString = '<ul>'
    // listSection.reduce((prev, curr) => {
    //     let prevI = prev ? prev.indexOf('-') : null
    //     let currI = curr.indexOf('-')
    //     let targetI = curr.match(item)
    //     console.log(prevI, currI)
    //     if (!prevI) {
    //         return
    //     }

    //     if (currI === prevI) {
    //         newString += `<li>${targetI[0]}</li>`
    //     }

    //     if (currI >= prevI) {
    //         newString += `<ul><li>${targetI[0]}</li>`
    //     }

    //     if (currI <= prevI) {
    //         newString += `</ul><li>${targetI[0]}</li>`
    //     }
    // })

    // newString += '</ul>'

    //     str = str.replace(m, newString)
  });

  return str;
};

const listBuilder = (string, list, index, dashIndex) => {
  // console.log(index, dashIndex)
  // console.log(list)

  // if (!list[index] || list[index].indexOf('-') >= dashIndex) {
  //     return
  // }
  // console.log(list)
  //console.log(dashIndex)
  if (index > list.length) {
    //console.log('Here')
    return;
  }
  //index === 2 ? console.log(list[index].indexOf('-')) : null

  if (index > 0) {
    if (list[index].indexOf("-") < dashIndex) {
      // list[2] ? console.log(list[2].indexOf('-') <= dashIndex) : null
      console.log("here", list[index].indexOf("-"), dashIndex);
      return;
    } else if (list[index].indexOf("-") > dashIndex) {
      console.log("now here");
      listBuilder(string, list, index, list[index].indexOf("-"));
    }
  }

  dashIndex = list[index].indexOf("-");

  string += "<ul>";

  for (let l of list) {
    let item = /(?<=-\s).+/;
    let targetItem = l.match(item);
    string += `<li>${targetItem[0]}</li>`;
    listBuilder(string, list, index + 1, dashIndex);
    //list.shift()
    //console.log(list)
  }

  string += "</ul>";
  console.log(string);
  return string;
};
