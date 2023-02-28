const { v4: uuidv4 } = require("uuid");

const BY_EMAIL = {};
const BY_ID = {};

class User {
  constructor(first, last, email, password) {
    this.first = first;
    this.last = last;
    this.email = email;
    this.password = password;
    this.id = uuidv4();

    BY_ID[this.id] = this;
    BY_EMAIL[this.email] = this;
  }
}

function getUsers() {
  let result = Object.values(BY_EMAIL);
  result.sort();
  return result
    .map((user) => Object.assign({}, user))
    .map((u) => delete u.password);
}

function getUserById(id) {
  let user = BY_ID[id];
  return user && Object.assign({}, user);
}

function getUserByEmail(email) {
  let user = BY_EMAIL[email];
  return user && Object.assign({}, user);
}

function deleteUser(id) {
  let user = getUserById(id);
  if (user) {
    delete BY_ID[user.id];
    delete BY_EMAIL[user.email];
  }
  return user;
}

function isUser(obj) {
  return ["first", "last", "email", "password"].reduce(
    (acc, val) => obj.hasOwnProperty(val) && acc,
    true
  );
}

module.exports = {
  User: User,
  getUserByEmail: getUserByEmail,
  getUserById: getUserById,
  getUsers: getUsers,
  isUser: isUser,
  deleteUser: deleteUser,
};
