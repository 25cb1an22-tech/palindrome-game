const ctx = new (window.AudioContext || window.webkitAudioContext)();
function sfx(f, t, d) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = t; o.frequency.value = f; g.gain.value = 0.2;
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + d);
}