exports.convertFormat = (unformattedUsername) => {
    myformat = "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡";
    myMap = new Map();
    myMap.set("a", "𝕒");
    myMap.set("b", "𝕓");
    myMap.set("c", "𝕔");
    myMap.set("d", "𝕕");
    myMap.set("e", "𝕖");
    myMap.set("f", "𝕗");
    myMap.set("g", "𝕘");
    myMap.set("h", "𝕙");
    myMap.set("i", "𝕚");
    myMap.set("j", "𝕛");
    myMap.set("k", "𝕜");
    myMap.set("l", "𝕝");
    myMap.set("m", "𝕞");
    myMap.set("n", "𝕟");
    myMap.set("o", "𝕠");
    myMap.set("p", "𝕡");
    myMap.set("q", "𝕢");
    myMap.set("r", "𝕣");
    myMap.set("s", "𝕤");
    myMap.set("t", "𝕥");
    myMap.set("u", "𝕦");
    myMap.set("v", "𝕧");
    myMap.set("w", "𝕨");
    myMap.set("x", "𝕩");
    myMap.set("y", "𝕪");
    myMap.set("z", "𝕫");
    myMap.set("0", "𝟘");
    myMap.set("1", "𝟙");
    myMap.set("2", "𝟚");
    myMap.set("3", "𝟛");
    myMap.set("4", "𝟜");
    myMap.set("5", "𝟝");
    myMap.set("6", "𝟞");
    myMap.set("7", "𝟟");
    myMap.set("8", "𝟠");
    myMap.set("9", "𝟡");
  
    let formattedUsername = "";
    for (i = 0; i < unformattedUsername.length; i++) {
      formattedUsername += myMap.get(unformattedUsername.charAt(i));
    }
    return formattedUsername;
  };
  