const mediaWikiLib = {
    header1: text => `<h1>${text}</h1>`,
    header2: text => `<h2>${text}</h2>`,
    header3: text => `<h3>${text}</h3>`,
    header4: text => `<h4>${text}</h4>`,
    header5: text => `<h5>${text}</h5>`,
    header6: text => `<h6>${text}</h6>`,
    header7: text => `<h7>${text}</h7>`,
    header8: text => `<h8>${text}</h8>`,
    header9: text => `<h9>${text}</h9>`,
    orderedList: items => `<ol>${items.map(item => `<li>${item}</li>`).join('')}</ol>`
  };
  
  function parseMediaWikiText(mediawikiText) {
    const headers = mediawikiText
      .replace(/^= (.*?) =$/gm, (_, p1) => mediaWikiLib.header1(p1))
      .replace(/^== (.*?) ==$/gm, (_, p1) => mediaWikiLib.header2(p1))
      .replace(/^=== (.*?) ===$/gm, (_, p1) => mediaWikiLib.header3(p1))
      .replace(/^==== (.*?) ====$/gm, (_, p1) => mediaWikiLib.header4(p1))
      .replace(/^===== (.*?) =====$/gm, (_, p1) => mediaWikiLib.header5(p1))
      .replace(/^====== (.*?) ======$/gm, (_, p1) => mediaWikiLib.header6(p1))
      .replace(/^======= (.*?) =======$/gm, (_, p1) => mediaWikiLib.header7(p1))
      .replace(/^======== (.*?) ========$/gm, (_, p1) => mediaWikiLib.header8(p1))
      .replace(/^========= (.*?) =========$/gm, (_, p1) => mediaWikiLib.header9(p1));
  
    const listItems = [];
    const lines = headers.split('\n');
    let inList = false;
  
    const parsedLines = lines.map(line => {
      const listItemMatch = line.match(/^# (.*)$/);
      if (listItemMatch) {
        listItems.push(listItemMatch[1]);
        inList = true;
        return '';
      } else {
        if (inList) {
          const listHTML = mediaWikiLib.orderedList(listItems);
          listItems.length = 0;
          inList = false;
          return listHTML + '\n' + line;
        } else {
          return line;
        }
      }
    });
  
    if (listItems.length > 0) {
      const listHTML = mediaWikiLib.orderedList(listItems);
      parsedLines.push(listHTML);
    }
  
    return parsedLines.join('\n');
  }
  
