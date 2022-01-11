exports.convertFormat = (unformattedText, format, defaultFormat = false) => {
  //format = "bold_italic"
  //bold 56320, 57294
  //italic 56840, 48
  //bold_italic 56892, 48
  //console.log(unformattedText, format)
  strikethrough = "";

  if (format == 'strikethrough') {
    fontStyle = "A̶";
    strikethrough = fontStyle[1];
  }

  let formattedText = "";
  [...unformattedText].forEach(c => {
    num = c.charCodeAt(1);
    charCode_F = c.charCodeAt(0);
    charCode_S = c.charCodeAt(1);
    if (format === 'strikethrough')
      formattedText += c + strikethrough;

    else if (charCode_F == 55349) {
      // already different format
      if (charCode_S >= 56320 && charCode_S <= 56320 + 51) {
        //already bold
        // shift to bold_italic
        num = num - 56320;
        charCode_S = 56892;
        formattedText += String.fromCharCode(charCode_F, charCode_S + num);

      }
      else if (charCode_S >= 57294 && charCode_S <= 57294 + 9) {
        //already bold number
        num = num - 57294;
        charCode_S = NaN;
        charCode_F = 48 + num;
        formattedText += String.fromCharCode(charCode_F, charCode_S + num);

      }
      else if (charCode_S >= 56840 && charCode_S <= 56840 + 51) {
        //already italic
        // shift to bold_italic
        num = num - 56840;
        charCode_S = 56892;
        formattedText += String.fromCharCode(charCode_F, charCode_S + num);
      }
      else if (charCode_S >= 56892 && charCode_S <= 56892 + 51) {
        // already italic_bold
      }
      else
        formattedText += c + strikethrough;

    }
    else {
      if (charCode_F < 48 || (charCode_F > 57 && charCode_F < 65) || (charCode_F > 90 && charCode_F < 97) || charCode_F > 122) {
        // console.log(formattedText, c)
        formattedText += c;
        //console.log(formattedText, c)
      }
      else {

        if (charCode_F < 59)
          num = charCode_F - 48;
        else if (charCode_F < 91)
          num = charCode_F - 65;
        else
          num = charCode_F - (65 + 6);
        //charCode_F = 55349;
        if (format === 'bold') {
          if (charCode_F < 59)
            formattedText += String.fromCharCode(55349, 57294 + num);
          else
            formattedText += String.fromCharCode(55349, 56320 + num);
        }
        else if (format === 'italic') {
          if (charCode_F < 59)
            formattedText += String.fromCharCode(charCode_F, NaN);
          else
            formattedText += String.fromCharCode(55349, 56840 + num);
        }
        else if (format === 'bold_italic') {
          if (charCode_F < 59)
            formattedText += String.fromCharCode(charCode_F, NaN);
          else
            formattedText += String.fromCharCode(55349, 56892 + num);
        }
      }
    }
  });
  return formattedText;
}
