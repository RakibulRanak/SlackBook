exports.convertFormat = (unformattedUsername) => {
  //Replace your character format
  myCharFormat = process.env.Char_a || "𝐀";
  //Replace your number format
  myNumFormat = process.env.Char_0 || "𝟎";

  charCode_F = myCharFormat.charCodeAt(0);
  charCode_S = myCharFormat.charCodeAt(1);

  numCode_F = myNumFormat.charCodeAt(0);
  numCode_S = myNumFormat.charCodeAt(1);

  let formattedUsername = "";
  [...unformattedUsername].forEach(c => {
    num = c.charCodeAt(0);
    if (num < 48) {
      formattedUsername += c;
    }
    else if (num < 59) {
      num -= 48;
      formattedUsername += String.fromCharCode(numCode_F, numCode_S + num);
    }
    else if (num < 91) {
      num -= 65;
      formattedUsername += String.fromCharCode(charCode_F, charCode_S + num);
    }
    else {
      num -= (65 + 6);
      formattedUsername += String.fromCharCode(charCode_F, charCode_S + num);
    }

  });
  return formattedUsername;
}