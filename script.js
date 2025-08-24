
  const landing1 = document.getElementById('landing1');
  const landing2 = document.getElementById('landing2');
  const getStartedBtn = document.getElementById('getStartedBtn');
  const virtualTourBtn = document.getElementById('virtualTourBtn');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const backgroundMusic = document.getElementById('backgroundMusic');
  const backBtn = document.getElementById('backBtn');
  const hamburger = document.getElementById('hamburger');
  const navRight = document.getElementById('navigation-menu');

  // Show and hide with scale/blur fade effect
  async function showSection(toShow, toHide) {
    // Hide current
    toHide.classList.remove('visible');
    toHide.classList.add('hidden');
    await new Promise(r => setTimeout(r, 950));

    toHide.style.display = 'none';

    // Show new
    toShow.style.display = toShow.id === 'landing1' ? 'flex' : 'block';
    await new Promise(r => setTimeout(r, 30));
    toShow.classList.remove('hidden');
    toShow.classList.add('visible');
  }

  // Initial states
  landing1.classList.add('visible');
  landing2.classList.add('hidden');
  landing2.style.display = 'none';
  backBtn.style.display = 'none';

  getStartedBtn.addEventListener('click', async () => {
    await showSection(landing2, landing1);
    backBtn.style.display = 'block';
    window.scrollTo(0,0);
    backgroundMusic.play().catch(() => {});
    updateMusicIcon();
  });

  backBtn.addEventListener('click', async () => {
    await showSection(landing1, landing2);
    backBtn.style.display = 'none';
    backgroundMusic.pause();
  });

  const virtualTourUrl = "https://website-intro-laboratorium.vercel.app/";
  virtualTourBtn.addEventListener('click', () => {
    window.location.href = virtualTourUrl;
  });

  // Smooth scroll for navbar anchors
  document.querySelectorAll('nav a.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if(target) {
        target.scrollIntoView({behavior: 'smooth', block:"start"});
      }
      // Close menu after clicking on small screens
      if(window.innerWidth <= 768){
        toggleMenu(false);
      }
    });
  });

  // Hamburger toggle function
  function toggleMenu(show) {
    if(show){
      navRight.classList.add('open');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded','true');
    } else {
      navRight.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded','false');
    }
  }

  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    toggleMenu(!expanded);
  });

  hamburger.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      hamburger.click();
    }
  });

  function updateMusicIcon(){
    if(backgroundMusic.paused){
      musicToggleBtn.innerHTML = '&#128263;';
      musicToggleBtn.setAttribute('aria-label', 'Turn on background music');
    } else {
      musicToggleBtn.innerHTML = '&#128266;';
      musicToggleBtn.setAttribute('aria-label', 'Turn off background music');
    }
  }
  musicToggleBtn.addEventListener('click', () => {
    if(backgroundMusic.paused){
      backgroundMusic.play();
    } else {
      backgroundMusic.pause();
    }
    updateMusicIcon();
  });

  const navItems = document.querySelectorAll('nav a, nav button');
  navItems.forEach(el => {
    el.addEventListener('focus', () => {
      el.style.outline = '3px solid #f6e500';
      el.style.outlineOffset = '3px';
    });
    el.addEventListener('blur', () => {
      el.style.outline = 'none';
    });
  });

