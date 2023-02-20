window.addEventListener("DOMContentLoaded", () => {
  $("#create-game-btn").click(createGame);
  setupSession();
});

var SID = "empty";

function setupSession() {
  let options = {
    method: "POST",
  };

  fetch(`/api/v1/sids`, options)
    .then((res) => res.json())
    .then((session) => {
      SID = session.id;
    })
    .then(listView);
}

function listView() {
  $("#game-view").hide();
  $("#game-list-view").show("slow");
  updateTokens();
  let span = $("<span>");
  span.text(SID + " ");
  $("#game-list-view").append(span);
  fetch(`/api/v1/sids/${SID}`)
    .then((res) => res.json())
    .then((games) => addGames(games));
}

/**
 *
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
    started.text(game.start);
    tr.append(started);
    let ended = $("<td>");
    ended.text(game.end ?? "-");
    tr.append(ended);
    let view = $("<td>");
    let viewBtn = $("<button>");
    viewBtn.addClass("btn btn-warning");
    viewBtn.text("View");
    viewBtn.click(function () {
      gameView(game);
    });
    view.append(viewBtn);
    tr.append(view);

    rows.push(tr);
  }
  $("#game-list-body").append(rows);
}

function gameView(game) {
  $("#game-list-view").hide();
  $("#game-view").show("slow");
  $("#connect4-board").css("background-color", game.theme.color);
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 7; x++) {
      let token = game.grid[y][x];
      if (token == "X") {
        let selectedCell = $(".row").eq(x).find(".cell").eq(y);
        let img = $("<img>");

        // Set the src and alt attributes of the image element
        img.attr("src", game.theme.playerToken.url);
        img.attr("alt", game.theme.playerToken.name);

        // Append the image element to the selected cell
        selectedCell.append(img);
      }
    }
  }
  $(".drop-cell").hover(
    function () {
      var img = $("<img>");
      img.attr("src", game.theme.playerToken.url);
      img.attr("alt", game.theme.playerToken.name);
      $(this).append(img);
    },
    function () {
      $(this).find("img").remove();
    }
  );
  $(".drop-cell").click(function () {
    var index = $(this).index();
    alert("You clicked on cell " + index);
  });

  $("#game-return-btn").click(function () {
    listView();
  });
}

function updateTokens() {
  fetch(`/api/v1/meta`)
    .then((res) => res.json())
    .then((thing) =>
      thing.tokens.forEach((token) => {
        addToSelect(token);
      })
    );
}

function addToSelect(token) {
  let player = $("#player-select");
  player.append(
    $("<option>", {
      value: token.name,
      text: token.name,
    })
  );
  let computer = $("#computer-select");
  computer.append(
    $("<option>", {
      value: token.name,
      text: token.name,
    })
  );
}

function createGame(evt) {
  evt.preventDefault();
  let color = $("#color-select").val();
  let playerToken = $("#player-select").val();
  let computerToken = $("#computer-select").val();
  if (!color || !playerToken || !computerToken) return;
  if (computerToken == playerToken) {
    alert("Please select 2 different tokens for the Player and Computer.");
    return;
  }

  let options = {
    method: "POST",
    body: JSON.stringify({
      color: color,
      playerToken: playerToken,
      computerToken: computerToken,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(`/api/v1/sids/${SID}`, options)
    .then((response) => response.json())
    .then((game) => gameView(game));
}
