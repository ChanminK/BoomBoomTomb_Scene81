const ASSETS = {
    desert: "assets/desert.png",
    pyramid: 'assets/pyramidbackground.jpg',
    tomb: 'assets/tomb.jpg',
    door: 'assets/door.png',
    explorer: 'assets/explorer.png',
    sign: 'assets/sign.png',
    stall: 'assets/stall.png',
    market: 'assets/market.png',
    marketnpc: 'assets/marketnpc.png',
    gamblingnpc: 'assets/gamblingnpc.jpg',
    shopnpc: 'assets/shopnpc.png',
    getout: 'assets/getout.png',
    shopcounter: 'assets/shopcounter.jpg',
    tombshopnpc: 'assets/tombshopnpc.png',
    artifact1: 'assets/artifact1.png',
    artifact2: 'assets/artifact2.png',
    artifact3: 'assets/artifact3.png',
    bomb: 'assets/bomb.png',
    shield: 'assets/shield.png',
    charm: 'assets/shield.png'
};

const HINTS = {
    boom: "faint sizzling...",
    chest: "metallic clinks...",
    artifact: "a low hum...",
    trap: "whistling drafts...",
    npc: "murmuring voices..."
};

function randomHint() {
    const keys = Object.keys(HINTS);
    const k = keys[Math.floor(Math.random() * keys.length)];
    return { type: k, text: HINTS[k] };
}

