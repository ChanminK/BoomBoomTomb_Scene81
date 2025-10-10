const ASSETS = {
  desert: "assets/desert.png",
  pyramid: "assets/pyramidbackground.jpg",
  tomb: "assets/tomb.jpg",
  door: "assets/door.png",
  explorer: "assets/explorer.png",
  getout: "assets/getout.png",
  sign: "assets/sign.png",
  stall: "assets/stall.png",
  market: "assets/market.png",
  stallnpc: "assets/stallnpc.png",
  marketnpc: "assets/marketnpc.png",
  gamblingnpc: "assets/gamblingnpc.jpg",
  tombshopnpc: "assets/tombshopnpc.png",
  shopcounter: "assets/shopcounter.jpg",
  artifact1: "assets/artifact1.png",
  artifact2: "assets/artifact2.png",
  artifact3: "assets/artifact3.png",
  itembomb: "assets/bomb.png",
  itemcharm: "assets/charm.png",
  itemshield: "assets/shield.png"
};

const HINTS = {
  boom: "faint sizzling...",
  chest: "metallic clinks...",
  artifact: "a low hum...",
  trap: "whistling drafts...",
  npc: "murmuring voices..."
};

function weightedPick(weights){
  const total = weights.reduce((a,b)=>a+b,0);
  let r = Math.random()*total;
  for(let i=0;i<weights.length;i++){
    r -= weights[i];
    if(r<=0) return i;
  }
  return weights.length-1;
}

function randomRoomType(){
  const charm = state.meta.charm||0;
  const base = ['boom','trap','chest','artifact','npc'];
  let w = [1,1,2,2,2];
  if(charm>0) w = [1,1,2,3.5,2.5];
  return base[weightedPick(w)];
}

