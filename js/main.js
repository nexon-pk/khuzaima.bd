/**
 * ==========================================================================
 * MUHAMMAD KHUZAIMA'S 2ND BIRTHDAY — INTERACTIVE PRESENTATION LOGIC
 * A special birthday surprise from Uncle Ali Khawaja
 * ==========================================================================
 */

(function () {
  'use strict';

  // Fallback configuration if birthday-data.js isn't loaded
  const CFG = window.BIRTHDAY_CONFIG || {
    nephewName: "Muhammad Khuzaima",
    uncleName: "Ali Khawaja",
    age: 2,
    stage1: { countdownNumbers: [3, 2, 1], introHeading: "IT'S YOUR SPECIAL DAY", nameHeading: "MUHAMMAD KHUZAIMA", nextButtonText: "Let's Celebrate" },
    stage2: { greetingLine1: "HAPPY BIRTHDAY", greetingLine2: "MUHAMMAD KHUZAIMA", nextButtonText: "Assemble Cake" },
    stage3: { cakeTopper: "Khuzaima", caption: "LEVEL 2 UNLOCKED", nextButtonText: "Open Gifts" },
    stage4: { gifts: [] },
    stage5: { heading: "HAPPY 2ND BIRTHDAY", name: "MUHAMMAD KHUZAIMA", message: "Lots of love!", signOff: "LOTS OF LOVE, ALI KHAWAJA" }
  };

  // --------------------------------------------------------------------------
  // STATE MANAGEMENT
  // --------------------------------------------------------------------------
  const STATE = {
    currentStage: 0,
    totalStages: 5,
    currentGiftIndex: 0,
    isTransitioning: false,
    audioPlaying: false,
    audioMuted: false,
    audioInitialized: false,
    countdownTimer: null,
    animationTimers: [],
  };

  // --------------------------------------------------------------------------
  // DOM ELEMENT REFERENCES
  // --------------------------------------------------------------------------
  const DOM = {
    canvas: document.getElementById('celebration-canvas'),
    stageElements: [
      document.getElementById('stage-countdown'),
      document.getElementById('stage-balloons'),
      document.getElementById('stage-cake'),
      document.getElementById('stage-gifts'),
      document.getElementById('stage-wishes')
    ],
    stageDots: document.querySelectorAll('.stage-dot'),
    soundToggleBtn: document.getElementById('sound-toggle-btn'),
    bgAudio: document.getElementById('bg-audio'),

    // Stage 1
    countdownDisplay: document.getElementById('countdown-display'),
    stage1Reveal: document.getElementById('stage1-reveal'),
    stage1NextBtn: document.getElementById('stage1-next-btn'),
    stage1BalloonsBg: document.getElementById('stage1-balloons-bg'),

    // Stage 2
    stage2BalloonCluster: document.getElementById('stage2-balloon-cluster'),
    stage2NextBtn: document.getElementById('stage2-next-btn'),

    // Stage 3
    cakeTopper: document.getElementById('cake-topper'),
    tierTop: document.getElementById('tier-top'),
    tierMiddle: document.getElementById('tier-middle'),
    tierBottom: document.getElementById('tier-bottom'),
    cakeCaption: document.getElementById('cake-caption'),
    stage3NextBtn: document.getElementById('stage3-next-btn'),

    // Stage 4
    giftViews: document.querySelectorAll('.gift-view'),
    chequeModal: document.getElementById('cheque-modal'),
    chequeOpenBtn: document.getElementById('cheque-preview-wrapper'),
    chequeCloseBtn: document.getElementById('cheque-modal-close'),

    // Stage 5
    replayBtn: document.getElementById('replay-btn')
  };

  // --------------------------------------------------------------------------
  // AUDIO SYNTHESIZER & AUDIO MANAGER
  // --------------------------------------------------------------------------
  class CelebrationAudio {
    constructor() {
      this.audioCtx = null;
      this.isPlayingSynth = false;
      this.synthTimeout = null;
    }

    initContext() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    }

    // Play a gentle music box / celesta tone
    playTone(frequency, duration, delay = 0) {
      if (!this.audioCtx || STATE.audioMuted) return;
      setTimeout(() => {
        if (!this.audioCtx || STATE.audioMuted) return;
        try {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

          // Bell envelope
          gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.18, this.audioCtx.currentTime + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start();
          osc.stop(this.audioCtx.currentTime + duration);
        } catch (e) {
          // Audio safe fail
        }
      }, delay * 1000);
    }

    // Procedural "Happy Birthday" music box loop
    startHappyBirthdayMelody() {
      if (this.isPlayingSynth || STATE.audioMuted) return;
      this.isPlayingSynth = true;

      // Happy Birthday notes and durations (C4 octave)
      // C4: 261.6, D4: 293.7, E4: 329.6, F4: 349.2, G4: 392.0, A4: 440.0, B4: 493.9, C5: 523.3
      const notes = [
        { f: 261.6, d: 0.35, t: 0.0 },
        { f: 261.6, d: 0.35, t: 0.4 },
        { f: 293.7, d: 0.6,  t: 0.8 },
        { f: 261.6, d: 0.6,  t: 1.5 },
        { f: 349.2, d: 0.6,  t: 2.2 },
        { f: 329.6, d: 1.0,  t: 2.9 },

        { f: 261.6, d: 0.35, t: 4.0 },
        { f: 261.6, d: 0.35, t: 4.4 },
        { f: 293.7, d: 0.6,  t: 4.8 },
        { f: 261.6, d: 0.6,  t: 5.5 },
        { f: 392.0, d: 0.6,  t: 6.2 },
        { f: 349.2, d: 1.0,  t: 6.9 },

        { f: 261.6, d: 0.35, t: 8.0 },
        { f: 261.6, d: 0.35, t: 8.4 },
        { f: 523.3, d: 0.6,  t: 8.8 },
        { f: 440.0, d: 0.6,  t: 9.5 },
        { f: 349.2, d: 0.6,  t: 10.2 },
        { f: 329.6, d: 0.6,  t: 10.9 },
        { f: 293.7, d: 0.9,  t: 11.6 },

        { f: 466.2, d: 0.35, t: 12.7 },
        { f: 466.2, d: 0.35, t: 13.1 },
        { f: 440.0, d: 0.6,  t: 13.5 },
        { f: 349.2, d: 0.6,  t: 14.2 },
        { f: 392.0, d: 0.6,  t: 14.9 },
        { f: 349.2, d: 1.2,  t: 15.6 }
      ];

      notes.forEach(n => this.playTone(n.f, n.d, n.t));

      // Loop after 18 seconds if still allowed
      this.synthTimeout = setTimeout(() => {
        this.isPlayingSynth = false;
        if (STATE.audioPlaying && !STATE.audioMuted) {
          this.startHappyBirthdayMelody();
        }
      }, 18000);
    }

    stopSynth() {
      this.isPlayingSynth = false;
      if (this.synthTimeout) clearTimeout(this.synthTimeout);
    }

    playSparkleEffect() {
      if (STATE.audioMuted) return;
      this.initContext();
      const sparkles = [523.3, 659.3, 784.0, 1046.5];
      sparkles.forEach((f, i) => this.playTone(f, 0.25, i * 0.08));
    }
  }

  const celebrationAudio = new CelebrationAudio();

  function toggleAudio() {
    celebrationAudio.initContext();

    if (!STATE.audioPlaying) {
      STATE.audioPlaying = true;
      STATE.audioMuted = false;
      DOM.soundToggleBtn.classList.add('playing');
      DOM.soundToggleBtn.setAttribute('aria-label', 'Mute Music');

      // Try playing audio element first; if error or empty, use synthesized chime music
      if (DOM.bgAudio && DOM.bgAudio.src) {
        DOM.bgAudio.play().then(() => {
          // Audio file playing successfully
        }).catch(() => {
          // Fallback to procedurally generated Happy Birthday music box tune
          celebrationAudio.startHappyBirthdayMelody();
        });
      } else {
        celebrationAudio.startHappyBirthdayMelody();
      }
    } else {
      STATE.audioPlaying = false;
      STATE.audioMuted = true;
      DOM.soundToggleBtn.classList.remove('playing');
      DOM.soundToggleBtn.setAttribute('aria-label', 'Play Music');
      if (DOM.bgAudio) {
        DOM.bgAudio.pause();
      }
      celebrationAudio.stopSynth();
    }
  }

  // --------------------------------------------------------------------------
  // HIGH-PERFORMANCE 60FPS CANVAS CELEBRATION (FIREWORKS & CONFETTI)
  // --------------------------------------------------------------------------
  class ParticleEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.rockets = [];
      this.isRunning = false;
      this.colors = [
        '#FF4365', '#FF8FB8', '#E8BE69', '#FFE4EF',
        '#2274A5', '#1D4ED8', '#CDEBFF', '#E8DFFF', '#FFFFFF'
      ];

      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.ctx.scale(this.dpr, this.dpr);
    }

    launchRocket(startX = null, targetY = null) {
      const x = startX !== null ? startX : this.width * (0.2 + Math.random() * 0.6);
      const y = this.height;
      const target = targetY !== null ? targetY : this.height * (0.2 + Math.random() * 0.35);
      const speed = 12 + Math.random() * 5;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];

      this.rockets.push({
        x: x,
        y: y,
        targetY: target,
        vy: -speed,
        color: color,
        trail: []
      });

      this.ensureRunning();
    }

    explode(x, y, color, count = 45) {
      celebrationAudio.playSparkleEffect();
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.2 - 0.1);
        const speed = 2 + Math.random() * 6;
        this.particles.push({
          type: 'firework',
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: color || this.colors[Math.floor(Math.random() * this.colors.length)],
          alpha: 1,
          decay: 0.015 + Math.random() * 0.018,
          radius: 2 + Math.random() * 2.5,
          gravity: 0.12
        });
      }
      this.ensureRunning();
    }

    burstConfetti(count = 50, originX = null, originY = null) {
      const ox = originX !== null ? originX : this.width * 0.5;
      const oy = originY !== null ? originY : this.height * 0.35;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 9;
        this.particles.push({
          type: 'confetti',
          x: ox,
          y: oy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          alpha: 1,
          decay: 0.007 + Math.random() * 0.008,
          w: 8 + Math.random() * 6,
          h: 4 + Math.random() * 4,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
          gravity: 0.18
        });
      }
      this.ensureRunning();
    }

    ensureRunning() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.loop();
      }
    }

    clear() {
      this.particles = [];
      this.rockets = [];
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.isRunning = false;
    }

    loop() {
      if (!this.isRunning) return;

      this.ctx.clearRect(0, 0, this.width, this.height);

      // Update rockets
      for (let i = this.rockets.length - 1; i >= 0; i--) {
        const r = this.rockets[i];
        r.y += r.vy;

        // Spark trail
        this.ctx.fillStyle = r.color;
        this.ctx.beginPath();
        this.ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        this.ctx.fill();

        if (r.y <= r.targetY) {
          this.explode(r.x, r.y, r.color);
          this.rockets.splice(i, 1);
        }
      }

      // Update particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);

        if (p.type === 'confetti') {
          p.rotation += p.rotationSpeed;
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate((p.rotation * Math.PI) / 180);
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          this.ctx.fillStyle = p.color;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          this.ctx.fill();
        }

        this.ctx.restore();
      }

      if (this.particles.length > 0 || this.rockets.length > 0) {
        requestAnimationFrame(() => this.loop());
      } else {
        this.isRunning = false;
      }
    }
  }

  const particleEngine = new ParticleEngine(DOM.canvas);

  // --------------------------------------------------------------------------
  // STAGE MANAGEMENT (CRITICAL: STRICTLY ONE STAGE ACTIVE AT A TIME)
  // --------------------------------------------------------------------------
  function setStage(stageIndex) {
    if (STATE.isTransitioning) return;
    if (stageIndex < 0 || stageIndex >= STATE.totalStages) return;

    STATE.isTransitioning = true;
    STATE.currentStage = stageIndex;

    // Clear any timers from previous stage
    STATE.animationTimers.forEach(id => clearTimeout(id));
    STATE.animationTimers = [];

    // Update top progress indicators
    DOM.stageDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === stageIndex);
      dot.setAttribute('aria-current', idx === stageIndex ? 'step' : 'false');
    });

    // Hide all stages strictly (removing active class & disabling interaction)
    DOM.stageElements.forEach((stage, idx) => {
      if (idx === stageIndex) {
        stage.classList.add('stage-active');
        stage.removeAttribute('aria-hidden');
      } else {
        stage.classList.remove('stage-active');
        stage.setAttribute('aria-hidden', 'true');
      }
    });

    // Run specific entrance animations for the new stage
    switch (stageIndex) {
      case 0:
        startStage1Countdown();
        break;
      case 1:
        startStage2Balloons();
        break;
      case 2:
        startStage3Cake();
        break;
      case 3:
        startStage4Gifts();
        break;
      case 4:
        startStage5Wishes();
        break;
    }

    // Allow user interactions after transition settles
    const unlockTimer = setTimeout(() => {
      STATE.isTransitioning = false;
    }, 600);
    STATE.animationTimers.push(unlockTimer);
  }

  // Helper to show Next buttons cleanly
  function showNextButton(btnElement, delayMs = 1200) {
    if (!btnElement) return;
    btnElement.classList.remove('btn-visible');
    btnElement.classList.add('btn-hidden');

    const timer = setTimeout(() => {
      btnElement.classList.remove('btn-hidden');
      btnElement.classList.add('btn-visible');
    }, delayMs);
    STATE.animationTimers.push(timer);
  }

  // --------------------------------------------------------------------------
  // STAGE 1: COUNTDOWN & FIREWORKS LOGIC
  // --------------------------------------------------------------------------
  function startStage1Countdown() {
    DOM.countdownDisplay.style.display = 'block';
    DOM.stage1Reveal.style.display = 'none';
    DOM.stage1NextBtn.classList.remove('btn-visible');
    DOM.stage1NextBtn.classList.add('btn-hidden');
    DOM.stage1BalloonsBg.innerHTML = '';

    const numbers = [3, 2, 1];
    let currentIndex = 0;

    function renderNumber() {
      if (currentIndex < numbers.length) {
        DOM.countdownDisplay.innerHTML = `<span class="countdown-number">${numbers[currentIndex]}</span>`;
        celebrationAudio.playTone(392 + currentIndex * 60, 0.3);
        currentIndex++;
        STATE.countdownTimer = setTimeout(renderNumber, 1000);
      } else {
        // Countdown finished! Trigger fireworks and celebration
        triggerCountdownCelebration();
      }
    }

    renderNumber();
  }

  function triggerCountdownCelebration() {
    DOM.countdownDisplay.style.display = 'none';
    DOM.stage1Reveal.style.display = 'flex';

    // Fireworks & rockets launch
    for (let i = 0; i < 4; i++) {
      const rocketTimer = setTimeout(() => {
        particleEngine.launchRocket(
          window.innerWidth * (0.2 + i * 0.2),
          window.innerHeight * (0.2 + Math.random() * 0.25)
        );
      }, i * 250);
      STATE.animationTimers.push(rocketTimer);
    }

    // Confetti burst
    const confettiTimer = setTimeout(() => {
      particleEngine.burstConfetti(65);
    }, 700);
    STATE.animationTimers.push(confettiTimer);

    // Spawn floating background mini balloons
    spawnMiniBalloons();

    // Reveal Next Button after celebration settles
    showNextButton(DOM.stage1NextBtn, 1500);
  }

  function spawnMiniBalloons() {
    const colors = ['#FF4365', '#2274A5', '#FF8FB8', '#E8BE69', '#1D4ED8'];
    for (let i = 0; i < 6; i++) {
      const balloon = document.createElement('div');
      balloon.className = 'mini-balloon';
      balloon.style.left = `${10 + i * 16}%`;
      balloon.style.backgroundColor = colors[i % colors.length];
      balloon.style.animationDuration = `${7 + Math.random() * 4}s`;
      balloon.style.animationDelay = `${i * 0.4}s`;
      DOM.stage1BalloonsBg.appendChild(balloon);
    }
  }

  // --------------------------------------------------------------------------
  // STAGE 2: BALLOONS NAME REVEAL
  // --------------------------------------------------------------------------
  function startStage2Balloons() {
    DOM.stage2BalloonCluster.innerHTML = '';
    DOM.stage2NextBtn.classList.remove('btn-visible');
    DOM.stage2NextBtn.classList.add('btn-hidden');

    // Create coordinated festive balloons (Red, Royal Blue, Pink, Gold)
    const balloonConfigs = [
      { color: 'red', left: '8%', top: '15%', delay: 0.1, fromX: -150, fromY: -100 },
      { color: 'royal-blue', left: '16%', top: '48%', delay: 0.3, fromX: -200, fromY: 100 },
      { color: 'gold', left: '82%', top: '18%', delay: 0.2, fromX: 200, fromY: -100 },
      { color: 'royal-blue', right: '8%', top: '52%', delay: 0.4, fromX: 200, fromY: 120 },
      { color: 'pink', left: '5%', top: '75%', delay: 0.5, fromX: -120, fromY: 200 },
      { color: 'red', right: '14%', top: '78%', delay: 0.6, fromX: 150, fromY: 200 },
    ];

    balloonConfigs.forEach((cfg, idx) => {
      const balloon = document.createElement('div');
      balloon.className = `festive-balloon ${cfg.color}`;
      if (cfg.left) balloon.style.left = cfg.left;
      if (cfg.right) balloon.style.right = cfg.right;
      balloon.style.top = cfg.top;

      // Initial off-screen offset
      balloon.style.transform = `translate(${cfg.fromX}px, ${cfg.fromY}px) scale(0.6)`;
      balloon.style.opacity = '0';

      const string = document.createElement('div');
      string.className = 'balloon-string';
      balloon.appendChild(string);
      DOM.stage2BalloonCluster.appendChild(balloon);

      // Animate balloons smoothly into coordinated arrangement
      const timer = setTimeout(() => {
        balloon.style.transform = 'translate(0, 0) scale(1)';
        balloon.style.opacity = '1';
      }, cfg.delay * 1000);
      STATE.animationTimers.push(timer);
    });

    // Confetti burst as name reveals
    const burstTimer = setTimeout(() => {
      particleEngine.burstConfetti(50);
      celebrationAudio.playSparkleEffect();
    }, 900);
    STATE.animationTimers.push(burstTimer);

    // Show Next Button
    showNextButton(DOM.stage2NextBtn, 1800);
  }

  // --------------------------------------------------------------------------
  // STAGE 3: 3-TIER PHOTO CAKE ASSEMBLY
  // --------------------------------------------------------------------------
  function startStage3Cake() {
    // Reset all cake tiers to unassembled air positions
    DOM.tierBottom.classList.remove('tier-placed');
    DOM.tierMiddle.classList.remove('tier-placed');
    DOM.tierTop.classList.remove('tier-placed');
    DOM.cakeTopper.classList.remove('topper-visible');
    DOM.cakeCaption.style.opacity = '0';
    DOM.cakeCaption.style.transform = 'scale(0.85)';
    DOM.stage3NextBtn.classList.remove('btn-visible');
    DOM.stage3NextBtn.classList.add('btn-hidden');

    // 1. Bottom tier enters from below
    const t1 = setTimeout(() => {
      DOM.tierBottom.classList.add('tier-placed');
      celebrationAudio.playTone(330, 0.35);
    }, 400);
    STATE.animationTimers.push(t1);

    // 2. Middle tier enters from side
    const t2 = setTimeout(() => {
      DOM.tierMiddle.classList.add('tier-placed');
      celebrationAudio.playTone(440, 0.35);
    }, 1100);
    STATE.animationTimers.push(t2);

    // 3. Top tier enters from above
    const t3 = setTimeout(() => {
      DOM.tierTop.classList.add('tier-placed');
      celebrationAudio.playTone(554, 0.4);
    }, 1800);
    STATE.animationTimers.push(t3);

    // 4. Cake topper drops in and candles ignite
    const t4 = setTimeout(() => {
      DOM.cakeTopper.classList.add('topper-visible');
      particleEngine.burstConfetti(45);
      celebrationAudio.playSparkleEffect();

      // Show Level 2 Unlocked caption
      DOM.cakeCaption.style.transition = 'all 0.6s var(--transition-bounce)';
      DOM.cakeCaption.style.opacity = '1';
      DOM.cakeCaption.style.transform = 'scale(1)';
    }, 2500);
    STATE.animationTimers.push(t4);

    // 5. Reveal Next button
    showNextButton(DOM.stage3NextBtn, 3200);
  }

  // --------------------------------------------------------------------------
  // STAGE 4: BIRTHDAY GIFTS LOGIC (CHEQUE, IPHONES, RANGE ROVERS)
  // --------------------------------------------------------------------------
  function startStage4Gifts() {
    STATE.currentGiftIndex = 0;
    showGiftSubStage(0);
  }

  function showGiftSubStage(giftIndex) {
    STATE.currentGiftIndex = giftIndex;

    DOM.giftViews.forEach((view, idx) => {
      if (idx === giftIndex) {
        view.classList.add('gift-active');
        view.removeAttribute('aria-hidden');
      } else {
        view.classList.remove('gift-active');
        view.setAttribute('aria-hidden', 'true');
      }
    });

    // Trigger gift-specific entrance animations
    if (giftIndex === 0) {
      // Cheque reveal
      const btn = document.getElementById('gift1-next-btn');
      showNextButton(btn, 300);
      particleEngine.burstConfetti(35);
    } else if (giftIndex === 1) {
      // 2x iPhone 18 Pro Max reveal
      const pLeft = document.getElementById('phone-card-left');
      const pRight = document.getElementById('phone-card-right');
      const btn = document.getElementById('gift2-next-btn');

      if (pLeft) pLeft.classList.remove('entered');
      if (pRight) pRight.classList.remove('entered');

      const enterTimer = setTimeout(() => {
        if (pLeft) pLeft.classList.add('entered');
        if (pRight) pRight.classList.add('entered');
        particleEngine.burstConfetti(40);
        celebrationAudio.playSparkleEffect();
      }, 300);
      STATE.animationTimers.push(enterTimer);

      showNextButton(btn, 1600);
    } else if (giftIndex === 2) {
      // 2x Range Rover reveal
      const car1 = document.getElementById('car-card-1');
      const car2 = document.getElementById('car-card-2');
      const btn = document.getElementById('gift3-next-btn');

      if (car1) car1.classList.remove('entered');
      if (car2) car2.classList.remove('entered');

      const c1Timer = setTimeout(() => {
        if (car1) car1.classList.add('entered');
        celebrationAudio.playTone(350, 0.3);
      }, 300);
      STATE.animationTimers.push(c1Timer);

      const c2Timer = setTimeout(() => {
        if (car2) car2.classList.add('entered');
        particleEngine.burstConfetti(50);
        celebrationAudio.playSparkleEffect();
      }, 800);
      STATE.animationTimers.push(c2Timer);

      // This is the last gift, its next button will advance to Stage 5!
      showNextButton(btn, 1800);
    }
  }

  // --------------------------------------------------------------------------
  // STAGE 5: PERSONAL BIRTHDAY WISHES
  // --------------------------------------------------------------------------
  function startStage5Wishes() {
    // Grand celebration finale confetti showers
    particleEngine.burstConfetti(70);
    for (let i = 0; i < 3; i++) {
      const rocketTimer = setTimeout(() => {
        particleEngine.launchRocket(
          window.innerWidth * (0.25 + i * 0.25),
          window.innerHeight * 0.25
        );
      }, i * 350);
      STATE.animationTimers.push(rocketTimer);
    }
    celebrationAudio.playSparkleEffect();
  }

  // --------------------------------------------------------------------------
  // EVENT LISTENERS & INITIALIZATION
  // --------------------------------------------------------------------------
  function setupEventListeners() {
    // Sound toggle button
    if (DOM.soundToggleBtn) {
      DOM.soundToggleBtn.addEventListener('click', toggleAudio);
    }

    // Auto-enable audio on first interaction if requested
    document.body.addEventListener('click', () => {
      if (!STATE.audioInitialized) {
        STATE.audioInitialized = true;
        celebrationAudio.initContext();
      }
    }, { once: true });

    // Stage 1 -> Stage 2
    if (DOM.stage1NextBtn) {
      DOM.stage1NextBtn.addEventListener('click', () => setStage(1));
    }

    // Stage 2 -> Stage 3
    if (DOM.stage2NextBtn) {
      DOM.stage2NextBtn.addEventListener('click', () => setStage(2));
    }

    // Stage 3 -> Stage 4
    if (DOM.stage3NextBtn) {
      DOM.stage3NextBtn.addEventListener('click', () => setStage(3));
    }

    // Gift 1 -> Gift 2
    const gift1Next = document.getElementById('gift1-next-btn');
    if (gift1Next) {
      gift1Next.addEventListener('click', () => showGiftSubStage(1));
    }

    // Gift 2 -> Gift 3
    const gift2Next = document.getElementById('gift2-next-btn');
    if (gift2Next) {
      gift2Next.addEventListener('click', () => showGiftSubStage(2));
    }

    // Gift 3 -> Stage 5 (Wishes)
    const gift3Next = document.getElementById('gift3-next-btn');
    if (gift3Next) {
      gift3Next.addEventListener('click', () => setStage(4));
    }

    // Stage 5 -> Replay
    if (DOM.replayBtn) {
      DOM.replayBtn.addEventListener('click', () => {
        particleEngine.clear();
        setStage(0);
      });
    }

    // Cheque Zoom Modal
    if (DOM.chequeOpenBtn && DOM.chequeModal) {
      DOM.chequeOpenBtn.addEventListener('click', () => {
        DOM.chequeModal.classList.add('open');
      });
    }
    if (DOM.chequeCloseBtn && DOM.chequeModal) {
      DOM.chequeCloseBtn.addEventListener('click', () => {
        DOM.chequeModal.classList.remove('open');
      });
    }
    if (DOM.chequeModal) {
      DOM.chequeModal.addEventListener('click', (e) => {
        if (e.target === DOM.chequeModal) {
          DOM.chequeModal.classList.remove('open');
        }
      });
    }

    // Modal Next Button inside enlarged cheque
    const modalNextBtn = document.getElementById('modal-next-btn');
    if (modalNextBtn && DOM.chequeModal) {
      modalNextBtn.addEventListener('click', () => {
        DOM.chequeModal.classList.remove('open');
        showGiftSubStage(1);
      });
    }
  }

  // Kickstart presentation on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setStage(0);
  });

})();
