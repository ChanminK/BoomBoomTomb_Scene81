const state = {
    artifacts: [],
    coins: 0,
    inventory: [],
    tutorialDone: false,
    runActive: false,
    meta: {}
};

document.addEventListener('DOMContentLoaded', () => {
    hideDialog();
    hideConfirm();
});

function save(){ 
    try{ localStorage.setItem('bbt_state', JSON.stringify(state)); }catch{}
}

function load(){
    try{ const r=localStorage.getItem('bbt_state'); if(r) Object.assign(state, JSON.parse(r)); }catch{} 
}

load();

function $(sel, root=document){ return root.querySelector(sel); }
function el(tag, attrs={}, children=[]){
    const e=document.createElement(tag);
    Object.entries(attrs).forEach(([k, v])=> {
        if(k==='class') e.className=v;
        else if(k==='style') Object.assign(e.style,v);
        else if(k.startsWith('on')&&typeof v==='function') e.addEventListener(k.slice(2), v);
        else e.setAttribute(k, v);
    });
    const list = Array.isArray(children) ? children : [children];
    list.forEach(c=>{
        if(typeof c=== 'string') e.appendChild(document.createTextNode(c));
        else if(c) e.appendChild(c);
    });
    return e;
}

function updateHUD(){
    const a=$('#hud-artifacts'), c=$('#hud-coins');
    if(a) a.textContent=`🗿 ${state.artifacts.length}/3`;
    if(c) c.textContent=`🪙 ${state.coins}`;
}

function showDialog({ title="", body="", actions=[] }){
    $('#dialog-title').textContent=title;
    $('#dialog-body').innerHTML=body;
    const actionsEl=$('#dialog-actions');
    actionsEl.innerHTML="";
    actions.forEach(({label, variant, onClick}) => {
        const b=el('button', {class: `btn ${variant||''}`, onclick:()=>{hideDialog(); onClick&&onClick();}},label);
        actionsEl.appendChild(b);
    });
    $('#overlay').classList.remove('hidden');
    $('#dialog').classList.remove('hidden');
    $('#dialog').setAttribute('aria-hidden', 'false');
}

function hideDialog(){
    $('#overlay').classList.add('hidden');
    $('#dialog').classList.add('hidden');
    $('#dialog').setAttribute('aria-hidden', 'true');
}

function confirmBox({ body="", yes=()=>{}, no=()=>{} }){
    $('#confirm-body').innerHTML=body;
    $('#confirm-yes').onclick=()=>{ hideConfirm(); yes(); };
    $('#confirm-no').onclick =()=>{ hideConfirm(); no();  };
    $('#overlay').classList.remove('hidden');
    $('#confirm').classList.remove('hidden');
    $('#confirm').setAttribute('aria-hidden','false');
}

function hideConfirm(){
    $('#overlay').classList.add('hidden');
    $('#confirm').classList.add('hidden');
    $('#confirm').setAttribute('aria-hidden', 'true');
}

function attachTooltip(node, text){
    let tip;
    node.addEventListener('mouseenter', ()=>{
        tip = document.createElement('div');
        tip.className='tooltip';
        tip.textContent=text;
        node.parentElement.appendChild(tip);
        const r=node.getBoundingClientRect(), pr=node.parentElement.getBoundingClientRect();
        tip.style.left = (r.left - pr.left + r.width/2) + 'px';
        tip.style.top = (r.top-pr.top) + 'px';
    });
    node.addEventListener('mouseleave', ()=>{ if(tip){ tip.remove(); tip=null; } });
};

function go(sceneId, data = {}){
    const root = document.getElementById('scene');
    root.innerHTML = '';
    const registry = window.SCENES;
    if (!registry || typeof registry[sceneId] !== 'function'){
        root.textContent = `Scene "${sceneId}" not found.`;
        return;
    }

    registry[sceneId](root, data);
    updateHUD();
    save();
}

window.BBT = {
    stats(){
        const s = { coins: state.coins, artifacts: [...state.artifacts], inventory: [...(state.inventory||[])], tutorialDone: state.tutorialDone};
        console.table(s);
        return s;
    },

    wipe(){
        try { localStorage.removeItem('bbt_state'); } catch {}
        state.artifacts = [];
        state.coins = 0;
        state.inventory = [];
        state.tutorialDone = false;
        state.runActive = false;
        state.meta = {};
        updateHUD();
        save();
        console.log('BBT state wiped');
    }
};