window.SCENES = {
  desert(root) {
    try{ AudioMgr.stopAll(); AudioMgr.play('bgm',{loop:true,volume:0.5}); }catch{}
    root.appendChild(el('img',{src:ASSETS.desert,class:'bg',alt:'Desert dunes'}));

    const tomb=el('img',{src:ASSETS.tomb,class:'prop tomb',alt:'Tomb entrance',title:'Tomb',onclick:()=>{
      if(!state.tutorialDone){
        showDialog({
          title:"Hold up!",
          body:`The Explorer steps in: “First time? Talk to me before you enter. Also, reloading this page may lose progress.”`,
          actions:[
            {label:"Find Explorer",onClick:()=>go('explorer')},
            {label:"Okay",variant:"primary"}
          ]
        });
        return;
      }
      go('doors');
    }});
    root.appendChild(tomb);

    const explorer=el('img',{src:ASSETS.explorer,class:'prop explorer',alt:'Explorer',title:'Explorer',onclick:()=>go('explorer')});
    root.appendChild(explorer);

    const signLeft=el('img',{src:ASSETS.sign,class:'prop sign-left flipped',alt:'Sign to Scene 10',title:'Scene 10',onclick:()=>{
      showDialog({
        title:"Directions to Scene 10",
        body:`<p>Ruined House (Semi-Sentient)</p><p><a href="https://isle.a.hackclub.dev/scenes/10" target="_blank" rel="noopener">Open Scene 10</a></p>`,
        actions:[{label:"Close",variant:"primary"}]
      });
    }});
    root.appendChild(signLeft);

    const signRight = el('img', {
  src: ASSETS.sign,
  class: 'prop sign-right',
  alt: 'Signs to 55/58',
  title: 'Scenes 55 / 58',
  onclick: () => {
    showDialog({
      title: "Directions",
      body: `
        <p>South, slightly west: Scene 55 – The Forest of Many Tree-Like Things That Are Not Actually Trees.</p>
        <p><a href="https://isle.a.hackclub.dev/scenes/55" target="_blank" rel="noopener">Open Scene 55</a></p>
        <p>Eastwards: Scene 58 – Wigglebutt Woods.</p>
        <p><a href="https://island.hackclub.com/scenes/58" target="_blank" rel="noopener">Open Scene 58</a></p>
      `,
      actions: [{ label: "Close", variant: "primary" }]
    });
  }
});
root.appendChild(signRight);


    const stall=el('img',{src:ASSETS.stall,class:'prop stall',alt:'Market stall',title:'Market',onclick:()=>go('market')});
    root.appendChild(stall);

    root.appendChild(el('a',{class:'sign-link',style:{left:'9%',top:'66%'},href:'https://isle.a.hackclub.dev/scenes/10',target:'_blank'},'Scene 10'));
    root.appendChild(el('a',{class:'sign-link',style:{right:'9%',top:'66%'}},'55 / 58'));
  },

  explorer(root){
    root.appendChild(el('img',{src:ASSETS.desert,class:'bg',alt:'Desert'}));
    const portrait=el('img',{src:ASSETS.explorer,class:'prop',style:{width:'33%',left:'34%',top:'34%'},alt:'Explorer'});
    root.appendChild(portrait);

    if(!state.tutorialDone){
      const lines=[
        'Welcome adventurer! You are now at the famous Boom Boom Tomb!',
        'Here, you must find three special artifacts and bring them back to me!',
        'But be careful! If you\'re not careful, you might go...',
        'BOOOM',
        'If you don\'t want to,',
        'GET OUT',
        '(also don\'t reload the page; progress might reset)'
      ];
      let step=0;
      const advance=()=>{
        if(step===0){ showDialog({title:"Explorer",body:`<p>${lines[0]}</p>`,actions:[{label:"Next",variant:"primary",onClick:advance}]}); step++; return; }
        if(step===1){ showDialog({title:"Explorer",body:`<p>${lines[1]}</p>`,actions:[{label:"Next",variant:"primary",onClick:advance}]}); step++; return; }
        if(step===2){ showDialog({title:"Explorer",body:`<p>${lines[2]}</p>`,actions:[{label:"Next",variant:"primary",onClick:advance}]}); step++; return; }
        if(step===3){ try{AudioMgr.play('bigboom');}catch{} showDialog({title:"Explorer",body:`<p><strong>${lines[3]}</strong></p>`,actions:[{label:"Next",variant:"primary",onClick:advance}]}); step++; return; }
        if(step===4){ showDialog({title:"Explorer",body:`<p>${lines[4]}</p>`,actions:[{label:"Next",variant:"primary",onClick:advance}]}); step++; return; }
        if(step===5){ try{AudioMgr.play('getout');}catch{} portrait.src=ASSETS.getout; showDialog({title:"Explorer",body:`<p><strong>${lines[5]}</strong></p>`,actions:[{label:"Next",variant:"primary",onClick:advance}]}); step++; return; }
        if(step===6){
          const body=`
            <p>${lines[6]}</p>
            <p>So adventurer, what would you like to do?</p>
          `;
          showDialog({
            title:"Explorer",
            body,
            actions:[
              {label:"Adventure",variant:"primary",onClick:()=>{
                const how=`
                  <p>Here's how it works: when you enter the tomb, you will be presented with 3 doors.</p>
                  <p>Choose one and hope that it isn't a bomb!</p>
                  <p>You might find artifacts, treasures, or coins to spend at the shop to help you!</p>
                  <p>Continue and when you have 3 artifacts, come back to me!</p>
                  <p>Then I'll give you your prize. Good luck!</p>
                `;
                state.tutorialDone=true; save();
                showDialog({title:"Explorer",body:how,actions:[{label:"Enter the Tomb",variant:"primary",onClick:()=>go('doors')}]});
              }},
              {label:"Leave",onClick:()=>{
                try{AudioMgr.play('getout');}catch{}
                showDialog({
                  title:"Where to?",
                  body:`<p>Pick a destination:</p><ul><li><a href="https://isle.a.hackclub.dev/scenes/10" target="_blank" rel="noopener">Scene 10 – Ruined House</a></li><li><a href="https://isle.a.hackclub.dev/scenes/55" target="_blank" rel="noopener">Scene 55 – Forest of Many Tree-Like Things</a></li><li>Scene 58 – Wigglebutt Woods (unavailable)</li></ul>`,
                  actions:[{label:"Back to Desert",variant:"primary",onClick:()=>go('desert')}]
                });
              }}
            ]
          });
        }
      };
      advance();
      return;
    }

    const menu=()=>{
      showDialog({
        title:"Explorer",
        body:`<p>Now the tomb is a dangerous place, but remember this! You might hear some telltale signs of certain things!</p>`,
        actions:[
          {label:"I have all the artifacts",onClick:()=>{
            if(state.artifacts.length>=3){
              showDialog({
                title:"Wonderful!",
                body:`<p>Here's your prize:</p><p><button class="btn primary" id="rr">Claim</button></p>`,
                actions:[{label:"Back",onClick:menu}]
              });
              setTimeout(()=>{
                const b=document.getElementById('rr');
                if(b) b.onclick=()=>{
                  const iframe=`<div style="position:relative;padding-top:56.25%"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" title="Rickroll" allow="autoplay; encrypted-media" style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe></div>`;
                  showDialog({title:"🎁",body:iframe,actions:[{label:"Back to Desert",variant:"primary",onClick:()=>go('desert')}]});
                };
              },0);
            }else{
              showDialog({title:"Explorer",body:`<p>Hmm, you don't seem to have three artifacts yet... come back later!</p>`,actions:[{label:"Back",variant:"primary",onClick:menu}]});
            }
          }},
          {label:"Lore",variant:"",onClick:()=>{
            const pages=[
              `<p><strong>The Boom.</strong> Long before the dunes swallowed the valley, three sibling artisans forged curios from sun, moon, and stone. Their rivalry ended when a jealous patron laced the tomb with clockwork traps—each misstep a percussion in an endless, sandy symphony.</p>`,
              `<p><strong>The Three.</strong> The <em>Sunstone</em> warms cold gears to life; the <em>Moonstone</em> hushes echoing halls; and <em>THE ROCK</em> is… just a rock. But in the right hands, even a rock can tip history.</p>`,
              `<p><strong>The Wager.</strong> The tomb listens. It rewards nerve and punishes greed. Merchants nest like lizards in the cool cracks, gamblers whisper odds to the walls, and every door hums a different note. If you learn the melody, you’ll leave with more than coins.</p>`
            ];
            let p=0;
            const show=()=>showDialog({title:"Explorer's Lore",body:pages[p],actions:[
              {label: p===0?'Next':'Back', onClick:()=>{ if(p>0) p--; show(); }},
              {label: p<pages.length-1?'Next':'Close', variant:'primary', onClick:()=>{ if(p<pages.length-1){ p++; show(); } else menu(); }}
            ]});
            show();
          }},
          {label:"Leave",variant:"primary",onClick:()=>go('desert')}
        ]
      });
    };
    menu();
  },

  doors(root){
    try{ AudioMgr.stopAll(); AudioMgr.play('tomb',{loop:true,volume:0.7}); }catch{}
    root.appendChild(el('img',{src:ASSETS.pyramid,class:'bg',alt:'Inside the pyramid'}));

    const assigned=[randomRoomType(),randomRoomType(),randomRoomType()];
    const lockedIndex = Math.random()<0.33 ? Math.floor(Math.random()*3) : -1;
    const positions=['left','mid','right'];

    positions.forEach((pos,idx)=>{
      const door=el('img',{src:ASSETS.door,class:`door ${pos}`,alt:`Door ${pos}`});
      const assignedType=assigned[idx];
      const hintText=HINTS[assignedType]||'silence';
      const locked = idx===lockedIndex;

      door.addEventListener('mouseenter',()=>{
        const show=Math.random()<0.5;
        const t = locked ? 'a heavy lock clicking' : (show? hintText : "you can't hear anything");
        attachTooltip(door, t);
      });

      door.addEventListener('click',()=>{
        if(locked && itemCount('Bomb')===0){
          showDialog({
            title:'Locked',
            body:`<p>The door is sealed. It needs a Bomb to blow the lock.</p>`,
            actions:[{label:'Back',variant:'primary'}]
          });
          return;
        }
        if(locked && itemCount('Bomb')>0){
          confirmBox({
            body:`Use a Bomb to blow the lock?`,
            yes:()=>{
              if(consumeItem('Bomb')){
                showDialog({
                  title:'Boom',
                  body:`<p>The lock shatters.</p>`,
                  actions:[{label:'Enter',variant:'primary',onClick:()=>go('room',{type:assignedType, fromLocked:true})}]
                });
              } else {
                showDialog({title:'No Bomb',body:'You fumble for a Bomb, but have none.',actions:[{label:'OK',variant:'primary'}]});
              }
            },
            no:()=>{}
          });
          return;
        }

        const show=Math.random()<0.5;
        const heard= show? hintText : "you can't hear anything";
        confirmBox({
          body:`You press your ear to the door. It sounds like <em>${heard}</em><br/>Enter?`,
          yes:()=>go('room',{type:assignedType}),
          no:()=>{}
        });
      });

      root.appendChild(door);
    });

    const leaveBtn=el('button',{class:'btn',style:{position:'absolute',right:'12px',bottom:'12px',zIndex:'6'},onclick:()=>{
      confirmBox({body:'Exit the tomb?',yes:()=>transitionTo('desert'),no:()=>{}});
    }},'Leave');
    root.appendChild(leaveBtn);
  },

  room(root,data){
    try{ AudioMgr.stop('tomb'); }catch{}
    root.appendChild(el('img',{src:ASSETS.pyramid,class:'bg',alt:'A chamber'}));
    const type=data?.type||'chest';
    let text='';
    let after=()=>{ decrementCharm(); go('doors'); };

    if(type==='boom'){
      if(itemCount('Shield')>0){
        consumeItem('Shield');
        text='A hidden charge pops—your Shield absorbs the blast and crumbles.';
      } else if(state.coins<5){
        try{AudioMgr.play('bigboom');}catch{}
        state.coins=0;
        showDialog({
          title:'BOOM',
          body:'You triggered a massive trap with not enough coins to recover. Game over.',
          actions:[{label:'Back to Desert',variant:'primary',onClick:()=>{ decrementCharm(); go('desert'); }}]
        });
        updateHUD(); save(); return;
      } else {
        try{AudioMgr.play('bigboom');}catch{}
        state.coins=Math.max(0,state.coins-5);
        text='A pressure plate! You survive, but drop 5 coins.';
      }
    } else if(type==='trap'){
      if(state.coins<3){
        state.coins=0;
        showDialog({
          title:'Trap!',
          body:'Sprung! You’re thrown out of the tomb and lose all your coins.',
          actions:[{label:'Back to Desert',variant:'primary',onClick:()=>{ decrementCharm(); go('desert'); }}]
        });
        updateHUD(); save(); return;
      } else {
        state.coins-=3;
        text='Dart holes line the walls. You duck and lose 3 coins in the scramble.';
      }
    } else if(type==='chest'){
      const amt=3;
      state.coins+=amt;
      text=`You find a dusty chest with ${amt} coins.`;
    } else if(type==='artifact'){
      const pool=['Sunstone','Moonstone','THE ROCK'];
      const have=new Set(state.artifacts);
      const mapImages={Sunstone:ASSETS.artifact1,Moonstone:ASSETS.artifact2,'THE ROCK':ASSETS.artifact3};
      const candidates=pool.filter(a=>!have.has(a));
      const found=candidates[0]||null;
      if(found){
        state.artifacts.push(found);
        text=`You carefully lift the <strong>${found}</strong>!`;
        const img=el('img',{src:mapImages[found],class:'prop',style:{width:'18%',left:'41%',top:'40%'}});
        root.appendChild(img);
        after=()=>{ decrementCharm(); if(state.artifacts.length>=3){ showDialog({title:'All set',body:'I should go to the Explorer now.',actions:[{label:'Go to Explorer',variant:'primary',onClick:()=>go('explorer')}]}); } else { go('doors'); } };
      } else {
        text='An empty pedestal… someone was here before.';
      }
    } else if(type==='npc'){
      const which = Math.random()<0.5 ? 'gambler' : 'merchant';
      if(which==='gambler'){
        root.appendChild(el('img',{src:ASSETS.gamblingnpc,class:'prop',style:{width:'12%',left:'54%',top:'42%'},alt:'Gambling NPC'}));
        text=`A robed figure beckons. “Gamble 2 coins for 4?”`;
        after=()=>{
          showDialog({
            title:'Gambler',
            body:'Pay 2 coins to roll. Win +4 coins (50%) or lose (50%).',
            actions:[
              {label:'No thanks',onClick:()=>{ decrementCharm(); go('doors'); }},
              {label:'Gamble (2🪙)',variant:'primary',onClick:()=>{
                if(state.coins<2){
                  showDialog({title:'Not enough',body:'Come back with more coins.',actions:[{label:'OK',variant:'primary',onClick:()=>{ decrementCharm(); go('doors'); }}]});
                  return;
                }
                state.coins-=2;
                if(Math.random()<0.5) state.coins+=4;
                decrementCharm(); go('doors');
              }}
            ]
          });
        };
      } else {
        root.appendChild(el('img',{src:ASSETS.tombshopnpc,class:'prop',style:{width:'14%',left:'54%',top:'42%'},alt:'Tomb Merchant'}));
        const items=[{id:'Bomb',img:ASSETS.itembomb},{id:'Charm',img:ASSETS.itemcharm},{id:'Shield',img:ASSETS.itemshield}];
        const offer=items[Math.floor(Math.random()*items.length)];
        text=`A merchant whispers, “One ${offer.id} for 1 coin?”`;
        after=()=>{
          showDialog({
            title:'Merchant',
            body:`<div style="display:flex;gap:12px;align-items:center"><img src="${offer.img}" alt="${offer.id}" style="width:64px;height:64px;object-fit:contain;border:1px solid #5a493a;border-radius:8px" /><div><p>${offer.id}</p><p>Price: 1🪙</p></div></div>`,
            actions:[
              {label:'No',onClick:()=>{ decrementCharm(); go('doors'); }},
              {label:'Yes (1🪙)',variant:'primary',onClick:()=>{
                if(state.coins<1){
                  showDialog({title:'Not enough',body:'Come back richer.',actions:[{label:'OK',variant:'primary',onClick:()=>{ decrementCharm(); go('doors'); }}]});
                  return;
                }
                state.coins-=1;
                if(offer.id==='Charm'){ state.meta.charm = (state.meta.charm||0) + 3; }
                else addItem(offer.id);
                decrementCharm(); go('doors');
              }}
            ]
          });
        };
      }
    }

    if(type!=='npc'){
      showDialog({title:type.toUpperCase(),body:`<p>${text}</p>`,actions:[{label:'Continue',variant:'primary',onClick:after}]});
    } else {
      showDialog({title:'You enter...',body:`<p>${text}</p>`,actions:[{label:'Continue',variant:'primary',onClick:after}]});
    }
    updateHUD(); save();

    function decrementCharm(){
      if(state.meta.charm && state.meta.charm>0){ state.meta.charm -= 1; if(state.meta.charm<0) state.meta.charm=0; }
    }
  },

  market(root){
    try{ AudioMgr.stopAll(); AudioMgr.play('shop',{loop:true,volume:0.7}); }catch{}
    root.appendChild(el('img',{src:ASSETS.desert,class:'bg',alt:'Desert'}));
    root.appendChild(el('img',{src:ASSETS.market,class:'prop',style:{width:'40%',left:'30%',top:'34%'},alt:'Market counter'}));
    root.appendChild(el('img',{src:ASSETS.stallnpc,class:'prop',style:{width:'12%',left:'54%',top:'42%'},alt:'Shop NPC'}));

    if(!state.meta.visitedShop){
      state.meta.visitedShop=true; save();
      showDialog({
        title:'Shopkeeper',
        body:`<p>Welcome adventurer, to my humble shop.</p><p>Here I sell items that you may buy with coins to aid you on your journey.</p><p>Here, have a look.</p>`,
        actions:[
          {label:'Open Shop',variant:'primary',onClick:openShop},
          {label:'Leave',onClick:()=>{ try{AudioMgr.stop('shop');}catch{} go('desert'); }}
        ]
      });
    } else {
      showDialog({
        title:'Shopkeeper',
        body:`<p>Welcome back.</p>`,
        actions:[
          {label:'Shop',variant:'primary',onClick:openShop},
          {label:'Lore (WIP)'},
          {label:'Leave',onClick:()=>{ try{AudioMgr.stop('shop');}catch{} go('desert'); }}
        ]
      });
    }

    function priceSpan(p){ const afford=state.coins>=p; return `<span style="color:${afford?'#fff':'#ff6b6b'}">${p}🪙</span>`; }
    function buyBtn(id,price){
      return `<button class="btn ${state.coins>=price?'primary':''}" data-id="${id}" data-price="${price}">Buy</button>`;
    }
    function openShop(){
      const items=[
        {id:'Bomb',img:ASSETS.itembomb,desc:'Open locked doors.',price:3},
        {id:'Charm',img:ASSETS.itemcharm,desc:'Increases artifact odds for 3 rooms.',price:5},
        {id:'Shield',img:ASSETS.itemshield,desc:'Blocks one bomb once.',price:10}
      ];
      const cards=items.map(it=>`
        <div style="background:#1c1510;border:1px solid #5a493a;border-radius:12px;padding:12px;display:grid;gap:8px;place-items:center">
          <div style="font-weight:700">${it.id}</div>
          <img src="${it.img}" alt="${it.id}" style="width:96px;height:96px;object-fit:contain;border:1px solid #4a3c2f;border-radius:10px" />
          <div style="opacity:.9">${it.desc}</div>
          <div>Price: ${priceSpan(it.price)}</div>
          ${buyBtn(it.id,it.price)}
        </div>
      `).join('');

      const body=`
        <div style="background:#00000055;border:1px solid #5a493a;border-radius:14px;overflow:hidden">
          <div style="background:url('${ASSETS.shopcounter}') center/cover no-repeat;padding:10px 12px;display:flex;justify-content:space-between;align-items:center">
            <div>Shop</div>
            <button id="shopClose" class="btn">X</button>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;padding:12px;min-width:560px">
            ${cards}
          </div>
        </div>
      `;
      showDialog({title:'',body:body,actions:[]});
      setTimeout(()=>{
        const close=$('#shopClose'); if(close) close.onclick=()=>{ hideDialog(); go('market'); };
        document.querySelectorAll('#dialog-body button[data-id]').forEach(b=>{
          b.onclick=()=>{
            const id=b.getAttribute('data-id');
            const price=+b.getAttribute('data-price');
            if(state.coins<price){
              showDialog({title:'Not enough',body:'Come back richer.',actions:[{label:'OK',variant:'primary',onClick:openShop}]});
              return;
            }
            state.coins-=price;
            if(id==='Charm'){ state.meta.charm=(state.meta.charm||0)+3; }
            else addItem(id);
            save();
            openShop();
          };
        });
      },0);
    }
  },

  outro(root){
    root.appendChild(el('img',{src:ASSETS.desert,class:'bg',alt:'Desert'}));
    showDialog({
      title:'You Did It!',
      body:`<p>You return to the Explorer with <strong>3 artifacts</strong> in tow.</p><p>Summary: 🪙 ${state.coins} | Items: ${state.inventory.join(', ')||'none'}</p><p>Thanks for playing!</p>`,
      actions:[
        {label:'Play Again (soft reset)',variant:'primary',onClick:()=>{ state.artifacts=[]; save(); go('desert'); }}
      ]
    });
  }
};