window.SCENES = {
  desert(root) {
    try { AudioMgr.stopAll(); AudioMgr.play('bgm', { loop: true, volume: 0.2}); } catch{}
    const bg = el('img', { src: ASSETS.desert, class: 'bg', alt: 'Desert dunes' });
    root.appendChild(bg);
    
    const tomb = el('img', { src: ASSETS.tomb, class: 'prop tomb', alt: 'Tomb entrance', onclick: () => {
      if (!state.tutorialDone) {
        showDialog({
          title: "Hold up!",
          body: `The Explorer steps in: “First time? Talk to me before you enter. Also, reloading this page may lose progress.”`,
          actions: [
            { label: "Find Explorer", onClick: () => go('explorer') },
            { label: "Okay", variant: "primary" }
          ]
        });
        return;
      }
      go('doors');
    }});
    root.appendChild(tomb);
    attachTooltip(tomb, 'Tomb');

    const explorer = el('img', { src: ASSETS.explorer, class: 'prop explorer', alt: 'Explorer', onclick: () => go('explorer') });
    root.appendChild(explorer);
    attachTooltip(explorer, 'Explorer');

    const signLeft = el('img', { 
        src: ASSETS.sign,
        class: 'prop sign-left flipped',
        alt: 'Sign to Scene 10',
        onclick: () => window.open('https://isle.a.hackclub.dev/scenes/10', '_blank')
    });
    root.appendChild(signLeft);
    attachTooltip(signLeft, 'Scene 10');

    const signRight = el('img', { src: ASSETS.sign, class: 'prop sign-right', alt: 'Signs to 55/58', onclick: () => {
      showDialog({
        title: "Wayfinding",
        body: `
          <p>South, slightly west: Scene 55 – The Forest of Many Tree-Like Things That Are Not Actually Trees.</p>
          <p><a href="https://isle.a.hackclub.dev/scenes/55" target="_blank">Open Scene 55</a></p>
          <p>Eastwards: Scene 58 – Wigglebutt Woods (unavailable).</p>
        `,
        actions: [{ label: "Close", variant: "primary" }]
      });
    }});
    root.appendChild(signRight);
    attachTooltip(signRight, 'Scenes 55/58');

    const stall = el('img', { src: ASSETS.stall, class: 'prop stall', alt: 'Market stall', onclick: () => go('market') });
    root.appendChild(stall);
    attachTooltip(stall, 'Market');

    root.appendChild(el('a', { class: 'sign-link', style: { left:'9%', top:'66%' }, href: 'https://isle.a.hackclub.dev/scenes/10', target: '_blank' }, 'Scene 10'));
    root.appendChild(el('a', { class: 'sign-link', style: { right:'9%', top:'66%' } }, 'Scenes 55/58'));
  },

  explorer(root) {
    root.appendChild(el('img', { src: ASSETS.desert, class: 'bg', alt: 'Desert' }));
    const big = el('img', { src: ASSETS.explorer, class: 'prop', style: { width:'22%', left:'39%', top:'40%' }, alt: 'Explorer portrait' });
    root.appendChild(big);
    const body = `
      <p><strong>Explorer:</strong> “Welcome to the Boom Boom Tomb. Three doors each room, choose wisely.</p>
      <ul>
        <li>Reloading may lose progress.</li>
        <li>Collect <strong>3 artifacts</strong> to finish a run.</li>
        <li>Find coins to spend at the market.</li>
      </ul>
      <p>Ready to try a loop?”</p>
    `;
    showDialog({
      title: "First Steps",
      body,
      actions: [
        { label: "Leave", onClick: () => go('desert') },
        { label: "Enter the Tomb", variant: "primary", onClick: () => { state.tutorialDone = true; save(); go('doors'); } }
      ]
    });
  },

  doors(root) {
    root.appendChild(el('img', { src: ASSETS.pyramid, class: 'bg', alt: 'Inside the pyramid' }));
    ['left','mid','right'].forEach(pos => {
      const door = el('img', { src: ASSETS.door, class: `door ${pos}`, alt: `Door ${pos}` });
      const hint = randomHint();
      attachTooltip(door, hint.text);
      door.addEventListener('click', () => {
        confirmBox({
          body: `You press your ear to the door. It sounds like <em>${hint.text}</em><br/>Enter?`,
          yes: () => go('room', { type: hint.type }),
          no: () => {}
        });
      });
      root.appendChild(door);
    });
  },

  room(root, data) {
    root.appendChild(el('img', { src: ASSETS.pyramid, class: 'bg', alt: 'A chamber' }));
    const type = data?.type || 'chest';
    let text = '';
    let after = () => go('doors');
    switch (type) {
      case 'boom':
        text = `A pressure plate! You narrowly avoid disaster but drop a coin in the scramble.`;
        state.coins = Math.max(0, state.coins - 1);
        break;
      case 'chest':
        text = `You find a dusty chest with a few coins.`;
        state.coins += 3;
        break;
      case 'artifact': {
        const pool = ['Sun Shard','Moon Relic','Star Idol'];
        const candidates = pool.filter(a => !state.artifacts.includes(a));
        const found = candidates[0] || null;
        if (found) state.artifacts.push(found);
        text = found ? `You carefully lift the <strong>${found}</strong>!` : `An empty pedestal… someone was here before.`;
        after = () => {
          if (state.artifacts.length >= 3) return go('outro');
          go('doors');
        };
        break;
      }
      case 'trap':
        text = `Dart holes line the walls. You wait… and nothing happens. Creepy, but safe.`;
        break;
      case 'npc':
        text = `A robed figure beckons. “Gamble 2 coins for a chance at 5?”`;
        root.appendChild(el('img', {
          src: ASSETS.gamblingnpc,
          class: 'prop',
          style: { width:'12%', left:'54%', top:'42%' },
          alt: 'Gambling NPC'
        }));
        after = () => {
          showDialog({
            title: "Gambler",
            body: `Pay 2 coins to roll. Win +5 coins (50%) or lose (50%).`,
            actions: [
              { label: "No thanks", onClick: () => go('doors') },
              { label: "Gamble (2🪙)", variant: "primary", onClick: () => {
                  if (state.coins < 2) return showDialog({ title: "Not enough", body: "Come back with more coins.", actions:[{label:"OK", variant:"primary"}] });
                  state.coins -= 2;
                  if (Math.random() < 0.5) state.coins += 5;
                  go('doors');
                } }
            ]
          });
        };
        break;
    }
    showDialog({
      title: type.toUpperCase(),
      body: `<p>${text}</p>`,
      actions: [{ label: "Continue", variant: "primary", onClick: after }]
    });
    updateHUD(); save();
  },

  market(root) {
    root.appendChild(el('img', { src: ASSETS.desert, class: 'bg', alt: 'Desert' }));
    root.appendChild(el('img', { src: ASSETS.market, class: 'prop', style:{ width:'40%', left:'30%', top:'34%' }, alt: 'Market counter' }));
    root.appendChild(el('img', { src: ASSETS.marketnpc, class: 'prop', style:{ width:'12%', left:'54%', top:'42%' }, alt: 'Market NPC' }));
    showDialog({
      title: "Market",
      body: `
        <p>Welcome, traveler. Spend your coins?</p>
        <ul>
          <li><strong>Bomb</strong> — 3🪙</li>
          <li><strong>Minor Charm</strong> — 5🪙 (slightly improves artifact odds for 2 rooms)</li>
        </ul>
      `,
      actions: [
        { label: "Buy Bomb (3🪙)", onClick: () => {
            if (state.coins < 3) return showDialog({ title:"Not enough", body:"Come back richer.", actions:[{label:"OK", variant:"primary"}] });
            state.coins -= 3; state.inventory.push('Bomb');
            go('market');
          } },
        { label: "Buy Charm (5🪙)", onClick: () => {
            if (state.coins < 5) return showDialog({ title:"Not enough", body:"Come back richer.", actions:[{label:"OK", variant:"primary"}] });
            state.coins -= 5; state.meta.charm = (state.meta.charm||0)+2;
            go('market');
          } },
        { label: "Leave", variant: "primary", onClick: () => go('desert') }
      ]
    });
    updateHUD(); save();
  },

  outro(root) {
    root.appendChild(el('img', { src: ASSETS.desert, class: 'bg', alt: 'Desert' }));
    showDialog({
      title: "You Did It!",
      body: `
        <p>You return to the Explorer with <strong>3 artifacts</strong> in tow.</p>
        <p>Summary: 🪙 ${state.coins} | Items: ${state.inventory.join(', ') || 'none'}</p>
        <p>Thanks for playing!</p>
      `,
      actions: [
        { label: "Play Again (soft reset)", variant: "primary", onClick: () => {
            state.artifacts = [];
            save(); go('desert');
          } }
      ]
    });
  }
};

