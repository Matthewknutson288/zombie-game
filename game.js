

// ─────────────────────────────────────────────
//  CHARACTER SELECT PREVIEWS
// ─────────────────────────────────────────────
function drawPreviewPaxton() {
  const c = document.getElementById('preview-paxton');
  const x = c.getContext('2d');
  // body
  x.fillStyle='#2255bb'; x.fillRect(32,58,36,32);
  x.fillStyle='#3a5a8a'; x.fillRect(32,80,36,14);
  // arms
  x.fillStyle='#d4956a'; x.fillRect(20,60,13,22); x.fillRect(68,60,13,22);
  // head
  x.fillStyle='#d4956a'; x.beginPath(); x.arc(50,38,20,0,Math.PI*2); x.fill();
  // brown hair
  x.fillStyle='#5c3317'; x.fillRect(30,22,40,16); x.beginPath(); x.arc(50,26,20,Math.PI,0); x.fill();
  // brown eyes
  x.fillStyle='#4a2800'; x.fillRect(40,36,6,7); x.fillRect(54,36,6,7);
  x.fillStyle='#8b5e3c'; x.fillRect(41,37,3,5); x.fillRect(55,37,3,5);
  // smile
  x.strokeStyle='#8b5e3c'; x.lineWidth=2; x.beginPath(); x.arc(50,48,6,0.2,Math.PI-0.2); x.stroke();
  // shoes
  x.fillStyle='#cc2200'; x.fillRect(30,93,16,10); x.fillRect(54,93,16,10);
}

function drawPreviewRosie() {
  const c = document.getElementById('preview-rosie');
  const x = c.getContext('2d');
  // outfit body
  x.fillStyle='#cc2255'; x.fillRect(30,58,40,20);
  // skirt flare
  x.fillStyle='#aa1144';
  x.beginPath(); x.moveTo(28,78); x.lineTo(22,100); x.lineTo(70,100); x.lineTo(72,78); x.closePath(); x.fill();
  // arms
  x.fillStyle='#f4b08a'; x.fillRect(18,60,13,20); x.fillRect(69,60,13,20);
  // ponytail
  x.fillStyle='#ff69b4';
  x.beginPath(); x.moveTo(65,28); x.quadraticCurveTo(80,20,78,48); x.quadraticCurveTo(70,42,62,40); x.closePath(); x.fill();
  // head
  x.fillStyle='#f4b08a'; x.beginPath(); x.arc(50,40,20,0,Math.PI*2); x.fill();
  // pink hair
  x.fillStyle='#ff69b4'; x.fillRect(30,24,40,16); x.beginPath(); x.arc(50,28,20,Math.PI,0); x.fill(); x.fillRect(30,36,8,14);
  // blue eyes
  x.fillStyle='#1a90ff'; x.beginPath(); x.arc(43,40,4.5,0,Math.PI*2); x.fill(); x.beginPath(); x.arc(57,40,4.5,0,Math.PI*2); x.fill();
  x.fillStyle='#fff';    x.beginPath(); x.arc(44,39,1.5,0,Math.PI*2); x.fill(); x.beginPath(); x.arc(58,39,1.5,0,Math.PI*2); x.fill();
  // smile
  x.strokeStyle='#c07060'; x.lineWidth=2; x.beginPath(); x.arc(50,48,6,0.2,Math.PI-0.2); x.stroke();
  // boots
  x.fillStyle='#553311'; x.fillRect(28,98,14,12); x.fillRect(58,98,14,12);
}

drawPreviewPaxton();
drawPreviewRosie();

// ─────────────────────────────────────────────
//  CANVAS SETUP
// ─────────────────────────────────────────────
const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d');
let W, H, GROUND;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  W      = canvas.width;
  H      = canvas.height;
  GROUND = H - 80;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ─────────────────────────────────────────────
//  INPUT
// ─────────────────────────────────────────────
const keys = {};
document.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (['Space','ArrowUp','ArrowLeft','ArrowRight','KeyZ'].includes(e.code)) e.preventDefault();
});
document.addEventListener('keyup', e => { keys[e.code] = false; });

// ─────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────
const POWERUP_SPAWN_INTERVAL = 15 * 60; // 15 seconds at 60fps
const MODE_DURATION          = 60 * 60; // 60 seconds at 60fps
const KILL_CYCLE             = 20;      // kills before day/night flip

// ─────────────────────────────────────────────
//  MODE DEFINITIONS
// ─────────────────────────────────────────────
const MODES = {
  normal:  { name:'NORMAL',  color:'#fff',    spd:4, jump:-14, atkRange:60,   atkDmg:20   },
  samurai: { name:'SAMURAI', color:'#ffd700', spd:5, jump:-15, atkRange:120,  atkDmg:50   },
  ninja:   { name:'NINJA',   color:'#cc88ff', spd:8, jump:-18, atkRange:80,   atkDmg:35   },
  turtle:  { name:'TURTLE',  color:'#2ecc71', spd:3, jump:-13, atkRange:70,   atkDmg:40   },
  gunner:  { name:'GUNNER',  color:'#ff8800', spd:4, jump:-14, atkRange:999,  atkDmg:15   },
  devil:   { name:'DEVIL',   color:'#ff2200', spd:5, jump:-15, atkRange:80,   atkDmg:9999 },
  angel:   { name:'ANGEL',   color:'#ffffaa', spd:4, jump:-14, atkRange:70,   atkDmg:1    },
  god:     { name:'GOD',     color:'#fff100', spd:12, jump:-24, atkRange:9999, atkDmg:99999 }
};

const ENHANCED_MODES = {
  samurai: { name:'SAMURAI+', color:'#ffe566', spd:6,  jump:-16, atkRange:150, atkDmg:90  },
  ninja:   { name:'NINJA+',   color:'#dd99ff', spd:10, jump:-20, atkRange:100, atkDmg:65  },
  gunner:  { name:'GUNNER+',  color:'#ffaa33', spd:5,  jump:-15, atkRange:999, atkDmg:30  },
  turtle:  { name:'TURTLE+',  color:'#55ffaa', spd:4,  jump:-14, atkRange:80,  atkDmg:70  }
};

const MODE_BASE = JSON.parse(JSON.stringify(MODES));

// ─────────────────────────────────────────────
//  POWER-UP DEFINITIONS
// ─────────────────────────────────────────────
const POWERUP_DEFS = {
  samurai: { icon:'⚔️',  label:'SAMURAI', color:'#ffd700' },
  ninja:   { icon:'🥷',  label:'NINJA',   color:'#cc88ff' },
  turtle:  { icon:'🐢',  label:'TURTLE',  color:'#2ecc71' },
  gunner:  { icon:'🔫',  label:'GUNNER',  color:'#ff8800' },
  medkit:  { icon:'❤️',  label:'HEAL',    color:'#ff4466', heal:40 },
  shield:  { icon:'🛡️', label:'SHIELD',  color:'#88ccff' },
  devil:   { icon:'😈',  label:'DEVIL',   color:'#ff2200' },
  angel:   { icon:'😇',  label:'ANGEL',   color:'#ffffaa' }
};

// ─────────────────────────────────────────────
//  GAME STATE VARIABLES
// ─────────────────────────────────────────────
let player, zombies, powerups, particles, bullets, enemyBullets;
let score, totalKills, killsSinceCycle, wave, isNight, isGameOver;
let coins = 0;
let upgrades = {
  health: 0,
  healthRegen: 0,
  damage: 0,
  speed:  0,
  jump:   0,
  luck:   1
};
let enhancedPowerups = {
  samurai: 0,
  ninja:   0,
  gunner:  0,
  turtle:  0,
  devil:   0,
  angel:   0
};
let powerupCosts = {
  samurai: 20,
  ninja:   20,
  gunner:  20,
  turtle:  20,
  devil:   20,
  angel:   20
};
let shopOpen = false;
let godUnlocked = false;
let godCost = 10000;
let powerupSpawnTimer  = 0;
let waveInProgress     = false;
let waveClearTimer     = 0;
let wavePending        = false;
let waveSpawnTarget    = 0;
let waveSpawned        = 0;
let activeBoss         = null;
let selectedChar       = 'paxton';
let jumpHeld           = false;
let zHeld              = false;
let gameLoopRunning    = false;

// ─────────────────────────────────────────────
//  CHARACTER SELECT
// ─────────────────────────────────────────────
function selectChar(ch) {
  selectedChar = ch;
  document.getElementById('select-screen').style.display = 'none';
  canvas.style.display = 'block';
  document.getElementById('ui').style.display         = 'block';
  document.getElementById('right-ui').style.display   = 'block';
  document.getElementById('bottom-ui').style.display  = 'block';
  initGame();
  if (!gameLoopRunning) { gameLoopRunning = true; loop(); }
}
window.selectChar = selectChar;

function goToSelect() {
  isGameOver = true;
  document.getElementById('gameover').style.display      = 'none';
  canvas.style.display                                   = 'none';
  document.getElementById('ui').style.display            = 'none';
  document.getElementById('right-ui').style.display      = 'none';
  document.getElementById('bottom-ui').style.display     = 'none';
  document.getElementById('shield-bar').style.display    = 'none';
  document.getElementById('select-screen').style.display = 'flex';
  gameLoopRunning = false;
}
window.goToSelect = goToSelect;

