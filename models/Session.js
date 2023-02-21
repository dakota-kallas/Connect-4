const { v4: uuidv4 } = require("uuid");

const SESSIONS = {};

class Session {
  constructor() {
    this.id = uuidv4();
    this.games = {};

    SESSIONS[this.id] = this;
  }
}

/**
 * PRE: A valid SID is provided
 * @param {id} sid
 * @returns All declared games for a given session
 */
function getGamesBySID(sid) {
  let games = SESSIONS[sid].games;
  return games && Object.values(games);
}

/**
 * PRE: A valid SID and GID are provided
 * @param {id} sid
 * @param {id} gid
 */
function addGame(sid, gid) {
  SESSIONS[sid].games[gid] = gid;
}

/**
 * PRE: A valid SID and GID are provided
 * @param {id} sid
 * @param {id} gid
 * @returns A boolean on if the game is apart of the current session
 */
function isAuthenticatedGame(sid, gid) {
  return SESSIONS[sid].games[gid] != undefined;
}

module.exports = {
  Session: Session,
  addGame: addGame,
  isAuthenticatedGame: isAuthenticatedGame,
  getGamesBySID: getGamesBySID,
};
