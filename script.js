const state = {
    artifcats: [],
    coins: 0,
    inverntory: [],
    tutorialDone: false,
    runActive: false
}

function go(scene, data={}) {
    const el = document.getElementById('scene');
    el.innerHTML = "";
    if (SCENES[scene]) {
        SCENES[scene](el, data);
    } else {
        el.innerHTML = `<p>Scene "${scene}" not found.</p>`;
    }
}