// ─────────────────────────────────────────────
//  INIT / RESTART
// ─────────────────────────────────────────────
function initGame() {
  score = 0; totalKills = 0; killsSinceCycle = 0; wave = 1;
  isNight = false; isGameOver = false;
  waveInProgress = false; waveClearTimer = 0;
  waveSpawnTarget = 0; waveSpawned = 0;
  powerupSpawnTimer = POWERUP_SPAWN_INTERVAL;
  coins = 0;
  upgrades = { health:0, healthRegen:0, damage:0, speed:0, jump:0, luck:1 };
  enhancedPowerups = { samurai:0, ninja:0, gunner:0, turtle:0, devil:0, angel:0 };
  powerupCosts = { samurai:20, ninja:20, gunner:20, turtle:20, devil:20, angel:20, god:godCost };
  shopOpen = false;
  godUnlocked = false;
  document.getElementById('shop-overlay').style.display = 'none';
  document.getElementById('coins-txt').textContent = 0;

  document.getElementById('gameover').style.display   = 'none';
  document.getElementById('ammo-txt').style.display   = 'none';
  document.getElementById('shield-bar').style.display = 'none';
  activeBoss = null;
  hideBossBar();

  const isRosie = selectedChar === 'rosie';
  const baseHp = selectedChar === 'paxton' ? 130 : 100;
  player = {
    x: 150, y: GROUND, w: 36, h: 54,
    vx: 0, vy: 0, onGround: false,
    hp: baseHp + (upgrades.health * 5), maxHp: baseHp + (upgrades.health * 5),
    mode: 'normal', modeTimer: 0, devilDrainTimer: 0,
    atkCd: 0, attacking: false, atkFrame: 0,
    facingRight: true, invincible: 0,
    animFrame: 0, animTimer: 0,
    throwCd: 0, gunFireCd: 0,
    shieldHp: 0,
    char: selectedChar,
    baseSpdBonus: isRosie ? 2 : 0,
    regenTimer: 60,
    activePowerup: null
  };

  zombies      = [];
  powerups     = [];
  particles    = [];
  bullets      = [];
  enemyBullets = [];

  updateUI();
  startWave();
}

function restartGame() { initGame(); if (!gameLoopRunning) { gameLoopRunning = true; loop(); } }
window.restartGame = restartGame;

// ─────────────────────────────────────────────
//  UI UPDATE
// ─────────────────────────────────────────────
function updateUI() {
  document.getElementById('hp-txt').textContent    = Math.max(0, Math.round(player.hp));
  document.getElementById('hp-max-txt').textContent = Math.max(0, Math.round(player.maxHp));
  document.getElementById('score-txt').textContent = score;
  document.getElementById('wave-txt').textContent  = wave;
  document.getElementById('dmg-txt').textContent   = wave;

  const m = MODES[player.mode];
  const modeEl = document.getElementById('mode-txt');
  modeEl.style.color  = m.color;
  modeEl.textContent  = 'MODE: ' + m.name;

  document.getElementById('ammo-txt').style.display   = player.mode === 'gunner' ? 'block' : 'none';
  const hasShield = player.shieldHp > 0;
  document.getElementById('shield-bar').style.display = hasShield ? 'block' : 'none';
  if (hasShield) document.getElementById('shield-txt').textContent = player.shieldHp;
}

// ─────────────────────────────────────────────
//  WAVE MANAGEMENT
// ─────────────────────────────────────────────
function startWave() {
  wavePending = false;
  waveInProgress = true;
  const isBossWave = wave % 10 === 0;
  const regularCount = 4 + wave;
  const bossCount = isBossWave ? 1 : 0;
  waveSpawnTarget = regularCount + bossCount;
  waveSpawned = 0;
  activeBoss = null;
  hideBossBar();
  showWaveNotify(isBossWave ? '💀 BOSS WAVE ' + wave + ' 💀' : '⚔️ WAVE ' + wave + ' ⚔️');
  updateUI();

  for (let i = 0; i < regularCount; i++) {
    setTimeout(() => {
      if (!isGameOver) {
        zombies.push(mkZombie());
        waveSpawned++;
      }
    }, i * 800);
  }

  if (isBossWave) {
    setTimeout(() => {
      if (!isGameOver) {
        const boss = mkBossZombie();
        zombies.push(boss);
        activeBoss = boss;
        updateBossHealthUI();
        waveSpawned++;
        showWaveNotify('🦴 BOSS ENTERS THE SCENE!');
      }
    }, regularCount * 800 + 700);
  }
}

function mkBossZombie() {
  const side = Math.random() > 0.5 ? 1 : -1;
  const x = side > 0 ? W + 90 : -120;
  const bossNumber = Math.max(1, Math.floor(wave / 10));
  const bossHp = 300 + (bossNumber - 1) * 100;
  return {
    x, y: GROUND,
    w: 72, h: 110,
    hp: bossHp,
    maxHp: bossHp,
    spd: 1,
    pts: 650 + bossNumber * 120,
    type: 'boss',
    animFrame: 0, animTimer: 0, atkCd: 0, dead: false,
    shootCd: 0,
    color: '#6f2e2b'
  };
}

function mkZombie() {
  const side = Math.random() > 0.5 ? 1 : -1;
  const x    = side > 0 ? W + 60 : -80;
  const strength = 1 + 0.25 * (wave - 1);
  const pool = wave < 3 ? ['walker'] : wave < 5 ? ['walker','runner'] : ['walker','runner','big'];
  const type = wave >= 3 && Math.random() < 0.25 ? 'spitter' : pool[Math.floor(Math.random() * pool.length)];
  const base = {
    walker: { w:38, h:58, hp:80,  spd:1.8, pts:50  },
    runner: { w:34, h:54, hp:60,  spd:3.5, pts:75  },
    big:    { w:54, h:72, hp:150, spd:1.2, pts:150 },
    spitter:{ w:40, h:58, hp:70,  spd:1.3, pts:90  }
  }[type];
  return {
    x, y: GROUND,
    ...base,
    maxHp: base.hp * strength,
    hp: base.hp * strength,
    spd: base.spd * strength,
    pts: base.pts * strength,
    type,
    animFrame: 0, animTimer: 0, atkCd: 0, dead: false,
    shootCd: 0,
    color: type === 'big' ? '#5a7a3a' : type === 'runner' ? '#8fbc8f' : type === 'spitter' ? '#4a90e2' : '#7a9a6a'
  };
}

// ─────────────────────────────────────────────
//  PARTICLES / FLOAT TEXT
// ─────────────────────────────────────────────
function addParticle(x, y, color, n = 8) {
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 / n) * i + Math.random() * 0.5;
    particles.push({
      x, y,
      vx: Math.cos(a) * (2 + Math.random() * 3),
      vy: Math.sin(a) * (2 + Math.random() * 3) - 2,
      life: 1, color, size: 3 + Math.random() * 5
    });
  }
}

function addFloatText(x, y, text, color) {
  particles.push({ x, y, vx: 0, vy: -2, life: 1, color, text, isText: true });
}

// ─────────────────────────────────────────────
//  COMBAT
// ─────────────────────────────────────────────
function hitZombie(z, dmg) {
  if (z.dead) return;
  z.hp = Math.max(0, z.hp - dmg);
  addFloatText(z.x + z.w / 2, z.y - 20, '-' + Math.round(dmg), '#ffdd77');
  if (z.hp > 0) return;

  z.dead = true;
  score += z.pts;
  totalKills++;
  const coinReward = z.type === 'boss' ? 100 : z.type === 'big' ? 10 : z.type === 'spitter' ? 5 : 2;
  const baseReward = (player && player.char === 'rosie') ? coinReward * 2 : coinReward;
  const luckBonus = Math.max(0, (upgrades.luck || 1) - 1);
  const rewardWithLuck = baseReward + luckBonus;
  const multiplier = 2 ** Math.floor(wave / 30);
  const finalReward = rewardWithLuck * multiplier;
  coins += finalReward;
  addFloatText(z.x + z.w / 2, z.y - 35, '+' + finalReward + '🪙', '#f5d020');
  document.getElementById('coins-txt').textContent = coins;
  addParticle(z.x + z.w / 2, z.y + z.h / 2, z.color, 18);
  addFloatText(z.x, z.y - 20, '+' + z.pts, '#9fe1cb');
  document.getElementById('score-txt').textContent = score;
  if (z.type === 'boss') {
    activeBoss = null;
    hideBossBar();
  }
}

function fireGunBullet() {
  const dir = player.facingRight ? 1 : -1;
  bullets.push({
    x: player.x + (dir > 0 ? player.w + 4 : -8),
    y: player.y + player.h / 2 - 14,
    vx: dir * 18, vy: (Math.random() - 0.5) * 3,
    dmg: 15, color: '#ff8800', dead: false, isBullet: true
  });
  addParticle(player.x + (dir > 0 ? player.w + 10 : -10), player.y + player.h / 2 - 14, '#ffaa44', 3);
}

