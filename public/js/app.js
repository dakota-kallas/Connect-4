let authenticatedUser = null;

window.addEventListener("DOMContentLoaded", () => {
  $("#create-game-btn").click(createGame);
  $("#login-button").click(login);
  $("#logout-button").click(logout);
  loginView();
});

/**
 * Setup the login view
 */
function loginView() {
  $("#login-view").show();
  $("#game-list-view").hide();
  $("#game-view").hide();
  $("#profile").hide();
  $("#profile-dropdown").hide();
}

function login() {
  let password = $("#password-input").val();
  let email = $("#email-input").val();

  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  fetch("/connectfour/api/v1/login", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((user) => {
      authenticatedUser = user;
      updateUserProfile(user);
      updateTokens();
      listView();
    })
    .finally(() => {
      $("#password-input").val("");
      $("#email-input").val("");
    });
}

function updateUserProfile(user) {
  $("#user-full-name").text(user.first + " " + user.last);
}

function logout() {
  fetch("/connectfour/api/v1/logout", { method: "POST" }).then(loginView);
}

/**
 * Setup the List view of the current sessions games
 */
function listView() {
  $("#login-view").hide();
  $("#game-view").hide();
  $("#validation-container").empty();
  $("#game-list-view").show();
  $("#profile").show();
  $("#profile-dropdown").show();

  fetch(`/connectfour/api/v1/users/${authenticatedUser.id}/gids`)
    .then((res) => res.json())
    .then((resObj) => {
      if (!resObj.msg) {
        addGames(resObj);
      } else {
        $("#validation-container").text(`*${resObj.msg}`);
      }
    });
}

/**
 * Add all of the sessions games to the game list
 * @param {Game[]} games
 */
function addGames(games) {
  $("#game-list-body").empty();
  let rows = [];
  if (Object.keys(games).length === 0) return;
  for (let game of games) {
    let tr = $("<tr>");
    let status = $("<td>");
    status.text(game.status);
    tr.append(status);
    let player = $("<td>");
    let playerImg = $("<img>");
    playerImg.attr("src", game.theme.playerToken.url);
    playerImg.attr("alt", game.theme.playerToken.name);
    player.append(playerImg);
    tr.append(player);
    let computer = $("<td>");
    let computerImg = $("<img>");
    computerImg.attr("src", game.theme.computerToken.url);
    computerImg.attr("alt", game.theme.computerToken.name);
    computer.append(computerImg);
    tr.append(computer);

    let started = $("<td>");
    let date = new Date(game.start);
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    started.text(date.toLocaleString("en-US", options).replace(/,/g, ""));
    tr.append(started);
    let ended = $("<td>");
    if (game.end) {
      date = new Date(game.end);
      ended.text(date.toLocaleString("en-US", options).replace(/,/g, ""));
    } else {
      ended.text("-");
    }

    tr.append(ended);
    let view = $("<td>");
    let viewBtn = $("<button>");
    viewBtn.addClass("btn");
    viewBtn.css("background-color", game.theme.color);
    viewBtn.text("view");
    viewBtn.click(function () {
      fetch(`/connectfour/api/v1/users/${authenticatedUser.id}/gids/${game.id}`)
        .then((res) => res.json())
        .then((resObj) => {
          if (!resObj.msg) {
            gameView(resObj);
          } else {
            $("#validation-container").text(`*${resObj.msg}`);
          }
        });
    });
    view.append(viewBtn);
    tr.append(view);

    rows.push(tr);
  }
  $("#game-list-body").append(rows);
}

/**
 * Setup the view of a game for the user
 * @param {Game} game
 */
function gameView(game) {
  // CLEAR OUT CONTENTS
  $(".cell").empty();
  $(".drop-cell").empty();
  $("#game-status").empty();
  $("#status-gif-container").empty();
  $(".cell").off();
  $(".drop-cell").off();
  $("#game-return-btn").off();
  $("#drop-row").show();

  $("#game-list-view").hide();
  $("#connect4-board").css("background-color", game.theme.color);
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 7; x++) {
      let token = game.grid[y][x];
      if (token == "X") {
        let selectedCell = $(".row").eq(y).find(".cell").eq(x);
        let img = $("<img>");
        img.attr("src", game.theme.playerToken.url);
        img.attr("alt", game.theme.playerToken.name);

        selectedCell.append(img);
      } else if (token == "O") {
        let selectedCell = $(".row").eq(y).find(".cell").eq(x);
        let img = $("<img>");
        img.attr("src", game.theme.computerToken.url);
        img.attr("alt", game.theme.computerToken.name);
        selectedCell.append(img);
      }
    }
  }

  if (game.status == "UNFINISHED") {
    $(".drop-cell").hover(
      function () {
        let img = $("<img>");
        img.attr("src", game.theme.playerToken.url);
        img.attr("alt", game.theme.playerToken.name);
        $(this).append(img);
      },
      function () {
        $(this).find("img").remove();
      }
    );
    $(".drop-cell").click(function () {
      let index = $(this).index();
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };
      fetch(
        `/connectfour/api/v1/users/${authenticatedUser.id}/gids/${game.id}?move=${index}`,
        options
      )
        .then((response) => response.json())
        .then((game) => gameView(game));
    });
  } else if (game.status == "LOSS") {
    addStatusImage("./assets/cry.gif");
  } else if (game.status == "VICTORY") {
    addStatusImage("./assets/winner.gif");
  }

  $("#game-return-btn").click(function () {
    updateTokens();
    listView();
  });
  let statusSpan = $("<span>");
  statusSpan.text(game.status);
  $("#game-status").append(statusSpan);
  $("#game-view").show();
}

