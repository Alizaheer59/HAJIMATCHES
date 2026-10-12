/**
 * MOHAMMAD HAZI MOINUDDIN BASHA - BIODATA PORTFOLIO SCRIPT
 * Interactive animations, golden particle canvas, 3D tilt, lightbox, and clipboard utils.
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initHeroSwitcher();
  initTiltEffect();
  initLightbox();
  initTabs();
  initThemeToggle();
  initScrollEffects();
  initCopyAndShare();
  initAudioAmbience();
  initMobileMenu();
});

/* ==========================================================================
   1. GOLDEN STARLIGHT PARTICLES CANVAS
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: -1000, y: -1000 };
  const particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 70;

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.2 + 0.8;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
      this.alpha = this.baseAlpha;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.twinkleFactor = Math.random() * Math.PI;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.twinkleFactor += this.twinkleSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.twinkleFactor) * 0.25;

      // Mouse subtle push
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        this.x -= (dx / dist) * 1.5;
        this.y -= (dy / dist) * 1.5;
      }

      if (this.y < -10) this.y = height + 10;
      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
    }
    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(243, 198, 76, ${Math.max(0, this.alpha)})`;
      ctx.shadowBlur = this.size * 3;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.7)';
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. HERO PHOTO SPOTLIGHT SWITCHER
   ========================================================================== */
const photoData = [
  {
    id: 'formal',
    src: 'assets/images/photo_formal.jpg',
    title: 'Assistant Professor, VIT-AP',
    badge: 'Campus & Academic Role',
    alt: 'Mohammad Hazi Moinuddin Basha - Campus Portrait'
  },
  {
    id: 'beach',
    src: 'assets/images/photo_beach.jpg',
    title: 'Mohammad Hazi Moinuddin Basha',
    badge: 'Casual & Lifestyle Portrait',
    alt: 'Mohammad Hazi Moinuddin Basha - Outdoor Portrait'
  }
];

function initHeroSwitcher() {
  const tabs = document.querySelectorAll('.hero-photo-switcher .switcher-tab');
  const heroImg = document.getElementById('hero-spotlight-img');
  const badge1 = document.getElementById('floating-badge-role');

  if (!tabs.length || !heroImg) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const photoKey = tab.getAttribute('data-photo');
      const item = photoData.find((p) => p.id === photoKey);

      if (item) {
        heroImg.style.opacity = '0';
        heroImg.style.transform = 'scale(0.95)';
        setTimeout(() => {
          heroImg.src = item.src;
          heroImg.alt = item.alt;
          if (badge1) badge1.textContent = item.badge;
          heroImg.style.opacity = '1';
          heroImg.style.transform = 'scale(1)';
        }, 200);
      }
    });
  });
}

/* ==========================================================================
   3. 3D CARD TILT EFFECT ON HOVER
   ========================================================================== */
function initTiltEffect() {
  const cards = document.querySelectorAll('.tilt-card, .gallery-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   4. FULLSCREEN LIGHTBOX MODAL WITH GALLERY NAVIGATION
   ========================================================================== */
let currentLightboxIndex = 0;

function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!modal || !img) return;

  function openLightbox(index) {
    currentLightboxIndex = index;
    const item = photoData[index];
    img.src = item.src;
    img.alt = item.alt;
    if (caption) {
      caption.innerHTML = `<strong>${item.title}</strong><br><span style="color: #f3c64c; font-size: 0.85rem;">${item.badge}</span>`;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function prevPhoto() {
    currentLightboxIndex = (currentLightboxIndex - 1 + photoData.length) % photoData.length;
    openLightbox(currentLightboxIndex);
  }

  function nextPhoto() {
    currentLightboxIndex = (currentLightboxIndex + 1) % photoData.length;
    openLightbox(currentLightboxIndex);
  }

  // Bind gallery cards
  const galleryCards = document.querySelectorAll('.gallery-card');
  galleryCards.forEach((card, idx) => {
    card.addEventListener('click', () => openLightbox(idx));
  });

  // Preview official biodata modal button
  const previewBiodataBtn = document.getElementById('preview-biodata-btn');
  if (previewBiodataBtn) {
    previewBiodataBtn.addEventListener('click', () => {
      img.src = 'assets/images/biodata_card.jpg';
      img.alt = 'Official Matrimonial Biodata Poster';
      if (caption) {
        caption.innerHTML = `<strong>Official Matrimonial Biodata Poster</strong><br><a href="assets/images/biodata_card.jpg" download="Mohammad_Hazi_Moinuddin_Basha_Biodata.jpg" class="btn btn-gold" style="margin-top: 10px; display: inline-flex; padding: 6px 16px; font-size: 0.85rem;">📥 Download High-Resolution Poster</a>`;
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // Hero zoom trigger
  const heroZoomBtn = document.getElementById('hero-zoom-trigger');
  if (heroZoomBtn) {
    heroZoomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const activeTab = document.querySelector('.switcher-tab.active');
      const photoKey = activeTab ? activeTab.getAttribute('data-photo') : 'formal';
      const idx = photoData.findIndex((p) => p.id === photoKey);
      openLightbox(idx !== -1 ? idx : 0);
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevPhoto(); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextPhoto(); });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
  });
}

/* ==========================================================================
   5. BIODATA TAB FILTERING
   ========================================================================== */
function initTabs() {
  const tabButtons = document.querySelectorAll('.bio-tab-btn');
  const tabPanes = document.querySelectorAll('.bio-tab-pane');

  if (!tabButtons.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.getAttribute('data-tab');

      if (targetId === 'all') {
        tabPanes.forEach((pane) => (pane.style.display = 'block'));
      } else {
        tabPanes.forEach((pane) => {
          if (pane.id === `tab-${targetId}`) {
            pane.style.display = 'block';
          } else {
            pane.style.display = 'none';
          }
        });
      }
    });
  });
}