function fireNinjaStar() {
  const dir = player.facingRight ? 1 : -1;
  bullets.push({
    x: player.x + (dir > 0 ? player.w : 0),
    y: player.y + player.h / 2 - 15,
    vx: dir * 13, dmg: 30, color: '#cc88ff', dead: false, isStar: true
  });
}

// ─────────────────────────────────────────────
//  POWER-UP COLLECTION
// ─────────────────────────────────────────────
function collectPowerup(p) {
  const enhanceable = ['samurai','ninja','gunner','turtle'];
  if (enhanceable.includes(p.type) && enhancedPowerups[p.type] > 0) {
    const level = enhancedPowerups[p.type];
    const base = MODE_BASE[p.type];
    const powerScale = 1 + ((upgrades.damage || 0) * 1.5);
    MODES[p.type].atkDmg   = Math.round(base.atkDmg * level * powerScale);
    MODES[p.type].atkRange = Math.round(base.atkRange * level * powerScale);
    MODES[p.type].spd      = base.spd + (level - 1) * 1.5 + ((upgrades.speed || 0) * 0.25);
    MODES[p.type].name     = base.name + ' x' + level;
    MODES[p.type].color    = ENHANCED_MODES[p.type].color;
  }
  const def = POWERUP_DEFS[p.type];

  if (p.type === 'medkit') {
    // Devil blocks healing
    if (player.mode === 'devil') {
      addFloatText(player.x, player.y - 20, 'DEVIL BLOCKS HEAL!', '#ff4400');
      return;
    }
    const healed = Math.min(def.heal, player.maxHp - player.hp);
    player.hp    = Math.min(player.maxHp, player.hp + def.heal);
    addParticle(p.x, p.y, '#ff4466', 20);
    addFloatText(p.x, p.y - 20, '+' + Math.round(healed) + ' HP', '#ff88aa');
    updateUI();
    showFlash('❤️ HEALED!', '#ff4466');

  } else if (p.type === 'shield') {
    player.shieldHp = 100;
    addParticle(p.x, p.y, '#88ccff', 20);
    updateUI();
    showFlash('🛡️ SHIELD ACTIVE!', '#88ccff');

  } else if (p.type === 'devil') {
    player.mode      = 'devil';
    player.modeTimer = MODE_DURATION;
    player.shieldHp  = 0;
    player.devilDrainTimer = 0;
    updateUI();
    addParticle(p.x, p.y, def.color, 25);
    showFlash('😈 DEVIL MODE! LOSES 1 HP / SEC', '#ff2200');

  } else if (p.type === 'angel') {
    player.mode      = 'angel';
    player.modeTimer = MODE_DURATION;
    updateUI();
    addParticle(p.x, p.y, def.color, 25);
    showFlash('😇 ANGEL MODE! INVINCIBLE + REGEN!', '#ffffaa');

  } else {
    // samurai / ninja / turtle / gunner
    player.mode      = p.type;
    player.modeTimer = MODE_DURATION;
    updateUI();
    addParticle(p.x, p.y, def.color, 20);
    showFlash(def.icon + ' ' + def.label + ' MODE!', def.color);
  }
  if (godUnlocked && player) {
    player.mode = 'god';
    player.modeTimer = Infinity;
    player.activePowerup = 'god';
    updateUI();
  }
}

function spawnPowerup() {
  const types = ['medkit','shield'];
  const type  = types[Math.floor(Math.random() * types.length)];
  powerups.push({
    x: 150 + Math.random() * (W - 300),
    y: GROUND - 15,
    type, bob: Math.random() * Math.PI * 2, collected: false
  });
}

// ─────────────────────────────────────────────
//  NOTIFICATIONS
// ─────────────────────────────────────────────
function showFlash(msg, color) {
  const el = document.getElementById('powerup-flash');
  el.textContent = msg; el.style.color = color; el.style.display = 'block';
  clearTimeout(el._t); el._t = setTimeout(() => el.style.display = 'none', 2200);
}
function showNotify(msg, color) {
  const el = document.getElementById('kill-notify');
  el.textContent = msg; el.style.color = color; el.style.display = 'block';
  clearTimeout(el._t); el._t = setTimeout(() => el.style.display = 'none', 2500);
}
function showWaveNotify(msg) {
  const el = document.getElementById('wave-notify');
  el.textContent = msg; el.style.display = 'block';
  clearTimeout(el._t); el._t = setTimeout(() => el.style.display = 'none', 2000);
}
function updateBossHealthUI() {
  const panel = document.getElementById('boss-health-panel');
  const fill = document.getElementById('boss-health-fill');
  const value = document.getElementById('boss-health-value');
  const label = document.getElementById('boss-health-label');
  if (!activeBoss || activeBoss.dead) {
    panel.style.display = 'none';
    return;
  }
  panel.style.display = 'block';
  const pct = Math.max(0, activeBoss.hp / activeBoss.maxHp);
  fill.style.width = (pct * 100) + '%';
  value.textContent = Math.max(0, Math.round(activeBoss.hp)) + ' / ' + Math.round(activeBoss.maxHp);
  label.textContent = 'BOSS ZOMBIE • WAVE ' + wave;
}
function hideBossBar() {
  document.getElementById('boss-health-panel').style.display = 'none';
}
function triggerGameOver() {
  isGameOver    = true;
  gameLoopRunning = false;
  document.getElementById('gameover').style.display      = 'block';
  document.getElementById('final-score').textContent     = score;
}

