document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const transitionOverlay = document.getElementById('transition-overlay');
  const progressBar = document.getElementById('progress-bar');
  const particlesContainer = transitionOverlay.querySelector('.particles');
  const confettiCanvas = document.getElementById('confetti-canvas');
  const ctx = confettiCanvas.getContext('2d');
  const confettiParticles = [];
  let touchStartX = 0;
  let touchStartY = 0;
  const updateThemeIcon = () => {
    const isDark = html.classList.contains('dark');
    themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
  };
  updateThemeIcon();
  themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    updateThemeIcon();
  });
  const games = {
    floppy: {
      title: 'Floppy Bird',
      url: 'flop/index.html'
    },
    '2048': {
      title: '2048',
      url: '2048.html'
    },
    snake: {
      title: 'Snake',
      url: 'Snake.html'
    },
    'minecraft': {  // ← теперь в кавычках — исправлено!
      title: 'Minecraft',
      url: 'https://craftingtable.free.nf/'
    }
  };
  const resizeConfettiCanvas = () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  };
  resizeConfettiCanvas();
  window.addEventListener('resize', resizeConfettiCanvas);
  window.addEventListener('orientationchange', resizeConfettiCanvas);
  function createConfettiParticle() {
    return {
      x: Math.random() * confettiCanvas.width,
      y: -10,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      color: `hsl(${Math.random() * 60 + 240}, 70%, 50%)`,
      size: Math.random() * 5 + 3
    };
  }
  function animateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.size *= 0.99;
      if (p.y > confettiCanvas.height || p.size < 0.5) {
        confettiParticles.splice(index, 1);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    });
    if (confettiParticles.length > 0) {
      requestAnimationFrame(animateConfetti);
    }
  }
  function triggerConfetti() {
    for (let i = 0; i < 150; i++) {
      confettiParticles.push(createConfettiParticle());
    }
    animateConfetti();
  }
  const createParticles = () => {
    particlesContainer.innerHTML = '';
    const count = window.innerWidth < 768 ? 30 : 50;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.width = `${Math.random() * 5 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.background = Math.random() > 0.5 ? '#7c3aed' : '#ec4899';
      particlesContainer.appendChild(particle);
    }
  };
  createParticles();
  window.addEventListener('resize', createParticles);
  const startTransition = (gameKey) => {
    if (!games[gameKey]) return;
    triggerConfetti();
    progressBar.style.animation = 'none';
    progressBar.offsetHeight;
    progressBar.style.animation = '';
    transitionOverlay.classList.add('active');
    setTimeout(() => {
      window.location.href = games[gameKey].url;
    }, 3000);
  };
  function handlePlay(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.type === 'touchend') {
      const touch = e.changedTouches[0];
      const dx = Math.abs(touch.clientX - touchStartX);
      const dy = Math.abs(touch.clientY - touchStartY);
      if (dx > 30 || dy > 30) {
        return;
      }
    }
    const card = e.currentTarget.closest('.game-card');
    if (card) {
      const game = card.dataset.game;
      startTransition(game);
    }
  }
  const playElements = document.querySelectorAll('.game-card, .play-btn');
  playElements.forEach(element => {
    element.addEventListener('click', handlePlay);
    element.addEventListener('touchstart', (ev) => {
      const touch = ev.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    }, { passive: true });
    element.addEventListener('touchend', handlePlay);
  });
  const randomBtn = document.getElementById('random-game');
  randomBtn.addEventListener('click', () => {
    const gameKeys = Object.keys(games);
    const randomKey = gameKeys[Math.floor(Math.random() * gameKeys.length)];
    startTransition(randomKey);
  });
  randomBtn.addEventListener('touchstart', (ev) => {
    const touch = ev.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });
  randomBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    const dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
    if (dx <= 30 && dy <= 30) {
      const gameKeys = Object.keys(games);
      const randomKey = gameKeys[Math.floor(Math.random() * gameKeys.length)];
      startTransition(randomKey);
    }
  });
});