/* ==========================================================================
   6. THEME TOGGLE (EMERALD GOLD <-> MIDNIGHT GOLD)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'midnight') {
      document.body.removeAttribute('data-theme');
      showToast('Switched to Royal Emerald Theme');
    } else {
      document.body.setAttribute('data-theme', 'midnight');
      showToast('Switched to Midnight Onyx Theme');
    }
  });
}

/* ==========================================================================
   7. SCROLL EFFECTS & NAVBAR BLUR
   ========================================================================== */
function initScrollEffects() {
  const navbar = document.querySelector('.navbar-wrapper');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Smooth scroll links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile nav if open
        document.querySelector('.nav-links')?.classList.remove('mobile-open');
      }
    });
  });
}

/* ==========================================================================
   8. COPY DETAILS & WHATSAPP SHARE
   ========================================================================== */
function initCopyAndShare() {
  const biodataSummary = `*Matrimonial Biodata - Mohammad Hazi Moinuddin Basha*
بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

• Name: Mohammad Hazi Moinuddin Basha
• Date of Birth: 30/11/1997 (~28 yrs)
• Place of Birth: Kakinada, Andhra Pradesh
• Height: 5 feet 11 inches (180 cm)
• Complexion: Fair
• Religion: Muslim (Sunni)
• Education: B.Tech., M.Tech., Ph.D. [Pursuing]
• Occupation: Assistant Professor
• Organization: VIT-AP University, Amaravati

*Family Details:*
• Father's Name: Md Mahaboob Basha
• Mother's Name: MD Parvin
• Sisters: 1 (Married)

*Address:*
• Ramachandra Towers, Flat No 402, Near Gandhi Maidyanam, Padamara Veedhi, Eluru, Andhra Pradesh

*Online Portfolio & Photos:*
${window.location.href}`;

  const copyBtns = document.querySelectorAll('.copy-biodata-btn');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(biodataSummary).then(
        () => {
          showToast('✓ Biodata copied! Ready to share on WhatsApp');
        },
        () => {
          // Fallback
          const ta = document.createElement('textarea');
          ta.value = biodataSummary;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast('✓ Biodata copied to clipboard');
        }
      );
    });
  });

  // Print PDF Button
  const printBtns = document.querySelectorAll('.print-biodata-btn');
  printBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });

  // WhatsApp share
  const waShareBtns = document.querySelectorAll('.whatsapp-share-btn');
  waShareBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const encodedMsg = encodeURIComponent(biodataSummary);
      window.open(`https://api.whatsapp.com/send?text=${encodedMsg}`, '_blank');
    });
  });

  // Contact form submission
  const contactForm = document.getElementById('inquiry-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sender-name')?.value || 'Guest';
      const city = document.getElementById('sender-city')?.value || '';
      const msg = document.getElementById('sender-msg')?.value || '';
      
      const text = `Assalamu Alaykum, my name is ${name} from ${city}. Regarding the profile of Mohammad Hazi Moinuddin Basha: ${msg}`;
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
      showToast('Connecting to WhatsApp with your message...');
    });
  }
}

/* ==========================================================================
   9. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   10. WEB AUDIO AMBIENT HARMONY CHIME
   ========================================================================== */
function initAudioAmbience() {
  const audioBtn = document.getElementById('ambient-audio-toggle');
  if (!audioBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let intervalId = null;

  // Calm pentatonic frequencies (peaceful, meditative)
  const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];

  function playChimeNote(freq) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 3.6);
  }

  function startAmbient() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // Trigger initial notes
    playChimeNote(notes[0]);
    setTimeout(() => playChimeNote(notes[2]), 400);
    setTimeout(() => playChimeNote(notes[4]), 800);

    intervalId = setInterval(() => {
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      playChimeNote(randomNote);
    }, 2800);

    isPlaying = true;
    audioBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>
    `;
    showToast('Ambient Tranquility Sound On');
  }

  function stopAmbient() {
    if (intervalId) clearInterval(intervalId);
    isPlaying = false;
    audioBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      </svg>
    `;
    showToast('Ambient Sound Muted');
  }

  audioBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startAmbient();
    } else {
      stopAmbient();
    }
  });
}

/* ==========================================================================
   11. MOBILE HAMBURGER MENU
   ========================================================================== */
function initMobileMenu() {
  const burger = document.getElementById('mobile-menu-btn');
  const nav = document.querySelector('.nav-links');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    nav.classList.toggle('mobile-open');
  });
}