// ─────────────────────────────────────────────
//  MAIN UPDATE LOOP
// ─────────────────────────────────────────────
function update() {
  if (isGameOver || shopOpen) return;
  const m   = MODES[player.mode];
  const spd = m.spd + (player.baseSpdBonus || 0) + (upgrades.speed * 0.5);

  // ── Purchased mode effects ──
  if (player.mode !== 'normal') {
    if (player.mode === 'devil') {
      if (player.devilDrainTimer <= 0) {
        player.hp -= 1;
        player.devilDrainTimer = 60;
      } else {
        player.devilDrainTimer--;
      }
      if (player.hp <= 0) { triggerGameOver(); return; }
      updateUI();
    }
    if (player.mode === 'angel' && player.hp < player.maxHp) {
      player.hp = Math.min(player.maxHp, player.hp + 0.15);
      updateUI();
    }
  }
  document.getElementById('timer-txt').textContent = '';

  if (player.mode !== 'devil' && player.hp < player.maxHp) {
    player.regenTimer--;
    if (player.regenTimer <= 0) {
      player.regenTimer = 60;
      const regenAmount = Math.max(1, upgrades.healthRegen + 1);
      if (regenAmount > 0) {
        player.hp = Math.min(player.maxHp, player.hp + regenAmount);
        updateUI();
      }
    }
  }

  // ── Power-up spawn timer ──
  powerupSpawnTimer--;
  if (powerupSpawnTimer <= 0) {
    powerupSpawnTimer = POWERUP_SPAWN_INTERVAL;
    spawnPowerup();
  }
  document.getElementById('powerup-timer-txt').textContent = 'Next drop: ' + Math.ceil(powerupSpawnTimer / 60) + 's';

  // ── Player movement ──
  const jumpKey = keys['Space'] || keys['ArrowUp'];
  if      (keys['ArrowLeft'])  { player.vx = -spd; player.facingRight = false; }
  else if (keys['ArrowRight']) { player.vx =  spd; player.facingRight = true;  }
  else    player.vx *= 0.7;

  if (jumpKey && player.onGround && !jumpHeld) {
    player.vy       = m.jump - (upgrades.jump * 0.5);
    player.onGround = false;
    addParticle(player.x + player.w / 2, GROUND + player.h, '#aaa', 5);
  }
  jumpHeld = jumpKey;

  player.vy += 0.7;
  player.x  += player.vx;
  player.y  += player.vy;
  if (player.y >= GROUND) { player.y = GROUND; player.vy = 0; player.onGround = true; }
  player.x = Math.max(20, Math.min(W - 56, player.x));

  // ── Attack cooldowns ──
  if (player.atkCd    > 0) player.atkCd--;
  if (player.throwCd  > 0) player.throwCd--;
  if (player.gunFireCd > 0) player.gunFireCd--;
  if (player.atkFrame > 0) { player.atkFrame--; } else { player.attacking = false; }
  if (player.invincible > 0) player.invincible--;

  // ── Attack input ──
  const zKey = keys['KeyZ'];
  if (player.mode === 'gunner') {
    if (zKey && player.gunFireCd <= 0) { fireGunBullet(); player.gunFireCd = 6; }
  } else {
    if (zKey && !zHeld && player.atkCd <= 0) {
      player.attacking = true;
      player.atkFrame  = 12;
      player.atkCd     = 25;
      if (player.mode === 'ninja' && player.throwCd <= 0) { fireNinjaStar(); player.throwCd = 40; }
    }
  }
  zHeld = zKey;

  // ── Melee hit detection ──
  if (player.attacking && player.atkFrame === 10) {
    const baseDmg = (player.mode === 'normal') ? (player.char === 'paxton' ? 15 : player.char === 'rosie' ? 10 : m.atkDmg) : m.atkDmg;
    const bonusDmg = baseDmg + (upgrades.damage * (player.mode === 'normal' ? 6 : 9));
    let atkDmg = bonusDmg;
    // Rosie 25% crit
    if (player.char === 'rosie' && Math.random() < 0.25) atkDmg *= 2;
    const ax = player.facingRight ? player.x + player.w : player.x - m.atkRange;
    zombies.forEach(z => {
      if (!z.dead
          && ax < z.x + z.w
          && ax + m.atkRange > z.x
          && player.y + player.h > z.y + 10
          && player.y < z.y + z.h) {
        hitZombie(z, atkDmg);
      }
    });
  }

  // ── Bullet movement & hit detection ──
  bullets.forEach(b => {
    b.x += b.vx;
    b.y += b.vy || 0;
    if (b.x < -50 || b.x > W + 50) { b.dead = true; return; }
    zombies.forEach(z => {
      if (z.dead || b.dead) return;
      if (b.x > z.x && b.x < z.x + z.w && Math.abs(b.y - (z.y + z.h / 2)) < 45) {
        hitZombie(z, b.dmg);
        if (!b.pierce) b.dead = true;
        addParticle(z.x + z.w / 2, z.y + z.h / 2, b.color || '#ff8800', 6);
      }
    });
  });
  bullets = bullets.filter(b => !b.dead);

  // ── Enemy bullets / spitters ──
  const invincModes = ['angel', 'devil', 'god'];
  enemyBullets.forEach(b => {
    b.x += b.vx;
    b.y += b.vy;
    if (b.x < -50 || b.x > W + 50 || b.y < -50 || b.y > H + 50) { b.dead = true; return; }
    if (b.x > player.x && b.x < player.x + player.w && b.y > player.y && b.y < player.y + player.h) {
      if (!invincModes.includes(player.mode) && player.invincible <= 0) {
        if (player.shieldHp > 0) {
          player.shieldHp = Math.max(0, player.shieldHp - b.dmg);
          addFloatText(player.x, player.y - 10, '🛡️ -' + b.dmg, '#88ccff');
          if (player.shieldHp === 0) addFloatText(player.x, player.y - 30, 'SHIELD BROKE!', '#ff8800');
          updateUI();
        } else {
          player.hp -= b.dmg;
          player.invincible = 60;
          addFloatText(player.x, player.y - 10, '-' + b.dmg, '#e24b4a');
          updateUI();
          if (player.hp <= 0) { triggerGameOver(); return; }
        }
      }
      b.dead = true;
      addParticle(b.x, b.y, b.color || '#5cb3ff', 6);
    }
  });
  enemyBullets = enemyBullets.filter(b => !b.dead);

  // ── Zombie AI & damage to player ──
  zombies.forEach(z => {
    if (z.dead) return;
    z.animTimer++;
    if (z.animTimer > 15) { z.animTimer = 0; z.animFrame = (z.animFrame + 1) % 2; }

    const dx = (player.x + player.w/2) - (z.x + z.w/2);
    const dist = Math.abs(dx);
    const stopDist = (z.w / 2) + (player.w / 2) + 8;
    if (dist > stopDist) {
      z.x += dx > 0 ? z.spd : -z.spd;
    } else {
      // Keep zombies a fixed distance from the player to avoid overlap
      if (dx > 0) {
        z.x = (player.x + player.w/2) - stopDist - z.w/2;
      } else {
        z.x = (player.x + player.w/2) + stopDist - z.w/2;
      }
    }

    if (z.atkCd > 0) z.atkCd--;
    if (z.type === 'spitter') {
      z.shootCd = Math.max(0, z.shootCd - 1);
      if (Math.abs(dx) < 280 && z.shootCd <= 0) {
        const dy = (player.y + player.h / 2) - (z.y + z.h / 2);
        const len = Math.hypot(dx, dy) || 1;
        enemyBullets.push({
          x: z.x + z.w / 2,
          y: z.y + z.h / 2 - 6,
          vx: (dx / len) * 6,
          vy: (dy / len) * 6,
          dmg: 2,
          color: '#5cb3ff',
          dead: false,
          isEnemyBullet: true
        });
        z.shootCd = 120;
      }
    }

    if (Math.abs(dx) < 55 && z.atkCd <= 0) {
      player.vx = dx > 0 ? -5 : 5;
      player.vy = -3;
      player.onGround = false;
      z.atkCd = 90;
      if (!invincModes.includes(player.mode) && player.invincible <= 0) {
        let dmg = Math.max(1, Math.ceil(wave + (wave - 1) * 0.5));
        if (player.mode === 'turtle') dmg = Math.max(1, Math.ceil(dmg * 0.4));

        if (player.shieldHp > 0) {
          player.shieldHp = Math.max(0, player.shieldHp - dmg);
          addFloatText(player.x, player.y - 10, '🛡️ -' + dmg, '#88ccff');
          if (player.shieldHp === 0) addFloatText(player.x, player.y - 30, 'SHIELD BROKE!', '#ff8800');
          updateUI();
        } else {
          player.hp -= dmg;
          player.invincible = 60;
          addFloatText(player.x, player.y - 10, '-' + dmg, '#e24b4a');
          updateUI();
          if (player.hp <= 0) { triggerGameOver(); return; }
        }
      }
    }
  });

  // ── Power-up pickup ──
  powerups.forEach(p => {
    p.bob += 0.05;
    if (!p.collected
        && Math.abs(player.x - p.x) < 55
        && Math.abs(player.y - p.y) < 55) {
      p.collected = true;
      collectPowerup(p);
    }
  });
  powerups = powerups.filter(p => !p.collected);

  // ── Particles ──
  particles.forEach(p => {
    if (p.isText) { p.y += p.vy; }
    else { p.x += p.vx; p.y += p.vy; p.vy += 0.12; }
    p.life -= 0.025;
  });
  particles = particles.filter(p => p.life > 0);

  // ── Player animation ──
  player.animTimer++;
  if (player.animTimer > 10) { player.animTimer = 0; player.animFrame = (player.animFrame + 1) % 4; }

  if (activeBoss && activeBoss.dead) {
    activeBoss = null;
    hideBossBar();
  } else if (activeBoss) {
    updateBossHealthUI();
  }

  // ── Wave end check ──
  const alive = zombies.filter(z => !z.dead);
  if (waveInProgress && waveSpawned >= waveSpawnTarget && alive.length === 0) {
    waveInProgress = false;
    if (!wavePending) {
      wavePending = true;
      if (player && player.mode !== 'god') {
        player.mode = 'normal';
        player.modeTimer = 0;
        player.activePowerup = null;
        updateUI();
      }
      openShop();
      showNotify('🛒 SHOP OPEN! CHOOSE YOUR UPGRADE', '#ffd700');
    }
  }
}

// ─────────────────────────────────────────────
//  DRAW: BACKGROUND
// ─────────────────────────────────────────────
function drawBG() {
  const skyTop = isNight ? '#040611' : '#4ea8de';
  const skyBottom = isNight ? '#101427' : '#9fd9ff';
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, skyTop);
  grad.addColorStop(1, skyBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  if (isNight) {
    ctx.fillStyle = '#e8e0c0'; ctx.beginPath(); ctx.arc(W - 120, 75, 44, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#050510'; ctx.beginPath(); ctx.arc(W - 100, 60, 38, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    [[50,30],[120,50],[200,20],[350,45],[500,15],[600,60],[700,35],[800,55],[900,25],[1000,40],[150,80],[450,70],[750,85],[300,30],[650,20]].forEach(([sx, sy]) => ctx.fillRect(sx, sy, 2, 2));
  } else {
    ctx.fillStyle = '#fffaaa'; ctx.beginPath(); ctx.arc(100, 80, 50, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    [[200,60,80,28],[450,40,100,32],[700,70,90,25]].forEach(([cx, cy, cw, ch]) => {
      ctx.beginPath(); ctx.ellipse(cx, cy, cw, ch, 0, 0, Math.PI * 2); ctx.fill();
    });
  }

  ctx.fillStyle = isNight ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.12)';
  for (let i = 0; i < 8; i++) {
    const y = 120 + i * 70 + Math.sin(i) * 10;
    ctx.beginPath(); ctx.moveTo(-20, y);
    ctx.quadraticCurveTo(W * 0.25, y - 40, W * 0.5, y);
    ctx.quadraticCurveTo(W * 0.75, y + 40, W + 20, y - 10);
    ctx.lineTo(W + 20, H);
    ctx.lineTo(-20, H);
    ctx.closePath(); ctx.fill();
  }

  const bc = isNight ? '#0b1018' : '#1b2a3f';
  const roof = isNight ? '#111827' : '#273447';
  const accent = isNight ? '#182331' : '#3d526b';

  const drawBuilding = (bx, bw, bh) => {
    const by = GROUND + 58 - bh;
    ctx.fillStyle = bc;
    ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = roof;
    ctx.fillRect(bx - 8, by - 12, bw + 16, 14);
    ctx.fillStyle = accent;
    ctx.fillRect(bx + 8, by + 10, bw - 16, 8);
    ctx.fillRect(bx + 10, by + 28, bw - 20, 6);
    ctx.fillRect(bx + 10, by + 46, bw - 20, 6);
    ctx.fillStyle = isNight ? 'rgba(255,220,140,0.16)' : 'rgba(255,255,255,0.12)';
    for (let wy = by + 18; wy < by + bh - 12; wy += 24) {
      for (let wx = bx + 10; wx < bx + bw - 10; wx += 22) {
        ctx.fillRect(wx, wy, 8, 12);
      }
    }
    ctx.fillStyle = isNight ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.08)';
    ctx.fillRect(bx + 8, by + bh - 8, bw - 16, 8);
  };

  [[0,100,180],[110,80,140],[200,120,220],[330,90,170],[430,110,240],[550,100,180],[660,130,210],[800,80,140],[890,120,240],[1020,100,180],[1150,90,160]].forEach(([bx, bw, bh]) => drawBuilding(bx, bw, bh));

  ctx.fillStyle = isNight ? '#0f0f0a' : '#2f4f1f';
  ctx.fillRect(0, GROUND + 54, W, H);
  ctx.fillStyle = isNight ? '#1f1f16' : '#4b6d29';
  ctx.fillRect(0, GROUND + 48, W, 10);
  ctx.fillStyle = isNight ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.12)';
  for (let i = 0; i < 14; i++) {
    const x = (i * 110) % (W + 80) - 40;
    const y = GROUND + 24 + (i % 3) * 8;
    ctx.fillRect(x, y, 40, 6);
  }
}

