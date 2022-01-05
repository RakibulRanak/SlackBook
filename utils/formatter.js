exports.convertFormat = (unformattedUsername) => {
  //Replace your character format
  myCharFormat = "𝕒";
  //Replace your number format
  myNumFormat = "𝟘";

  charCode_F = myCharFormat.charCodeAt(0);
  charCode_S = myCharFormat.charCodeAt(1);

  numCode_F = myNumFormat.charCodeAt(0);
  numCode_S = myNumFormat.charCodeAt(1);

  allChars = "abcdefghijklmnopqrstuvwxyz"
  allNums = "0123456789"

  let formattedUsername = "";
  [...unformattedUsername].forEach(c => {
    num = c.charCodeAt(0) - 97;
    if (num < 0) {
      num += 49;
      formattedUsername += String.fromCharCode(numCode_F, numCode_S + num);
    }
    else {
      formattedUsername += String.fromCharCode(charCode_F, charCode_S + num);
    }

  });
  return formattedUsername;
};
