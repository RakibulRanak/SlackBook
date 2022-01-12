exports.convertFormat = (unformattedText, format, defaultFormat = false) => {
  boldFont_Char_Start = 56320;
  boldFont_Digit_Start = 57294;
  italicFont_Char_Start = 56840;
  itlaicFont_Digit_Start = 48;
  boldItalicFont_Char_Start = 56892;
  boldItalic_Digit_Start = 48;
  englishCustomFontBase = 55349;

  let formattedText = "";
  [...unformattedText].forEach(c => {
    num = c.charCodeAt(1);
    charCode_F = c.charCodeAt(0);
    charCode_S = c.charCodeAt(1);
    strikethrough = "";

    if (format === 'strikethrough') {
      fontStyle = "A̶";
      formattedText += c;
      strikethrough = fontStyle[1]
      if (charCode_F < 256 || charCode_F == 55349)
        formattedText += strikethrough;
    }

    else if (charCode_F == englishCustomFontBase) {
      // already in different format
      if (charCode_S >= boldFont_Char_Start && charCode_S <= boldFont_Char_Start + 51) {
        //already bold
        //shift to bold_italic
        num = num - boldFont_Char_Start;
        formattedText += String.fromCharCode(englishCustomFontBase, boldItalicFont_Char_Start + num);
      }
      else if (charCode_S >= boldFont_Digit_Start && charCode_S <= boldFont_Digit_Start + 9) {
        //already bold number
        num = num - boldFont_Digit_Start;
        formattedText += String.fromCharCode(boldItalic_Digit_Start + num, NaN);
      }

      else if (charCode_S >= italicFont_Char_Start && charCode_S <= italicFont_Char_Start + 51) {
        //already italic
        // shift to bold_italic
        num = num - italicFont_Char_Start;
        formattedText += String.fromCharCode(englishCustomFontBase, boldItalicFont_Char_Start + num);
      }
      else if (charCode_S >= boldItalicFont_Char_Start && charCode_S <= boldItalicFont_Char_Start + 51) {
        // already italic_bold
        // don't have to do anything
      }
      else
        formattedText += c;
    }
    else {
      if (charCode_F < 48 || (charCode_F > 57 && charCode_F < 65) || (charCode_F > 90 && charCode_F < 97) || charCode_F > 122) {
        formattedText += c;
      }
      else {
        if (charCode_F < 59)
          num = charCode_F - 48;
        else if (charCode_F < 91)
          num = charCode_F - 65;
        else
          num = charCode_F - (65 + 6);

        if (format === 'bold') {
          if (charCode_F < 59)
            formattedText += String.fromCharCode(englishCustomFontBase, boldFont_Digit_Start + num);
          else
            formattedText += String.fromCharCode(englishCustomFontBase, boldFont_Char_Start + num);
        }
        else if (format === 'italic') {
          if (charCode_F < 59)
            formattedText += c;
          else
            formattedText += String.fromCharCode(englishCustomFontBase, italicFont_Char_Start + num);
        }
        else if (format === 'bold_italic') {
          if (charCode_F < 59)
            formattedText += c;
          else
            formattedText += String.fromCharCode(englishCustomFontBase, boldItalicFont_Char_Start + num);
        }
      }
    }
  });
  return formattedText;
}