// ─────────────────────────────────────────────
//  DRAW: PLAYER
// ─────────────────────────────────────────────
function drawPlayer() {
  const p = player;
  // Flash when hit (but not during angel/devil invincibility)
  if (p.invincible > 0 && Math.floor(p.invincible / 5) % 2 === 0
      && p.mode !== 'angel' && p.mode !== 'devil') return;

  const px     = Math.round(p.x);
  const py     = Math.round(p.y);
  const legBob = p.onGround ? Math.sin(p.animFrame * Math.PI / 2) * 4 : 0;

  // Angel glow
  if (p.mode === 'angel') {
    const ag = ctx.createRadialGradient(px+18, py+27, 10, px+18, py+27, 60);
    ag.addColorStop(0, 'rgba(255,255,180,0.35)'); ag.addColorStop(1, 'rgba(255,255,180,0)');
    ctx.fillStyle = ag; ctx.beginPath(); ctx.arc(px+18, py+27, 60, 0, Math.PI*2); ctx.fill();
  }
  // Devil aura
  if (p.mode === 'devil') {
    const dg = ctx.createRadialGradient(px+18, py+27, 10, px+18, py+27, 55);
    dg.addColorStop(0, 'rgba(255,30,0,0.3)'); dg.addColorStop(1, 'rgba(255,30,0,0)');
    ctx.fillStyle = dg; ctx.beginPath(); ctx.arc(px+18, py+27, 55, 0, Math.PI*2); ctx.fill();
  }

  ctx.save();
  if (!p.facingRight) { ctx.translate(px*2 + p.w, 0); ctx.scale(-1, 1); }

  if (p.char === 'rosie') drawRosie(px, py, p, legBob);
  else                    drawPaxton(px, py, p, legBob);

  ctx.restore();

  // Shield bubble
  if (p.shieldHp > 0) {
    const frac = p.shieldHp / 100;
    ctx.save();
    ctx.globalAlpha  = 0.25 + frac * 0.3;
    ctx.strokeStyle  = '#88ccff'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(p.x + p.w/2, p.y + p.h/2, 36, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = 'rgba(100,180,255,0.08)';
    ctx.beginPath(); ctx.arc(p.x + p.w/2, p.y + p.h/2, 36, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1; ctx.restore();
  }

  // Angel halo
  if (p.mode === 'angel') {
    ctx.save(); ctx.strokeStyle = '#ffffaa'; ctx.lineWidth = 3; ctx.globalAlpha = 0.85;
    ctx.beginPath(); ctx.ellipse(p.x + p.w/2, p.y - 6, 16, 5, Math.sin(Date.now()/600)*0.2, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1; ctx.restore();
  }

  // Devil horns
  if (p.mode === 'devil') {
    ctx.save(); ctx.fillStyle = '#cc0000';
    const hornOffset = p.facingRight ? 0 : 0;
    const h1x = p.x + 8, h2x = p.x + 28;
    [h1x, h2x].forEach(hx => {
      ctx.beginPath(); ctx.moveTo(hx, p.y+4); ctx.lineTo(hx-5, p.y-12); ctx.lineTo(hx+5, p.y-12); ctx.closePath(); ctx.fill();
    });
    ctx.restore();
  }

  // HP bar
  const barW = 50, barH = 5, barX = p.x - 7, barY = p.y - 14;
  ctx.fillStyle = '#333'; ctx.fillRect(barX, barY, barW, barH);
  ctx.fillStyle = p.hp > 50 ? '#2ecc71' : p.hp > 25 ? '#f1c40f' : '#e74c3c';
  ctx.fillRect(barX, barY, barW * (p.hp / p.maxHp), barH);
}

// ─────────────────────────────────────────────
//  DRAW: PAXTON SPRITES
// ─────────────────────────────────────────────
function drawPaxton(px, py, p, legBob) {
  const mode = p.mode;
  const hairColor = '#ff69b4';

  if (mode === 'samurai') {
    // Red armor
    ctx.fillStyle = '#8b0000'; ctx.fillRect(px+5, py+20, 26, 28);
    ctx.fillStyle = '#4a0000'; ctx.fillRect(px+4, py+18, 28, 8); ctx.fillRect(px+4, py+40, 28, 8);
    // Head + hair
    ctx.fillStyle = '#d4956a'; ctx.beginPath(); ctx.arc(px+18, py+12, 13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = hairColor; ctx.fillRect(px+5, py+2, 26, 10); ctx.beginPath(); ctx.arc(px+18, py+5, 13, Math.PI, 0); ctx.fill();
    // Helmet
    ctx.fillStyle = '#2c2c2c'; ctx.fillRect(px+4, py-2, 28, 6); ctx.fillRect(px+8, py-8, 20, 8);
    // Brown eyes
    ctx.fillStyle = '#4a2800'; ctx.fillRect(px+11, py+10, 4, 4); ctx.fillRect(px+21, py+10, 4, 4);
    // Sword
    const sa = p.attacking ? -0.8 : 0.3;
    ctx.save(); ctx.translate(px+32, py+24); ctx.rotate(sa);
    ctx.fillStyle = '#c0c0c0'; ctx.fillRect(0, -2, 52, 4);
    ctx.fillStyle = '#ffd700'; ctx.fillRect(-5, -5, 8, 10);
    ctx.restore();
    ctx.fillStyle = '#5c1a1a'; ctx.fillRect(px+5, py+44, 10, 14+legBob); ctx.fillRect(px+20, py+44, 10, 14-legBob);

  } else if (mode === 'ninja') {
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(px+4, py+18, 28, 30);
    ctx.fillStyle = '#d4956a'; ctx.beginPath(); ctx.arc(px+18, py+12, 13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(px+6, py+12, 24, 8); ctx.fillRect(px+5, py, 26, 10);
    ctx.beginPath(); ctx.arc(px+18, py+5, 13, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#8844cc'; ctx.fillRect(px+11, py+9, 5, 3); ctx.fillRect(px+20, py+9, 5, 3);
    // Spinning shuriken
    ctx.fillStyle = '#888'; ctx.save(); ctx.translate(px+34, py+26); ctx.rotate(Date.now()/180);
    for (let i=0; i<4; i++) { ctx.rotate(Math.PI/2); ctx.fillRect(-2,-7,4,14); }
    ctx.restore();
    ctx.fillStyle = '#111'; ctx.fillRect(px+5, py+44, 10, 14+legBob); ctx.fillRect(px+20, py+44, 10, 14-legBob);

  } else if (mode === 'turtle') {
    ctx.fillStyle = '#2d8a4e'; ctx.beginPath(); ctx.ellipse(px+18, py+30, 20, 18, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#1a5c33';
    ctx.beginPath(); ctx.moveTo(px+18,py+14); ctx.lineTo(px+35,py+30); ctx.lineTo(px+18,py+46); ctx.lineTo(px+1,py+30); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#4caf50'; ctx.fillRect(px+6, py+20, 24, 22);
    ctx.fillStyle = '#4caf50'; ctx.beginPath(); ctx.arc(px+18, py+12, 14, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = hairColor; ctx.fillRect(px+5, py, 26, 8); ctx.beginPath(); ctx.arc(px+18, py+4, 13, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#4a2800'; ctx.fillRect(px+10, py+10, 5, 5); ctx.fillRect(px+21, py+10, 5, 5);
    ctx.strokeStyle = '#1a5c33'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(px+18, py+30, 10, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = '#2d8a4e'; ctx.fillRect(px+4, py+48, 12, 10+legBob); ctx.fillRect(px+20, py+48, 12, 10-legBob);

  } else if (mode === 'gunner') {
    ctx.fillStyle = '#556'; ctx.fillRect(px+4, py+18, 28, 30);
    ctx.fillStyle = '#334'; ctx.fillRect(px+4, py+18, 28, 10); ctx.fillRect(px+4, py-4, 28, 8);
    ctx.fillStyle = '#d4956a'; ctx.beginPath(); ctx.arc(px+18, py+12, 13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = hairColor; ctx.fillRect(px+5, py+2, 26, 10); ctx.beginPath(); ctx.arc(px+18, py+5, 13, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#4a2800'; ctx.fillRect(px+10, py+9, 5, 5); ctx.fillRect(px+20, py+9, 5, 5);
    // Machine gun
    ctx.fillStyle = '#ff8800'; ctx.fillRect(px+30, py+26, 28, 8); ctx.fillRect(px+54, py+23, 8, 4); ctx.fillRect(px+54, py+31, 8, 4);
    ctx.fillStyle = '#444'; ctx.fillRect(px+32, py+24, 20, 4); ctx.fillRect(px+32, py+34, 20, 4);
    if (keys['KeyZ']) { ctx.fillStyle='#ffdd44'; ctx.beginPath(); ctx.arc(px+64, py+30, 5, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = '#556'; ctx.fillRect(px+5, py+44, 10, 14+legBob); ctx.fillRect(px+20, py+44, 10, 14-legBob);

  } else if (mode === 'devil') {
    ctx.fillStyle = '#880000'; ctx.fillRect(px+5, py+20, 26, 28);
    ctx.fillStyle = '#d4956a'; ctx.beginPath(); ctx.arc(px+18, py+12, 13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = hairColor; ctx.fillRect(px+5, py+2, 26, 10); ctx.beginPath(); ctx.arc(px+18, py+5, 13, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#ff0000'; ctx.fillRect(px+11, py+10, 4, 4); ctx.fillRect(px+21, py+10, 4, 4);
    ctx.fillStyle = '#550000'; ctx.fillRect(px+5, py+44, 10, 14+legBob); ctx.fillRect(px+20, py+44, 10, 14-legBob);
    ctx.strokeStyle = '#cc0000'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(px+8, py+44); ctx.quadraticCurveTo(px-10, py+60, px-4, py+70); ctx.stroke();

  } else if (mode === 'angel') {
    ctx.fillStyle = '#eef0ff'; ctx.fillRect(px+5, py+20, 26, 28);
    ctx.fillStyle = '#d4d8ff'; ctx.fillRect(px+5, py+38, 26, 12);
    ctx.fillStyle = '#d4956a'; ctx.fillRect(px-2, py+22, 8, 18); ctx.fillRect(px+30, py+22, 8, 18);
    ctx.beginPath(); ctx.arc(px+18, py+12, 13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#5c3317'; ctx.fillRect(px+5, py+1, 26, 10); ctx.beginPath(); ctx.arc(px+18, py+5, 13, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#4a2800'; ctx.fillRect(px+11, py+10, 4, 5); ctx.fillRect(px+21, py+10, 4, 5);
    // Wings
    ctx.fillStyle = 'rgba(220,230,255,0.7)';
    ctx.beginPath(); ctx.ellipse(px-8, py+28, 18, 12, -0.4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(px+44, py+28, 18, 12,  0.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.ellipse(px-5, py+24, 10, 7, -0.4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(px+41, py+24, 10, 7,  0.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#cc2200'; ctx.fillRect(px+3, py+48, 13, 8+legBob); ctx.fillRect(px+19, py+48, 13, 8-legBob);

  } else {
    // Normal Paxton
    ctx.fillStyle = '#2255bb'; ctx.fillRect(px+5, py+20, 26, 26);
    ctx.fillStyle = '#3a5a8a'; ctx.fillRect(px+5, py+38, 26, 12);
    ctx.fillStyle = '#d4956a'; ctx.fillRect(px-2, py+22, 8, 18); ctx.fillRect(px+30, py+22, 8, 18);
    ctx.beginPath(); ctx.arc(px+18, py+12, 13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#5c3317'; ctx.fillRect(px+5, py+1, 26, 10); ctx.beginPath(); ctx.arc(px+18, py+5, 13, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#4a2800'; ctx.fillRect(px+11, py+10, 4, 5); ctx.fillRect(px+21, py+10, 4, 5);
    ctx.fillStyle = '#8b5e3c'; ctx.fillRect(px+12, py+11, 2, 3); ctx.fillRect(px+22, py+11, 2, 3);
    if (p.attacking) { ctx.fillStyle='#d4956a'; ctx.beginPath(); ctx.arc(px+46, py+25, 8, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = '#cc2200'; ctx.fillRect(px+3, py+48, 13, 8+legBob); ctx.fillRect(px+19, py+48, 13, 8-legBob);
  }
}

// ─────────────────────────────────────────────
//  DRAW: ROSIE SPRITES
// ─────────────────────────────────────────────
function drawRosie(px, py, p, legBob) {
  const mode = p.mode;
  const headColor = '#f4b08a';
  const hairColor = '#ff69b4';

  if (mode === 'samurai') {
    ctx.fillStyle = '#8b0000'; ctx.fillRect(px+5, py+20, 26, 28);
    ctx.fillStyle = '#4a0000'; ctx.fillRect(px+4, py+18, 28, 8); ctx.fillRect(px+4, py+40, 28, 8);
    ctx.fillStyle = headColor; ctx.beginPath(); ctx.arc(px+18, py+12, 13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = hairColor; ctx.fillRect(px+5, py+2, 26, 10); ctx.beginPath(); ctx.arc(px+18, py+5, 13, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#2c2c2c'; ctx.fillRect(px+4, py-2, 28, 6); ctx.fillRect(px+8, py-8, 20, 8);
    ctx.fillStyle = '#1a90ff'; ctx.fillRect(px+11, py+10, 4, 4); ctx.fillRect(px+21, py+10, 4, 4);
    const sa = p.attacking ? -0.8 : 0.3;
    ctx.save(); ctx.translate(px+32, py+24); ctx.rotate(sa);
    ctx.fillStyle = '#c0c0c0'; ctx.fillRect(0,-2,52,4); ctx.fillStyle='#ffd700'; ctx.fillRect(-5,-5,8,10);
    ctx.restore();
    ctx.fillStyle = '#5c1a1a'; ctx.fillRect(px+5, py+44, 10, 14+legBob); ctx.fillRect(px+20, py+44, 10, 14-legBob);

  } else if (mode === 'ninja') {
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(px+4, py+18, 28, 30);
    ctx.fillStyle = headColor; ctx.beginPath(); ctx.arc(px+18, py+12, 13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(px+6, py+12, 24, 8); ctx.fillRect(px+5, py, 26, 10);
    ctx.beginPath(); ctx.arc(px+18, py+5, 13, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#8844cc'; ctx.fillRect(px+11, py+9, 5, 3); ctx.fillRect(px+20, py+9, 5, 3);
    ctx.fillStyle = '#888'; ctx.save(); ctx.translate(px+34, py+26); ctx.rotate(Date.now()/180);
    for (let i=0; i<4; i++) { ctx.rotate(Math.PI/2); ctx.fillRect(-2,-7,4,14); }
    ctx.restore();
    ctx.fillStyle = '#111'; ctx.fillRect(px+5, py+44, 10, 14+legBob); ctx.fillRect(px+20, py+44, 10, 14-legBob);

  } else if (mode === 'turtle') {
    ctx.fillStyle = '#2d8a4e'; ctx.beginPath(); ctx.ellipse(px+18, py+30, 20, 18, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#1a5c33';
    ctx.beginPath(); ctx.moveTo(px+18,py+14); ctx.lineTo(px+35,py+30); ctx.lineTo(px+18,py+46); ctx.lineTo(px+1,py+30); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#4caf50'; ctx.fillRect(px+6, py+20, 24, 22);
    ctx.fillStyle = '#4caf50'; ctx.beginPath(); ctx.arc(px+18, py+12, 14, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = hairColor; ctx.fillRect(px+5, py, 26, 8); ctx.beginPath(); ctx.arc(px+18, py+4, 13, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#1a90ff'; ctx.fillRect(px+10, py+10, 5, 5); ctx.fillRect(px+21, py+10, 5, 5);
    ctx.strokeStyle = '#1a5c33'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(px+18, py+30, 10, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = '#2d8a4e'; ctx.fillRect(px+4, py+48, 12, 10+legBob); ctx.fillRect(px+20, py+48, 12, 10-legBob);

  } else if (mode === 'gunner') {
    ctx.fillStyle = '#556'; ctx.fillRect(px+4, py+18, 28, 30);
    ctx.fillStyle = headColor; ctx.beginPath(); ctx.arc(px+18, py+12, 13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = hairColor; ctx.fillRect(px+5, py+2, 26, 10); ctx.fillRect(px+5, py+8, 6, 12);
    ctx.beginPath(); ctx.arc(px+18, py+5, 13, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#1a90ff'; ctx.fillRect(px+11, py+10, 4, 4); ctx.fillRect(px+21, py+10, 4, 4);
    ctx.fillStyle = '#ff8800'; ctx.fillRect(px+30, py+26, 28, 8); ctx.fillRect(px+54, py+23, 8, 4); ctx.fillRect(px+54, py+31, 8, 4);
    if (keys['KeyZ']) { ctx.fillStyle='#ffdd44'; ctx.beginPath(); ctx.arc(px+64, py+30, 5, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = '#553311'; ctx.fillRect(px+5, py+44, 10, 14+legBob); ctx.fillRect(px+20, py+44, 10, 14-legBob);

  } else if (mode === 'devil') {
    ctx.fillStyle = '#880000'; ctx.fillRect(px+5, py+20, 26, 28);
    ctx.fillStyle = headColor; ctx.beginPath(); ctx.arc(px+18, py+12, 13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = hairColor; ctx.fillRect(px+5, py+2, 26, 10); ctx.beginPath(); ctx.arc(px+18, py+5, 13, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#ff0000'; ctx.fillRect(px+11, py+10, 4, 4); ctx.fillRect(px+21, py+10, 4, 4);
    ctx.fillStyle = '#550000'; ctx.fillRect(px+5, py+44, 10, 14+legBob); ctx.fillRect(px+20, py+44, 10, 14-legBob);
    ctx.strokeStyle = '#cc0000'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(px+8, py+44); ctx.quadraticCurveTo(px-10, py+60, px-4, py+70); ctx.stroke();

  } else if (mode === 'angel') {
    ctx.fillStyle = '#eef0ff'; ctx.fillRect(px+5, py+20, 26, 28);
    ctx.fillStyle = headColor; ctx.beginPath(); ctx.arc(px+18, py+12, 13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = hairColor; ctx.fillRect(px+5, py+2, 26, 10); ctx.fillRect(px+5, py+8, 6, 12);
    ctx.beginPath(); ctx.arc(px+18, py+5, 13, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#1a7a3a'; ctx.fillRect(px+11, py+10, 4, 4); ctx.fillRect(px+21, py+10, 4, 4);
    ctx.fillStyle = 'rgba(220,230,255,0.7)';
    ctx.beginPath(); ctx.ellipse(px-8, py+28, 18, 12, -0.4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(px+44, py+28, 18, 12,  0.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#553311'; ctx.fillRect(px+3, py+48, 13, 10+legBob); ctx.fillRect(px+19, py+48, 13, 10-legBob);

  } else {
    // Normal Rosie
    ctx.fillStyle = '#cc2255'; ctx.fillRect(px+5, py+20, 26, 22);
    ctx.fillStyle = '#aa1144';
    ctx.beginPath(); ctx.moveTo(px+3,py+40); ctx.lineTo(px-2,py+56); ctx.lineTo(px+38,py+56); ctx.lineTo(px+33,py+40); ctx.closePath(); ctx.fill();
    ctx.fillStyle = headColor; ctx.fillRect(px-2, py+22, 8, 18); ctx.fillRect(px+30, py+22, 8, 18);
    // Head
    ctx.beginPath(); ctx.arc(px+18, py+12, 13, 0, Math.PI*2); ctx.fill();
    // Ponytail
    ctx.fillStyle = hairColor;
    ctx.beginPath(); ctx.moveTo(px+26,py+6); ctx.quadraticCurveTo(px+42,py-2,px+40,py+22); ctx.quadraticCurveTo(px+32,py+18,px+28,py+14); ctx.closePath(); ctx.fill();
    ctx.fillRect(px+5, py+2, 26, 10); ctx.fillRect(px+5, py+8, 6, 12);
    ctx.beginPath(); ctx.arc(px+18, py+5, 13, Math.PI, 0); ctx.fill();
    // Green eyes
    ctx.fillStyle = '#1a90ff'; ctx.beginPath(); ctx.arc(px+13, py+13, 3.5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(px+23, py+13, 3.5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px+14, py+12, 1.2, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(px+24, py+12, 1.2, 0, Math.PI*2); ctx.fill();
    if (p.attacking) { ctx.fillStyle=headColor; ctx.beginPath(); ctx.arc(px+46, py+25, 7, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = '#553311'; ctx.fillRect(px+3, py+54, 13, 10+legBob); ctx.fillRect(px+19, py+54, 13, 10-legBob);
  }
}

// ─────────────────────────────────────────────
//  DRAW: ZOMBIES
// ─────────────────────────────────────────────
function drawZombie(z) {
  if (z.dead) return;
  const zx = Math.round(z.x), zy = Math.round(z.y), bob = z.animFrame === 0 ? 0 : 3;

  if (z.type === 'boss') {
    ctx.save();
    ctx.translate(zx + z.w / 2, zy + z.h / 2);
    ctx.fillStyle = '#4d1f1f';
    ctx.fillRect(-z.w / 2 + 8, -z.h / 2 + 22, z.w - 16, z.h - 28);
    ctx.fillStyle = '#7a2f2f';
    ctx.fillRect(-z.w / 2 + 12, -z.h / 2 + 18, z.w - 24, 20);
    ctx.fillStyle = '#2a1515';
    ctx.fillRect(-z.w / 2 + 16, -z.h / 2 + 40, z.w - 32, z.h - 64);
    ctx.fillStyle = '#ff5d3a';
    ctx.fillRect(-z.w / 2 + 16, -z.h / 2 + 12, 10, 12);
    ctx.fillRect(z.w / 2 - 26, -z.h / 2 + 12, 10, 12);
    ctx.fillStyle = '#d9d9d9';
    ctx.fillRect(-z.w / 2 + 20, -z.h / 2 + 8, 10, 10);
    ctx.fillRect(z.w / 2 - 30, -z.h / 2 + 8, 10, 10);
    ctx.fillStyle = '#111';
    ctx.fillRect(-z.w / 2 + 18, -z.h / 2 + 44, 12, 22);
    ctx.fillRect(z.w / 2 - 30, -z.h / 2 + 44, 12, 22);
    ctx.restore();
    ctx.fillStyle = '#333'; ctx.fillRect(zx, zy - 16, z.w, 8);
    ctx.fillStyle = '#e24b4a'; ctx.fillRect(zx, zy - 16, z.w * (z.hp / z.maxHp), 8);
    return;
  }

  if (z.type === 'spitter') {
    ctx.fillStyle = '#3f5fe0'; ctx.fillRect(zx+5, zy+20, z.w-10, z.h-25);
    ctx.fillStyle = '#6db9ff'; ctx.fillRect(zx+7, zy+8, z.w-14, 10);
    ctx.fillStyle = '#dbeeff'; ctx.fillRect(zx+z.w/2-5, zy+12, 10, 6);
    ctx.fillStyle = '#4a3a2a'; ctx.fillRect(zx+8, zy+2, 6, 8); ctx.fillRect(zx+z.w-14, zy, 8, 6);
    ctx.fillStyle = '#333'; ctx.fillRect(zx, zy-10, z.w, 5);
    ctx.fillStyle = '#e24b4a'; ctx.fillRect(zx, zy-10, z.w*(z.hp/z.maxHp), 5);
    return;
  }

  ctx.fillStyle = z.color; ctx.fillRect(zx+5, zy+20, z.w-10, z.h-25);
  ctx.fillStyle = '#8fbc6a'; ctx.beginPath(); ctx.arc(zx+z.w/2, zy+12, z.type==='big'?17:13, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#4a3a2a';
  if (z.type !== 'big') { ctx.fillRect(zx+7, zy+2, 6, 8); ctx.fillRect(zx+20, zy, 8, 6); }
  ctx.fillStyle = '#cc0000'; ctx.fillRect(zx+z.w/2-9, zy+9, 5, 5); ctx.fillRect(zx+z.w/2+4, zy+9, 5, 5);
  ctx.fillStyle = '#ff4444'; ctx.fillRect(zx+z.w/2-8, zy+10, 3, 3); ctx.fillRect(zx+z.w/2+5, zy+10, 3, 3);
  const arm = z.animFrame === 0 ? -5 : 0;
  ctx.fillStyle = '#8fbc6a'; ctx.fillRect(zx-12, zy+20+arm, 16, 8); ctx.fillRect(zx+z.w-4, zy+20+arm, 16, 8);
  ctx.fillStyle = '#5a7a3a';
  ctx.fillRect(zx+5,      zy+z.h-18, (z.w-10)/2-1, 18+bob);
  ctx.fillRect(zx+z.w/2+1, zy+z.h-18, (z.w-10)/2-1, 18-bob);
  ctx.fillStyle = '#333'; ctx.fillRect(zx, zy-10, z.w, 5);
  ctx.fillStyle = '#e24b4a'; ctx.fillRect(zx, zy-10, z.w*(z.hp/z.maxHp), 5);
}

// ─────────────────────────────────────────────
//  DRAW: POWER-UPS
// ─────────────────────────────────────────────
function drawPowerup(p) {
  if (p.collected) return;
  const def  = POWERUP_DEFS[p.type];
  const bobY = Math.sin(p.bob) * 9;
  const py   = p.y - 38 + bobY;
  // Glow
  ctx.fillStyle = def.color + '33'; ctx.beginPath(); ctx.arc(p.x+20, py+20, 28, 0, Math.PI*2); ctx.fill();
  // Box
  ctx.fillStyle = def.color + 'bb'; ctx.strokeStyle = def.color; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(p.x, py, 40, 40, 8); ctx.fill(); ctx.stroke();
  // Icon
  ctx.font = '20px serif'; ctx.textAlign = 'center'; ctx.fillText(def.icon, p.x+20, py+27);
  // Label
  ctx.fillStyle = def.color; ctx.font = 'bold 9px Courier New'; ctx.textAlign = 'center';
  ctx.fillText(def.label, p.x+20, py+50);
  ctx.textAlign = 'left';
}

// ─────────────────────────────────────────────
//  DRAW: BULLETS
// ─────────────────────────────────────────────
function drawBullets() {
  bullets.forEach(b => {
    if (b.isStar) {
      ctx.fillStyle = '#cc88ff'; ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(Date.now()/100);
      for (let i=0; i<4; i++) { ctx.rotate(Math.PI/2); ctx.fillRect(-2,-7,4,14); }
      ctx.restore();
    } else if (b.isBullet) {
      ctx.fillStyle = '#ffaa00'; ctx.fillRect(b.x-8, b.y-2, 14, 4);
      ctx.fillStyle = '#ffff88'; ctx.fillRect(b.x-4, b.y-1,  8, 2);
    }
  });
  enemyBullets.forEach(b => {
    ctx.fillStyle = '#5cb3ff'; ctx.fillRect(b.x-6, b.y-2, 12, 4);
    ctx.fillStyle = '#cfeeff'; ctx.fillRect(b.x-3, b.y-1, 6, 2);
  });
}

// ─────────────────────────────────────────────
//  DRAW: PARTICLES
// ─────────────────────────────────────────────
function drawParticles() {
  particles.forEach(p => {
    ctx.globalAlpha = p.life;
    if (p.isText) {
      ctx.fillStyle = p.color; ctx.font = 'bold 14px Courier New'; ctx.fillText(p.text, p.x, p.y);
    } else {
      ctx.fillStyle = p.color; ctx.fillRect(p.x-p.size/2, p.y-p.size/2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  });
}

// ─────────────────────────────────────────────
//  MAIN DRAW
// ─────────────────────────────────────────────
function draw() {
  ctx.clearRect(0, 0, W, H);
  drawBG();
  zombies.forEach(drawZombie);
  powerups.forEach(drawPowerup);
  drawBullets();
  drawParticles();
  drawPlayer();

  // Mode ground aura
  if (player.mode !== 'normal') {
    const auraCols = { samurai:'#ffd70022', ninja:'#cc88ff22', turtle:'#2ecc7122', gunner:'#ff880022', devil:'#ff220033', angel:'#ffffaa22' };
    ctx.fillStyle = auraCols[player.mode] || '#ffffff11';
    ctx.beginPath(); ctx.ellipse(player.x+player.w/2, player.y+player.h-5, 38, 16, 0, 0, Math.PI*2); ctx.fill();
  }

  // Wave clear banner
  if (!waveInProgress && waveClearTimer > 0) {
    ctx.fillStyle = 'rgba(255,255,100,0.8)'; ctx.font = "bold 20px 'Fredoka One',cursive"; ctx.textAlign = 'center';
    ctx.fillText('Wave ' + wave + ' cleared! Next wave in ' + Math.ceil(waveClearTimer/60) + 's', W/2, H/2-30);
    ctx.textAlign = 'left';
  }

  // Night overlay
  if (isNight) { ctx.fillStyle = 'rgba(0,0,60,0.22)'; ctx.fillRect(0, 0, W, H); }
}

// ─────────────────────────────────────────────
//  GAME LOOP
// ─────────────────────────────────────────────
function loop() {
  if (!gameLoopRunning) return;
  update();
  draw();
  requestAnimationFrame(loop);
}

function openShop() {
  shopOpen = true;
  const el = document.getElementById('shop-overlay');
  el.style.display = 'flex';
  refreshShopUI();
}

function closeShop() {
  shopOpen = false;
  document.getElementById('shop-overlay').style.display = 'none';
  if (wavePending) {
    wavePending = false;
    wave++;
    zombies = [];
    startWave();
  }
}

function refreshShopUI() {
  document.getElementById('shop-coins').textContent = '🪙 ' + coins;

  const stats = ['health','healthRegen','damage','speed','jump','luck'];
  stats.forEach(s => {
    const lvl = upgrades[s] || 0;
    const el = document.getElementById(s + '-info');
    if (el) {
      if (lvl >= 100) {
        el.textContent = 'Level ' + lvl + ' | MAXED';
      } else {
        const cost = lvl + 1;
        el.textContent = 'Level ' + lvl + ' → ' + (lvl + 1) + ' | Cost: ' + cost + '🪙';
      }
    }
  });

  Object.entries(powerupCosts).forEach(([k, cost]) => {
    const btn = document.getElementById('btn-' + k);
    if (!btn) return;
    const level = enhancedPowerups[k] || 0;
    if (k === 'god') {
      const ready = Object.values(enhancedPowerups).every(l => l >= 15);
      if (godUnlocked) {
        btn.querySelector('small').textContent = 'PURCHASED';
        btn.classList.add('owned');
      } else if (ready) {
        btn.querySelector('small').textContent = 'Unlock: ' + cost + '🪙';
        btn.classList.remove('owned');
      } else {
        btn.querySelector('small').textContent = 'LOCKED';
        btn.classList.remove('owned');
      }
      return;
    }
    if (level >= 15) {
      btn.querySelector('small').textContent = 'Lv ' + level + ' | MAXED';
      btn.classList.add('owned');
    } else {
      btn.querySelector('small').textContent = 'Lv ' + level + ' | Cost: ' + cost + '🪙';
      btn.classList.toggle('owned', level > 0);
    }
  });
}

function buyUpgrade(stat) {
  if (upgrades[stat] >= 100) {
    showFlash('MAX LEVEL REACHED!', '#ffd700');
    return;
  }
  const cost = upgrades[stat] + 1;
  if (coins < cost) {
    showFlash('Not enough coins! Need ' + cost + '🪙', '#e24b4a');
    return;
  }
  coins -= cost;
  upgrades[stat]++;
  document.getElementById('coins-txt').textContent = coins;

  if (stat === 'health' && player) {
    player.maxHp = 100 + (upgrades.health * 5);
    player.hp = player.maxHp;
    updateUI();
  }
  if (stat === 'healthRegen' && player) {
    player.regenTimer = 60;
    updateUI();
  }
  if (stat === 'luck' && player) {
    updateUI();
  }
  refreshShopUI();
  showFlash('✅ ' + stat.toUpperCase() + ' upgraded to level ' + upgrades[stat] + '!', '#2ecc71');
}

function buyEnhanced(type) {
  if (type === 'god') {
    if (godUnlocked) {
      showFlash('GOD MODE ALREADY PURCHASED!', '#ffd700');
      return;
    }
    const needsMax = Object.values(enhancedPowerups).every(l => l >= 15);
    if (!needsMax) {
      showFlash('MAX ALL POWER-UPS FIRST!', '#e24b4a');
      return;
    }
    const cost = powerupCosts.god;
    if (coins < cost) {
      showFlash('Need ' + cost + '🪙 for GOD POWER-UP!', '#e24b4a');
      return;
    }
    coins -= cost;
    godUnlocked = true;
    if (player) {
      player.mode = 'god';
      player.modeTimer = Infinity;
      player.activePowerup = 'god';
      player.hp = player.maxHp;
      updateUI();
    }
    document.getElementById('coins-txt').textContent = coins;
    refreshShopUI();
    showFlash('🌟 GOD MODE PURCHASED! YOU ARE UNSTOPPABLE!', '#ffe566');
    return;
  }
  if (enhancedPowerups[type] >= 15) {
    showFlash('POWER-UP MAXED!', '#ffd700');
    return;
  }
  const cost = powerupCosts[type];
  if (coins < cost) {
    showFlash('Need ' + cost + '🪙 for ' + type + ' power-up!', '#e24b4a');
    return;
  }
  coins -= cost;
  enhancedPowerups[type] = (enhancedPowerups[type] || 0) + 1;
  const newLevel = enhancedPowerups[type];
  if (newLevel < 10) powerupCosts[type] += 5;
  else powerupCosts[type] *= 2;
  document.getElementById('coins-txt').textContent = coins;
  if (player) {
    player.mode = type;
    player.modeTimer = 0;
    player.activePowerup = type;
    if (type === 'angel') {
      player.hp = Math.min(player.maxHp, player.hp + 8);
    }
    updateUI();
  }

  // no auto-unlock; god mode must be purchased after all power-ups reach level 15
  refreshShopUI();
  showFlash('✅ ' + type.toUpperCase() + ' POWER-UP BOOSTED!', '#ffd700');
}

document.addEventListener('keydown', e => {
  if (e.code === 'KeyS' && !isGameOver) {
    shopOpen ? closeShop() : openShop();
  }
});