/**
 * Display an image at the top of the game according to the game status
 * @param {String} location
 */
function addStatusImage(location) {
  let img = $("<img>");
  img.addClass("w-100");
  img.addClass("h-100");
  img.attr("src", location);
  img.attr("alt", "Game Status");
  $("#status-gif-container").append(img);
  $("#status-gif-container").addClass("w-100");
  $("#drop-row").hide();
}

/**
 * Clear out the current contents of the player & computer selectors and get the defaults
 */
function updateTokens() {
  $("#computer-select").empty();
  $("#player-select").empty();
  fetch(`/connectfour/api/v1/meta/`)
    .then((res) => res.json())
    .then((metadata) => setupSelect(metadata.tokens, metadata.default));
}

/**
 * Update the player & computer token selectors to the given settings
 * @param {Token[]} tokens
 * @param {Theme} defaultTheme
 */
function setupSelect(tokens, defaultTheme) {
  let player = $("#player-select");
  let computer = $("#computer-select");
  for (token of tokens) {
    let playerOption = $("<option>", {
      value: token.name,
      text: token.name,
    });
    if (token.name == defaultTheme.playerToken.name) {
      playerOption.attr("selected", "selected");
    }
    player.append(playerOption);
    let computerOption = $("<option>", {
      value: token.name,
      text: token.name,
    });
    if (token.name == defaultTheme.computerToken.name) {
      computerOption.attr("selected", "selected");
    }
    computer.append(computerOption);
  }
  $("#color-select").val(defaultTheme.color);
}

/**
 * Create a new Connect 4 game & get information ready to display
 * @param {Event} evt
 */
function createGame(evt) {
  evt.preventDefault();
  $("#validation-container").empty();
  let color = $("#color-select").val().replace("#", "");
  let playerToken = $("#player-select").val();
  let computerToken = $("#computer-select").val();
  if (!color || !playerToken || !computerToken) return;
  if (computerToken == playerToken) {
    alert("Please select 2 different tokens for the Player and Computer.");
    return;
  }

  let body = new URLSearchParams();
  body.append("playerToken", playerToken);
  body.append("computerToken", computerToken);

  let options = {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  fetch(
    `/connectfour/api/v1/users/${authenticatedUser.id}/gids?color=${color}`,
    options
  )
    .then((response) => response.json())
    .then((resObj) => {
      if (!resObj.msg) {
        gameView(resObj);
      } else {
        $("#validation-container").text(`*${resObj.msg}`);
      }
    });
}