window.SCENES.intro = function(root){
    const hud = document.getElementById('hud');
    if (hud) hud.style.display = 'none';

    const wrap = el('div', { class: 'intro'},
        el('div', { class: 'intro-inner'}, [
            el('div', {id:'introText', class:'intro-text'}),
            el('div', {id:'introPrompt', class:'intro-prompt hidden blink'}, 'press enter to continue')
        ])
    );
    root.appendChild(wrap);

    const seq = [
        { text: 'You walk through the scorching sands, desperate for water.', sfx: 'walk'},
        { text: 'Surprisingly, you start hearing... explosions?'},
        { text: 'boom', sfx: 'farboom'},
        { text: 'Boom', sfx: 'midboom'},
        { text: 'BOOM', sfx: 'closeboom'},
        { text: 'You run quickly and see...', sfx: 'running'}
    ];

    const textEl = document.getElementById('introText');
    const promptEl = document.getElementById('introPrompt');

    let i = -1;
    let idx = 0;
    let typing = false;
    let timer = null;

    function showPromptLater(){
        setTimeout(() => {
            promptEl.classList.remove('hidden');
        }, 3000);
    }

    function startLine(){
        promptEl.classList.add('hidden');
        textEl.textContent = '';
        idx = 0;
        typing = true;
        const line = seq[i];
        if(line.sfx) AudioMgr.play(line.sfx);
        clearInterval(timer);
        timer = setInterval(() => {
            const full = line.text;
            if (idx >= full.length){
                clearInterval(timer);
                typing = false;
                showPromptLater();
                return;
            }
            textEl.textContent = full.slice(0, idx +1);
            idx += 1;
        }, 30);
    }

    function completeLine(){
        const line = (i >= 0 && i < seq.length) ? seq[i] : { text: ''};
        clearInterval(timer);
        textEl.textContent = line.text;
        typing = false;
        showPromptLater();
    }

    function next(){
        AudioMgr.stopAll();
        i += 1;
        if (i < seq.length){
            startLine();
        } else {
            if(hud) hud.style.display = '';
            root.innerHTML = '';
            transitionTo('desert');
        }
    }
    
    function onKey(e){
        if (e.key !== 'Enter') return;
        try { AudioMgr.unlock(); } catch {}
        if (i<0){
            i=0;
            startLine();
            return;
        }
        if (typing) {
            completeLine();
        } else {
            next();
        }
    }

    window.addEventListener("keydown", onKey);
    document.getElementById('introPrompt').classList.remove('hidden');
}