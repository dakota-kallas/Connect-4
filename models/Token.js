const { v4: uuidv4 } = require("uuid");

const TOKENS = {};

class Token {
  constructor(name, url) {
    this.name = name;
    this.url = url;
    this.id = uuidv4();

    TOKENS[this.name] = this;
  }
}

/**
 * @returns All declared tokens
 */
function getTokens() {
  let result = Object.values(TOKENS);
  return result.map((token) => Object.assign({}, token));
}

/**
 * PRE: A valid name was provided
 * @param {string} name
 * @returns A token with the provided name
 */
function getTokenByName(name) {
  let token = TOKENS[name];
  return token && Object.assign({}, token);
}

module.exports = {
  Token: Token,
  getTokens: getTokens,
  getTokenByName: getTokenByName,
};
