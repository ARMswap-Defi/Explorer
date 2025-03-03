const initPath = require("../assets/source/question.svg");

export function getSourcePath(symbol: any) {
  let path;
  // console.log(symbol);
  try {
    path = require("../assets/source/" + symbol + ".svg");
  } catch (error) {
    try {
      path = require("../assets/source/" + symbol + ".png");
    } catch (error) {
      try {
        path = require("../assets/source/" + symbol + ".jpg");
      } catch (error) {
        path = initPath;
      }
    }
  }
  // console.log(path);

  return path?.default?.src;
}
