const SCENES = {
  desert(el) {
    el.innerHTML = `
      <img src="assets/desert.png" class="bg">
      <img src="assets/tomb.png" class="tomb" onclick="go('doors')">
      <img src="assets/explorer.png" class="explorer" onclick="go('explorer')">
      <img src="assets/sign.png" class="sign" onclick="window.open('https://isle.a.hackclub.dev/scenes/10')">
      <img src="assets/stall.png" class="stall" onclick="go('market')">
    `;
  },
  explorer(el) {
    el.innerHTML = `
      <p>Explorer: "Want to talk or leave?"</p>
      <button onclick="go('desert')">Leave</button>
      <button onclick="alert('talking soon!')">Talk</button>
    `;
  },
  doors(el) {
    el.innerHTML = `
      <img src="assets/pyramidbackground.png" class="bg">
      <img src="assets/door.png" class="door left">
      <img src="assets/door.png" class="door mid">
      <img src="assets/door.png" class="door right">
    `;
  },
  market(el) {
    el.innerHTML = `<p>Market stub here!</p><button onclick="go('desert')">Back</button>`;
  }
};
