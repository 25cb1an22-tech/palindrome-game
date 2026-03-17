let p1 = { s: 0, l: 3 }, p2 = { s: 0, l: 3 };
let active = 1, timer, time, max = 12;
const socket = io(); // Backend connection

// Star Background
const canvas = document.getElementById('bg-canvas');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth; canvas.height = window.innerHeight;
let stars = Array(200).fill().map(() => ({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, r: Math.random()*2 }));
function draw() {
    c.fillStyle = '#000'; c.fillRect(0,0,canvas.width,canvas.height);
    c.fillStyle = '#fff';
    stars.forEach(s => { c.beginPath(); c.arc(s.x, s.y, s.r, 0, Math.PI*2); c.fill(); s.y += 0.5; if(s.y > canvas.height) s.y = 0; });
    requestAnimationFrame(draw);
}
draw();

function showRules() {
    document.getElementById('lobby').classList.remove('active-screen');
    document.getElementById('rules-overlay').style.display = 'flex';
}

function start() {
    document.getElementById('ln1').innerText = (document.getElementById('p1n').value || "P1").toUpperCase();
    document.getElementById('ln2').innerText = (document.getElementById('p2n').value || "P2").toUpperCase();
    document.getElementById('rules-overlay').style.display = 'none';
    document.getElementById('arena').classList.add('active-screen');
    nextTurn();
}

function nextTurn() {
    document.getElementById('s1').style.background = active === 1 ? 'rgba(0,242,255,0.05)' : 'none';
    document.getElementById('s2').style.background = active === 2 ? 'rgba(255,0,123,0.05)' : 'none';
    document.getElementById('t-fill').style.background = active === 1 ? 'var(--p1)' : 'var(--p2)';
    clearInterval(timer); time = max;
    timer = setInterval(() => {
        time -= 0.1;
        document.getElementById('t-fill').style.width = (time/max)*100 + "%";
        if(time <= 0) check(true);
    }, 100);
}

function check(to = false) {
    const val = document.getElementById('game-in').value.trim().toUpperCase();
    if(!val && !to) return;
    clearInterval(timer);
    const isP = val && val === val.split('').reverse().join('');
    let cur = active === 1 ? p1 : p2;
    
    if(isP && !to) { cur.s += 100; confetti({ particleCount: 30, origin: { x: active === 1 ? 0.2 : 0.8 } }); }
    else { cur.l--; }

    document.getElementById('ls1').innerText = p1.s.toString().padStart(2, '0');
    document.getElementById('ls2').innerText = p2.s.toString().padStart(2, '0');
    document.getElementById('lh1').innerText = "💎".repeat(Math.max(0, p1.l));
    document.getElementById('lh2').innerText = "💎".repeat(Math.max(0, p2.l));
    document.getElementById('game-in').value = "";

    if(p1.l <= 0 || p2.l <= 0) showBoard();
    else { active = active === 1 ? 2 : 1; nextTurn(); }
}

function showBoard() {
    document.getElementById('end-screen').style.display = 'flex';
    document.getElementById('rank-list').innerHTML = `<h2>Game Over!</h2>`;
}