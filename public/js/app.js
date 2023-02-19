window.addEventListener("DOMContentLoaded", () => {
  $("#create-game-btn").click(createGame);
  listView();
});

function listView() {
  $("#game-list-view").show("slow");
  $("#game-view").hide("fast");
  updateTokens();
}

function gameView(game) {
  $("#game-list-view").hide("slow");
  $("#game-view").show("slow");
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
  fetch(`/api/v1/`, options).then(gameView);
}