window.SCENES.intro = function(root){
  const hud=$('#hud'); if(hud) hud.style.display='none';
  const wrap=el('div',{class:'intro'},el('div',{class:'intro-inner'},[
    el('div',{id:'introText',class:'intro-text'}),
    el('div',{id:'introPrompt',class:'intro-prompt hidden blink'},'press enter to continue')
  ]));
  root.appendChild(wrap);

  const seq=[
    {text:'You walk through the scorching sands, desperate for water.',sfx:'walk'},
    {text:'Surprisingly, you start hearing... explosions?'},
    {text:'boom',sfx:'farboom'},
    {text:'Boom',sfx:'midboom'},
    {text:'BOOM',sfx:'closeboom'},
    {text:'You run quickly and see...',sfx:'running'}
  ];

  const textEl=$('#introText');
  const promptEl=$('#introPrompt');

  let i=0, idx=0, typing=false, timer=null;

  function showPromptLater(){ setTimeout(()=>{ promptEl.classList.remove('hidden'); },3000); }

  function startLine(){
    if(i<0||i>=seq.length){ typing=false; promptEl.classList.remove('hidden'); return; }
    promptEl.classList.add('hidden');
    textEl.textContent='';
    idx=0; typing=true;
    const line=seq[i];
    if(line.sfx){ try{ AudioMgr.play(line.sfx); }catch{} }
    clearInterval(timer);
    timer=setInterval(()=>{
      const full=line.text;
      if(idx>=full.length){ clearInterval(timer); typing=false; showPromptLater(); return; }
      textEl.textContent=full.slice(0,idx+1);
      idx+=1;
    },30);
  }

  function completeLine(){
    const line=(i>=0&&i<seq.length)?seq[i]:{text:''};
    clearInterval(timer);
    textEl.textContent=line.text;
    typing=false;
    showPromptLater();
  }

  function next(){
    try{ AudioMgr.stopAll(); }catch{}
    i+=1;
    if(i<seq.length){ startLine(); }
    else{ if(hud) hud.style.display=''; root.innerHTML=''; transitionTo('desert'); }
  }

  function onKey(e){
    if(e.key!=='Enter') return;
    try{ AudioMgr.unlock(); }catch{}
    if(typing) completeLine(); else next();
  }

  window.addEventListener('keydown',onKey);
  startLine();
};
