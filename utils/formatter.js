
exports.convertFormat = (unformattedText, format) => {

  strikethrough = "";
  // bold by default
  if (format === 'bold') {
    myCharFormat = process.env.Bold_Char_A || "𝐀";
    myNumFormat = process.env.Bold_Char_0 || "𝟎";
  }

  // italic
  else if (format === 'italic') {
    myCharFormat = process.env.Italic_Char_A || "𝘈";
    myNumFormat = process.env.Italic_Char_0 || "0";
  }

  //bold_italic
  else if (format == 'bold_italic') {
    myCharFormat = process.env.Bold_Italic_Char_A || "𝘼";
    myNumFormat = process.env.Bold_Italic_Char_0 || "0";
  }

  else if (format == 'strikethrough') {
    fontStyle = "A̶";
    strikethrough = fontStyle[1];
  }

  charCode_F = myCharFormat.charCodeAt(0);
  charCode_S = myCharFormat.charCodeAt(1);

  numCode_F = myNumFormat.charCodeAt(0);
  numCode_S = myNumFormat.charCodeAt(1);

  let formattedText = "";
  [...unformattedText].forEach(c => {
    num = c.charCodeAt(0);
    if (num < 48) {
      formattedText += c;
    }
    else if (num < 59) {
      num -= 48;
      formattedText += String.fromCharCode(numCode_F, numCode_S + num);
    }
    else if (num < 91) {
      num -= 65;
      formattedText += String.fromCharCode(charCode_F, charCode_S + num);
    }
    else {
      num -= (65 + 6);
      formattedText += String.fromCharCode(charCode_F, charCode_S + num);
    }
    formattedText += strikethrough;

  });
  return formattedText;
}
