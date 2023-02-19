window.addEventListener("DOMContentLoaded", () => {
  $("#create-game-btn").click(createGame);
  listView();
});

function listView() {
  $("#game-list-view").show("slow");
  $("#game-view").hide("slow");
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
  fetch(`/api/v1/sids/:sid`, options);
}
