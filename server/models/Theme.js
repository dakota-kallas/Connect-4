class Theme {
  constructor(color, playerToken, computerToken) {
    this.color = color;
    this.playerToken = playerToken;
    this.computerToken = computerToken;
  }
}

function isTheme(obj) {
  return ["color", "playerToken", "computerToken"].reduce(
    (acc, val) => obj.hasOwnProperty(val) && acc,
    true
  );
}

module.exports = {
  Theme: Theme,
  isTheme: isTheme,
};
