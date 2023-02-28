class Metadata {
  constructor(defaultTheme, tokens) {
    this.tokens = tokens;
    this.default = defaultTheme;
  }
}

function isMetadata(obj) {
  return ["tokens", "default"].reduce(
    (acc, val) => obj.hasOwnProperty(val) && acc,
    true
  );
}

module.exports = {
  Metadata: Metadata,
  isMetadata: isMetadata,
};
