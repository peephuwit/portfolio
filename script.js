/**
 * Portfolio Single Page Application (SPA) Controller & Clean 2D Subtle-Angle Drop Physics
 */
document.addEventListener('DOMContentLoaded', () => {
  // Prevent browser zoom gestures and keyboard shortcuts
  preventPageZoom();

  // Screen elements
  const welcomeScreen = document.getElementById('welcomeScreen');
  const homeScreen = document.getElementById('homeScreen');
  const welcomeContainer = document.getElementById('welcomeContainer');
  const navLogoBtn = document.getElementById('navLogoBtn');
  const loaderDecryptedText = document.getElementById('loaderDecryptedText');
  const loadingBarFill = document.getElementById('loadingBarFill');
  const loadingPercent = document.getElementById('loadingPercent');

  // Scroll Expand Elements (React Bits ScrollExpand)
  const scrollExpandScreen = document.getElementById('scrollExpandScreen');
  const scrollExpandContainer = document.getElementById('scrollExpandContainer');
  const scrollExpandTrack = document.getElementById('scrollExpandTrack');
  const scrollExpandStage = document.getElementById('scrollExpandStage');
  const scrollExpandFrame = document.getElementById('scrollExpandFrame');
  const scrollExpandMedia = document.getElementById('scrollExpandMedia');
  const scrollExpandTitle = document.getElementById('scrollExpandTitle');
  const scrollExpandHint = document.getElementById('scrollExpandHint');

  // Bilingual Language State & Dictionary
  let currentLang = 'en';
  try {
    currentLang = localStorage.getItem('preferred_lang') || 'en';
  } catch (e) {}

  const TRANSLATIONS = {
    en: {
      heroDesc: "Computer Science student who enjoys building interactive digital experiences and turning creative ideas into functional websites.",
      aboutLead: "Hi, I'm <span class=\"highlight-name\">Peephuwit Witwarothai</span>.<br>I'm a Computer Science student who enjoys building digital experiences where technology meets creativity.",
      card1: "Building functional, reliable web applications from concept to working software.",
      card2: "Creating clean database schemas, APIs, and the core logic that powers applications.",
      card3: "Crafting intuitive interfaces, smooth motion, and engaging user experiences.",
      quote: "“I believe a good digital experience isn't just about how it works, but also how it feels.”",
      skillTagline: "Tap any key to view skill details.",
      shortcutLabel: "Shortcut Key"
    },
    th: {
      heroDesc: "นักศึกษาคณะวิทยาการคอมพิวเตอร์ที่หลงใหลการสร้างดิจิทัลประสบการณ์เชิงโต้ตอบ และเปลี่ยนไอเดียสร้างสรรค์ให้กลายเป็นเว็บไซต์ที่ใช้งานได้จริง",
      aboutLead: "สวัสดีครับ ผม <span class=\"highlight-name\">พีร์ภูวิษ วิทย์วโรทัย</span><br>นักศึกษาคณะวิทยาการคอมพิวเตอร์ที่สนุกกับการสร้างดิจิทัลประสบการณ์ ผสานโค้ดที่สะอาดเข้ากับดีไซน์ที่โต้ตอบได้",
      card1: "พัฒนาเว็บแอปพลิเคชันที่ทำงานได้จริงและเชื่อถือได้ ตั้งแต่วางคอนเซปต์จนถึงซอฟต์แวร์ที่พร้อมใช้งาน",
      card2: "ออกแบบ Database Schemas, APIs และระบบ Core Logic ที่ขับเคลื่อนการทำงานของแอปพลิเคชัน",
      card3: "ออกแบบ UI ที่เข้าใจง่าย การเคลื่อนไหวที่ลื่นไหล และมอบประสบการณ์การใช้งานที่น่าประทับใจ",
      quote: "“ผมเชื่อว่าประสบการณ์ดิจิทัลที่ดี ไม่ได้สำคัญแค่ว่ามันทำงานอย่างไร แต่สำคัญที่ว่าผู้ใช้รู้สึกอย่างไรเมื่อได้ใช้งาน”",
      skillTagline: "แตะปุ่มใดก็ได้เพื่อดูรายละเอียดของทักษะ",
      shortcutLabel: "คีย์ลัด"
    }
  };

  let homeTl = null;
  let hasTransitioned = false;
  let loadProgress = 0;
  let loadingAnimFrame = null;
  let loadingTimeout = null;

  // Decrypted Text Scrambler Engine (React Bits DecryptedText, speed 60ms)
  let decryptedTextTimer = null;
  const DECRYPT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  function runDecryptedText(el, targetText = 'pphw.dev404', speed = 60, onComplete) {
    if (!el) return;
    const len = targetText.length;
    let iteration = 0;
    const revealedIndices = new Set();

    if (decryptedTextTimer) {
      clearInterval(decryptedTextTimer);
      decryptedTextTimer = null;
    }

    // Set initial scrambled chars
    let initHtml = '';
    for (let i = 0; i < len; i++) {
      const randChar = DECRYPT_CHARS[Math.floor(Math.random() * DECRYPT_CHARS.length)];
      initHtml += `<span class="decrypted-char decrypted-char--encrypted">${randChar}</span>`;
    }
    el.innerHTML = initHtml;

    decryptedTextTimer = setInterval(() => {
      iteration++;

      // Progressively decrypt character by character from left to right (Speed 60ms)
      const shouldReveal = Math.min(len, Math.floor(iteration / 1.3));
      for (let i = 0; i < shouldReveal; i++) {
        revealedIndices.add(i);
      }

      let html = '';
      for (let i = 0; i < len; i++) {
        if (revealedIndices.has(i)) {
          html += `<span class="decrypted-char decrypted-char--revealed">${targetText[i]}</span>`;
        } else {
          const rand = DECRYPT_CHARS[Math.floor(Math.random() * DECRYPT_CHARS.length)];
          html += `<span class="decrypted-char decrypted-char--encrypted">${rand}</span>`;
        }
      }
      el.innerHTML = html;

      if (revealedIndices.size >= len) {
        clearInterval(decryptedTextTimer);
        decryptedTextTimer = null;
        let finalHtml = '';
        for (let i = 0; i < len; i++) {
          finalHtml += `<span class="decrypted-char decrypted-char--revealed">${targetText[i]}</span>`;
        }
        el.innerHTML = finalHtml;
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }
    }, speed);
  }

  // Initialize and run staged loading bar animation with Decrypted Text
  function startLoading() {
    if (loadingAnimFrame) {
      cancelAnimationFrame(loadingAnimFrame);
      loadingAnimFrame = null;
    }
    if (loadingTimeout) clearTimeout(loadingTimeout);

    loadProgress = 0;
    let isDecryptedFinished = false;

    if (loadingBarFill) {
      loadingBarFill.style.width = '0%';
    }
    if (loadingPercent) {
      loadingPercent.textContent = '0%';
    }

    // Trigger Decrypted Text with speed 60ms immediately; guarantees completion before 100%
    if (loaderDecryptedText) {
      runDecryptedText(loaderDecryptedText, 'pphw.dev404', 60, () => {
        isDecryptedFinished = true;
      });
    } else {
      isDecryptedFinished = true;
    }

    // Trigger 3D Keypad compilation in background right away
    if (typeof window.prewarmKeypad === 'function') {
      window.prewarmKeypad();
    }

    loadingTimeout = setTimeout(() => {
      if (hasTransitioned) return;

      let currentVal = 0;
      let phase = 1; // 1: 0->72%, 2: wait for decrypted to finish, 3: 72->100%

      function updateUI(val) {
        loadProgress = val;
        if (loadingBarFill) {
          loadingBarFill.style.width = `${val.toFixed(1)}%`;
        }
        if (loadingPercent) {
          loadingPercent.textContent = `${Math.floor(val)}%`;
        }
      }

      function step() {
        if (hasTransitioned) return;

        if (phase === 1) {
          // Phase 1: Smooth, quick initial fill to ~72%
          currentVal += (72 - currentVal) * 0.085 + 0.55;
          if (currentVal >= 71) {
            currentVal = 71;
            phase = 2;
          }
          updateUI(currentVal);
          loadingAnimFrame = requestAnimationFrame(step);
        } else if (phase === 2) {
          // Phase 2: Wait until pphw.dev404 has 100% finished decrypting
          if (isDecryptedFinished) {
            phase = 3;
          } else {
            // Gentle creeping while text effect finishes resolving
            if (currentVal < 82) {
              currentVal += 0.08;
              updateUI(currentVal);
            }
          }
          loadingAnimFrame = requestAnimationFrame(step);
        } else if (phase === 3) {
          // Phase 3: Decrypted text is already fully finished; bar accelerates to 100%
          currentVal += (100 - currentVal) * 0.14 + 0.85;
          if (currentVal >= 99.5) {
            currentVal = 100;
            updateUI(100);
            // Brief natural pause before ultra-smooth crossfade
            loadingTimeout = setTimeout(transitionToScrollExpand, 200);
            return;
          }
          updateUI(currentVal);
          loadingAnimFrame = requestAnimationFrame(step);
        }
      }

      loadingAnimFrame = requestAnimationFrame(step);
    }, 60);
  }

  // Smooth transition from White Preloader to Scroll Expand Stage
  function transitionToScrollExpand() {
    if (hasTransitioned) return;
    hasTransitioned = true;
    if (loadingAnimFrame) {
      cancelAnimationFrame(loadingAnimFrame);
      loadingAnimFrame = null;
    }
    if (loadingTimeout) clearTimeout(loadingTimeout);

    if (welcomeScreen && scrollExpandScreen) {
      // 1. Activate scroll expand screen directly underneath (both have pure white backgrounds)
      scrollExpandScreen.classList.remove('hidden');
      scrollExpandScreen.classList.add('active');
      initScrollExpand();

      // 2. Smoothly fade out welcome screen over scroll-expand screen with zero dark flicker
      welcomeScreen.classList.add('fade-out');

      setTimeout(() => {
        welcomeScreen.classList.remove('active', 'fade-out');
        welcomeScreen.classList.add('hidden');
      }, 650);
    } else {
      transitionToHome();
    }
  }

  // React Bits ScrollExpand Component Controller (Math & Parameters from Image 1)
  let scrollExpandRaf = null;
  let expandTargetProgress = 0;
  let expandCurrentProgress = 0;
  let expandVelocity = 0;
  let expandLastTime = 0;
  let isExpandCompleted = false;

  const clampVal = (v, min, max) => Math.min(Math.max(v, min), max);
  const smoothStepVal = (edge0, edge1, x) => {
    const t = clampVal((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
    return t * t * (3 - 2 * t);
  };

  // React Bits FoldText (Split By: Character, Hinge: Left, Ease: Power out, Color: #f7f2e8, Duration: 0.65s, Stagger: 0.045s, Perspective: 700px, Crease Shading: 0.55)
  function triggerFoldText() {
    if (!scrollExpandTitle) return;
    const words = ["Welcome", "To", "My", "PORTFOLIO", "Website"];
    
    // Split into characters preserving words & spaces with #00d2ff blue for Welcome and Website
    scrollExpandTitle.innerHTML = words.map(word => {
      const isBlue = (word.toLowerCase() === 'welcome' || word.toLowerCase() === 'website');
      const charSpans = Array.from(word).map(char => 
        `<span class="fold-char-wrapper"><span class="fold-char ${isBlue ? 'fold-char--blue' : ''}">${char}</span></span>`
      ).join('');
      return `<span class="fold-word">${charSpans}</span>`;
    }).join('<span class="fold-space">&nbsp;</span>');

    const chars = scrollExpandTitle.querySelectorAll('.fold-char');
    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf(chars);
      gsap.fromTo(chars, 
        {
          opacity: 0,
          rotationY: -90, // Hinge: Left
          transformOrigin: "0% 50%",
          filter: "brightness(0.55) contrast(1.15)" // Crease Shading: 0.55
        },
        {
          opacity: 1,
          rotationY: 0,
          filter: "brightness(1) contrast(1)",
          duration: 0.65, // Duration: 0.65s
          stagger: 0.045, // Stagger: 0.045s
          ease: "power2.out", // Ease: Power out
          delay: 0.15
        }
      );
    }
  }

  let expandWheelHandler = null;
  let expandTouchStartHandler = null;
  let expandTouchMoveHandler = null;

  function initScrollExpand() {
    if (!scrollExpandScreen || !scrollExpandFrame || !scrollExpandMedia) return;

    expandTargetProgress = 0;
    expandCurrentProgress = 0;
    expandVelocity = 0;
    expandLastTime = performance.now();
    isExpandCompleted = false;
    scrollExpandScreen.scrollTop = 0;

    const stageH = window.innerHeight || 800;
    const scrollDistancePx = 420; // Silky responsive travel: ~4-5 gentle notches or 1 fluid flick

    if (scrollExpandTrack) {
      scrollExpandTrack.style.height = `${Math.round(stageH + scrollDistancePx + 40)}px`;
    }

    window.dispatchEvent(new Event('resize'));
    triggerFoldText();

    // Reliable Hint slide-up animation driver
    let hintAlpha = 0;
    let hintY = 28;

    if (scrollExpandHint) {
      scrollExpandHint.style.opacity = '0';
      scrollExpandHint.style.transform = 'translate3d(0, 28px, 0)';

      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(scrollExpandHint);
        gsap.to({ a: 0, y: 28 }, {
          a: 1,
          y: 0,
          duration: 0.85,
          ease: "power2.out",
          delay: 0.30,
          onUpdate: function() {
            hintAlpha = this.targets()[0].a;
            hintY = this.targets()[0].y;
            if (expandCurrentProgress <= 0.002) {
              scrollExpandHint.style.opacity = hintAlpha.toFixed(3);
              scrollExpandHint.style.transform = `translate3d(0, ${hintY.toFixed(1)}px, 0)`;
            }
          }
        });
      } else {
        hintAlpha = 1;
        hintY = 0;
        scrollExpandHint.style.opacity = '1';
        scrollExpandHint.style.transform = 'translate3d(0, 0, 0)';
      }
    }

    function applyExpand(p) {
      // Direct linear mapping to smoothed progress ensures 1:1 tactile responsiveness
      // Initial: 42% x 58%, radius 24px -> End: 100% x 100%, radius 0px
      const w = 42 + (100 - 42) * p;
      const h = 58 + (100 - 58) * p;
      const ix = Math.max(0, (100 - w) / 2);
      const iy = Math.max(0, (100 - h) / 2);
      const r = Math.max(0, 24 * (1 - p));

      scrollExpandFrame.style.clipPath = `inset(${iy.toFixed(2)}% ${ix.toFixed(2)}% ${iy.toFixed(2)}% round ${r.toFixed(1)}px)`;

      // Media Zoom: 1.35 down to 1.00
      const zoom = 1.35 - 0.35 * p;
      scrollExpandMedia.style.transform = `translate3d(0, 0, 0) scale(${zoom.toFixed(4)})`;

      // Softly dissolve drop-shadow as frame reaches viewport boundaries
      if (p > 0.6) {
        const sProg = (1 - p) / 0.4;
        scrollExpandFrame.style.boxShadow = `0 ${Math.round(25 * sProg)}px ${Math.round(65 * sProg)}px rgba(0, 0, 0, ${(0.28 * sProg).toFixed(3)}), 0 ${Math.round(10 * sProg)}px ${Math.round(25 * sProg)}px rgba(0, 0, 0, ${(0.16 * sProg).toFixed(3)})`;
      } else {
        scrollExpandFrame.style.boxShadow = '';
      }

      // Title: "Welcome To My PORTFOLIO Website" fades out as frame opens up
      if (scrollExpandTitle) {
        if (p <= 0.04) {
          scrollExpandTitle.style.opacity = '';
          scrollExpandTitle.style.transform = '';
        } else if (p < 0.60) {
          const tProg = (p - 0.04) / 0.56;
          const tAlpha = Math.max(0, 1 - tProg);
          scrollExpandTitle.style.opacity = tAlpha.toFixed(3);
          scrollExpandTitle.style.transform = `translate3d(0, ${(-30 * tProg).toFixed(1)}px, 0) scale(${(1 + 0.04 * tProg).toFixed(3)})`;
        } else {
          scrollExpandTitle.style.opacity = '0';
          scrollExpandTitle.style.transform = 'translate3d(0, -30px, 0) scale(1.04)';
        }
      }

      // Hint: "Scroll inside the frame" slides up and fades out smoothly on scroll
      if (scrollExpandHint) {
        if (p > 0.002) {
          const gone = Math.min(1, p / 0.10);
          scrollExpandHint.style.opacity = (hintAlpha * (1 - gone)).toFixed(3);
          scrollExpandHint.style.transform = `translate3d(0, ${(hintY + 14 * gone).toFixed(1)}px, 0)`;
        } else {
          scrollExpandHint.style.opacity = hintAlpha.toFixed(3);
          scrollExpandHint.style.transform = `translate3d(0, ${hintY.toFixed(1)}px, 0)`;
        }
      }

      // When fully expanded (>= 99.4%): Seamlessly hand off to Home screen without hesitation
      if (p >= 0.994 && !isExpandCompleted) {
        isExpandCompleted = true;
        scrollExpandFrame.style.clipPath = 'inset(0% 0% 0% 0% round 0px)';
        scrollExpandMedia.style.transform = 'translate3d(0, 0, 0) scale(1)';
        transitionFromExpandToHome();
      }
    }

    function tickExpand(currentTime) {
      if (!currentTime) currentTime = performance.now();
      const dt = Math.min(Math.max((currentTime - expandLastTime) / 1000, 0.001), 0.035);
      expandLastTime = currentTime;

      // Critically damped mass-spring-damper (smoothTime = 0.20s)
      // Guarantees zero velocity discontinuities, continuous acceleration, and no overshoot
      const smoothTime = 0.20;
      const omega = 2 / smoothTime;
      const x = omega * dt;
      const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
      const change = expandCurrentProgress - expandTargetProgress;
      const temp = (expandVelocity + omega * change) * dt;
      expandVelocity = (expandVelocity - omega * temp) * exp;
      expandCurrentProgress = expandTargetProgress + (change + temp) * exp;

      if (Math.abs(expandTargetProgress - expandCurrentProgress) < 0.0001 && Math.abs(expandVelocity) < 0.0002) {
        expandCurrentProgress = expandTargetProgress;
        expandVelocity = 0;
      }

      applyExpand(expandCurrentProgress);

      if (!isExpandCompleted) {
        scrollExpandRaf = requestAnimationFrame(tickExpand);
      }
    }

    // Clean up existing listeners if any
    if (expandWheelHandler) {
      scrollExpandScreen.removeEventListener('wheel', expandWheelHandler);
    }
    if (expandTouchStartHandler) {
      scrollExpandScreen.removeEventListener('touchstart', expandTouchStartHandler);
    }
    if (expandTouchMoveHandler) {
      scrollExpandScreen.removeEventListener('touchmove', expandTouchMoveHandler);
    }

    // High-performance virtual wheel accumulator with delta normalization and spike dampening
    expandWheelHandler = (e) => {
      if (isExpandCompleted) return;
      e.preventDefault();
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 33.33;
      else if (e.deltaMode === 2) delta *= window.innerHeight;

      delta = clampVal(delta, -140, 140);
      expandTargetProgress = clampVal(expandTargetProgress + (delta / scrollDistancePx), 0, 1);
    };
    scrollExpandScreen.addEventListener('wheel', expandWheelHandler, { passive: false });

    let touchStartY = 0;
    expandTouchStartHandler = (e) => {
      if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
    };
    expandTouchMoveHandler = (e) => {
      if (isExpandCompleted || !e.touches || !e.touches[0]) return;
      e.preventDefault();
      const curY = e.touches[0].clientY;
      const deltaY = (touchStartY - curY) * 1.2;
      touchStartY = curY;
      expandTargetProgress = clampVal(expandTargetProgress + (deltaY / scrollDistancePx), 0, 1);
    };
    scrollExpandScreen.addEventListener('touchstart', expandTouchStartHandler, { passive: true });
    scrollExpandScreen.addEventListener('touchmove', expandTouchMoveHandler, { passive: false });

    applyExpand(0);
    if (scrollExpandRaf) cancelAnimationFrame(scrollExpandRaf);
    scrollExpandRaf = requestAnimationFrame(tickExpand);
  }

  function transitionFromExpandToHome() {
    if (scrollExpandRaf) {
      cancelAnimationFrame(scrollExpandRaf);
      scrollExpandRaf = null;
    }

    // Clean up wheel and touch listeners
    if (expandWheelHandler) {
      scrollExpandScreen.removeEventListener('wheel', expandWheelHandler);
      expandWheelHandler = null;
    }
    if (expandTouchStartHandler) {
      scrollExpandScreen.removeEventListener('touchstart', expandTouchStartHandler);
      expandTouchStartHandler = null;
    }
    if (expandTouchMoveHandler) {
      scrollExpandScreen.removeEventListener('touchmove', expandTouchMoveHandler);
      expandTouchMoveHandler = null;
    }

    // Instant seamless handoff: switch screens in a single frame with zero black flash or jitter
    scrollExpandScreen.classList.remove('active');
    scrollExpandScreen.classList.add('hidden');

    homeScreen.classList.remove('hidden');
    homeScreen.classList.add('active');
    homeScreen.scrollTop = 0;
    hasUserScrolledHome = false;
    if (typeof resetHomeSmoothScroll === 'function') resetHomeSmoothScroll();

    if (typeof handleHeroScrollZoom === 'function') handleHeroScrollZoom();

    if (window.resetBadgeToTop) {
      window.resetBadgeToTop();
    } else {
      window._pendingBadgeDrop = true;
    }

    // Play Home screen animations (Navbar, Sphere, Typewriter, Lanyard Badge)
    animateHomeEntrance();
    initAboutScrollReveal();
    initPaperPlaneFlight();
    if (typeof initSpecularButtons === 'function') initSpecularButtons();

    setTimeout(() => {
      const activeLink = document.querySelector('.nav-link.active');
      if (activeLink) updateNavIndicator(activeLink, true);
      if (typeof updateLanguageIndicator === 'function') updateLanguageIndicator(false);
    }, 50);
  }

  // Smooth transition from Welcome Screen to Home Screen (Direct Fallback)
  function transitionToHome() {
    if (hasTransitioned) return;
    hasTransitioned = true;
    if (loadingAnimFrame) {
      cancelAnimationFrame(loadingAnimFrame);
      loadingAnimFrame = null;
    }
    if (loadingTimeout) clearTimeout(loadingTimeout);

    // Safety: ensure Keypad prewarm is triggered if user skipped early
    if (typeof window.prewarmKeypad === 'function') {
      window.prewarmKeypad();
    }

    if (welcomeScreen && homeScreen) {
      // 1. Gently fade out the entire welcome screen (elements gradually become transparent via original CSS)
      welcomeScreen.classList.add('fade-out');

      // 2. After the graceful fade-out completes, switch to the Home screen
      setTimeout(() => {
        welcomeScreen.classList.remove('active', 'fade-out');
        welcomeScreen.classList.add('hidden');

        homeScreen.classList.remove('hidden');
        homeScreen.classList.add('active');
        homeScreen.scrollTop = 0;
        hasUserScrolledHome = false;
        if (typeof resetHomeSmoothScroll === 'function') resetHomeSmoothScroll();
        if (typeof handleHeroScrollZoom === 'function') handleHeroScrollZoom();

        // 1. Ensure badge is completely off-screen at the top when entering Home
        if (window.resetBadgeToTop) {
          window.resetBadgeToTop();
        } else {
          window._pendingBadgeDrop = true;
        }

        // 2. Initialize and position sliding navbar indicator on active link
        setTimeout(() => {
          const activeLink = document.querySelector('.nav-link.active');
          if (activeLink) updateNavIndicator(activeLink, true);
          if (typeof updateLanguageIndicator === 'function') updateLanguageIndicator(false);
        }, 50);

        // 3. Trigger Home Screen Entrance (GSAP) & other pages reveal
        animateHomeEntrance();
        initAboutScrollReveal();
        initPaperPlaneFlight();
        if (typeof initSpecularButtons === 'function') initSpecularButtons();
        if (typeof window._updateScrollFloat === 'function') window._updateScrollFloat(true);
      }, 750);
    }
  }

  // Home Screen Scroll Lock (User request: Wait until all home entrance elements are fully loaded before allowing scroll to #about)
  let isHomeScrollLocked = false;

  function lockHomeScroll() {
    isHomeScrollLocked = true;
    if (homeScreen) {
      homeScreen.classList.add('scroll-locked');
      homeScreen.scrollTop = 0;
    }
  }

  function unlockHomeScroll() {
    isHomeScrollLocked = false;
    if (homeScreen) {
      homeScreen.classList.remove('scroll-locked');
    }
    if (typeof window._updateScrollFloat === 'function') {
      window._updateScrollFloat(true);
    }
  }

  if (homeScreen) {
    homeScreen.addEventListener('wheel', (e) => {
      if (isHomeScrollLocked) {
        e.preventDefault();
      }
    }, { passive: false });

    homeScreen.addEventListener('touchmove', (e) => {
      if (isHomeScrollLocked) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  // Mobile Hero Scroll-Triggered Animation Controllers
  let mobileHeroTl = null;
  let hasHeroAnimatedOnMobile = false;

  function resetMobileHeroState() {
    if (window.innerWidth > 768) return;
    if (mobileHeroTl) {
      mobileHeroTl.kill();
      mobileHeroTl = null;
    }
    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf([
        '.hero-greeting',
        '.hero-name',
        '.hero-sub-student',
        '.hero-sub-role',
        '.hero-desc',
        '.hero-cta-group'
      ]);
      // Set all elements to clean baseline (x: 0, y: 0 for name so it NEVER overlaps student below)
      gsap.set(['.hero-greeting', '.hero-sub-student', '.hero-sub-role', '.hero-desc', '.hero-cta-group'], {
        opacity: 0,
        y: 20,
        x: 0
      });
      gsap.set('.hero-name', {
        opacity: 0,
        y: 0,
        x: 0
      });
    }
    const nameEl = document.getElementById('typewriterName');
    if (nameEl) nameEl.textContent = '';
    const cursorEl = document.getElementById('nameCursor');
    if (cursorEl) cursorEl.style.opacity = '0';
    if (nameTypewriterTimeout) {
      clearTimeout(nameTypewriterTimeout);
      nameTypewriterTimeout = null;
    }
    if (typewriterTimeout) {
      clearTimeout(typewriterTimeout);
      typewriterTimeout = null;
    }
  }

  function playMobileHeroEntrance() {
    if (mobileHeroTl) {
      mobileHeroTl.kill();
      mobileHeroTl = null;
    }

    if (typeof gsap === 'undefined') {
      startNameTypewriter(200);
      startTypewriter(2000);
      return;
    }

    const smoothEase = 'cubic-bezier(0.16, 1, 0.3, 1)';
    mobileHeroTl = gsap.timeline();

    // 1. Hero Greeting "Hello, I'm" pops up
    mobileHeroTl.fromTo('.hero-greeting',
      { opacity: 0, y: 20, x: 0, scale: 0.92 },
      { opacity: 1, y: 0, x: 0, scale: 1, duration: 0.60, ease: smoothEase },
      0
    );

    // 2. Hero Name "PEEPHUWIT" Types out in-place (strictly y: 0, x: 0 so it NEVER overlaps subtitle)
    mobileHeroTl.fromTo('.hero-name',
      { opacity: 0, y: 0, x: 0 },
      { opacity: 1, y: 0, x: 0, duration: 0.20, ease: 'power1.out' },
      0.15
    );
    startNameTypewriter(200);

    // 3. "Computer Science Student" slides up
    mobileHeroTl.fromTo('.hero-sub-student',
      { opacity: 0, y: 20, x: 0 },
      { opacity: 1, y: 0, x: 0, duration: 0.60, ease: smoothEase },
      0.40
    );

    // 4. Role (Developer <-> Creative Designer) centered and slides in (strictly x: 0)
    mobileHeroTl.fromTo('.hero-sub-role',
      { opacity: 0, y: 20, x: 0 },
      { opacity: 1, y: 0, x: 0, duration: 0.60, ease: smoothEase },
      0.60
    );
    startTypewriter(1800);

    // 5. Description paragraph slides up
    mobileHeroTl.fromTo('.hero-desc',
      { opacity: 0, y: 20, x: 0 },
      { opacity: 1, y: 0, x: 0, duration: 0.60, ease: smoothEase },
      0.80
    );

    // 6. Compact Symmetrical CTA Buttons group slides up
    mobileHeroTl.fromTo('.hero-cta-group',
      { opacity: 0, y: 20, x: 0 },
      { opacity: 1, y: 0, x: 0, duration: 0.65, ease: smoothEase },
      0.95
    );
  }

  function initMobileHeroScrollTrigger() {
    const heroEl = document.querySelector('.hero-section');
    const homeScreen = document.getElementById('homeScreen');
    if (!heroEl || !homeScreen) return;

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (window.innerWidth <= 768) {
          if (entry.isIntersecting && !hasHeroAnimatedOnMobile) {
            hasHeroAnimatedOnMobile = true;
            playMobileHeroEntrance();
          }
        }
      }, {
        root: homeScreen,
        threshold: 0.12
      });
      observer.observe(heroEl);
    }

    // Scroll listener fallback & reset when user scrolls all the way back up to the badge view
    homeScreen.addEventListener('scroll', () => {
      if (window.innerWidth <= 768) {
        if (homeScreen.scrollTop < 40) {
          if (hasHeroAnimatedOnMobile) {
            hasHeroAnimatedOnMobile = false;
            resetMobileHeroState();
          }
        } else if (!hasHeroAnimatedOnMobile) {
          const vh = window.innerHeight || 800;
          if (homeScreen.scrollTop > vh * 0.20) {
            hasHeroAnimatedOnMobile = true;
            playMobileHeroEntrance();
          }
        }
      }
    }, { passive: true });
  }

  // Orchestrated Home Screen Entrance Timeline
  function animateHomeEntrance() {
    lockHomeScroll();

    if (homeTl) {
      homeTl.kill();
      homeTl = null;
    }

    if (typeof window.refreshScrollVelocity === 'function') {
      window.refreshScrollVelocity();
    }

    const isMobile = window.innerWidth <= 768;

    if (typeof gsap === 'undefined') {
      if (!isMobile) {
        startNameTypewriter(650);
        startTypewriter(4200);
      } else {
        hasHeroAnimatedOnMobile = false;
        resetMobileHeroState();
      }
      setTimeout(() => {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) updateNavIndicator(activeLink, true);
        if (window.triggerBadgeDrop) {
          window.triggerBadgeDrop();
        } else {
          window._pendingBadgeDrop = true;
        }
        unlockHomeScroll();
      }, 500);
      return;
    }

    document.body.classList.add('gsap-enabled');

    gsap.killTweensOf([
      '.navbar-wrapper',
      '.hero-greeting',
      '.hero-name',
      '.hero-sub-student',
      '.hero-sub-role',
      '.hero-desc',
      '.hero-cta-group',
      '.hero-cta-group .cta-btn',
      '.sphere-3d-wrapper'
    ]);

    const smoothEase = 'cubic-bezier(0.16, 1, 0.3, 1)';

    homeTl = gsap.timeline({
      onComplete: () => {
        unlockHomeScroll();
      }
    });

    if (isMobile) {
      // On mobile: badge is seen first! Text animations are held until scrolling down to hero
      hasHeroAnimatedOnMobile = false;
      resetMobileHeroState();

      // Navbar drops down smoothly
      homeTl.fromTo('.navbar-wrapper',
        { y: -80, opacity: 1 },
        { y: 0, opacity: 1, duration: 0.65, ease: smoothEase, onComplete: () => {
          const activeLink = document.querySelector('.nav-link.active');
          if (activeLink) updateNavIndicator(activeLink, true);
        }},
        0.10
      );

      // 3D Sphere Background
      homeTl.fromTo('.sphere-3d-wrapper',
        { opacity: 0, scale: 0.68, y: 60 },
        { opacity: 1, scale: 1, y: 0, duration: 1.20, ease: smoothEase },
        0.35
      );

      // Drop 3D badge smoothly at 0.5s
      setTimeout(() => {
        if (window.triggerBadgeDrop) {
          window.triggerBadgeDrop();
        } else {
          window._pendingBadgeDrop = true;
        }
      }, 500);

      // Unlock scroll after badge entrance so user can scroll down
      setTimeout(unlockHomeScroll, 650);
      return;
    }

    // Safety fallback timer to unlock scroll after 2.6s (desktop)
    setTimeout(unlockHomeScroll, 2600);

    // Desktop: side-by-side entrance
    // 1. 3D Sphere Background pops up
    homeTl.fromTo('.sphere-3d-wrapper',
      { opacity: 0, scale: 0.68, y: 60 },
      { opacity: 1, scale: 1, y: 0, duration: 1.20, ease: smoothEase },
      0.35
    );

    // 2. Hero Greeting "Hello, I'm" pops up: delay 0.35s, duration 0.80s
    homeTl.fromTo('.hero-greeting',
      { opacity: 0, y: 32, scale: 0.85 },
      { opacity: 1, y: 0, scale: 1, duration: 0.80, ease: smoothEase },
      0.35
    );

    // 3. Navbar drops down from top
    homeTl.fromTo('.navbar-wrapper',
      { y: -80, opacity: 1 },
      { y: 0, opacity: 1, duration: 0.65, ease: smoothEase, onComplete: () => {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) updateNavIndicator(activeLink, true);
      }},
      0.10
    );

    // 4. Hero Name "PEEPHUWIT" Types out in-place with cyber cursor
    homeTl.fromTo('.hero-name',
      { opacity: 0, x: 0 },
      { opacity: 1, x: 0, duration: 0.20, ease: 'power1.out' },
      0.60
    );

    // 5. "Computer Science Student" slides up: delay 0.95s, duration 0.75s
    homeTl.fromTo('.hero-sub-student',
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 0.75, ease: smoothEase },
      0.95
    );

    // 6. Role (Software Developer) slides in from right: delay 1.25s, duration 0.85s
    homeTl.fromTo('.hero-sub-role',
      { opacity: 0, x: 110 },
      { opacity: 1, x: 0, duration: 0.85, ease: smoothEase },
      1.25
    );

    // 7. Description paragraph slides up: delay 1.45s, duration 0.80s
    homeTl.fromTo('.hero-desc',
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 0.80, ease: smoothEase },
      1.45
    );

    // 8. CTA Buttons group slides up: delay 1.65s, duration 0.85s
    homeTl.fromTo('.hero-cta-group',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.85, ease: smoothEase },
      1.65
    );

    // 9. Drop the 3D lanyard badge smoothly at exactly 0.5s (500ms)
    setTimeout(() => {
      if (window.triggerBadgeDrop) {
        window.triggerBadgeDrop();
      } else {
        window._pendingBadgeDrop = true;
      }
    }, 500);

    // 10. Start typewriter for PEEPHUWIT (starts typing at 0.65s)
    startNameTypewriter(650);

    // 11. Start typewriter after Developer settles into position and pauses for ~2.1s
    startTypewriter(4200);
  }

  // GSAP Micro-interactions for buttons, logo, badges, and nav
  function initGSAPMicroInteractions() {
    if (typeof gsap === 'undefined') return;

    // CTA Buttons interactive bounce
    const ctaBtns = document.querySelectorAll('.cta-btn');
    ctaBtns.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.05, y: -4, duration: 0.24, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, y: 0, duration: 0.28, ease: 'power2.inOut' });
      });
      btn.addEventListener('mousedown', () => {
        gsap.to(btn, { scale: 0.96, duration: 0.1, ease: 'power1.out' });
      });
      btn.addEventListener('mouseup', () => {
        gsap.to(btn, { scale: 1.05, duration: 0.15, ease: 'back.out(2)' });
      });
    });

    // Nav Logo hover pulse
    if (navLogoBtn) {
      navLogoBtn.addEventListener('mouseenter', () => {
        gsap.to(navLogoBtn, { scale: 1.07, letterSpacing: '1px', duration: 0.25, ease: 'power2.out' });
      });
      navLogoBtn.addEventListener('mouseleave', () => {
        gsap.to(navLogoBtn, { scale: 1, letterSpacing: '0.5px', duration: 0.25, ease: 'power2.out' });
      });
    }

    // Nav links subtle hover micro-shift
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        if (!link.classList.contains('active')) {
          gsap.to(link, { y: -2, scale: 1.04, duration: 0.2, ease: 'power1.out' });
        }
      });
      link.addEventListener('mouseleave', () => {
        gsap.to(link, { y: 0, scale: 1, duration: 0.2, ease: 'power1.inOut' });
      });
    });
  }

  // Return to Welcome Screen when clicking the nav logo
  function transitionToWelcome(e) {
    if (e) e.preventDefault();
    if (!hasTransitioned) return;

    if (homeTl) homeTl.kill();
    if (typewriterTimeout) clearTimeout(typewriterTimeout);
    if (nameTypewriterTimeout) clearTimeout(nameTypewriterTimeout);
    if (scrollExpandRaf) {
      cancelAnimationFrame(scrollExpandRaf);
      scrollExpandRaf = null;
    }

    if (scrollExpandScreen) {
      scrollExpandScreen.classList.remove('active', 'fade-out');
      scrollExpandScreen.classList.add('hidden');
    }

    if (welcomeScreen && homeScreen) {
      homeScreen.classList.add('fade-out');

      setTimeout(() => {
        homeScreen.classList.remove('active', 'fade-out');
        homeScreen.classList.add('hidden');
        homeScreen.scrollTop = 0;
        hasUserScrolledHome = false;
        if (typeof handleHeroScrollZoom === 'function') handleHeroScrollZoom();

        hasTransitioned = false;
        welcomeScreen.classList.remove('hidden', 'fade-out');
        welcomeScreen.classList.add('active');
        if (window.resetBadgeToTop) {
          window.resetBadgeToTop();
        }
        startLoading();
      }, 550);
    }
  }

  // Event Listeners for Page Navigation
  if (welcomeContainer) {
    welcomeContainer.addEventListener('click', transitionToScrollExpand);
  }

  if (navLogoBtn) {
    navLogoBtn.addEventListener('click', transitionToWelcome);
  }

  // Rubber Segment Active Indicator Pill Controller for Navbar (React Bits style)
  const navLinksContainer = document.querySelector('.nav-links');
  let navIndicator = document.getElementById('navIndicator');
  if (navLinksContainer && !navIndicator) {
    navIndicator = document.createElement('div');
    navIndicator.className = 'nav-indicator';
    navIndicator.id = 'navIndicator';
    navLinksContainer.prepend(navIndicator);
  }

  const heroSection = document.querySelector('.hero-section');

  const indicatorState = {
    l: 0,
    r: 0,
    top: 0,
    height: 0,
    scaleY: 1
  };

  let rubberTimeline = null;
  let isIndicatorInitialized = false;

  function renderIndicator() {
    if (!navIndicator) return;
    const width = Math.max(0, indicatorState.r - indicatorState.l);
    navIndicator.style.transform = `translate3d(${indicatorState.l}px, ${indicatorState.top}px, 0) scaleY(${indicatorState.scaleY})`;
    navIndicator.style.width = `${width}px`;
    navIndicator.style.height = `${indicatorState.height}px`;
    navIndicator.style.opacity = '1';
  }

  function getNavSlots() {
    if (!navLinksContainer) return [];
    const navRect = navLinksContainer.getBoundingClientRect();
    const links = Array.from(navLinksContainer.querySelectorAll('.nav-link'));
    return links.map(link => {
      const rect = link.getBoundingClientRect();
      return {
        link: link,
        l: rect.left - navRect.left,
        r: rect.right - navRect.left,
        top: rect.top - navRect.top,
        height: rect.height,
        width: rect.width
      };
    });
  }

  function updateNavIndicator(targetLink, isImmediate = false) {
    if (!targetLink || !navIndicator || !navLinksContainer) return;

    const navRect = navLinksContainer.getBoundingClientRect();
    const targetRect = targetLink.getBoundingClientRect();

    if (navRect.width === 0 || targetRect.width === 0) return;

    const b = {
      l: targetRect.left - navRect.left,
      r: targetRect.right - navRect.left,
      top: targetRect.top - navRect.top,
      height: targetRect.height,
      width: targetRect.width
    };

    if (isImmediate || !isIndicatorInitialized || typeof gsap === 'undefined') {
      if (rubberTimeline) {
        rubberTimeline.kill();
        rubberTimeline = null;
      }
      indicatorState.l = b.l;
      indicatorState.r = b.r;
      indicatorState.top = b.top;
      indicatorState.height = b.height;
      indicatorState.scaleY = 1;
      renderIndicator();
      isIndicatorInitialized = true;
      return;
    }

    const a = { l: indicatorState.l, r: indicatorState.r };
    const distance = Math.abs(b.l - a.l);

    if (distance < 2) {
      indicatorState.l = b.l;
      indicatorState.r = b.r;
      indicatorState.top = b.top;
      indicatorState.height = b.height;
      indicatorState.scaleY = 1;
      renderIndicator();
      return;
    }

    if (rubberTimeline) {
      rubberTimeline.kill();
      rubberTimeline = null;
    }

    const dir = b.l > a.l ? 1 : -1;
    const leadEdge = dir > 0 ? 'r' : 'l';
    const trailEdge = dir > 0 ? 'l' : 'r';
    const leadTarget = dir > 0 ? b.r : b.l;
    const trailTarget = dir > 0 ? b.l : b.r;

    // React Bits Rubber Segment physics:
    // Stretch thins height (volume conservation), squash bulges height on impact
    const stretchY = Math.max(0.84, 1 - Math.min(distance / 700, 0.16));
    const squashPx = Math.min(7, Math.max(3, Math.round(distance * 0.045)));
    const squashY = Math.min(1.12, 1 + Math.min(distance / 700, 0.12));

    rubberTimeline = gsap.timeline({
      onUpdate: renderIndicator
    });

    if (indicatorState.top !== b.top || indicatorState.height !== b.height) {
      rubberTimeline.to(indicatorState, {
        top: b.top,
        height: b.height,
        duration: 0.28,
        ease: 'power2.out'
      }, 0);
    }

    // 1. Dilate / Stretch phase:
    // Lead edge rushes towards target, trail edge lags behind to stretch across gap
    const trailLag = dir > 0 ? a.l + (b.l - a.l) * 0.14 : a.r + (b.r - a.r) * 0.14;

    rubberTimeline.to(indicatorState, {
      [leadEdge]: leadTarget,
      scaleY: stretchY,
      duration: 0.19,
      ease: 'power3.out'
    }, 0);

    rubberTimeline.to(indicatorState, {
      [trailEdge]: trailLag,
      duration: 0.19,
      ease: 'power1.in'
    }, 0);

    // 2. Landing Squash phase:
    // Trail edge overshoots into target slot by squashPx (compressing pill horizontally)
    rubberTimeline.to(indicatorState, {
      [trailEdge]: trailTarget + dir * squashPx,
      scaleY: squashY,
      duration: 0.16,
      ease: 'power2.out'
    }, 0.15);

    // 3. Rebound & Relax phase:
    // Trail edge rebounds back to exact slot boundary with spring damping, scaleY returns to 1
    rubberTimeline.to(indicatorState, {
      [trailEdge]: trailTarget,
      scaleY: 1.0,
      duration: 0.24,
      ease: 'elastic.out(1.25, 0.42)'
    }, 0.31);
  }

  // Helper to switch active navbar link and slide indicator
  function setActiveNavLink(targetLink, isImmediate = false) {
    if (!targetLink) return;
    const links = document.querySelectorAll('.nav-link');
    if (targetLink.classList.contains('active')) {
      updateNavIndicator(targetLink, isImmediate);
      return;
    }
    links.forEach(l => l.classList.remove('active'));
    targetLink.classList.add('active');
    updateNavIndicator(targetLink, isImmediate);
  }

  // Grab, Drag & Flick Gesture Controller for Rubber Segment
  let isDraggingNavThumb = false;
  let dragStartX = 0;
  let dragStartL = 0;
  let dragWidth = 0;
  let dragPointerId = null;
  let dragPointerHistory = [];
  let hasMovedEnoughToDrag = false;
  let justFinishedNavDrag = false;

  function initRubberSegmentDrag() {
    if (!navLinksContainer) return;

    navLinksContainer.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      const navRect = navLinksContainer.getBoundingClientRect();
      const pointerX = e.clientX - navRect.left;

      const thumbMargin = 12;
      const isOnThumb = (pointerX >= indicatorState.l - thumbMargin) && 
                        (pointerX <= indicatorState.r + thumbMargin);

      if (!isOnThumb) return;

      isDraggingNavThumb = true;
      hasMovedEnoughToDrag = false;
      dragPointerId = e.pointerId;
      dragStartX = pointerX;
      dragStartL = indicatorState.l;
      dragWidth = indicatorState.r - indicatorState.l;
      dragPointerHistory = [[Date.now(), pointerX]];

      if (rubberTimeline) {
        rubberTimeline.kill();
        rubberTimeline = null;
      }

      try {
        navLinksContainer.setPointerCapture(e.pointerId);
      } catch (err) {}
    });

    navLinksContainer.addEventListener('pointermove', (e) => {
      if (!isDraggingNavThumb || e.pointerId !== dragPointerId) return;

      const navRect = navLinksContainer.getBoundingClientRect();
      const pointerX = e.clientX - navRect.left;

      dragPointerHistory.push([Date.now(), pointerX]);
      if (dragPointerHistory.length > 10) dragPointerHistory.shift();

      const deltaX = pointerX - dragStartX;

      if (!hasMovedEnoughToDrag) {
        if (Math.abs(deltaX) > 4) {
          hasMovedEnoughToDrag = true;
          navLinksContainer.dataset.held = 'true';
          navIndicator.classList.add('is-held');
        } else {
          return;
        }
      }

      let newL = dragStartL + deltaX;
      const trackWidth = navLinksContainer.clientWidth;
      const maxL = trackWidth - dragWidth;

      // React Bits Apple-style rubber-band resistance outside bounds
      const RUBBER_COEFF = 0.55;
      if (newL < 0) {
        const over = -newL;
        newL = -(over * dragWidth * RUBBER_COEFF) / (dragWidth + RUBBER_COEFF * over);
      } else if (newL > maxL) {
        const over = newL - maxL;
        newL = maxL + (over * dragWidth * RUBBER_COEFF) / (dragWidth + RUBBER_COEFF * over);
      }

      indicatorState.l = newL;
      indicatorState.r = newL + dragWidth;
      indicatorState.scaleY = 0.96;
      renderIndicator();
    });

    function finishDrag(e) {
      if (!isDraggingNavThumb || (e && e.pointerId !== dragPointerId)) return;

      isDraggingNavThumb = false;
      try {
        if (dragPointerId !== null) navLinksContainer.releasePointerCapture(dragPointerId);
      } catch (err) {}
      dragPointerId = null;

      delete navLinksContainer.dataset.held;
      navIndicator.classList.remove('is-held');

      if (!hasMovedEnoughToDrag) {
        indicatorState.scaleY = 1.0;
        renderIndicator();
        return;
      }

      justFinishedNavDrag = true;
      setTimeout(() => { justFinishedNavDrag = false; }, 100);

      // 1. Calculate release velocity
      const now = Date.now();
      const recent = dragPointerHistory.filter(([t]) => now - t <= 100);
      let velocity = 0;
      if (recent.length >= 2) {
        const [t0, x0] = recent[0];
        const [t1, x1] = recent[recent.length - 1];
        if (t1 - t0 >= 8) {
          velocity = ((x1 - x0) / (t1 - t0)) * 1000;
        }
      }
      velocity = Math.max(-2000, Math.min(2000, velocity));

      // 2. Momentum projection (glide)
      const glide = 75;
      const d = 1 - 0.1 * Math.pow(0.05, glide / 100);
      const projection = ((velocity / 1000) * d) / (1 - d);
      const currentCenter = (indicatorState.l + indicatorState.r) / 2;
      const landingCenter = currentCenter + projection;

      // 3. Find closest slot
      const slots = getNavSlots();
      if (!slots.length) return;

      let bestIndex = 0;
      let bestDist = Infinity;
      slots.forEach((s, idx) => {
        const slotCenter = (s.l + s.r) / 2;
        const dist = Math.abs(slotCenter - landingCenter);
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = idx;
        }
      });

      const flickThreshold = 120;
      const activeLink = document.querySelector('.nav-link.active');
      const activeIndex = slots.findIndex(s => s.link === activeLink);
      if (Math.abs(velocity) > flickThreshold && bestIndex === activeIndex) {
        const step = Math.sign(velocity);
        bestIndex = Math.max(0, Math.min(slots.length - 1, bestIndex + step));
      }

      const targetSlot = slots[bestIndex];
      const targetLink = targetSlot.link;

      if (targetLink) {
        const targetId = targetLink.getAttribute('href');
        smoothNavigateTo(targetId, targetLink);
      }
    }

    navLinksContainer.addEventListener('pointerup', finishDrag);
    navLinksContainer.addEventListener('pointercancel', finishDrag);
  }

  let hasUserScrolledHome = false;

  function isDesktopZoomEnabled() {
    if (typeof window === 'undefined') return false;
    // Mobile or tablet screen width (<= 1180px covers iPads in portrait and most landscape)
    if (window.innerWidth <= 1180) return false;
    // Touchscreen / iPad detection (including iPad Pro 12.9" which is 1024x1366px)
    const isTouch = (navigator.maxTouchPoints > 1) || ('ontouchstart' in window);
    const isIPad = /iPad/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isTabletUA = /Tablet|iPad|PlayBook|Silk|Android(?!.*Mobile)/i.test(navigator.userAgent);
    if ((isTouch && isIPad) || isTabletUA) return false;
    // Coarse pointer without hover (tablets and mobile touch devices)
    if (window.matchMedia && window.matchMedia('(pointer: coarse) and (hover: none)').matches) {
      return false;
    }
    return true;
  }

  // Dynamic Scroll Zoom: Smoothly zoom out Home, About Me, and Portfolio when scrolling through sections (Desktop only)
  function handleHeroScrollZoom() {
    const scrollContainer = document.getElementById('homeScreen');
    const hero = heroSection || document.getElementById('home');
    if (!scrollContainer) return;

    const scrollTop = scrollContainer.scrollTop;
    if (scrollTop > 0) {
      hasUserScrolledHome = true;
    }

    const aboutSection = document.getElementById('about');
    const aboutContainer = aboutSection ? aboutSection.querySelector('.about-container') : null;
    const portfolioSection = document.getElementById('portfolio');
    const portfolioContainer = portfolioSection ? portfolioSection.querySelector('.portfolio-container') : null;

    const lanyardCanvas = document.getElementById('lanyard3dCanvas');
    const sphereWrapper = document.querySelector('.sphere-3d-wrapper');

    // On mobile and tablet/iPad devices: completely disable zoom-out scaling during scroll and page switching
    if (!isDesktopZoomEnabled()) {
      if (hero) {
        hero.style.transform = '';
        hero.style.opacity = '';
        hero.style.pointerEvents = 'auto';
      }
      if (lanyardCanvas) {
        lanyardCanvas.style.transform = '';
        lanyardCanvas.style.opacity = '';
        lanyardCanvas.style.pointerEvents = 'auto';
      }
      if (sphereWrapper) {
        sphereWrapper.style.transform = '';
        sphereWrapper.style.opacity = '';
      }
      if (aboutContainer) {
        aboutContainer.style.transform = '';
        aboutContainer.style.opacity = '';
        aboutContainer.style.pointerEvents = 'auto';
      }
      if (portfolioContainer) {
        portfolioContainer.style.transform = '';
        portfolioContainer.style.opacity = '';
        portfolioContainer.style.pointerEvents = 'auto';
      }
      return;
    }

    // -------------------------------------------------------------------------
    // PAGE 1: HERO SECTION DYNAMIC SCROLL ZOOM-OUT (slower, more gradual)
    // -------------------------------------------------------------------------
    if (hero) {
      // Extended zoom distance for a slower, calmer zoom rate
      const threshold = aboutSection && aboutSection.offsetTop > 200
        ? Math.max(aboutSection.offsetTop + 180, 680)
        : Math.max(hero.offsetHeight * 1.15, 620);

      const rawProgress = Math.min(Math.max(scrollTop / threshold, 0), 1);
      // Gentle exponential easing: zoom starts very softly
      const progress = Math.pow(rawProgress, 1.25);

      if (progress > 0.001) {
        // More pronounced zoom-out shrinkage: scale down to ~0.76
        const heroScale = 1 - progress * 0.24;
        const heroOpacity = Math.max(0, 1 - progress * 1.05);
        const heroTranslateY = progress * 46;

        hero.style.transform = `scale(${heroScale.toFixed(4)}) translateY(${heroTranslateY.toFixed(1)}px)`;
        hero.style.opacity = heroOpacity.toFixed(3);
        hero.style.pointerEvents = progress > 0.65 ? 'none' : 'auto';

        // 3D Lanyard ID Badge: deeper zoom out
        if (lanyardCanvas) {
          const lanyardScale = 1 - progress * 0.20;
          const lanyardOpacity = Math.max(0, 1 - progress * 1.10);
          const lanyardTranslateY = progress * 36;

          lanyardCanvas.style.transform = `scale(${lanyardScale.toFixed(4)}) translateY(${lanyardTranslateY.toFixed(1)}px)`;
          lanyardCanvas.style.opacity = lanyardOpacity.toFixed(3);
          lanyardCanvas.style.pointerEvents = progress > 0.55 ? 'none' : 'auto';
        }

        // Background 3D Sphere: atmospheric zoom-out
        if (sphereWrapper) {
          const sphereScale = 1 - progress * 0.16;
          const sphereOpacity = Math.max(0.35, 1 - progress * 0.55);
          const sphereTranslateY = progress * 24;

          sphereWrapper.style.transform = `scale(${sphereScale.toFixed(4)}) translateY(${sphereTranslateY.toFixed(1)}px)`;
          sphereWrapper.style.opacity = sphereOpacity.toFixed(3);
        }
      } else {
        // Exactly at the top (scrollTop === 0): Zoom in completely restored to 100% original position
        hero.style.transform = '';
        hero.style.opacity = '1';
        hero.style.pointerEvents = 'auto';

        if (lanyardCanvas) {
          lanyardCanvas.style.transform = '';
          lanyardCanvas.style.opacity = '';
          lanyardCanvas.style.pointerEvents = 'auto';
        }

        if (sphereWrapper && hasUserScrolledHome) {
          // Return sphere to exact original entrance position and 100% opacity
          sphereWrapper.style.transform = 'scale(1) translateY(0px)';
          sphereWrapper.style.opacity = '1';
        }
      }
    }

    // -------------------------------------------------------------------------
    // PAGE 2: ABOUT ME SECTION DYNAMIC SCROLL ZOOM-OUT (deeper shrinkage)
    // -------------------------------------------------------------------------
    if (aboutContainer && aboutSection) {
      const aboutTop = aboutSection.offsetTop;
      const aboutHeight = aboutSection.offsetHeight;
      const containerHeight = scrollContainer.clientHeight || window.innerHeight;
      const portfolioTop = portfolioSection && portfolioSection.offsetTop > aboutTop
        ? portfolioSection.offsetTop
        : (aboutTop + aboutHeight);

      // Only begin zooming out when user has scrolled through all of About Me content
      // and Portfolio is rising up into the viewport
      const aboutExitStart = Math.max(portfolioTop - containerHeight * 0.95, aboutTop + Math.max(aboutHeight - containerHeight * 0.95, 200));
      // Extended exit distance for a gradual, smooth transition
      const aboutExitDistance = Math.max(containerHeight * 1.35, 620);

      if (scrollTop > aboutExitStart) {
        const rawProgress = Math.min(Math.max((scrollTop - aboutExitStart) / aboutExitDistance, 0), 1);
        const aboutProgress = Math.pow(rawProgress, 1.20);
        // More pronounced zoom-out shrinkage: scale down to ~0.78
        const aboutScale = 1 - aboutProgress * 0.22;
        const aboutOpacity = Math.max(0, 1 - aboutProgress * 1.02);
        const aboutTranslateY = aboutProgress * 42;

        aboutContainer.style.transform = `scale(${aboutScale.toFixed(4)}) translateY(${aboutTranslateY.toFixed(1)}px)`;
        aboutContainer.style.opacity = aboutOpacity.toFixed(3);
        aboutContainer.style.pointerEvents = aboutProgress > 0.70 ? 'none' : 'auto';
      } else {
        // While browsing through About Me: 100% full scale, sharp, completely steady
        aboutContainer.style.transform = '';
        aboutContainer.style.opacity = '';
        aboutContainer.style.pointerEvents = 'auto';
      }
    }

    // -------------------------------------------------------------------------
    // PAGE 3: PORTFOLIO SHOWCASE DYNAMIC SCROLL ZOOM-OUT (deeper shrinkage)
    // -------------------------------------------------------------------------
    if (portfolioContainer && portfolioSection) {
      const portfolioTop = portfolioSection.offsetTop;
      const portfolioHeight = portfolioSection.offsetHeight;
      const containerHeight = scrollContainer.clientHeight || window.innerHeight;
      const maxScroll = scrollContainer.scrollHeight - containerHeight;

      const portExitDistance = 380;
      const portExitStart = Math.max(maxScroll - portExitDistance, portfolioTop + Math.max(portfolioHeight - containerHeight, 200));

      if (maxScroll > portfolioTop + 300 && scrollTop > portExitStart) {
        const rawProgress = Math.min(Math.max((scrollTop - portExitStart) / portExitDistance, 0), 1);
        const portProgress = Math.pow(rawProgress, 1.20);
        // More pronounced zoom-out shrinkage: scale down to ~0.80
        const portScale = 1 - portProgress * 0.20;
        const portOpacity = Math.max(0.25, 1 - portProgress * 0.75);
        const portTranslateY = portProgress * 34;

        portfolioContainer.style.transform = `scale(${portScale.toFixed(4)}) translateY(${portTranslateY.toFixed(1)}px)`;
        portfolioContainer.style.opacity = portOpacity.toFixed(3);
        portfolioContainer.style.pointerEvents = portProgress > 0.80 ? 'none' : 'auto';
      } else {
        // While browsing through Portfolio projects: 100% full scale, sharp, completely steady
        portfolioContainer.style.transform = '';
        portfolioContainer.style.opacity = '';
        portfolioContainer.style.pointerEvents = 'auto';
      }
    }
  }

  // ==========================================================================
  // ==========================================================================
  // GSAP-STYLE PAPER AIRPLANE FLIGHT CONTROLLER (Files 5, 6, 7)
  // Starts at #about and finishes right before #portfolio with smooth scrub
  // ==========================================================================
  let flightTargetProgress = 0;
  let flightCurrentProgress = 0;
  let flightRafId = null;
  let flightInitialized = false;
  let flightLoopRunning = false;
  let triggerFlightLoop = null;

  function initPaperPlaneFlight() {
    const flightContainer = document.getElementById('flightContainer');
    const primaryPath = document.getElementById('flightTrailPrimary');
    const secondaryPath = document.getElementById('flightTrailSecondary');
    const masterPath = document.getElementById('flightTrailMaster') || primaryPath;
    const planeWrapper = document.getElementById('paperPlaneWrapper');
    const scrollContainer = document.getElementById('homeScreen');
    const aboutSection = document.getElementById('about');

    if (!flightContainer || !primaryPath || !planeWrapper || !scrollContainer || !aboutSection || !masterPath) {
      return;
    }

    let totalLen = masterPath.getTotalLength();
    const SAMPLES = 600;
    let pts = [];

    function buildPoints() {
      totalLen = masterPath.getTotalLength();
      if (totalLen <= 10) return false;
      pts = [];
      for (let i = 0; i <= SAMPLES; i++) {
        const d = (i / SAMPLES) * totalLen;
        const pt = masterPath.getPointAtLength(d);
        pts.push({ x: pt.x, y: pt.y });
      }
      return true;
    }

    buildPoints();

    function getPointAt(dist) {
      if (!pts.length) return { x: 0, y: 0 };
      const clamped = Math.max(0, Math.min(totalLen, dist));
      const idx = (clamped / totalLen) * SAMPLES;
      const i0 = Math.floor(idx);
      const i1 = Math.min(SAMPLES, i0 + 1);
      const frac = idx - i0;
      return {
        x: pts[i0].x + (pts[i1].x - pts[i0].x) * frac,
        y: pts[i0].y + (pts[i1].y - pts[i0].y) * frac
      };
    }

    let smoothBank = 0;
    let smoothPitch = 0;
    let smoothZ = 0;

    function renderFlightFrame() {
      if (!pts.length || totalLen <= 10) {
        if (!buildPoints()) {
          flightRafId = requestAnimationFrame(renderFlightFrame);
          return;
        }
      }

      // Smooth GSAP-style scrub progress
      const diff = flightTargetProgress - flightCurrentProgress;
      let isSettled = false;
      if (Math.abs(diff) > 0.0001) {
        flightCurrentProgress += diff * 0.16;
      } else {
        flightCurrentProgress = flightTargetProgress;
        isSettled = true;
      }

      const p = Math.max(0, Math.min(1, flightCurrentProgress));
      const width = flightContainer.offsetWidth || 1440;
      const height = flightContainer.offsetHeight || 1700;
      const scaleX = width / 1440;
      const scaleY = height / 1700;

      // Opacity: fades in gracefully (0 -> 0.04), stays 1, fades out as soaring off right edge (0.88 -> 0.99)
      let opacity = 0;
      if (p > 0.002 && p < 0.998) {
        if (p < 0.04) {
          opacity = (p - 0.002) / 0.038;
        } else if (p > 0.88) {
          opacity = Math.max(0, (0.998 - p) / 0.118);
        } else {
          opacity = 1;
        }
      }

      const curDist = p * totalLen;
      const TRAIL_LENGTH = 140; // Shorter, sleek modern dashed contrail
      const TRAIL_GAP = 58;     // Distinct air gap: guaranteed separation from the rocket tail

      const trailEnd = Math.max(0, curDist - TRAIL_GAP);
      const trailStart = Math.max(0, trailEnd - TRAIL_LENGTH);
      const activeLen = trailEnd - trailStart;

      // Dynamic contrail generation: creates ONLY the active trailing segment
      // Completely eliminates mask artifacts, negative dash offsets, and stationary streak bugs
      if (activeLen > 4 && opacity > 0.01) {
        const STEPS = 20;
        let dStr = '';
        for (let i = 0; i <= STEPS; i++) {
          const d = trailStart + (i / STEPS) * activeLen;
          const ptSample = getPointAt(d);
          dStr += (i === 0 ? 'M ' : ' L ') + ptSample.x.toFixed(1) + ',' + ptSample.y.toFixed(1);
        }
        primaryPath.setAttribute('d', dStr);
        // Dash offset so dashes stay fixed in space as jet contrail vapor
        primaryPath.style.strokeDashoffset = (-trailStart).toFixed(1);
        primaryPath.style.opacity = (opacity * 0.95).toFixed(3);
      } else {
        primaryPath.setAttribute('d', '');
        primaryPath.style.opacity = '0';
      }

      if (secondaryPath) {
        secondaryPath.setAttribute('d', '');
        secondaryPath.style.opacity = '0';
      }

      // Airplane wrapper transform & opacity
      planeWrapper.style.opacity = opacity.toFixed(3);

      if (opacity > 0.001) {
        const pt = getPointAt(curDist);
        const ptPrev = getPointAt(Math.max(0, curDist - 6));
        const ptNext = getPointAt(Math.min(totalLen, curDist + 6));

        const dx = (ptNext.x - ptPrev.x) * scaleX;
        const dy = (ptNext.y - ptPrev.y) * scaleY;
        const heading = Math.atan2(dy, dx) * (180 / Math.PI);

        // 3D Aerodynamic Banking (Roll into turn)
        const ptBehind = getPointAt(Math.max(0, curDist - 22));
        const ptAhead = getPointAt(Math.min(totalLen, curDist + 22));

        const dx1 = (pt.x - ptBehind.x) * scaleX;
        const dy1 = (pt.y - ptBehind.y) * scaleY;
        const h1 = Math.atan2(dy1, dx1) * (180 / Math.PI);

        const dx2 = (ptAhead.x - pt.x) * scaleX;
        const dy2 = (ptAhead.y - pt.y) * scaleY;
        const h2 = Math.atan2(dy2, dx2) * (180 / Math.PI);

        let deltaH = h2 - h1;
        while (deltaH > 180) deltaH -= 360;
        while (deltaH < -180) deltaH += 360;

        // Banking angle clamped strictly to [-28deg, +28deg] - NEVER flips belly-up (ไม่หงายท้อง)
        const targetBank = Math.max(-28, Math.min(28, -deltaH * 1.5));
        smoothBank += (targetBank - smoothBank) * 0.18;

        // 3D Pitch: nose dips down into dive, lifts up in climb - clamped strictly to [-16deg, +16deg]
        const speed = Math.hypot(dx, dy) || 1;
        const vertSlope = dy / speed;
        const targetPitch = Math.max(-16, Math.min(16, vertSlope * 14));
        smoothPitch += (targetPitch - smoothPitch) * 0.18;

        // 3D Altitude (posZ): higher during loop-the-loop, dipping in dive
        let targetZ = 0;
        if (p > 0.22 && p < 0.55) {
          const loopT = (p - 0.22) / 0.33;
          targetZ = Math.sin(loopT * Math.PI) * 45;
        } else if (p >= 0.55 && p < 0.80) {
          const diveT = (p - 0.55) / 0.25;
          targetZ = -Math.sin(diveT * Math.PI) * 12;
        } else if (p >= 0.80) {
          targetZ = (p - 0.80) / 0.20 * 22;
        }
        smoothZ += (targetZ - smoothZ) * 0.15;

        const posX = pt.x * scaleX;
        const posY = pt.y * scaleY;

        planeWrapper.style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, ${smoothZ.toFixed(1)}px) rotateZ(${heading.toFixed(1)}deg) rotateX(${smoothBank.toFixed(1)}deg) rotateY(${smoothPitch.toFixed(1)}deg)`;

        // Dynamic 3D shadow shifting with altitude
        const shadowDist = 10 + (smoothZ + 15) * 0.35;
        const shadowBlur = 22 + (smoothZ + 15) * 0.40;
        planeWrapper.style.filter = `drop-shadow(0 ${shadowDist.toFixed(1)}px ${shadowBlur.toFixed(1)}px rgba(0, 210, 255, 0.45)) drop-shadow(0 ${Math.max(2, shadowDist * 0.4).toFixed(1)}px 12px rgba(192, 132, 252, 0.4))`;
      }

      if (isSettled) {
        flightLoopRunning = false;
        flightRafId = null;
        return;
      }

      flightRafId = requestAnimationFrame(renderFlightFrame);
    }

    function startFlightLoop() {
      if (!flightLoopRunning) {
        flightLoopRunning = true;
        if (!flightRafId) {
          flightRafId = requestAnimationFrame(renderFlightFrame);
        }
      }
    }
    triggerFlightLoop = startFlightLoop;

    if (!flightInitialized) {
      flightInitialized = true;
      startFlightLoop();
    }
  }

  function updatePaperPlaneProgress() {
    const scrollContainer = document.getElementById('homeScreen');
    const aboutSection = document.getElementById('about');
    const portfolioSection = document.getElementById('portfolio');

    if (!scrollContainer || !aboutSection) return;

    const scrollTop = (scrollContainer && scrollContainer.scrollTop) || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const aboutTop = aboutSection.offsetTop;
    const aboutHeight = aboutSection.offsetHeight;
    const containerHeight = (scrollContainer && scrollContainer.clientHeight) || window.innerHeight;

    // Flight begins as the user scrolls into About section
    const startScroll = Math.max(aboutTop - containerHeight * 0.70, 0);

    // Flight finishes and exits into right edge well before portfolio section rises into view
    const portTop = portfolioSection ? portfolioSection.offsetTop : (aboutTop + aboutHeight);
    const endScroll = portTop - containerHeight * 0.70;

    if (scrollTop <= startScroll) {
      flightTargetProgress = 0;
    } else if (scrollTop >= endScroll) {
      flightTargetProgress = 1;
    } else {
      flightTargetProgress = (scrollTop - startScroll) / (endScroll - startScroll);
    }

    if (typeof triggerFlightLoop === 'function') {
      triggerFlightLoop();
    }
  }

  // Scroll Spy: Tracks current active section dynamically and keeps navbar in sync
  let isNavClickScrolling = false;
  let navClickTimer = null;
  let isScrollTicking = false;

  function handleHomeScroll() {
    handleHeroScrollZoom();
    updatePaperPlaneProgress();

    const scrollContainer = document.getElementById('homeScreen');
    if (scrollContainer && scrollContainer.scrollTop < 120) {
      const visibleItems = document.querySelectorAll('.about-scroll-item.is-visible');
      if (visibleItems.length) {
        visibleItems.forEach(item => item.classList.remove('is-visible'));
      }
      if (typeof window.resetAboutLeadTypewriter === 'function') {
        window.resetAboutLeadTypewriter();
      }
    } else {
      const introBlock = document.getElementById('aboutIntroBlock');
      if (introBlock) {
        const iRect = introBlock.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        if (iRect.top < vh * 0.85 && iRect.bottom > 40) {
          if (typeof window.startAboutLeadTypewriter === 'function') {
            window.startAboutLeadTypewriter();
          }
        }
      }
    }

    if (!isScrollTicking) {
      requestAnimationFrame(() => {
        handleScrollSpy();
        isScrollTicking = false;
      });
      isScrollTicking = true;
    }
  }

  function handleScrollSpy() {
    if (isNavClickScrolling) return;

    const scrollContainer = document.getElementById('homeScreen');
    if (!scrollContainer) return;

    const scrollTop = scrollContainer.scrollTop;

    // Config of all possible sections
    const sectionConfigs = [
      { id: 'home', link: document.querySelector('.nav-link[href="#home"]') },
      { id: 'about', link: document.querySelector('.nav-link[href="#about"]') },
      { id: 'portfolio', link: document.querySelector('.nav-link[href="#portfolio"]') },
      { id: 'contact', link: document.querySelector('.nav-link[href="#contact"]') }
    ];

    const activeSections = sectionConfigs
      .map(cfg => ({ ...cfg, el: document.getElementById(cfg.id) }))
      .filter(cfg => cfg.el && cfg.link);

    if (!activeSections.length) return;

    // 1. Near the very top -> activate first section (HOME)
    if (scrollTop < 80) {
      setActiveNavLink(activeSections[0].link);
      return;
    }

    // 2. Near the very bottom -> activate last available section
    const scrollBottomRemaining = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight;
    if (scrollBottomRemaining < 60) {
      setActiveNavLink(activeSections[activeSections.length - 1].link);
      return;
    }

    // 3. Focal detection relative to scrollContainer viewport (triggers as soon as section enters reading view)
    const containerRect = scrollContainer.getBoundingClientRect();
    const containerHeight = scrollContainer.clientHeight || window.innerHeight;
    const focalY = containerRect.top + Math.min(containerHeight * 0.62, 560);

    let targetSection = activeSections[0];
    for (let i = 0; i < activeSections.length; i++) {
      const sec = activeSections[i];
      const rect = sec.el.getBoundingClientRect();
      if (rect.top <= focalY) {
        targetSection = sec;
      }
    }

    if (targetSection && targetSection.link) {
      setActiveNavLink(targetSection.link);
    }
  }

  // Dedicated Ultra-Smooth Navigation Controller using GSAP 60fps/120fps power3.inOut
  let navScrollTween = null;

  function smoothNavigateTo(targetId, targetLink = null) {
    const scrollContainer = document.getElementById('homeScreen');
    if (!scrollContainer) return;

    if (targetLink) {
      setActiveNavLink(targetLink);
    } else if (targetId) {
      const link = document.querySelector(`.nav-link[href="${targetId}"]`);
      if (link) setActiveNavLink(link);
    }

    const isMobile = window.innerWidth <= 768;
    const targetOffset = isMobile ? 78 : 90;
    const aboutOffset = isMobile ? 96 : 124;

    let targetTop = 0;
    if (targetId === '#home') {
      targetTop = 0;
    } else if (targetId === '#contact') {
      targetTop = Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight);
    } else if (targetId === '#portfolio') {
      const portSection = document.querySelector('#portfolio');
      if (portSection) {
        // Ensure "Projects" tab is active so project cards are shown
        const projectsTab = document.querySelector('.portfolio-tab[data-tab="projects"]');
        if (projectsTab && !projectsTab.classList.contains('active')) {
          projectsTab.click();
        }

        const cRect = scrollContainer.getBoundingClientRect();
        const portHeader = portSection.querySelector('#portfolioTitleBlock') || portSection.querySelector('.portfolio-header');
        if (portHeader) {
          const headerRect = portHeader.getBoundingClientRect();
          const headerTop = headerRect.top - cRect.top + scrollContainer.scrollTop;
          targetTop = Math.max(0, Math.round(headerTop - targetOffset));
        } else {
          const tRect = portSection.getBoundingClientRect();
          targetTop = Math.max(0, Math.round(tRect.top - cRect.top + scrollContainer.scrollTop - targetOffset));
        }
      }
    } else if (targetId === '#about') {
      const aboutSection = document.querySelector('#about');
      if (aboutSection) {
        const cRect = scrollContainer.getBoundingClientRect();
        const aboutHeader = aboutSection.querySelector('#aboutTitleBlock') || aboutSection.querySelector('.about-header');
        if (aboutHeader) {
          const headerRect = aboutHeader.getBoundingClientRect();
          const headerTop = headerRect.top - cRect.top + scrollContainer.scrollTop;
          targetTop = Math.max(0, Math.round(headerTop - aboutOffset));
        } else {
          const tRect = aboutSection.getBoundingClientRect();
          targetTop = Math.max(0, Math.round(tRect.top - cRect.top + scrollContainer.scrollTop - aboutOffset));
        }
      }
    } else if (targetId && targetId.startsWith('#')) {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const cRect = scrollContainer.getBoundingClientRect();
        const tRect = targetElement.getBoundingClientRect();
        targetTop = Math.max(0, Math.round(tRect.top - cRect.top + scrollContainer.scrollTop - targetOffset));
      }
    }

    const startTop = scrollContainer.scrollTop;
    const delta = Math.abs(targetTop - startTop);

    if (delta < 4) {
      isNavClickScrolling = false;
      return;
    }

    isNavClickScrolling = true;
    if (navClickTimer) clearTimeout(navClickTimer);
    if (typeof pauseHomeSmoothScroll === 'function') pauseHomeSmoothScroll();

    if (navScrollTween) {
      navScrollTween.kill();
      navScrollTween = null;
    }

    // Calibrated cinematic slow-motion duration: 1.6s minimum for nearby jumps up to 2.35s for full-page traverses
    const duration = Math.min(Math.max(delta / 900, 1.6), 2.35);

    const scrollState = { y: startTop };

    // Temporarily set scrollBehavior to auto so native browser engine doesn't fight RAF updates
    const origScrollBehavior = scrollContainer.style.scrollBehavior;
    scrollContainer.style.scrollBehavior = 'auto';

    const finishNavigation = () => {
      scrollContainer.style.scrollBehavior = origScrollBehavior;
      navScrollTween = null;
      isNavClickScrolling = false;
      if (typeof syncHomeSmoothScroll === 'function') syncHomeSmoothScroll(scrollContainer.scrollTop);
      handleScrollSpy();
      handleHeroScrollZoom();
      updatePaperPlaneProgress();
      if (typeof window._updateScrollFloat === 'function') {
        window._updateScrollFloat(true);
      }
      // Guarantee any newly scrolled-into-view card is made visible immediately
      const currentItems = scrollContainer.querySelectorAll('.about-scroll-item');
      const curRect = scrollContainer.getBoundingClientRect();
      currentItems.forEach(item => {
        const iRect = item.getBoundingClientRect();
        if (iRect.top < curRect.bottom && iRect.bottom > curRect.top) {
          item.classList.add('is-visible');
        }
      });
    };

    // User gesture cancels tween smoothly so interaction is never hijacked
    const cancelNavTween = () => {
      if (navScrollTween) {
        navScrollTween.kill();
        finishNavigation();
      }
    };
    scrollContainer.addEventListener('wheel', cancelNavTween, { passive: true, once: true });
    scrollContainer.addEventListener('touchmove', cancelNavTween, { passive: true, once: true });

    if (typeof gsap !== 'undefined') {
      navScrollTween = gsap.to(scrollState, {
        y: targetTop,
        duration: duration,
        ease: 'power2.inOut',
        onUpdate: () => {
          scrollContainer.scrollTop = scrollState.y;
          handleHeroScrollZoom();
          updatePaperPlaneProgress();
          if (typeof window._updateScrollFloat === 'function') {
            window._updateScrollFloat(false);
          }
        },
        onComplete: () => {
          scrollContainer.scrollTop = targetTop;
          finishNavigation();
        }
      });
    } else {
      scrollContainer.scrollTo({ top: targetTop, behavior: 'smooth' });
      navClickTimer = setTimeout(finishNavigation, Math.round(duration * 1000 + 50));
    }
  }

  // Interactive Navigation Category Selection with Rubber Segment & Content Transition
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (justFinishedNavDrag) {
        e.preventDefault();
        return;
      }
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        smoothNavigateTo(targetId, this);
      }
    });
  });

  // Initialize Rubber Segment drag & flick gestures
  initRubberSegmentDrag();

  // Also hook CTA buttons in hero (e.g. About Me / Portfolio button)
  const btnAbout = document.querySelector('.btn-portfolio');
  if (btnAbout) {
    btnAbout.addEventListener('click', (e) => {
      const targetId = btnAbout.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        smoothNavigateTo(targetId);
      }
    });
  }

  // Portfolio Subnav Filter Tabs (Projects, Certificates, Tech Stack)
  const portfolioTabs = document.querySelectorAll('.portfolio-tab');
  portfolioTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      portfolioTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      const tabPanes = document.querySelectorAll('.portfolio-tab-pane');
      tabPanes.forEach(pane => {
        if (pane.id === `tab-${targetTab}`) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });

      if (targetTab === 'tech-stack') {
        const keypadEl = document.querySelector('.keypad-showcase-card');
        if (keypadEl) {
          keypadEl.classList.add('is-visible');
        }
        if (typeof window.refreshKeypadCanvas === 'function') {
          window.refreshKeypadCanvas();
        }
      }
    });
  });

  // Scroll Reveal Controller for About Me Section Blocks & Scroll Spy initialization
  let aboutObserver = null;
  function initAboutScrollReveal() {
    const scrollItems = document.querySelectorAll('.about-scroll-item');
    const scrollContainer = document.getElementById('homeScreen');

    if (aboutObserver) {
      aboutObserver.disconnect();
    }

    if (scrollItems.length) {
      aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const wasVisible = entry.target.classList.contains('is-visible');
            entry.target.classList.add('is-visible');
            if (!wasVisible && entry.target.classList.contains('keypad-showcase-card')) {
              if (typeof window.refreshKeypadCanvas === 'function') {
                window.refreshKeypadCanvas();
              }
            }
            if (entry.target.id === 'aboutIntroBlock') {
              if (typeof window.startAboutLeadTypewriter === 'function') {
                window.startAboutLeadTypewriter();
              }
            }
          } else {
            // Opposite animation: remove is-visible when scrolling back up (item exits below viewport)
            const isBelow = entry.rootBounds
              ? entry.boundingClientRect.top >= entry.rootBounds.top
              : entry.boundingClientRect.top > 0;

            if (isBelow) {
              entry.target.classList.remove('is-visible');
              if (entry.target.id === 'aboutIntroBlock') {
                if (typeof window.resetAboutLeadTypewriter === 'function') {
                  window.resetAboutLeadTypewriter();
                }
              }
            }
          }
        });
      }, {
        root: scrollContainer || null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.1
      });

      scrollItems.forEach(item => aboutObserver.observe(item));
    }

    // Attach scroll listeners for hero zoom-out/in and active nav tracking
    if (scrollContainer) {
      if (scrollContainer._homeScrollHandler) {
        scrollContainer.removeEventListener('scroll', scrollContainer._homeScrollHandler);
      }
      scrollContainer._homeScrollHandler = handleHomeScroll;
      scrollContainer.addEventListener('scroll', handleHomeScroll, { passive: true });
    }

    window.removeEventListener('scroll', handleHomeScroll);
    window.addEventListener('scroll', handleHomeScroll, { passive: true });

    // Initial check to set active indicator and hero zoom state
    handleHeroScrollZoom();
    setTimeout(handleScrollSpy, 120);
    initPaperPlaneFlight();
    updatePaperPlaneProgress();
    initTimelineStepper();
    initTimelineTracingBeam();
    initScrollFloat();
    initAboutTypewriter();
    initHomeSmoothScroll();
  }


  // ==========================================================================
  // GSAP-Powered Momentum Smooth Inertial Scrolling for Home Screen
  // ==========================================================================
  let homeSmoothTarget = 0;
  let homeSmoothCurrent = 0;
  let homeSmoothVelocity = 0;
  let isHomeSmoothRunning = false;
  let homeSmoothLastTime = 0;
  let isHomeSmoothInitialized = false;

  function syncHomeSmoothScroll(val) {
    const st = (typeof val === 'number') ? val : (homeScreen ? homeScreen.scrollTop : 0);
    homeSmoothTarget = st;
    homeSmoothCurrent = st;
    homeSmoothVelocity = 0;
    isHomeSmoothRunning = false;
  }

  function resetHomeSmoothScroll() {
    syncHomeSmoothScroll(0);
  }

  function pauseHomeSmoothScroll() {
    isHomeSmoothRunning = false;
    homeSmoothVelocity = 0;
  }

  function initHomeSmoothScroll() {
    if (!homeScreen || isHomeSmoothInitialized) return;
    isHomeSmoothInitialized = true;

    syncHomeSmoothScroll();

    function tickHomeSmooth(time) {
      if (!isHomeSmoothRunning) return;

      const now = performance.now();
      const dt = Math.min(Math.max((now - homeSmoothLastTime) / 1000, 0.001), 0.035);
      homeSmoothLastTime = now;

      // Critically damped mass-spring-damper (smoothTime = 0.20s gives luxurious GSAP momentum)
      const smoothTime = 0.20;
      const omega = 2 / smoothTime;
      const x = omega * dt;
      const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
      const change = homeSmoothCurrent - homeSmoothTarget;
      const temp = (homeSmoothVelocity + omega * change) * dt;
      homeSmoothVelocity = (homeSmoothVelocity - omega * temp) * exp;
      homeSmoothCurrent = homeSmoothTarget + (change + temp) * exp;

      homeScreen.scrollTop = homeSmoothCurrent;
      if (typeof window._updateScrollFloat === 'function') {
        window._updateScrollFloat(false);
      }

      // Stop loop when settled
      if (Math.abs(homeSmoothTarget - homeSmoothCurrent) < 0.5 && Math.abs(homeSmoothVelocity) < 1.0) {
        homeScreen.scrollTop = homeSmoothTarget;
        homeSmoothCurrent = homeSmoothTarget;
        homeSmoothVelocity = 0;
        isHomeSmoothRunning = false;
        if (typeof window._updateScrollFloat === 'function') {
          window._updateScrollFloat(false);
        }
        return;
      }

      requestAnimationFrame(tickHomeSmooth);
    }

    function startHomeSmooth() {
      if (isHomeSmoothRunning) return;
      isHomeSmoothRunning = true;
      homeSmoothLastTime = performance.now();
      requestAnimationFrame(tickHomeSmooth);
    }

    function onHomeWheel(e) {
      if (isHomeScrollLocked || isNavClickScrolling || document.body.classList.contains('modal-open')) return;
      if (!homeScreen.classList.contains('active')) return;

      // Prevent jerky native browser scroll step
      e.preventDefault();

      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 33.33; // lines to px
      else if (e.deltaMode === 2) delta *= window.innerHeight; // pages to px

      // Clamp excessive single-event spike (trackpad flings)
      delta = clampVal(delta, -180, 180);

      const maxScroll = Math.max(0, homeScreen.scrollHeight - homeScreen.clientHeight);

      if (!isHomeSmoothRunning) {
        homeSmoothCurrent = homeScreen.scrollTop;
        homeSmoothTarget = homeScreen.scrollTop;
        homeSmoothVelocity = 0;
      }

      homeSmoothTarget = clampVal(homeSmoothTarget + delta, 0, maxScroll);
      startHomeSmooth();
    }

    // Keyboard smooth navigation (Arrows, PageUp/Down, Space)
    function onHomeKeyDown(e) {
      if (isHomeScrollLocked || isNavClickScrolling || document.body.classList.contains('modal-open')) return;
      if (!homeScreen.classList.contains('active')) return;
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;

      let keyDelta = 0;
      if (e.key === 'ArrowDown') keyDelta = 100;
      else if (e.key === 'ArrowUp') keyDelta = -100;
      else if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) keyDelta = window.innerHeight * 0.82;
      else if (e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) keyDelta = -window.innerHeight * 0.82;
      else if (e.key === 'Home') {
        e.preventDefault();
        homeSmoothTarget = 0;
        startHomeSmooth();
        return;
      } else if (e.key === 'End') {
        e.preventDefault();
        homeSmoothTarget = Math.max(0, homeScreen.scrollHeight - homeScreen.clientHeight);
        startHomeSmooth();
        return;
      }

      if (keyDelta !== 0) {
        e.preventDefault();
        const maxScroll = Math.max(0, homeScreen.scrollHeight - homeScreen.clientHeight);
        if (!isHomeSmoothRunning) {
          homeSmoothCurrent = homeScreen.scrollTop;
          homeSmoothTarget = homeScreen.scrollTop;
          homeSmoothVelocity = 0;
        }
        homeSmoothTarget = clampVal(homeSmoothTarget + keyDelta, 0, maxScroll);
        startHomeSmooth();
      }
    }

    function onHomeTouchStart() {
      if (isHomeSmoothRunning) {
        isHomeSmoothRunning = false;
        homeSmoothCurrent = homeScreen.scrollTop;
        homeSmoothTarget = homeScreen.scrollTop;
        homeSmoothVelocity = 0;
      }
    }

    function onHomeNativeScroll() {
      if (!isHomeSmoothRunning && !isNavClickScrolling) {
        homeSmoothCurrent = homeScreen.scrollTop;
        homeSmoothTarget = homeScreen.scrollTop;
      }
    }

    homeScreen.addEventListener('wheel', onHomeWheel, { passive: false });
    window.addEventListener('keydown', onHomeKeyDown);
    homeScreen.addEventListener('touchstart', onHomeTouchStart, { passive: true });
    homeScreen.addEventListener('scroll', onHomeNativeScroll, { passive: true });
  }

  // ==========================================================================
  // Timeline Stepper Controller for "What I Do" Milestone Card
  // ==========================================================================
  function initTimelineStepper() {
    const stepperCards = document.querySelectorAll('.stepper-card');
    stepperCards.forEach(card => {
      const nodeBtns = card.querySelectorAll('.stepper-node-btn');
      const track = card.querySelector('#stepperSliderTrack');
      const lines = card.querySelectorAll('.stepper-line');
      const prevBtn = card.querySelector('#stepperPrevBtn');
      const nextBtn = card.querySelector('#stepperNextBtn');

      if (!nodeBtns.length || !track) return;

      let currentStep = 0;
      const totalSteps = nodeBtns.length;

      function setStep(index) {
        if (index < 0) index = totalSteps - 1;
        if (index >= totalSteps) index = 0;
        currentStep = index;

        // 1. Horizontal sliding transition ("สไลด์ด้านข้างเหมือนเลื่อนสไลด์")
        track.style.transform = `translateX(-${currentStep * 100}%)`;

        // 2. Update step nodes (completed with checkmark, active with icon, inactive)
        nodeBtns.forEach((btn, i) => {
          btn.classList.remove('active', 'completed');
          if (i < currentStep) {
            btn.classList.add('completed');
            btn.setAttribute('aria-selected', 'false');
          } else if (i === currentStep) {
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
          } else {
            btn.setAttribute('aria-selected', 'false');
          }
        });

        // 3. Update connecting lines between nodes like in user image
        lines.forEach((line, i) => {
          const fill = line.querySelector('.stepper-line-fill');
          if (fill) {
            fill.style.width = currentStep > i ? '100%' : '0%';
          }
        });
      }

      nodeBtns.forEach((btn, idx) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          setStep(idx);
        });
      });

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          setStep(currentStep - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          setStep(currentStep + 1);
        });
      }

      setStep(0);
    });
  }

  // ==========================================================================
  // Timeline Central Spine Controller ("ค่อยๆเลื่อนตาม scroll mouse")
  // ==========================================================================
  function initTimelineTracingBeam() {
    const timeline = document.querySelector('.about-timeline');
    const spine = document.querySelector('.timeline-spine');
    const beam = document.querySelector('.timeline-beam');
    const scrollContainer = document.getElementById('homeScreen');

    if (!timeline || !spine || !beam) return;

    if (timeline._beamInitialized) return;
    timeline._beamInitialized = true;

    const nodes = timeline.querySelectorAll('.timeline-node');
    let currentProgress = 0;
    let targetProgress = 0;
    let isLoopRunning = false;
    let rafId = null;

    function calculateScrollProgress() {
      const sRect = spine.getBoundingClientRect();
      if (sRect.height <= 0) return 0;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Focal point around mid-screen (~55% from top of viewport)
      const focalY = vh * 0.55;
      const progress = (focalY - sRect.top) / sRect.height;
      return Math.max(0, Math.min(1, progress));
    }

    function startLoop() {
      if (!isLoopRunning) {
        isLoopRunning = true;
        rafId = requestAnimationFrame(renderFrame);
      }
    }

    function renderFrame() {
      // Smooth buttery lag (lerp: 0.08) for graceful "ค่อยๆเลื่อนตาม scroll" motion
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) < 0.001) {
        currentProgress = targetProgress;
        beam.style.height = `${(currentProgress * 100).toFixed(2)}%`;
        isLoopRunning = false;
        return;
      }

      currentProgress += diff * 0.08;
      beam.style.height = `${(currentProgress * 100).toFixed(2)}%`;

      rafId = requestAnimationFrame(renderFrame);
    }

    function onScroll() {
      targetProgress = calculateScrollProgress();
      startLoop();
    }

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', onScroll, { passive: true });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    setTimeout(() => {
      targetProgress = calculateScrollProgress();
      currentProgress = targetProgress;
      beam.style.height = `${(currentProgress * 100).toFixed(2)}%`;
    }, 120);
  }

  // ==========================================================================
  // Scroll Float Controller (React Bits: Text floats dynamically on scroll)
  // GSAP-Powered Scroll Scrubbing: Continuously tracks mouse wheel / scroll
  // ==========================================================================
  function initScrollFloat() {
    const scrollContainer = document.getElementById('homeScreen');
    const headerIds = ['aboutTitleBlock'];
    const blocks = [];

    headerIds.forEach((id) => {
      const headerEl = document.getElementById(id);
      if (!headerEl) return;

      const floatElements = headerEl.querySelectorAll('[data-scroll-float]');
      if (!floatElements.length) return;

      // Split text into individual character spans
      const allChars = [];
      floatElements.forEach((el) => {
        if (el._scrollFloatReady) {
          if (el._floatChars) allChars.push(...el._floatChars);
          return;
        }
        el._scrollFloatReady = true;

        const rawText = el.textContent.trim();
        el.textContent = '';
        el.setAttribute('aria-label', rawText);

        const chars = [];
        for (let i = 0; i < rawText.length; i++) {
          const char = rawText[i];
          const span = document.createElement('span');
          span.className = 'scroll-float-char';
          if (char === ' ') {
            span.classList.add('scroll-float-space');
            span.innerHTML = '&nbsp;';
          } else {
            span.textContent = char;
          }
          el.appendChild(span);
          chars.push(span);
        }
        el._floatChars = chars;
        allChars.push(...chars);
      });

      if (!allChars.length) return;
      const targets = allChars;
      const stagger = 0.03;

      if (headerEl._scrollFloatTl) {
        headerEl._scrollFloatTl.kill();
      }

      // React Bits ScrollFloat GSAP Timeline for About Me header
      let scrollFloatTl = null;
      if (typeof gsap !== 'undefined') {
        scrollFloatTl = gsap.timeline({ paused: true });
        scrollFloatTl.fromTo(
          targets,
          {
            opacity: 0,
            yPercent: 120,
            scaleY: 2.3,
            scaleX: 0.7,
            transformOrigin: '50% 0%'
          },
          {
            duration: 1,
            ease: 'back.inOut(2)',
            opacity: 1,
            yPercent: 0,
            scaleY: 1,
            scaleX: 1,
            stagger: stagger
          }
        );
      }
      headerEl._scrollFloatTl = scrollFloatTl;

      let lastTarget = -1;

      function updateBlock(immediate = false) {
        if (!scrollFloatTl) return;
        if (!homeScreen || !homeScreen.classList.contains('active')) {
          scrollFloatTl.progress(0);
          lastTarget = 0;
          return;
        }

        const rect = headerEl.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return;

        const vh = window.innerHeight || document.documentElement.clientHeight;

        // Scroll trigger range: starts as header enters lower screen (92% vh),
        // completes as it reaches natural reading position (42% vh)
        const startY = vh * 0.92;
        const endY = vh * 0.42;
        const rawProgress = (startY - rect.top) / (startY - endY);
        const targetProgress = Math.max(0, Math.min(1, rawProgress));

        if (Math.abs(targetProgress - lastTarget) < 0.002 && !immediate) {
          return;
        }
        lastTarget = targetProgress;

        if (immediate) {
          scrollFloatTl.progress(targetProgress);
        } else {
          gsap.to(scrollFloatTl, {
            progress: targetProgress,
            duration: 0.22,
            ease: 'power1.out',
            overwrite: 'auto'
          });
        }
      }

      blocks.push({ headerEl, update: updateBlock });
    });

    if (!blocks.length) return;

    function updateAllScrollFloat(immediate = false) {
      for (let i = 0; i < blocks.length; i++) {
        blocks[i].update(immediate);
      }
    }

    window._updateScrollFloat = updateAllScrollFloat;

    if (scrollContainer) {
      if (scrollContainer._scrollFloatHandler) {
        scrollContainer.removeEventListener('scroll', scrollContainer._scrollFloatHandler);
      }
      scrollContainer._scrollFloatHandler = () => updateAllScrollFloat(false);
      scrollContainer.addEventListener('scroll', scrollContainer._scrollFloatHandler, { passive: true });
    }

    window.removeEventListener('scroll', updateAllScrollFloat);
    window.addEventListener('scroll', () => updateAllScrollFloat(false), { passive: true });
    window.addEventListener('resize', () => updateAllScrollFloat(false), { passive: true });

    // Initial check
    setTimeout(() => updateAllScrollFloat(true), 60);
  }

  // ==========================================================================
  // About Lead Typewriter Controller (Full Block Cursor █ & Zero-Shift Ghost)
  // ==========================================================================
  function initAboutTypewriter() {
    const leadWrap = document.getElementById('aboutIntroBlock');
    const aboutLead = document.getElementById('aboutLead');
    if (!leadWrap || !aboutLead) return;

    let leadGhostEl = document.getElementById('aboutLeadGhost');
    let leadTextEl = document.getElementById('aboutLeadText');
    let cursorEl = document.getElementById('aboutLeadCursor');

    // Auto-heal: Guarantee #aboutLeadGhost, #aboutLeadText and #aboutLeadCursor exist in DOM
    if (!leadGhostEl || !leadTextEl || !cursorEl) {
      aboutLead.innerHTML = '<span class="about-lead-ghost" id="aboutLeadGhost" aria-hidden="true"></span><span class="about-lead-typing" id="aboutLeadTyping"><span id="aboutLeadText"></span><span class="type-cursor-block" id="aboutLeadCursor">█</span></span>';
      leadGhostEl = document.getElementById('aboutLeadGhost');
      leadTextEl = document.getElementById('aboutLeadText');
      cursorEl = document.getElementById('aboutLeadCursor');
    }

    let currentTimeout = null;
    let isTyping = false;
    let hasCompleted = false;

    // Tokenizer that safely parses HTML tags vs readable characters/graphemes
    function tokenizeHtml(str) {
      const tokens = [];
      let i = 0;
      while (i < str.length) {
        if (str[i] === '<') {
          const closeIdx = str.indexOf('>', i);
          if (closeIdx !== -1) {
            tokens.push({ type: 'tag', value: str.slice(i, closeIdx + 1) });
            i = closeIdx + 1;
            continue;
          }
        }
        const nextTagIdx = str.indexOf('<', i);
        const textSegment = nextTagIdx !== -1 ? str.slice(i, nextTagIdx) : str.slice(i);
        i = nextTagIdx !== -1 ? nextTagIdx : str.length;

        if (typeof Intl !== 'undefined' && Intl.Segmenter) {
          const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
          for (const s of segmenter.segment(textSegment)) {
            tokens.push({ type: 'char', value: s.segment });
          }
        } else {
          for (let c = 0; c < textSegment.length; c++) {
            tokens.push({ type: 'char', value: textSegment[c] });
          }
        }
      }
      return tokens;
    }

    function startTypewriter(targetHtml) {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
        currentTimeout = null;
      }

      const activeLang = currentLang || 'en';
      const dict = TRANSLATIONS[activeLang] || TRANSLATIONS.en;
      const htmlToType = targetHtml || dict.aboutLead;

      // Keep ghost perfectly synchronized so container height is always exact
      if (leadGhostEl) {
        leadGhostEl.innerHTML = htmlToType;
      }

      const tokens = tokenizeHtml(htmlToType);
      leadTextEl.innerHTML = '';
      cursorEl.classList.remove('is-finished');
      cursorEl.style.opacity = '1';

      let buffer = '';
      const openTags = [];
      let tokenIndex = 0;
      isTyping = true;
      hasCompleted = false;

      function typeNext() {
        if (tokenIndex >= tokens.length) {
          leadTextEl.innerHTML = buffer;
          isTyping = false;
          hasCompleted = true;
          // When finished typing, pause 1.2s then fade out block cursor
          currentTimeout = setTimeout(() => {
            cursorEl.classList.add('is-finished');
          }, 1200);
          return;
        }

        // Process all consecutive HTML tags instantly without typing delay
        while (tokenIndex < tokens.length && tokens[tokenIndex].type === 'tag') {
          const tag = tokens[tokenIndex].value;
          buffer += tag;
          if (tag.startsWith('</')) {
            openTags.pop();
          } else if (!tag.endsWith('/>') && !tag.startsWith('<br')) {
            const match = tag.match(/<([a-zA-Z0-9]+)/);
            if (match) openTags.push(match[1]);
          }
          tokenIndex++;
        }

        if (tokenIndex >= tokens.length) {
          leadTextEl.innerHTML = buffer;
          isTyping = false;
          hasCompleted = true;
          currentTimeout = setTimeout(() => {
            cursorEl.classList.add('is-finished');
          }, 1200);
          return;
        }

        // Process character token
        const charToken = tokens[tokenIndex].value;
        buffer += charToken;
        tokenIndex++;

        // Auto-close open tags in preview
        const autoClose = openTags.slice().reverse().map(name => `</${name}>`).join('');
        leadTextEl.innerHTML = buffer + autoClose;

        // Dynamic typing cadence
        let delay = 22;
        if (['.', '!', '?'].includes(charToken)) {
          delay = 190;
        } else if ([',', ';', ':'].includes(charToken)) {
          delay = 110;
        } else if (charToken === ' ') {
          delay = 30;
        }

        currentTimeout = setTimeout(typeNext, delay);
      }

      typeNext();
    }

    function resetTypewriter() {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
        currentTimeout = null;
      }
      isTyping = false;
      hasCompleted = false;
      leadTextEl.innerHTML = '';
      cursorEl.classList.remove('is-finished');
      cursorEl.style.opacity = '1';
    }

    window.startAboutLeadTypewriter = function() {
      if (!isTyping && !hasCompleted) {
        startTypewriter();
      }
    };

    window.resetAboutLeadTypewriter = function() {
      resetTypewriter();
    };

    window.retypeAboutLead = function(lang) {
      const activeLang = lang || currentLang || 'en';
      const dict = TRANSLATIONS[activeLang] || TRANSLATIONS.en;
      if (leadGhostEl) {
        leadGhostEl.innerHTML = dict.aboutLead;
      }
      if (hasCompleted || isTyping) {
        startTypewriter(dict.aboutLead);
      } else {
        leadTextEl.innerHTML = '';
      }
    };

    // Initial check: if already in view on page load
    const initialRect = leadWrap.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const activeLang = currentLang || 'en';
    const dict = TRANSLATIONS[activeLang] || TRANSLATIONS.en;
    if (leadGhostEl) {
      leadGhostEl.innerHTML = dict.aboutLead;
    }

    if (initialRect.top < vh * 0.85 && initialRect.bottom > 60) {
      startTypewriter();
    } else {
      leadTextEl.innerHTML = '';
    }
  }

  // Recalculate indicator on window resize
  window.addEventListener('resize', () => {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) updateNavIndicator(activeLink, true);
  });

  // Typewriter Controller for Developer <-> Creative Designer
  const typewriterElement = document.getElementById('typewriterRole');
  let typewriterTimeout = null;
  const roles = ['Developer', 'Creative Designer'];
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let isDeleting = true;

  function runTypewriter() {
    if (!typewriterElement) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
      typewriterElement.textContent = currentRole.substring(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typewriterTimeout = setTimeout(runTypewriter, 450); // Pause on blank before typing next
        return;
      }
      typewriterTimeout = setTimeout(runTypewriter, 45); // Deleting speed
    } else {
      charIndex++;
      typewriterElement.textContent = currentRole.substring(0, charIndex);
      if (charIndex === currentRole.length) {
        isDeleting = true;
        typewriterTimeout = setTimeout(runTypewriter, 2300); // Hold time to read
        return;
      }
      typewriterTimeout = setTimeout(runTypewriter, 85); // Typing speed
    }
  }

  function startTypewriter(delay = 1400) {
    if (typewriterTimeout) clearTimeout(typewriterTimeout);
    if (!typewriterElement) return;
    typewriterElement.textContent = roles[0];
    charIndex = roles[0].length;
    isDeleting = true;
    roleIndex = 0;
    typewriterTimeout = setTimeout(runTypewriter, delay);
  }

  // Typewriter Controller for Main Hero Name "PEEPHUWIT"
  const typewriterNameElement = document.getElementById('typewriterName');
  const nameCursorElement = document.getElementById('nameCursor');
  let nameTypewriterTimeout = null;
  const fullName = 'PEEPHUWIT';

  function startNameTypewriter(startDelay = 650) {
    if (nameTypewriterTimeout) {
      clearTimeout(nameTypewriterTimeout);
      nameTypewriterTimeout = null;
    }
    if (!typewriterNameElement) return;

    typewriterNameElement.textContent = '';
    if (nameCursorElement) {
      nameCursorElement.style.opacity = '1';
    }

    let charIdx = 0;
    function typeNextChar() {
      charIdx++;
      if (charIdx <= fullName.length) {
        typewriterNameElement.textContent = fullName.substring(0, charIdx);
        if (charIdx < fullName.length) {
          nameTypewriterTimeout = setTimeout(typeNextChar, 120); // Natural, clear typing cadence (120ms)
        }
      }
    }

    nameTypewriterTimeout = setTimeout(typeNextChar, startDelay);
  }

  document.addEventListener('keydown', (e) => {
    if (!hasTransitioned && (e.key === ' ' || e.key === 'Enter')) {
      transitionToScrollExpand();
    }
  });

  // Initialize GSAP Interactive Micro-interactions
  initGSAPMicroInteractions();

  // Initialize Portfolio Showcase Subnav Tabs
  initPortfolioTabs();

  // Initialize 3D WebGL Multi-Segment Cloth Physics Lanyard Badge
  setTimeout(init3DLanyardWebGL, 20);

  // Trigger welcome screen with active class dynamically
  if (welcomeScreen && (!homeScreen || !homeScreen.classList.contains('active'))) {
    hasTransitioned = false;
    welcomeScreen.classList.remove('hidden', 'fade-out');
    welcomeScreen.classList.add('active');
    if (window.resetBadgeToTop) {
      window.resetBadgeToTop();
    }
    startLoading();
  }

  // If opening home.html directly, trigger home entrance
  if (homeScreen && homeScreen.classList.contains('active') && (!welcomeScreen || welcomeScreen.classList.contains('hidden'))) {
    if (window.resetBadgeToTop) {
      window.resetBadgeToTop();
    }
    animateHomeEntrance();
    initAboutScrollReveal();
    initPaperPlaneFlight();
    initSpecularButtons();
  }

  // Specular Button WebGL Controller (React Bits Glass Rim Shader)
  function initSpecularButtons() {
    const buttons = document.querySelectorAll('.hero-cta-group .cta-btn, .btn-cv, .btn-portfolio');
    if (!buttons.length) return;

    const VERT_SRC = [
      'attribute vec2 position;',
      'void main() {',
      '  gl_Position = vec4(position, 0.0, 1.0);',
      '}'
    ].join('\n');

    const FRAG_SRC = [
      'precision highp float;',
      'uniform vec2 uCenter;',
      'uniform vec2 uHalfSize;',
      'uniform float uRadius;',
      'uniform float uAngle;',
      'uniform float uPx;',
      'uniform vec3 uLineColor;',
      'uniform vec3 uBaseColor;',
      'uniform float uIntensity;',
      'uniform float uShineSize;',
      'uniform float uShineFade;',
      'uniform float uThickness;',
      'uniform float uBaseWidth;',
      '',
      'float sdRoundedRect(vec2 p, vec2 b, float r) {',
      '  vec2 q = abs(p) - b + r;',
      '  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;',
      '}',
      '',
      'float gaussianLine(float d, float sigma) {',
      '  float x = d / (sigma + 1e-6);',
      '  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));',
      '  return exp(-k * x * x);',
      '}',
      '',
      'void main() {',
      '  vec2 p = gl_FragCoord.xy - uCenter;',
      '  float d = sdRoundedRect(p, uHalfSize, uRadius);',
      '  vec2 L = vec2(cos(uAngle), sin(uAngle));',
      '',
      '  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.35;',
      '',
      '  vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6);',
      '  float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));',
      '  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);',
      '  float line = gaussianLine(d, uThickness);',
      '  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.2 * uPx, abs(d));',
      '  float hi = line * rim * edgeClamp * uIntensity;',
      '',
      '  vec3 col = uBaseColor * base + uLineColor * hi;',
      '  float a = clamp(base * 0.4 + hi, 0.0, 1.0);',
      '  gl_FragColor = vec4(col, a);',
      '}'
    ].join('\n');

    buttons.forEach(btn => {
      if (btn._specularInit) return;
      btn._specularInit = true;

      const isCV = btn.classList.contains('btn-cv');
      const lineColor = [1.0, 1.0, 1.0];
      const baseColor = isCV ? [0.15, 0.35, 0.85] : [0.35, 0.40, 0.50];
      const intensity = 1.4;
      const thickness = 1.35;
      const speed = 0.45;
      const shineSize = 14;
      const shineFade = 45;
      const proximity = 260;
      const PAD = 20;

      let fx = btn.querySelector('.specular-button__fx');
      if (!fx) {
        fx = document.createElement('span');
        fx.className = 'specular-button__fx';
        fx.setAttribute('aria-hidden', 'true');
        btn.prepend(fx);
      }

      const canvas = document.createElement('canvas');
      fx.appendChild(canvas);

      const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true }) ||
                 canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: true, antialias: true });
      if (!gl) return;

      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      function createShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          console.warn('Specular shader compile error:', gl.getShaderInfoLog(s));
          gl.deleteShader(s);
          return null;
        }
        return s;
      }

      const vs = createShader(gl.VERTEX_SHADER, VERT_SRC);
      const fs = createShader(gl.FRAGMENT_SHADER, FRAG_SRC);
      if (!vs || !fs) return;

      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn('Specular program link error:', gl.getShaderInfoLog(program));
        return;
      }
      gl.useProgram(program);

      const posBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const uCenterLoc = gl.getUniformLocation(program, 'uCenter');
      const uHalfSizeLoc = gl.getUniformLocation(program, 'uHalfSize');
      const uRadiusLoc = gl.getUniformLocation(program, 'uRadius');
      const uAngleLoc = gl.getUniformLocation(program, 'uAngle');
      const uPxLoc = gl.getUniformLocation(program, 'uPx');
      const uLineColorLoc = gl.getUniformLocation(program, 'uLineColor');
      const uBaseColorLoc = gl.getUniformLocation(program, 'uBaseColor');
      const uIntensityLoc = gl.getUniformLocation(program, 'uIntensity');
      const uShineSizeLoc = gl.getUniformLocation(program, 'uShineSize');
      const uShineFadeLoc = gl.getUniformLocation(program, 'uShineFade');
      const uThicknessLoc = gl.getUniformLocation(program, 'uThickness');
      const uBaseWidthLoc = gl.getUniformLocation(program, 'uBaseWidth');

      let btnW = 0, btnH = 0;
      let dpr = Math.min(window.devicePixelRatio || 1, 2);

      function resize() {
        const rect = btn.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        btnW = rect.width;
        btnH = rect.height;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const cw = Math.round((btnW + PAD * 2) * dpr);
        const ch = Math.round((btnH + PAD * 2) * dpr);
        if (canvas.width !== cw || canvas.height !== ch) {
          canvas.width = cw;
          canvas.height = ch;
        }
      }
      resize();

      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(resize);
        ro.observe(btn);
      }
      window.addEventListener('resize', resize, { passive: true });

      let pointerAngle = null;
      let proximityT = 0;

      function onPointerMove(e) {
        const rect = btn.getBoundingClientRect();
        if (rect.width === 0) return;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
        const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
        const dist = Math.hypot(dx, dy);

        if (dist === 0) {
          const nx = (e.clientX - cx) / (rect.width / 2);
          const ny = (cy - e.clientY) / (rect.height / 2);
          pointerAngle = Math.atan2(2 / rect.height, -2 / rect.width) + nx * 0.35 + ny * 0.18;
        } else {
          pointerAngle = Math.atan2(cy - e.clientY, e.clientX - cx);
        }
        const t = Math.max(0, 1 - dist / Math.max(proximity, 1));
        proximityT = t * t * (3 - 2 * t);
      }
      window.addEventListener('pointermove', onPointerMove, { passive: true });

      let angle = 2.4;
      let idleAngle = 2.4;
      let bright = 0.35;
      let lastTime = performance.now();

      function update(now) {
        requestAnimationFrame(update);
        if (document.hidden) return;
        if (btnW === 0) {
          resize();
          if (btnW === 0) return;
        }
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        idleAngle += speed * dt;
        const steer = pointerAngle !== null && proximityT > 0;
        const target = steer ? pointerAngle : idleAngle;
        const diff = ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        angle += diff * (1 - Math.exp(-dt * 7));

        const brightTarget = Math.max(0.35, proximityT);
        bright += (brightTarget - bright) * (1 - Math.exp(-dt * 8));

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);

        gl.uniform2f(uCenterLoc, (PAD + btnW / 2) * dpr, (PAD + btnH / 2) * dpr);
        gl.uniform2f(uHalfSizeLoc, (btnW / 2) * dpr, (btnH / 2) * dpr);
        gl.uniform1f(uRadiusLoc, Math.min(14, Math.min(btnW, btnH) / 2) * dpr);
        gl.uniform1f(uAngleLoc, angle);
        gl.uniform1f(uPxLoc, dpr);
        gl.uniform3f(uLineColorLoc, lineColor[0], lineColor[1], lineColor[2]);
        gl.uniform3f(uBaseColorLoc, baseColor[0], baseColor[1], baseColor[2]);
        gl.uniform1f(uIntensityLoc, intensity * bright);
        gl.uniform1f(uShineSizeLoc, (shineSize * Math.PI) / 180);
        gl.uniform1f(uShineFadeLoc, (shineFade * Math.PI) / 180);
        gl.uniform1f(uThicknessLoc, thickness * dpr);
        gl.uniform1f(uBaseWidthLoc, dpr);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      requestAnimationFrame(update);
    });
  }

  // Initialize Specular Buttons on startup
  initSpecularButtons();

  /**
   * Side Rays Ambient Background Lighting (React Bits - WebGL Ray Tracing)
   * Exact parameters from user screenshot:
   * Ray Color 1: #06704d, Ray Color 2: #033e9f, Origin: Top Right (flipX=0, flipY=0),
   * Speed: 3, Intensity: 2.5, Spread: 2, Tilt: 0, Saturation: 1.5,
   * Blend: 0.75, Falloff: 1.5, Opacity: 1
   */
  function initSideRays(target = 'sideRaysCanvas') {
    const canvas = typeof target === 'string' ? document.getElementById(target) : target;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      premultipliedAlpha: true
    }) || canvas.getContext('experimental-webgl');

    if (!gl) {
      console.warn('WebGL not supported for Side Rays');
      return;
    }

    const VERT_SRC = [
      'attribute vec2 position;',
      'void main() {',
      '  gl_Position = vec4(position, 0.0, 1.0);',
      '}'
    ].join('\n');

    const FRAG_SRC = [
      '#ifdef GL_FRAGMENT_PRECISION_HIGH',
      'precision highp float;',
      '#else',
      'precision mediump float;',
      '#endif',
      '',
      'uniform float iTime;',
      'uniform vec2 iResolution;',
      'uniform float iSpeed;',
      'uniform vec3 iRayColor1;',
      'uniform vec3 iRayColor2;',
      'uniform float iIntensity;',
      'uniform float iSpread;',
      'uniform float iFlipX;',
      'uniform float iFlipY;',
      'uniform float iTilt;',
      'uniform float iSaturation;',
      'uniform float iBlend;',
      'uniform float iFalloff;',
      'uniform float iOpacity;',
      '',
      'float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {',
      '  vec2 sourceToCoord = coord - raySource;',
      '  float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);',
      '  return clamp(',
      '    (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +',
      '    (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),',
      '    0.0, 1.0) *',
      '    clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);',
      '}',
      '',
      'void main() {',
      '  vec2 fragCoord = gl_FragCoord.xy;',
      '  if (iFlipX > 0.5) fragCoord.x = iResolution.x - fragCoord.x;',
      '  if (iFlipY > 0.5) fragCoord.y = iResolution.y - fragCoord.y;',
      '',
      '  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);',
      '  vec2 rayPos = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);',
      '',
      '  float tiltRad = iTilt * 3.14159265 / 180.0;',
      '  float cs = cos(tiltRad);',
      '  float sn = sin(tiltRad);',
      '  vec2 rel = coord - rayPos;',
      '  vec2 tiltedCoord = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs) + rayPos;',
      '',
      '  float halfSpread = iSpread * 0.275;',
      '  vec2 rayRefDir1 = normalize(vec2(cos(0.785398 + halfSpread), sin(0.785398 + halfSpread)));',
      '  vec2 rayRefDir2 = normalize(vec2(cos(0.785398 - halfSpread), sin(0.785398 - halfSpread)));',
      '',
      '  vec4 rays1 = vec4(iRayColor1, 1.0) * rayStrength(rayPos, rayRefDir1, tiltedCoord, 36.2214, 21.11349, iSpeed);',
      '  vec4 rays2 = vec4(iRayColor2, 1.0) * rayStrength(rayPos, rayRefDir2, tiltedCoord, 22.3991, 18.0234, iSpeed * 0.2);',
      '',
      '  vec4 color = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;',
      '',
      '  float distanceToLight = length(fragCoord.xy - vec2(rayPos.x, iResolution.y - rayPos.y)) / iResolution.y;',
      '  float brightness = iIntensity * 0.4 / pow(max(distanceToLight, 0.001), iFalloff);',
      '  color.rgb *= brightness;',
      '',
      '  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));',
      '  color.rgb = mix(vec3(gray), color.rgb, iSaturation);',
      '',
      '  color.a = max(color.r, max(color.g, color.b)) * iOpacity;',
      '  gl_FragColor = color;',
      '}'
    ].join('\n');

    function createShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('Side Rays shader compile error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = createShader(gl.VERTEX_SHADER, VERT_SRC);
    const fs = createShader(gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Side Rays program link error:', gl.getShaderInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(program, 'iTime');
    const uResolutionLoc = gl.getUniformLocation(program, 'iResolution');
    const uSpeedLoc = gl.getUniformLocation(program, 'iSpeed');
    const uRayColor1Loc = gl.getUniformLocation(program, 'iRayColor1');
    const uRayColor2Loc = gl.getUniformLocation(program, 'iRayColor2');
    const uIntensityLoc = gl.getUniformLocation(program, 'iIntensity');
    const uSpreadLoc = gl.getUniformLocation(program, 'iSpread');
    const uFlipXLoc = gl.getUniformLocation(program, 'iFlipX');
    const uFlipYLoc = gl.getUniformLocation(program, 'iFlipY');
    const uTiltLoc = gl.getUniformLocation(program, 'iTilt');
    const uSaturationLoc = gl.getUniformLocation(program, 'iSaturation');
    const uBlendLoc = gl.getUniformLocation(program, 'iBlend');
    const uFalloffLoc = gl.getUniformLocation(program, 'iFalloff');
    const uOpacityLoc = gl.getUniformLocation(program, 'iOpacity');

    // Values exact from control panel screenshot
    const config = {
      speed: 3.0,
      rayColor1: [6 / 255, 112 / 255, 77 / 255],   // #06704d
      rayColor2: [3 / 255, 62 / 255, 159 / 255],   // #033e9f
      intensity: 2.5,
      spread: 2.0,
      flipX: 0.0, // Top Right
      flipY: 0.0,
      tilt: 0.0,
      saturation: 1.5,
      blend: 0.75,
      falloff: 1.5,
      opacity: 1.0
    };

    gl.uniform1f(uSpeedLoc, config.speed);
    gl.uniform3fv(uRayColor1Loc, config.rayColor1);
    gl.uniform3fv(uRayColor2Loc, config.rayColor2);
    gl.uniform1f(uIntensityLoc, config.intensity);
    gl.uniform1f(uSpreadLoc, config.spread);
    gl.uniform1f(uFlipXLoc, config.flipX);
    gl.uniform1f(uFlipYLoc, config.flipY);
    gl.uniform1f(uTiltLoc, config.tilt);
    gl.uniform1f(uSaturationLoc, config.saturation);
    gl.uniform1f(uBlendLoc, config.blend);
    gl.uniform1f(uFalloffLoc, config.falloff);
    gl.uniform1f(uOpacityLoc, config.opacity);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      const tw = Math.floor(w * dpr);
      const th = Math.floor(h * dpr);
      if (canvas.width !== tw || canvas.height !== th) {
        canvas.width = tw;
        canvas.height = th;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    let animId = null;
    function render(time) {
      if (!canvas.isConnected) {
        if (animId) cancelAnimationFrame(animId);
        return;
      }
      animId = requestAnimationFrame(render);
      if (document.hidden) return;
      if (canvas.closest('.hidden')) return;

      gl.uniform1f(uTimeLoc, time * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    animId = requestAnimationFrame(render);
  }

  // Initialize Side Rays Background Lighting (Main Background + Scroll Expand Frame Background)
  initSideRays('sideRaysCanvas');
  initSideRays('scrollExpandRaysCanvas');



  function initPortfolioTabs() {
    const tabs = document.querySelectorAll('.portfolio-tab');
    const panes = document.querySelectorAll('.portfolio-tab-pane');
    if (!tabs.length || !panes.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabKey = tab.getAttribute('data-tab');
        const targetPaneId = `tab-${tabKey}`;

        tabs.forEach(t => t.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetPane = document.getElementById(targetPaneId);
        if (targetPane) {
          targetPane.classList.add('active');
          if (tabKey === 'projects') {
            const cards = targetPane.querySelectorAll('.project-card');
            cards.forEach(card => card.classList.remove('is-visible'));
            requestAnimationFrame(() => {
              cards.forEach(card => card.classList.add('is-visible'));
            });
          }
        }
        if (tabKey === 'tech-stack') {
          if (typeof window.prewarmKeypad === 'function') {
            window.prewarmKeypad();
          }
          if (window.refreshKeypadCanvas) {
            window.refreshKeypadCanvas();
          }
        }
      });
    });

    // Stage 2: Pre-warm Keypad as soon as portfolio section is scrolled near
    const portfolioSec = document.getElementById('portfolio');
    if (portfolioSec && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) {
          if (typeof window.prewarmKeypad === 'function') {
            window.prewarmKeypad();
          }
          observer.disconnect();
        }
      }, { rootMargin: '600px' });
      observer.observe(portfolioSec);
    }
  }

  // Interactive Mouse-Following Spotlight on Project Cards
  function initProjectCardSpotlight() {
    const cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;

    cards.forEach(card => {
      let isInside = false;
      let rafId = null;
      let lastEvent = null;

      function updateSpotlight() {
        if (!lastEvent) return;
        const rect = card.getBoundingClientRect();
        const x = lastEvent.clientX - rect.left;
        const y = lastEvent.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        if (!isInside) {
          isInside = true;
          card.classList.add('spotlight-active');
        }
        rafId = null;
      }

      function onPointerMove(e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        if (window.matchMedia && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        lastEvent = e;
        if (!rafId) {
          rafId = requestAnimationFrame(updateSpotlight);
        }
      }

      function onPointerLeave() {
        isInside = false;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        lastEvent = null;
        card.classList.remove('spotlight-active');
      }

      card.addEventListener('pointerenter', onPointerMove);
      card.addEventListener('pointermove', onPointerMove);
      card.addEventListener('pointerleave', onPointerLeave);
    });
  }

  // ==========================================================================
  // Project Detail Modal Controller (Dynamic Data & Glassmorphism Overlay)
  // ==========================================================================
  const TECH_LOGOS_MAP = {
    'React': { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
    'TypeScript': { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
    'Tailwind CSS': { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
    'Node.js': { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
    'Express': { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg', isWhite: true },
    'Zod': { url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/zod.svg', isWhite: true },
    'JWT': { url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/jsonwebtokens.svg', isWhite: true },
    'Prisma': { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg', isWhite: true },
    'SQLite': { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg' },
    'HTML': { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
    'CSS': { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
    'JavaScript': { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
    'Next.js': { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg', isWhite: true },
    'Python': { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
    'MySQL': { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
    'Docker': { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg' },
    'Git': { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-plain.svg' },
    'GitHub': { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', isWhite: true },
    'Figma': { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' },
    'WordPress': { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/wordpress/wordpress-plain.svg' },
    'Linux': { url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linux.svg', isWhite: true },
    'SVG Graphics': {
      svg: '<svg viewBox="0 0 24 24" class="tech-tag-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>'
    },
    'Vanilla Web Standards': {
      svg: '<svg viewBox="0 0 24 24" class="tech-tag-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
    },
    'Responsive Design': {
      svg: '<svg viewBox="0 0 24 24" class="tech-tag-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
    }
  };

  function renderTechTag(name) {
    const info = TECH_LOGOS_MAP[name];
    if (!info) return `<span>${name}</span>`;
    if (info.svg) return `${info.svg}<span>${name}</span>`;
    const whiteClass = info.isWhite ? ' tech-tag-icon-white' : '';
    return `<img src="${info.url}" alt="" class="tech-tag-icon${whiteClass}" loading="lazy"><span>${name}</span>`;
  }

  const PROJECTS_DATA = {
    'room-reserve': {
      title: 'ROOMRESERVE',
      subtitle: 'Resource & meeting room scheduling platform',
      subtitle_th: 'ระบบจองห้องประชุมและบริหารจัดการทรัพยากร',
      image: 'port/pic2.png',
      description: 'A modular resource scheduling engine with real-time conflict detection, showcased through an enterprise room booking interface.',
      description_th: 'ระบบบริหารจัดการและจัดสรรเวลาห้องประชุมแบบโมดูลาร์ พร้อมอัลกอริทึมตรวจสอบช่วงเวลาทับซ้อนแบบเรียลไทม์ ผ่านอินเทอร์เฟซการใช้งานระดับองค์กร',
      highlights: [
        { title: 'Intelligent Conflict Detection', desc: 'Server-side mathematical time-overlap algorithm prevents double bookings in real time (HTTP 409 Conflict).' },
        { title: 'End-to-End Type Safety', desc: 'Strict TypeScript interfaces and Zod validation enforce reliable data contracts across frontend and backend.' },
        { title: 'Relational Modeling & Prisma ORM', desc: 'Structured database schemas (Users, Rooms, Bookings) with SQLite persistence and Role-Based Access Control (RBAC).' },
        { title: 'Interactive Timeline & Bilingual UX', desc: 'Real-time schedule timeline view with instant Thai/English switching and automated Buddhist/Gregorian year conversion.' },
        { title: 'Extensible Architecture', desc: 'Data models and APIs designed to be adaptable for hot-desking, equipment, or appointment booking.' }
      ],
      highlights_th: [
        { title: 'Intelligent Conflict Detection', desc: 'อัลกอริทึมตรวจสอบการจองซ้อนทางคณิตศาสตร์ฝั่ง Server แบบเรียลไทม์ ป้องกันปัญหาชนกันของการจองทันที (HTTP 409 Conflict)' },
        { title: 'End-to-End Type Safety', desc: 'ใช้ TypeScript interfaces และ Zod validation ตรวจสอบความถูกต้องของข้อมูลระหว่าง Frontend และ Backend อย่างแม่นยำ' },
        { title: 'Relational Modeling & Prisma ORM', desc: 'ออกแบบ Database Schemas เชิงสัมพันธ์ (Users, Rooms, Bookings) ร่วมกับ SQLite และระบบ Role-Based Access Control (RBAC)' },
        { title: 'Interactive Timeline & Bilingual UX', desc: 'มุมมอง Timeline แสดงตารางเวลาแบบเรียลไทม์ สลับภาษาไทย/อังกฤษได้ทันที พร้อมระบบแปลงปี พ.ศ./ค.ศ. อัตโนมัติ' },
        { title: 'Extensible Architecture', desc: 'โครงสร้าง Data Model และ APIs ออกแบบให้ยืดหยุ่น สามารถต่อยอดสู่ระบบจองโต๊ะทำงาน หรืออุปกรณ์อื่นๆ ได้' }
      ],
      techGroups: [
        { label: 'Frontend', tags: ['React', 'TypeScript', 'Tailwind CSS'] },
        { label: 'Backend', tags: ['Node.js', 'Express', 'Zod', 'JWT'] },
        { label: 'Database', tags: ['Prisma', 'SQLite'] }
      ],
      liveDemoUrl: '#',
      sourceCodeUrl: 'https://github.com'
    },
    'bumblebee-clock': {
      title: 'BUMBLEBEE CLOCK',
      subtitle: 'Mecha-themed precision digital timepiece',
      subtitle_th: 'นาฬิกาดิจิทัลความแม่นยำสูงในธีมจักรกลหุ่นรบ',
      image: 'port/pic1.png',
      description: 'An interactive digital timepiece inspired by futuristic mechanical aesthetics. Features fluid real-time ticking animations, dynamic HUD elements, and ambient reactive glow effects built entirely with native web standards.',
      description_th: 'นาฬิกาดิจิทัลเชิงโต้ตอบที่ได้แรงบันดาลใจจากความงามของจักรกลล้ำยุค โดดเด่นด้วยแอนิเมชันเข็มวินาทีที่ลื่นไหล องค์ประกอบหน้าจอ HUD แบบไดนามิก และแสงนีออนโต้ตอบ โดยสร้างขึ้นด้วยเทคโนโลยีเว็บมาตรฐานทั้งหมด',
      highlights: [
        { title: 'Real-Time SVG Motion', desc: 'Sub-second precision time synchronization with smooth CSS transforms and SVG vector graphics.' },
        { title: 'Cyberpunk Industrial Design', desc: 'Striking mecha aesthetic featuring high-contrast neon accents and tactical HUD typography.' },
        { title: 'Lightweight & Optimized', desc: 'Crafted with pure HTML, CSS, and Vanilla JavaScript—blazing fast with zero external runtime libraries.' }
      ],
      highlights_th: [
        { title: 'Real-Time SVG Motion', desc: 'การซิงค์เวลาความละเอียดระดับเสี้ยววินาที พร้อม CSS transforms และภาพเวกเตอร์ SVG ที่นุ่มนวล' },
        { title: 'Cyberpunk Industrial Design', desc: 'ดีไซน์สไตล์จักรกลโดดเด่น ผสานแสงนีออนคอนทราสต์สูงและตัวอักษรแบบ Tactical HUD' },
        { title: 'Lightweight & Optimized', desc: 'พัฒนาด้วย HTML, CSS และ Vanilla JavaScript ล้วน — โหลดเร็วและไม่ต้องพึ่งพาไลบรารีภายนอก' }
      ],
      techGroups: [
        { label: 'Frontend', tags: ['HTML', 'CSS', 'JavaScript', 'SVG Graphics'] },
        { label: 'Architecture', tags: ['Vanilla Web Standards', 'Responsive Design'] }
      ],
      liveDemoUrl: '#',
      sourceCodeUrl: 'https://github.com'
    }
  };

  let currentOpenProjectId = null;
  let updateModalLanguage = null;

  function initProjectDetailModal() {
    const backdrop = document.getElementById('projectModalBackdrop');
    if (!backdrop) return;

    const closeBtn = document.getElementById('modalCloseBtn');
    const imgEl = document.getElementById('modalProjectImg');
    const titleEl = document.getElementById('modalProjectTitle');
    const subtitleEl = document.getElementById('modalProjectSubtitle');
    const descEl = document.getElementById('modalDescription');
    const highlightsListEl = document.getElementById('modalHighlightsList');
    const techTagsEl = document.getElementById('modalTechTags');
    const liveDemoBtn = document.getElementById('modalLiveDemoBtn');
    const sourceCodeBtn = document.getElementById('modalSourceCodeBtn');

    function openModal(projectId) {
      currentOpenProjectId = projectId;
      const data = PROJECTS_DATA[projectId];
      if (!data) return;

      const isTh = (currentLang === 'th');

      // Populate Left Column (Image)
      if (imgEl) {
        imgEl.src = data.image;
        imgEl.alt = `${data.title} Preview`;
      }

      // Populate Right Column
      if (titleEl) titleEl.textContent = data.title;
      if (subtitleEl) subtitleEl.textContent = (isTh && data.subtitle_th) ? data.subtitle_th : data.subtitle;
      if (descEl) descEl.textContent = (isTh && data.description_th) ? data.description_th : data.description;

      const highlights = (isTh && data.highlights_th) ? data.highlights_th : data.highlights;
      if (highlightsListEl && highlights) {
        highlightsListEl.innerHTML = highlights.map(h => `
          <li class="modal-highlight-item">
            <span class="highlight-bullet">▹</span>
            <div class="highlight-text">
              <strong>${h.title}:</strong> ${h.desc}
            </div>
          </li>
        `).join('');
      }

      if (techTagsEl && data.techGroups) {
        techTagsEl.innerHTML = data.techGroups.map(g => `
          <div class="modal-tech-group">
            <span class="modal-tech-group-label">${g.label}</span>
            <div class="modal-tech-tags">
              ${g.tags.map(t => `<span class="modal-tech-tag">${renderTechTag(t)}</span>`).join('')}
            </div>
          </div>
        `).join('');
      } else if (techTagsEl && data.tech) {
        techTagsEl.innerHTML = `
          <div class="modal-tech-tags">
            ${data.tech.map(t => `<span class="modal-tech-tag">${renderTechTag(t)}</span>`).join('')}
          </div>
        `;
      }

      if (liveDemoBtn) liveDemoBtn.href = data.liveDemoUrl || '#';
      if (sourceCodeBtn) sourceCodeBtn.href = data.sourceCodeUrl || '#';

      // Open modal & lock scroll
      backdrop.classList.add('is-open');
      backdrop.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    }

    updateModalLanguage = function () {
      if (currentOpenProjectId && backdrop.classList.contains('is-open')) {
        openModal(currentOpenProjectId);
      }
    };

    function closeModal() {
      currentOpenProjectId = null;
      backdrop.classList.remove('is-open');
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    }

    // Attach click events on trigger buttons ONLY (per user request)
    document.querySelectorAll('[data-open-modal]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const projectId = trigger.getAttribute('data-open-modal');
        openModal(projectId);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
      });
    }

    // Click outside container to close
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal();
      }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  // ==========================================================================
  // Bilingual Language Switcher (EN / TH) - Pure Text, Zero Emojis
  // ==========================================================================
  function updateLanguageIndicator(animate = true) {
    const switchEls = document.querySelectorAll('.nav-lang-pill');
    switchEls.forEach(langSwitch => {
      const langIndicator = langSwitch.querySelector('.lang-indicator');
      const activeBtn = langSwitch.querySelector(`.lang-btn[data-lang="${currentLang}"]`);
      if (activeBtn && langIndicator && langSwitch) {
        const switchRect = langSwitch.getBoundingClientRect();
        const btnRect = activeBtn.getBoundingClientRect();
        if (switchRect.width === 0 || btnRect.width === 0) return;

        const left = btnRect.left - switchRect.left;
        const top = btnRect.top - switchRect.top;
        const width = btnRect.width;
        const height = btnRect.height;

        if (!animate) {
          langIndicator.style.transition = 'none';
        } else {
          langIndicator.style.transition = 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), width 0.32s cubic-bezier(0.16, 1, 0.3, 1), height 0.32s cubic-bezier(0.16, 1, 0.3, 1)';
        }

        langIndicator.style.transform = `translate3d(${left}px, ${top}px, 0)`;
        langIndicator.style.width = `${width}px`;
        langIndicator.style.height = `${height}px`;

        if (!animate) {
          void langIndicator.offsetHeight; // Force reflow
          langIndicator.style.transition = 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), width 0.32s cubic-bezier(0.16, 1, 0.3, 1), height 0.32s cubic-bezier(0.16, 1, 0.3, 1)';
        }
      }
    });
  }

  function updateLanguageUI(lang, animate = true) {
    currentLang = lang;
    window.currentLang = lang;
    try {
      localStorage.setItem('preferred_lang', lang);
    } catch (e) {}

    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    const desktopLangCode = document.getElementById('desktopLangCode');
    if (desktopLangCode) {
      desktopLangCode.textContent = lang.toUpperCase();
    }

    updateLanguageIndicator(animate);

    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    const heroDesc = document.getElementById('heroDesc');
    const aboutLead = document.getElementById('aboutLead');
    const card1 = document.getElementById('cardDesc1');
    const card2 = document.getElementById('cardDesc2');
    const card3 = document.getElementById('cardDesc3');
    const quote = document.getElementById('approachQuote');
    const skillTagline = document.getElementById('skillTagline');
    const shortcutLabel = document.getElementById('shortcutLabel');

    if (heroDesc) heroDesc.innerHTML = dict.heroDesc;
    if (typeof window.retypeAboutLead === 'function') {
      window.retypeAboutLead(lang);
    } else {
      const leadTextEl = document.getElementById('aboutLeadText');
      if (leadTextEl) {
        leadTextEl.innerHTML = dict.aboutLead;
      }
    }
    if (card1) card1.textContent = dict.card1;
    if (card2) card2.textContent = dict.card2;
    if (card3) card3.textContent = dict.card3;
    if (quote) quote.textContent = dict.quote;
    if (skillTagline) skillTagline.textContent = dict.skillTagline;
    if (shortcutLabel) shortcutLabel.textContent = dict.shortcutLabel || (lang === 'th' ? 'คีย์ลัด' : 'Shortcut Key');

    if (typeof window.refreshSkillInfoLanguage === 'function') {
      window.refreshSkillInfoLanguage(lang);
    }

    if (typeof updateModalLanguage === 'function') {
      updateModalLanguage();
    }
  }

  function initLanguageSwitcher() {
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedLang = btn.getAttribute('data-lang');
        if (selectedLang && selectedLang !== currentLang) {
          updateLanguageUI(selectedLang, true);
        }
      });
    });

    const desktopToggle = document.getElementById('desktopLangToggle');
    if (desktopToggle) {
      desktopToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const nextLang = currentLang === 'en' ? 'th' : 'en';
        updateLanguageUI(nextLang, true);
      });
    }

    setTimeout(() => {
      updateLanguageUI(currentLang, false);
    }, 60);

    window.addEventListener('resize', () => {
      updateLanguageIndicator(false);
    });
  }

  /**
   * React Bits "Tech Text" Component Integration for PORTFOLIO Showcase
   * Replicated 1:1 with user customizer parameters:
   * Reveal: Letter | Reach: 200px | Softness: 0.7
   * Line Style: Dashed | Dash Length: 4px | Dash Gap: 2px | Stroke Width: 1.5px
   * Speed: 0.8 | Specks: 15 | Selection: true | Labels: true | Draggable: true | Sweep: true
   * Preserving Anton font, #00d2ff cyan glow and #ffffff clean white.
   */
  function initTechText() {
    const titles = document.querySelectorAll('.portfolio-title');
    if (!titles.length) return;

    const LABEL_FONT = '10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    const SPRING = 320;
    const DAMPING = 22;

    const approach = (current, target, dt, seconds) =>
      current + (target - current) * (1 - Math.exp(-dt / seconds));

    const hexToRgb = (hex) => {
      let h = String(hex || '').replace('#', '');
      if (h.length === 3) h = h.replace(/./g, (c) => c + c);
      const n = parseInt(h.slice(0, 6), 16);
      return Number.isNaN(n) ? [255, 255, 255] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };

    const rgba = (hex, alpha) => {
      const [r, g, b] = hexToRgb(hex);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const noise = (...values) => {
      let h = 2166136261;
      for (const value of values) {
        h = Math.imul(h ^ (value | 0), 16777619);
        h ^= h >>> 13;
        h = Math.imul(h, 0x5bd1e995);
        h ^= h >>> 15;
      }
      return (h >>> 0) / 4294967296;
    };

    const signed = (value) => (value > 0 ? `+${value}` : value < 0 ? `−${-value}` : '0');

    titles.forEach((titleEl) => {
      if (titleEl.dataset.techTextInit) return;
      titleEl.dataset.techTextInit = 'true';

      const container = document.createElement('div');
      container.className = 'tech-text';
      container.setAttribute('aria-hidden', 'true');

      const canvas = document.createElement('canvas');
      canvas.className = 'tech-text-canvas';
      container.appendChild(canvas);

      titleEl.appendChild(container);
      titleEl.classList.add('tech-text-ready');

      const ctx = canvas.getContext('2d');
      const scratch = document.createElement('canvas');
      const scratchCtx = scratch.getContext('2d');
      if (!ctx || !scratchCtx) return;

      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

      const s = {
        text1: 'PORTFOLIO',
        text2: 'Showcase',
        fontFamily: "'Anton', sans-serif",
        fontWeight: 400,
        fontSize: 52,
        color1: '#00d2ff',
        color2: '#ffffff',
        accentColor1: '#00d2ff',
        accentColor2: '#38bdf8',
        reach: 200,
        softness: 0.7,
        dashLength: 4,
        dashGap: 2,
        strokeWidth: 1.5,
        lineStyle: 'dashed',
        reveal: 'letter',
        specks: 15,
        selection: true,
        labels: true,
        draggable: true,
        sweep: true,
        speed: 0.8
      };

      let width = 1;
      let height = 1;
      let dpr = 1;
      let raf = 0;
      let last = performance.now();
      let visible = true;
      let alive = true;
      let layoutKey = '';
      let word = null;
      let glyphs = [];
      let clock = 0;
      let pulse = 0;
      let placed = false;
      let dragging = -1;
      const pointer = { x: 0, y: 0, inside: false };
      const grab = { x: 0, y: 0 };
      const lens = { x: 0, y: 0 };
      const frame = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 0, index: -1 };

      const fontFor = (size) => `${s.fontWeight} ${size}px ${s.fontFamily}`;

      const setFont = (target, size) => {
        target.font = fontFor(size);
        target.textAlign = 'left';
        target.textBaseline = 'alphabetic';
      };

      const sprite = (view, glyph, stroke) => {
        const pad = Math.ceil(s.strokeWidth * 2 + 10);
        const left = glyph.box.x1 - pad;
        const top = glyph.box.y1 - pad;
        const w = glyph.box.x2 - glyph.box.x1 + pad * 2;
        const h = glyph.box.y2 - glyph.box.y1 + pad * 2;
        const image = document.createElement('canvas');
        image.width = Math.max(1, Math.ceil(w * dpr));
        image.height = Math.max(1, Math.ceil(h * dpr));
        const c = image.getContext('2d');
        if (!c) return { image, left, top };

        c.setTransform(dpr, 0, 0, dpr, -left * dpr, -top * dpr);
        setFont(c, view.size);

        if (stroke) {
          c.lineJoin = 'round';
          c.lineWidth = s.strokeWidth * 2;
          c.lineCap = 'butt';
          c.strokeStyle = glyph.color;
          if (s.lineStyle !== 'solid') {
            c.setLineDash([Math.max(1, s.dashLength), Math.max(1, s.dashGap)]);
          }
          c.strokeText(glyph.char, glyph.x, view.baseline);
          c.setLineDash([]);
          c.globalCompositeOperation = 'destination-out';
          c.fillStyle = '#000000';
          c.fillText(glyph.char, glyph.x, view.baseline);
          c.globalCompositeOperation = 'source-over';
        } else {
          if (glyph.isCyan) {
            c.shadowColor = 'rgba(0, 210, 255, 0.45)';
            c.shadowBlur = 18;
          } else {
            c.shadowColor = 'rgba(0, 0, 0, 0.45)';
            c.shadowBlur = 8;
          }
          c.fillStyle = glyph.color;
          c.fillText(glyph.char, glyph.x, view.baseline);
        }
        return { image, left, top };
      };

      const ensureLayout = () => {
        const compEl = titleEl.querySelector('.title-portfolio') || titleEl;
        const compStyle = window.getComputedStyle(compEl);
        const parsedSize = parseFloat(compStyle.fontSize);
        if (parsedSize && !Number.isNaN(parsedSize)) {
          s.fontSize = parsedSize;
        }
        if (compStyle.fontFamily) {
          s.fontFamily = compStyle.fontFamily;
        }

        const key = [
          s.fontFamily,
          s.fontWeight,
          s.fontSize,
          width,
          height,
          dpr
        ].join('|');
        if (key === layoutKey && word) return word;
        layoutKey = key;

        const probe = scratchCtx;
        setFont(probe, s.fontSize);

        const m1 = probe.measureText(s.text1);
        const m2 = probe.measureText(s.text2);
        const baseGap = width < 500 ? 10 : 16;
        const inkWidth = m1.width + baseGap + m2.width;
        const asc = Math.max(m1.actualBoundingBoxAscent || s.fontSize * 0.75, m2.actualBoundingBoxAscent || s.fontSize * 0.75);
        const desc = Math.max(m1.actualBoundingBoxDescent || s.fontSize * 0.2, m2.actualBoundingBoxDescent || s.fontSize * 0.2);
        const inkHeight = asc + desc;

        const fit = Math.min(
          1,
          (width * 0.94) / Math.max(inkWidth, 1),
          (height * 0.74) / Math.max(inkHeight, 1)
        );
        const size = Math.round(s.fontSize * fit);
        setFont(probe, size);

        const sm1 = probe.measureText(s.text1);
        const sm2 = probe.measureText(s.text2);
        const gap = Math.round(baseGap * fit);
        const totalW = sm1.width + gap + sm2.width;
        const actualAsc = Math.max(sm1.actualBoundingBoxAscent || size * 0.75, sm2.actualBoundingBoxAscent || size * 0.75);
        const actualDesc = Math.max(sm1.actualBoundingBoxDescent || size * 0.2, sm2.actualBoundingBoxDescent || size * 0.2);
        const totalH = actualAsc + actualDesc;

        const x = Math.round((width - totalW) / 2);
        const baseline = Math.round((height - totalH) / 2 + actualAsc);

        const next = {
          size,
          baseline,
          left: x,
          right: x + totalW,
          top: baseline - actualAsc,
          bottom: baseline + actualDesc
        };
        word = next;

        const previous = glyphs;
        glyphs = [];

        // Word 1: PORTFOLIO
        const chars1 = Array.from(s.text1);
        let pref1 = '';
        chars1.forEach((char) => {
          const own = probe.measureText(char);
          const gx = x + probe.measureText(pref1).width;
          pref1 += char;

          const asc = typeof own.actualBoundingBoxAscent === 'number' ? own.actualBoundingBoxAscent : size * 0.78;
          const desc = typeof own.actualBoundingBoxDescent === 'number' ? own.actualBoundingBoxDescent : 0;
          const leftBound = typeof own.actualBoundingBoxLeft === 'number' ? gx - own.actualBoundingBoxLeft : gx;
          const rightBound = typeof own.actualBoundingBoxRight === 'number' ? gx + own.actualBoundingBoxRight : gx + own.width;

          const padX = 2;
          const padY = 2;
          const boxLeft = Math.round(leftBound - padX);
          const boxTop = Math.round(baseline - asc - padY);
          const boxRight = Math.round(rightBound + padX);
          const boxBottom = Math.round(baseline + desc + padY);

          const base = {
            char,
            x: gx,
            color: s.color1,
            accentColor: '#ffffff',
            isCyan: true,
            box: { x1: boxLeft, y1: boxTop, x2: boxRight, y2: boxBottom }
          };
          const kept = previous[glyphs.length];
          glyphs.push({
            ...base,
            offset: kept?.char === char ? kept.offset : { x: 0, y: 0 },
            velocity: kept?.char === char ? kept.velocity : { x: 0, y: 0 },
            outline: kept?.char === char ? kept.outline : 0,
            index: glyphs.length,
            fill: sprite(next, base, false),
            dashes: sprite(next, base, true)
          });
        });

        // Word 2: Showcase
        const word2X = x + sm1.width + gap;
        const chars2 = Array.from(s.text2);
        let pref2 = '';
        chars2.forEach((char) => {
          const own = probe.measureText(char);
          const gx = word2X + probe.measureText(pref2).width;
          pref2 += char;

          const asc = typeof own.actualBoundingBoxAscent === 'number' ? own.actualBoundingBoxAscent : size * 0.78;
          const desc = typeof own.actualBoundingBoxDescent === 'number' ? own.actualBoundingBoxDescent : 0;
          const leftBound = typeof own.actualBoundingBoxLeft === 'number' ? gx - own.actualBoundingBoxLeft : gx;
          const rightBound = typeof own.actualBoundingBoxRight === 'number' ? gx + own.actualBoundingBoxRight : gx + own.width;

          const padX = 2;
          const padY = 2;
          const boxLeft = Math.round(leftBound - padX);
          const boxTop = Math.round(baseline - asc - padY);
          const boxRight = Math.round(rightBound + padX);
          const boxBottom = Math.round(baseline + desc + padY);

          const base = {
            char,
            x: gx,
            color: s.color2,
            accentColor: '#ffffff',
            isCyan: false,
            box: { x1: boxLeft, y1: boxTop, x2: boxRight, y2: boxBottom }
          };
          const kept = previous[glyphs.length];
          glyphs.push({
            ...base,
            offset: kept?.char === char ? kept.offset : { x: 0, y: 0 },
            velocity: kept?.char === char ? kept.velocity : { x: 0, y: 0 },
            outline: kept?.char === char ? kept.outline : 0,
            index: glyphs.length,
            fill: sprite(next, base, false),
            dashes: sprite(next, base, true)
          });
        });

        dragging = -1;
        frame.index = -1;
        return next;
      };

      const glyphAt = (px, py) => {
        if (!word || py < word.top - 30 || py > word.bottom + 30) return -1;
        let best = -1;
        let bestDistance = Infinity;
        glyphs.forEach((glyph, i) => {
          const x1 = glyph.box.x1 + glyph.offset.x;
          const x2 = glyph.box.x2 + glyph.offset.x;
          const d = px < x1 ? x1 - px : px > x2 ? px - x2 : 0;
          if (d < bestDistance) {
            bestDistance = d;
            best = i;
          }
        });
        return bestDistance < 28 ? best : -1;
      };

      const crisp = (v) => (Math.round(v * dpr) + 0.5) / dpr;

      const perimeterPoint = (distance, w, h) => {
        let d = ((distance % (2 * (w + h))) + 2 * (w + h)) % (2 * (w + h));
        if (d < w) return [frame.x1 + d, frame.y1, 0, -1];
        d -= w;
        if (d < h) return [frame.x2, frame.y1 + d, 1, 0];
        d -= h;
        if (d < w) return [frame.x2 - d, frame.y2, 0, 1];
        d -= w;
        return [frame.x1, frame.y2 - d, -1, 0];
      };

      const drawSpecks = (a, accent) => {
        const w = frame.x2 - frame.x1;
        const h = frame.y2 - frame.y1;
        if (w < 2 || h < 2) return;
        const perimeter = 2 * (w + h);
        const seed = frame.index + 1;
        const grid = 3;

        for (let k = 0; k < s.specks; k++) {
          const period = 0.5 + noise(seed, k, 11) * 1.2;
          const t = pulse / period + noise(seed, k, 17);
          const cycle = Math.floor(t);
          const life = t - cycle;
          if (life > 0.7) continue;
          const [px, py, nx, ny] = perimeterPoint(noise(seed, k, cycle) * perimeter, w, h);
          const pick = noise(seed, k, cycle, 2);
          const size = pick < 0.46 ? 2 : pick < 0.7 ? 3 : pick < 0.84 ? 5 : pick < 0.94 ? 8 : 11;
          const large = size >= 8;
          const out = (large ? 9 : 4) + Math.floor(noise(seed, k, cycle, 1) * 5) * grid;
          const gx = frame.x1 + Math.round((px + nx * out - frame.x1) / grid) * grid;
          const gy = frame.y1 + Math.round((py + ny * out - frame.y1) / grid) * grid;
          const tone = noise(seed, k, cycle, 3);
          const blink = life < 0.06 || (life > 0.32 && life < 0.36) ? 0.35 : 1;
          const alpha = a * (large ? 0.3 + 0.4 * tone : 0.3 + 0.6 * tone) * blink;
          const left = Math.round(gx - size / 2);
          const top = Math.round(gy - size / 2);
          if (tone < 0.26 || (large && tone < 0.78)) {
            ctx.strokeStyle = rgba(accent, alpha);
            ctx.strokeRect(left + 0.5, top + 0.5, size, size);
            if (large && tone > 0.5) {
              ctx.fillStyle = rgba(accent, alpha);
              ctx.fillRect(Math.round(gx) - 1, Math.round(gy) - 1, 2, 2);
            }
          } else {
            ctx.fillStyle = rgba(accent, alpha);
            ctx.fillRect(left, top, size, size);
          }
        }

        for (let j = 0; j < 2; j++) {
          const head = (pulse * 0.42 * s.speed + j * 0.5) * perimeter;
          for (let i = 0; i < 4; i++) {
            const [px, py] = perimeterPoint(head - i * 6, w, h);
            const size = i === 0 ? 3 : 2;
            ctx.fillStyle = rgba(accent, a * [0.95, 0.55, 0.32, 0.16][i]);
            ctx.fillRect(Math.round(px - size / 2), Math.round(py - size / 2), size, size);
          }
        }
      };

      const drawFrame = () => {
        const glyph = glyphs[frame.index];
        if (!glyph || frame.alpha < 0.01) return;
        const a = frame.alpha;
        const frameColor = '#ffffff';
        const x1 = crisp(frame.x1);
        const y1 = crisp(frame.y1);
        const x2 = crisp(frame.x2);
        const y2 = crisp(frame.y2);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
        if (moved > 1) {
          const hx = (glyph.box.x1 + glyph.box.x2) / 2;
          const hy = (glyph.box.y1 + glyph.box.y2) / 2;
          ctx.beginPath();
          ctx.moveTo(hx, hy);
          ctx.lineTo(hx + glyph.offset.x, hy + glyph.offset.y);
          ctx.setLineDash([3, 4]);
          ctx.lineWidth = 1;
          ctx.strokeStyle = rgba(frameColor, 0.45 * a);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.rect(Math.round(hx) - 1.5, Math.round(hy) - 1.5, 3, 3);
          ctx.fillStyle = rgba(frameColor, 0.75 * a);
          ctx.fill();
        }

        // White HUD Bounding Box
        ctx.beginPath();
        ctx.rect(x1, y1, x2 - x1, y2 - y1);
        ctx.lineWidth = 1;
        ctx.strokeStyle = rgba(frameColor, 0.75 * a);
        ctx.shadowColor = 'rgba(255, 255, 255, 0.35)';
        ctx.shadowBlur = 4;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // White Corner Brackets (snug 3.5x3.5px on corners)
        ctx.beginPath();
        for (const [cx, cy] of [
          [x1, y1],
          [x2, y1],
          [x2, y2],
          [x1, y2]
        ]) {
          ctx.rect(Math.round(cx) - 1.5, Math.round(cy) - 1.5, 3.5, 3.5);
        }
        ctx.fillStyle = rgba(frameColor, 0.95 * a);
        ctx.fill();

        // 15 White Specks
        if (s.specks > 0) {
          ctx.lineWidth = 1;
          drawSpecks(a, frameColor);
        }

        // Monospace Dimension / Offset Label in White
        if (!s.labels) return;
        ctx.font = LABEL_FONT;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = rgba(frameColor, 0.85 * a);
        const label =
          moved > 1
            ? `${signed(Math.round(glyph.offset.x))}, ${signed(Math.round(-glyph.offset.y))}`
            : `${glyph.char}  ${Math.round(glyph.box.x2 - glyph.box.x1)} × ${Math.round(glyph.box.y2 - glyph.box.y1)}`;
        ctx.fillText(label, Math.round(frame.x1), Math.round(frame.y1) - 4);
      };

      const blit = (art, dx, dy) => {
        ctx.drawImage(
          art.image,
          Math.round((art.left + dx) * dpr),
          Math.round((art.top + dy) * dpr)
        );
      };

      const tick = (now) => {
        raf = 0;
        const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
        last = now;
        const view = ensureLayout();

        const sweeping = s.sweep && !reducedMotion && !pointer.inside && dragging < 0;
        if (sweeping) clock += dt * s.speed;
        pulse += dt;
        let targetX = pointer.x;
        let targetY = pointer.y;
        if (sweeping) {
          targetX = view.left + (view.right - view.left) * (0.5 - 0.5 * Math.cos(clock * 0.45));
          targetY = view.top + (view.bottom - view.top) * (0.45 + 0.1 * Math.sin(clock * 0.8));
        }
        const active = pointer.inside || sweeping || dragging >= 0;
        if (active && !placed) {
          lens.x = targetX;
          lens.y = targetY;
        }
        if (active) {
          const lag = pointer.inside ? 0.05 : 0.22;
          lens.x = approach(lens.x, targetX, dt, lag);
          lens.y = approach(lens.y, targetY, dt, lag);
        }
        placed = active;

        let moving = false;
        glyphs.forEach((glyph, i) => {
          if (i === dragging) {
            glyph.offset.x = approach(glyph.offset.x, pointer.x - grab.x, dt, 0.03);
            glyph.offset.y = approach(glyph.offset.y, pointer.y - grab.y, dt, 0.03);
            glyph.velocity.x = 0;
            glyph.velocity.y = 0;
            moving = true;
            return;
          }
          const { offset, velocity } = glyph;
          if (Math.abs(offset.x) < 0.05 && Math.abs(offset.y) < 0.05 && Math.hypot(velocity.x, velocity.y) < 0.5) {
            offset.x = 0;
            offset.y = 0;
            velocity.x = 0;
            velocity.y = 0;
            return;
          }
          velocity.x += (-SPRING * offset.x - DAMPING * velocity.x) * dt;
          velocity.y += (-SPRING * offset.y - DAMPING * velocity.y) * dt;
          offset.x += velocity.x * dt;
          offset.y += velocity.y * dt;
          moving = true;
        });

        const focus = dragging >= 0 ? dragging : active ? glyphAt(lens.x, lens.y) : -1;
        if (focus >= 0 && s.selection) {
          const glyph = glyphs[focus];
          const bx1 = glyph.box.x1 + glyph.offset.x;
          const by1 = glyph.box.y1 + glyph.offset.y;
          const bx2 = glyph.box.x2 + glyph.offset.x;
          const by2 = glyph.box.y2 + glyph.offset.y;
          if (frame.index < 0 || frame.alpha < 0.02) {
            frame.x1 = bx1;
            frame.y1 = by1;
            frame.x2 = bx2;
            frame.y2 = by2;
          }
          const glide = focus === dragging ? 0.02 : 0.08;
          frame.x1 = approach(frame.x1, bx1, dt, glide);
          frame.y1 = approach(frame.y1, by1, dt, glide);
          frame.x2 = approach(frame.x2, bx2, dt, glide);
          frame.y2 = approach(frame.y2, by2, dt, glide);
          frame.index = focus;
        }
        frame.alpha = approach(frame.alpha, focus >= 0 && s.selection ? 1 : 0, dt, 0.1);

        glyphs.forEach((glyph, i) => {
          const target = s.reveal === 'letter' && i === focus && i !== dragging ? 1 : 0;
          glyph.outline = approach(glyph.outline, target, dt, 0.09);
          if (Math.abs(glyph.outline - target) > 0.002) moving = true;
          else glyph.outline = target;
        });

        if (s.draggable) {
          container.style.cursor = dragging >= 0 ? 'grabbing' : focus >= 0 && pointer.inside ? 'grab' : '';
        }

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const glyph of glyphs) {
          const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
          if (moved > 1) {
            ctx.globalAlpha = Math.min(1, moved / 24) * 0.55;
            blit(glyph.dashes, 0, 0);
            ctx.globalAlpha = 1;
          }
        }

        for (const glyph of glyphs) {
          if (glyph.outline < 0.999) {
            ctx.globalAlpha = 1 - glyph.outline;
            blit(glyph.fill, glyph.offset.x, glyph.offset.y);
          }
          if (glyph.outline > 0.001) {
            ctx.globalAlpha = glyph.outline;
            blit(glyph.dashes, glyph.offset.x, glyph.offset.y);
          }
          ctx.globalAlpha = 1;
        }

        drawFrame();

        const settling =
          moving ||
          (frame.alpha > 0.01 && frame.alpha < 0.99) ||
          glyphs.some((g) => g.outline > 0.001 && g.outline < 0.999);
        if ((active || settling) && visible && alive) {
          raf = requestAnimationFrame(tick);
        }
      };

      const wake = () => {
        if (raf || !visible || !alive) return;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      };

      const resize = () => {
        width = Math.max(1, container.clientWidth);
        height = Math.max(1, container.clientHeight);
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        layoutKey = '';
        wake();
      };

      const locate = (e) => {
        const rect = container.getBoundingClientRect();
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
      };

      const onMove = (e) => {
        locate(e);
        pointer.inside = true;
        wake();
      };

      const onLeave = () => {
        if (dragging >= 0) return;
        pointer.inside = false;
        wake();
      };

      const onDown = (e) => {
        locate(e);
        pointer.inside = true;
        if (s.draggable && (e.pointerType !== 'mouse' || e.button === 0)) {
          const index = glyphAt(pointer.x, pointer.y);
          if (index >= 0) {
            dragging = index;
            grab.x = pointer.x - glyphs[index].offset.x;
            grab.y = pointer.y - glyphs[index].offset.y;
            if (container.setPointerCapture) {
              try { container.setPointerCapture(e.pointerId); } catch (_) {}
            }
          }
        }
        wake();
      };

      const onUp = (e) => {
        if (dragging >= 0) {
          dragging = -1;
          if (container.releasePointerCapture) {
            try { container.releasePointerCapture(e.pointerId); } catch (_) {}
          }
          const rect = container.getBoundingClientRect();
          pointer.inside =
            e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
        }
        wake();
      };

      container.addEventListener('pointermove', onMove, { passive: true });
      container.addEventListener('pointerenter', onMove, { passive: true });
      container.addEventListener('pointerdown', onDown, { passive: true });
      container.addEventListener('pointerup', onUp, { passive: true });
      container.addEventListener('pointercancel', onUp, { passive: true });
      container.addEventListener('pointerleave', onLeave, { passive: true });

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      window.addEventListener('resize', resize, { passive: true });

      const intersectionObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        wake();
      });
      intersectionObserver.observe(container);

      if (document.fonts) {
        document.fonts.ready.then(() => {
          layoutKey = '';
          wake();
        });
      }

      resize();
    });
  }

  // ==========================================================================
  // React Bits "Logo Loop" Controller (Speed: 100px/s, Direction: Left)
  // ==========================================================================
  function initLogoLoop() {
    const track = document.getElementById('logoLoopTrack');
    if (!track) return;
    const firstList = track.querySelector('.logo-loop-list');
    if (!firstList) return;

    function calibrateSpeed() {
      const width = firstList.getBoundingClientRect().width;
      if (width > 0) {
        // Exact 100px per second: duration = width / 100
        const durationSec = width / 100;
        track.style.setProperty('--logo-loop-duration', `${durationSec.toFixed(2)}s`);
      }
    }

    calibrateSpeed();
    window.addEventListener('resize', calibrateSpeed, { passive: true });
    const images = track.querySelectorAll('img');
    images.forEach(img => {
      if (!img.complete) {
        img.addEventListener('load', calibrateSpeed, { once: true });
      }
    });
  }

  // ==========================================================================
  // React Bits "Scroll Velocity" Controller
  // Customizer Settings: Velocity: 60 | Num Copies: 6 | Damping: 50 | Stiffness: 400
  // ==========================================================================
  function initScrollVelocity() {
    const section = document.getElementById('scrollVelocity');
    if (!section) return;
    const rows = section.querySelectorAll('.scroll-velocity-row');
    if (!rows.length) return;

    const scrollContainer = document.getElementById('homeScreen') || window;
    const getScrollTop = () => (scrollContainer === window ? (window.pageYOffset || document.documentElement.scrollTop || 0) : scrollContainer.scrollTop);

    const baseVelocity = 60; // 60px/s base rate from customizer
    const damping = 50;      // Damping: 50 from customizer
    const stiffness = 400;   // Stiffness: 400 from customizer

    let lastScroll = getScrollTop();
    let lastTime = performance.now();
    let springValue = 0;
    let springVelocity = 0;
    let isVisible = true;
    let rafId = null;

    // Track scroll direction: 1 for scrolling DOWN, -1 for scrolling UP
    // Default 1: Row 1 moves left, Row 2 moves right
    let targetDirFactor = 1;
    let smoothDirFactor = 1;

    const rowStates = Array.from(rows).map(row => {
      const track = row.querySelector('.scroll-velocity-track');
      const dir = parseFloat(row.getAttribute('data-direction')) || -1;
      return {
        row,
        track,
        dir,
        pos: 0,
        wrapWidth: 0
      };
    });

    function measure() {
      rowStates.forEach(state => {
        if (!state.track) return;
        const firstSpan = state.track.querySelector('.scroll-velocity-text');
        if (firstSpan && firstSpan.offsetWidth > 0) {
          state.wrapWidth = firstSpan.offsetWidth;
        }
      });
    }

    measure();
    window.addEventListener('resize', measure, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }

    function animate(now) {
      if (!isVisible) {
        rafId = null;
        return;
      }

      // If homeScreen or section is hidden in display (e.g. during welcome screen), idle the loop
      if (section.offsetParent === null) {
        lastTime = now;
        lastScroll = getScrollTop();
        rafId = requestAnimationFrame(animate);
        return;
      }

      const dt = Math.min(Math.max((now - lastTime) / 1000, 0.001), 0.05);
      lastTime = now;

      const currentScroll = getScrollTop();
      const deltaScroll = currentScroll - lastScroll;
      lastScroll = currentScroll;

      // Update scroll direction factor when active scrolling occurs:
      // deltaScroll > 0.5 => scrolling DOWN (Row 1 left, Row 2 right)
      // deltaScroll < -0.5 => scrolling UP (Row 1 right, Row 2 left)
      if (deltaScroll > 0.5) {
        targetDirFactor = 1;
      } else if (deltaScroll < -0.5) {
        targetDirFactor = -1;
      }

      // Smoothly transition direction to prevent any visual jerk/pop
      smoothDirFactor += (targetDirFactor - smoothDirFactor) * Math.min(dt * 14, 1);

      const targetScrollVelocity = dt > 0 ? (deltaScroll / dt) : 0;

      // Spring physics (Framer Motion damped spring: damping = 50, stiffness = 400)
      const force = -stiffness * (springValue - targetScrollVelocity) - damping * springVelocity;
      springVelocity += force * dt;
      springValue += springVelocity * dt;

      // Dynamic velocity calculation matching React Bits:
      // Text accelerates in direction of scroll and smoothly dampens back to base velocity
      const scrollBoost = Math.abs(springValue) * 0.28;

      rowStates.forEach(state => {
        if (!state.track) return;

        // Auto-measure if not measured yet (e.g. when transition from welcome screen just finished)
        if (state.wrapWidth <= 0) {
          const firstSpan = state.track.querySelector('.scroll-velocity-text');
          if (firstSpan && firstSpan.offsetWidth > 0) {
            state.wrapWidth = firstSpan.offsetWidth;
          }
        }
        if (state.wrapWidth <= 0) return;

        // Direction reversal logic:
        // state.dir: Row 1 = -1, Row 2 = +1
        // When smoothDirFactor = +1 (Scrolling Down):
        //   Row 1: currentDir = -1 * 1 = -1 (Moves Left)
        //   Row 2: currentDir = +1 * 1 = +1 (Moves Right)
        // When smoothDirFactor = -1 (Scrolling Up):
        //   Row 1: currentDir = -1 * -1 = +1 (Moves Right)
        //   Row 2: currentDir = +1 * -1 = -1 (Moves Left)
        const currentDir = state.dir * smoothDirFactor;
        const speed = currentDir * (baseVelocity + scrollBoost);

        state.pos += speed * dt;

        // Continuous modular wrap within [-wrapW, 0)
        const wrapW = state.wrapWidth;
        const mod = ((state.pos % wrapW) + wrapW) % wrapW;
        const wrappedX = mod - wrapW;

        state.track.style.transform = `translate3d(${wrappedX.toFixed(2)}px, 0, 0)`;
      });

      rafId = requestAnimationFrame(animate);
    }

    // Start loop immediately
    rafId = requestAnimationFrame(animate);

    // Pause when scrolled far out of view (rootMargin 300px)
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible && !rafId) {
            lastTime = performance.now();
            lastScroll = getScrollTop();
            rafId = requestAnimationFrame(animate);
          }
        });
      }, {
        rootMargin: '300px 0px 300px 0px'
      });
      observer.observe(section);
    }

    window.refreshScrollVelocity = () => {
      measure();
      if (!rafId) {
        lastTime = performance.now();
        lastScroll = getScrollTop();
        rafId = requestAnimationFrame(animate);
      }
    };
  }

  // ==========================================================================
  // React Bits "Option Wheel" Mobile Navigation Controller
  // Specs: Side: Left | Inset: 64px | Tilt: 6deg | Font Size: 3.3rem | Spacing: 1.5
  // Active: #3b82f6 | Text: #ffffff | Blur: 1.75px | Fade: 0.4 | Smoothing: 200ms
  // Font: Anton | Connected directly below .navbar-wrapper capsule
  // ==========================================================================
  function initMobileOptionWheel() {
    const hamburgerBtn = document.getElementById('navHamburgerBtn');
    const dropdown = document.getElementById('mobileOptionWheelDropdown');
    const backdrop = document.getElementById('mobileDropdownBackdrop');
    const viewport = document.getElementById('optionWheelViewport');
    const track = document.getElementById('optionWheelTrack');
    const items = Array.from(document.querySelectorAll('.option-wheel-item'));

    if (!hamburgerBtn || !dropdown || !viewport || !track || !items.length) return;

    const BASE_COUNT = 4;
    const SET_OFFSET = 4; // Middle set starts at index 4 (0..3, 4..7, 8..11)
    let selectedIndex = SET_OFFSET;
    let isOpen = false;
    let loopResetTimer = null;
    const defaultItemHeight = 68; // Font size * 1.5 spacing
    const sectionTargets = ['#home', '#about', '#portfolio', '#contact'];

    function updateWheel(index, animate = true) {
      clearTimeout(loopResetTimer);
      selectedIndex = Math.max(0, Math.min(items.length - 1, index));

      // 1. Calculate translateY offset so active item is centered in the wheel viewport
      const vHeight = viewport.clientHeight || 280;
      const iHeight = items[selectedIndex]?.offsetHeight || defaultItemHeight;
      const offsetY = (vHeight / 2) - (iHeight / 2) - (selectedIndex * iHeight);

      if (!animate) {
        track.style.transition = 'none';
      } else {
        track.style.transition = 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)';
      }
      track.style.transform = `translateY(${Math.round(offsetY)}px)`;

      // 2. Dynamic Option Wheel: Active item is completely straight horizontal (rotate 0deg / แนวตรง)
      // Items above slant upwards (-6deg per step), items below slant downwards (+6deg per step)
      items.forEach((item, i) => {
        const diff = i - selectedIndex; // negative = above center, positive = below center
        const dist = Math.abs(diff);
        const textEl = item.querySelector('.option-wheel-text');
        if (!textEl) return;

        if (!animate) {
          textEl.style.transition = 'none';
        } else {
          textEl.style.transition = 'color 200ms cubic-bezier(0.25, 1, 0.5, 1), opacity 200ms cubic-bezier(0.25, 1, 0.5, 1), filter 200ms cubic-bezier(0.25, 1, 0.5, 1), text-shadow 200ms cubic-bezier(0.25, 1, 0.5, 1), transform 200ms cubic-bezier(0.25, 1, 0.5, 1)';
        }

        item.classList.remove('is-active', 'dist-1', 'dist-2', 'dist-3');

        if (dist === 0) {
          // ACTIVE / SELECTED: แนวตรง (Straight Horizontal 0deg), Blue #3b82f6 with glow
          item.classList.add('is-active');
          textEl.style.color = '#3b82f6';
          textEl.style.opacity = '1';
          textEl.style.filter = 'blur(0px)';
          textEl.style.textShadow = '0 0 28px rgba(59, 130, 246, 0.7), 0 0 10px rgba(59, 130, 246, 0.45)';
          textEl.style.transform = 'translateX(10px) rotate(0deg) scale(1.04)';
        } else {
          // NON-SELECTED: Curved cylinder rotation
          item.classList.add(`dist-${Math.min(dist, 3)}`);
          const angle = diff * 6; // -6deg for 1 above, +6deg for 1 below, -12deg for 2 above, etc.
          const scale = Math.max(0.88, (1 - dist * 0.035)).toFixed(3);
          const opacity = dist === 1 ? '0.40' : (dist === 2 ? '0.16' : '0.08');
          const blur = (dist * 1.75).toFixed(2);

          textEl.style.color = '#ffffff';
          textEl.style.opacity = opacity;
          textEl.style.filter = `blur(${blur}px)`;
          textEl.style.textShadow = 'none';
          textEl.style.transform = `translateX(0px) rotate(${angle}deg) scale(${scale})`;
        }
      });

      // Seamless infinite loop normalization:
      // If selectedIndex drifted into Set 0 (< 4) or Set 2 (>= 8), normalize back into Set 1 [4..7]
      if (selectedIndex < SET_OFFSET || selectedIndex >= SET_OFFSET + BASE_COUNT) {
        if (animate) {
          loopResetTimer = setTimeout(() => {
            const baseIdx = ((selectedIndex % BASE_COUNT) + BASE_COUNT) % BASE_COUNT;
            selectedIndex = SET_OFFSET + baseIdx;
            updateWheel(selectedIndex, false);
          }, 205);
        } else {
          const baseIdx = ((selectedIndex % BASE_COUNT) + BASE_COUNT) % BASE_COUNT;
          selectedIndex = SET_OFFSET + baseIdx;
        }
      }
    }

    function syncWithCurrentSection() {
      const activeLink = document.querySelector('.nav-link.active');
      if (activeLink) {
        const href = activeLink.getAttribute('href');
        const found = sectionTargets.indexOf(href);
        if (found !== -1) {
          selectedIndex = SET_OFFSET + found;
          updateWheel(selectedIndex, false);
          return;
        }
      }
      selectedIndex = SET_OFFSET;
      updateWheel(selectedIndex, false);
    }

    function openMenu() {
      isOpen = true;
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      dropdown.classList.add('active');
      dropdown.setAttribute('aria-hidden', 'false');
      if (backdrop) {
        backdrop.classList.add('active');
        backdrop.setAttribute('aria-hidden', 'false');
      }

      // Lock background page scroll on body and homeScreen
      document.body.classList.add('mobile-menu-open');
      const homeScreen = document.getElementById('homeScreen');
      if (homeScreen) {
        homeScreen.classList.add('scroll-locked');
      }

      // Sync wheel position to the currently viewed section immediately
      syncWithCurrentSection();
      // Enforce positioning pass and update mobile language indicator
      requestAnimationFrame(() => {
        updateWheel(selectedIndex, false);
        if (typeof updateLanguageIndicator === 'function') {
          updateLanguageIndicator(false);
        }
      });
    }

    function closeMenu() {
      isOpen = false;
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      dropdown.classList.remove('active');
      dropdown.setAttribute('aria-hidden', 'true');
      if (backdrop) {
        backdrop.classList.remove('active');
        backdrop.setAttribute('aria-hidden', 'true');
      }

      // Unlock background page scroll
      document.body.classList.remove('mobile-menu-open');
      const homeScreen = document.getElementById('homeScreen');
      if (homeScreen) {
        homeScreen.classList.remove('scroll-locked');
      }
    }

    hamburgerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (backdrop) {
      backdrop.addEventListener('touchmove', (e) => {
        if (e.cancelable) e.preventDefault();
      }, { passive: false });
      backdrop.addEventListener('click', (e) => {
        e.preventDefault();
        closeMenu();
      });
    }

    // Selecting an item
    items.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const idx = parseInt(item.getAttribute('data-index'), 10);
        updateWheel(idx, true);
        const target = item.getAttribute('data-target');

        // Let user perceive the 200ms wheel spin smoothing before closing and scrolling
        setTimeout(() => {
          closeMenu();
          if (typeof smoothNavigateTo === 'function' && target) {
            smoothNavigateTo(target);
          }
        }, 200);
      });
    });

    // Touch swipe support on option wheel (Infinite Loop)
    let touchStartY = 0;
    viewport.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      if (!isOpen || !e.touches || !e.touches[0]) return;
      if (e.cancelable) e.preventDefault(); // Stop background scroll while interacting with menu!
      const dy = e.touches[0].clientY - touchStartY;
      if (Math.abs(dy) > 28) {
        if (dy < 0) {
          updateWheel(selectedIndex + 1, true);
          touchStartY = e.touches[0].clientY;
        } else if (dy > 0) {
          updateWheel(selectedIndex - 1, true);
          touchStartY = e.touches[0].clientY;
        }
      }
    }, { passive: false });

    // Mouse wheel support (Infinite Loop)
    viewport.addEventListener('wheel', (e) => {
      if (!isOpen) return;
      e.preventDefault();
      if (e.deltaY > 15) {
        updateWheel(selectedIndex + 1, true);
      } else if (e.deltaY < -15) {
        updateWheel(selectedIndex - 1, true);
      }
    }, { passive: false });

    // Keyboard accessibility (Infinite Loop)
    window.addEventListener('keydown', (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        closeMenu();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        updateWheel(selectedIndex + 1, true);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        updateWheel(selectedIndex - 1, true);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const activeItem = items[selectedIndex];
        if (activeItem) {
          const target = activeItem.getAttribute('data-target');
          closeMenu();
          if (typeof smoothNavigateTo === 'function' && target) {
            smoothNavigateTo(target);
          }
        }
      }
    });

    window.addEventListener('resize', () => {
      if (isOpen) {
        if (window.innerWidth > 768) {
          closeMenu();
        } else {
          updateWheel(selectedIndex, false);
          if (typeof updateLanguageIndicator === 'function') {
            updateLanguageIndicator(false);
          }
        }
      }
    }, { passive: true });

    // Initial silent positioning in middle set
    updateWheel(SET_OFFSET, false);
  }

  initProjectCardSpotlight();
  initProjectDetailModal();
  initScrollFloat();
  initAboutTypewriter();
  initLanguageSwitcher();
  initTechText();
  initLogoLoop();
  initScrollVelocity();
  initMobileOptionWheel();
  initMobileHeroScrollTrigger();
});

/**
 * Completely Rebuilt 3D WebGL Lanyard ID Badge System (1:1 Replica of video2.mp4)
 * Architecture & Physics Pipeline:
 * 1. 3D Scene, Studio Lighting & Procedural HDR Environment Mapping
 * 2. 3D Molded Acrylic ID Badge Mesh (Rounded Corners, Bevel & True 3D Slot Cutout)
 * 3. Metal Hardware Clasp Assembly Passing Directly Through the Slot Hole
 * 4. High-Density Woven Black Lanyard Ribbon with 3D Normal Torsion Twisting
 * 5. 6-DOF Card Rigid Body Dynamics with Moment of Inertia, Joint Constraint & Angular Momenta
 * 6. Compliant Hookean Spring Drag & Elastic Catapult Recoil ("แรงดีดตอนดึงและแรงแกว่ง")
 * 7. Authentic Gravity Drop Entrance & Aerodynamic Air Damping
 */
function init3DLanyardWebGL() {
  const canvas = document.getElementById('lanyard3dCanvas');
  if (!canvas) return;
  if (typeof THREE === 'undefined') {
    setTimeout(init3DLanyardWebGL, 40);
    return;
  }
  if (init3DLanyardWebGL._initialized) return;
  init3DLanyardWebGL._initialized = true;

  let width = window.innerWidth;
  let height = window.innerHeight;

  // 1. Scene, Camera, High-Precision WebGL Renderer
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 100);
  camera.position.set(0, 0, 13);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // 2. Pure White Studio HDR Environment Map for High-End Reflections (No Cyan/Blue Tint)
  function createStudioEnvMap() {
    const eCanvas = document.createElement('canvas');
    eCanvas.width = 1024;
    eCanvas.height = 512;
    const ctx = eCanvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 512);
    bgGrad.addColorStop(0, '#111317');
    bgGrad.addColorStop(0.5, '#181b22');
    bgGrad.addColorStop(1, '#0e1014');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Overhead softbox (pure white)
    const soft1 = ctx.createRadialGradient(512, 120, 10, 512, 120, 260);
    soft1.addColorStop(0, '#ffffff');
    soft1.addColorStop(0.4, 'rgba(255, 255, 255, 0.85)');
    soft1.addColorStop(1, 'transparent');
    ctx.fillStyle = soft1;
    ctx.fillRect(0, 0, 1024, 300);

    // Left fill softbox (pure white)
    const soft2 = ctx.createRadialGradient(200, 260, 10, 200, 260, 220);
    soft2.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    soft2.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
    soft2.addColorStop(1, 'transparent');
    ctx.fillStyle = soft2;
    ctx.fillRect(0, 0, 400, 512);

    // Right white soft strip
    const soft3 = ctx.createLinearGradient(850, 0, 950, 0);
    soft3.addColorStop(0, 'transparent');
    soft3.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
    soft3.addColorStop(1, 'transparent');
    ctx.fillStyle = soft3;
    ctx.fillRect(800, 0, 200, 512);

    const envTexture = new THREE.CanvasTexture(eCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    return envTexture;
  }

  const studioEnv = createStudioEnvMap();
  scene.environment = studioEnv;

  // 3. Studio Pure White Lighting (Calibrated for true skin tone contrast, zero overexposure)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambientLight);

  const mainSpot = new THREE.DirectionalLight(0xffffff, 0.45);
  mainSpot.position.set(0, 4, 8);
  scene.add(mainSpot);

  const fillLightLeft = new THREE.DirectionalLight(0xffffff, 0.15);
  fillLightLeft.position.set(-6, 0, 6);
  scene.add(fillLightLeft);

  const fillLightRight = new THREE.DirectionalLight(0xffffff, 0.15);
  fillLightRight.position.set(6, 0, 6);
  scene.add(fillLightRight);

  const textureLoader = new THREE.TextureLoader();

  // 4. Lanyard Strap Texture from theme/bandd.png (Offline Base64 with File Fallback)
  const bandSrc = (typeof window !== 'undefined' && window.BAND_TEXTURE_BASE64)
    ? window.BAND_TEXTURE_BASE64
    : 'theme/bandd.png';

  let ribbonMatRef = null;
  const bandTexture = textureLoader.load(
    bandSrc,
    (tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.encoding = THREE.sRGBEncoding;
      tex.needsUpdate = true;
      if (ribbonMatRef) ribbonMatRef.needsUpdate = true;
    },
    undefined,
    (err) => {
      console.warn('Band texture primary load failed, trying file fallback...', err);
      new THREE.TextureLoader().load('theme/bandd.png', (fallbackTex) => {
        fallbackTex.wrapS = THREE.RepeatWrapping;
        fallbackTex.wrapT = THREE.RepeatWrapping;
        fallbackTex.encoding = THREE.sRGBEncoding;
        fallbackTex.needsUpdate = true;
        if (ribbonMatRef) {
          ribbonMatRef.map = fallbackTex;
          ribbonMatRef.needsUpdate = true;
        }
      });
    }
  );
  bandTexture.wrapS = THREE.RepeatWrapping;
  bandTexture.wrapT = THREE.RepeatWrapping;
  bandTexture.encoding = THREE.sRGBEncoding;

  if (!window.BAND_TEXTURE_BASE64) {
    const checkBandInterval = setInterval(() => {
      if (window.BAND_TEXTURE_BASE64) {
        clearInterval(checkBandInterval);
        textureLoader.load(window.BAND_TEXTURE_BASE64, (tex) => {
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.encoding = THREE.sRGBEncoding;
          if (ribbonMatRef) {
            ribbonMatRef.map = tex;
            ribbonMatRef.needsUpdate = true;
          }
        });
      }
    }, 150);
    setTimeout(() => clearInterval(checkBandInterval), 10000);
  }

  // 5. High-Resolution Double-Sided Badge Atlas (Front: ppcard2_white_clean.png, Back: Tech Developer ID Badge)
  const PHOTO_ASPECT = 2583 / 3375; // True aspect ratio of authentic white-bordered card (0.765333)
  const photoSrc = (typeof window !== 'undefined' && window.CARD_PHOTO_DATA)
    ? window.CARD_PHOTO_DATA
    : 'theme/ppcard2_white_clean.png';

  let frontMatRef = null;

  function drawCardBack(ctx, ox, oy, w, h) {
    const grad = ctx.createLinearGradient(ox, oy, ox + w, oy + h);
    grad.addColorStop(0, '#0c1017');
    grad.addColorStop(0.5, '#151b23');
    grad.addColorStop(1, '#090d13');
    ctx.fillStyle = grad;
    ctx.fillRect(ox, oy, w, h);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    const gridSize = 45;
    for (let x = ox; x < ox + w; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, oy); ctx.lineTo(x, oy + h); ctx.stroke();
    }
    for (let y = oy; y < oy + h; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(ox + w, y); ctx.stroke();
    }

    ctx.fillStyle = '#05070a';
    ctx.fillRect(ox, oy + 70, w, 160);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(ox, oy + 70, w, 3);
    ctx.fillRect(ox, oy + 227, w, 3);

    ctx.fillStyle = '#f0f3f6';
    ctx.fillRect(ox + 80, oy + 290, w - 320, 95);
    ctx.fillStyle = '#0f141c';
    ctx.font = 'italic 34px "Segoe UI", sans-serif';
    ctx.fillText('Peephuwit', ox + 110, oy + 352);
    ctx.font = 'bold 20px monospace';
    ctx.fillStyle = '#656d76';
    ctx.fillText('SEC CODE: 404', ox + w - 210, oy + 350);

    const chipX = ox + 80, chipY = oy + 430, chipW = 160, chipH = 130;
    const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
    chipGrad.addColorStop(0, '#f9cb65');
    chipGrad.addColorStop(0.5, '#dba739');
    chipGrad.addColorStop(1, '#ab7c1c');
    ctx.fillStyle = chipGrad;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(chipX, chipY, chipW, chipH, 16) : ctx.rect(chipX, chipY, chipW, chipH);
    ctx.fill();
    ctx.strokeStyle = '#8c6114';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(90, 55, 10, 0.65)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(chipX + 50, chipY); ctx.lineTo(chipX + 50, chipY + chipH);
    ctx.moveTo(chipX + 110, chipY); ctx.lineTo(chipX + 110, chipY + chipH);
    ctx.moveTo(chipX, chipY + 65); ctx.lineTo(chipX + chipW, chipY + 65);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px "Segoe UI", sans-serif';
    ctx.fillText('PEEPHUWIT', ox + 280, chipY + 45);

    ctx.fillStyle = '#58a6ff';
    ctx.font = 'bold 26px "Segoe UI", sans-serif';
    ctx.fillText('FULL-STACK DEVELOPER', ox + 280, chipY + 85);

    ctx.fillStyle = '#8b949e';
    ctx.font = '22px monospace';
    ctx.fillText('CARD ID: PPHW-2026-DEV', ox + 280, chipY + 120);

    ctx.strokeStyle = '#388bfd';
    ctx.lineWidth = 2;
    ctx.strokeRect(ox + 80, oy + 610, w - 160, 200);
    ctx.fillStyle = 'rgba(56, 139, 253, 0.08)';
    ctx.fillRect(ox + 80, oy + 610, w - 160, 200);

    ctx.fillStyle = '#c9d1d9';
    ctx.font = '22px "Segoe UI", sans-serif';
    ctx.fillText('• CORE STACK: TypeScript • React / Next.js • Three.js • Python', ox + 110, oy + 670);
    ctx.fillText('• REPOSITORY: github.com/DexVanScientia / pphw.dev404', ox + 110, oy + 720);
    ctx.fillText('• PASS TYPE: ALL-ACCESS VERIFIED DEVELOPER', ox + 110, oy + 770);

    const barY = oy + 860, barH = 120, barW = w - 240, barX = ox + 120;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(barX - 20, barY - 15, barW + 40, barH + 60);

    ctx.fillStyle = '#000000';
    let curBarX = barX;
    const barPatterns = [3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3];
    for (let i = 0; i < barPatterns.length && curBarX < barX + barW; i++) {
      const bw = barPatterns[i] * 4;
      if (i % 2 === 0) {
        ctx.fillRect(curBarX, barY, bw, barH);
      }
      curBarX += bw + 3;
    }
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('* DEV - 2026 - PPHW - 404 *', ox + w / 2, barY + barH + 32);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#484f58';
    ctx.font = '18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PROPERTY OF PEEPHUWIT • ISSUED 2026 • AUTHORIZED USE ONLY', ox + w / 2, oy + h - 50);
    ctx.textAlign = 'left';
  }

  const ATLAS_H = 2048;
  const SLOT_W = Math.round(ATLAS_H * PHOTO_ASPECT); // 1567
  const ATLAS_W = SLOT_W * 2; // 3134

  const atlasCanvas = document.createElement('canvas');
  atlasCanvas.width = ATLAS_W;
  atlasCanvas.height = ATLAS_H;
  const atlasCtx = atlasCanvas.getContext('2d');
  atlasCtx.imageSmoothingEnabled = true;
  atlasCtx.imageSmoothingQuality = 'high';
  drawCardBack(atlasCtx, SLOT_W, 0, SLOT_W, ATLAS_H);

  const cardAtlasTexture = new THREE.CanvasTexture(atlasCanvas);
  cardAtlasTexture.encoding = THREE.sRGBEncoding;
  cardAtlasTexture.anisotropy = 16;
  cardAtlasTexture.minFilter = THREE.LinearFilter;
  cardAtlasTexture.magFilter = THREE.LinearFilter;
  cardAtlasTexture.generateMipmaps = false;

  function updateFrontAtlasImage(img) {
    const aspect = (img.naturalWidth && img.naturalHeight)
      ? (img.naturalWidth / img.naturalHeight)
      : PHOTO_ASPECT;
    const slotW = Math.round(ATLAS_H * aspect);
    const totalW = slotW * 2;
    if (atlasCanvas.width !== totalW || atlasCanvas.height !== ATLAS_H) {
      atlasCanvas.width = totalW;
      atlasCanvas.height = ATLAS_H;
      atlasCtx.imageSmoothingEnabled = true;
      atlasCtx.imageSmoothingQuality = 'high';
      drawCardBack(atlasCtx, slotW, 0, slotW, ATLAS_H);
    }
    atlasCtx.imageSmoothingEnabled = true;
    atlasCtx.imageSmoothingQuality = 'high';
    atlasCtx.drawImage(img, 0, 0, slotW, ATLAS_H);
    cardAtlasTexture.needsUpdate = true;
    if (frontMatRef) frontMatRef.needsUpdate = true;
  }

  const frontImg = new Image();
  frontImg.onload = () => updateFrontAtlasImage(frontImg);
  frontImg.onerror = () => {
    if (frontImg.src.endsWith('.webp')) {
      frontImg.src = 'theme/ppcard2_white_clean.png';
    } else if (typeof window !== 'undefined' && window.CARD_PHOTO_DATA) {
      frontImg.src = window.CARD_PHOTO_DATA;
    }
  };
  frontImg.src = photoSrc;
  if (frontImg.complete && frontImg.naturalWidth > 0) {
    updateFrontAtlasImage(frontImg);
  }

  if (!window.CARD_PHOTO_DATA) {
    const checkCardDataInterval = setInterval(() => {
      if (window.CARD_PHOTO_DATA) {
        clearInterval(checkCardDataInterval);
        const reloadImg = new Image();
        reloadImg.onload = () => updateFrontAtlasImage(reloadImg);
        reloadImg.src = window.CARD_PHOTO_DATA;
      }
    }, 150);
    setTimeout(() => clearInterval(checkCardDataInterval), 10000);
  }

  // 6. 3D Model & Card Assembly from kartu.glb
  const cardGroup = new THREE.Group();
  scene.add(cardGroup);

  const STRAP_ATTACH_Y = 1.55;

  // Laminated PVC Material: Crisp color fidelity, crystal clear gloss, zero milky fog
  const cardMat = new THREE.MeshPhysicalMaterial({
    map: cardAtlasTexture,
    clearcoat: 0.35,
    clearcoatRoughness: 0.05,
    roughness: 0.2,
    metalness: 0.0,
    envMapIntensity: 0.05,
    side: THREE.DoubleSide
  });
  frontMatRef = cardMat;


  function setupGLTFModel(gltf) {
    const nodes = {};
    gltf.scene.traverse((child) => {
      if (child.name) nodes[child.name] = child;
    });

    if (!nodes.card || !nodes.clip || !nodes.clamp) {
      console.warn('kartu.glb missing expected nodes:', nodes);
      return;
    }

    // Double-sided UV mapping: Left half for front photo, Right half for Tech ID back (un-mirrored)
    const cardGeo = nodes.card.geometry.clone();
    cardGeo.computeBoundingBox();
    cardGeo.computeVertexNormals();
    const bb = cardGeo.boundingBox;
    const pos = cardGeo.attributes.position;
    const norm = cardGeo.attributes.normal;

    // Scale card width to match true photo aspect ratio 1:1 with zero distortion
    const geoHeight = bb.max.y - bb.min.y;
    const currentGeoWidth = bb.max.x - bb.min.x;
    const targetGeoWidth = geoHeight * PHOTO_ASPECT;
    const scaleX = targetGeoWidth / currentGeoWidth;
    for (let i = 0; i < pos.count; i++) {
      pos.setX(i, pos.getX(i) * scaleX);
    }
    cardGeo.computeBoundingBox();
    const updatedBb = cardGeo.boundingBox;

    const uv = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      const x = (pos.getX(i) - updatedBb.min.x) / (updatedBb.max.x - updatedBb.min.x);
      const y = (pos.getY(i) - updatedBb.min.y) / (updatedBb.max.y - updatedBb.min.y);
      const nz = norm.getZ(i);
      if (nz >= -0.05) {
        uv[i * 2] = x * 0.5;
      } else {
        uv[i * 2] = 0.5 + (1.0 - x) * 0.5;
      }
      uv[i * 2 + 1] = y;
    }
    cardGeo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));

    const modelGroup = new THREE.Group();

    // 1. Card Mesh matching original 3D model geometry
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    cardMesh.castShadow = true;
    cardMesh.receiveShadow = true;
    cardMesh.renderOrder = 2;
    modelGroup.add(cardMesh);

    // 2. Hardware Clip (Original App.js: materials.metal with roughness=0.3)
    const clipMat = nodes.clip.material ? nodes.clip.material.clone() : new THREE.MeshStandardMaterial({
      color: 0x363636,
      metalness: 1.0,
      roughness: 0.3
    });
    clipMat.roughness = 0.3;
    clipMat.side = THREE.DoubleSide;
    const clipMesh = new THREE.Mesh(nodes.clip.geometry, clipMat);
    clipMesh.castShadow = true;
    clipMesh.renderOrder = 3;
    modelGroup.add(clipMesh);

    // 3. Hardware Clamp (Original App.js: materials.metal with roughness=0.5)
    const clampMat = nodes.clamp.material || new THREE.MeshStandardMaterial({
      color: 0x363636,
      metalness: 1.0,
      roughness: 0.5
    });
    clampMat.side = THREE.DoubleSide;
    const clampMesh = new THREE.Mesh(nodes.clamp.geometry, clampMat);
    clampMesh.castShadow = true;
    clampMesh.renderOrder = 3;
    modelGroup.add(clampMesh);

    // Scale and position inside cardGroup matching reference
    const MODEL_SCALE = 2.25;
    modelGroup.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);
    modelGroup.position.set(0, -1.2, -0.05);

    cardGroup.add(modelGroup);
    if (frontMatRef) frontMatRef.needsUpdate = true;

    // Wake up scene and render immediately once 3D card model is assembled
    isBadgeInView = true;
    isSceneVisible = true;
    canvas.style.display = 'block';
    canvas.style.visibility = 'visible';
    canvas.style.opacity = '1';
    if (window.triggerBadgeDrop && (homeScreen && homeScreen.classList.contains('active'))) {
      window.triggerBadgeDrop();
    }
  }

  function loadCardModel() {
    function tryLoad() {
      if (typeof THREE.GLTFLoader === 'undefined') {
        setTimeout(tryLoad, 40);
        return;
      }
      const loader = new THREE.GLTFLoader();

      // Priority 1: In-memory base64 data (instant, 100% offline & CORS-safe for file://)
      if (typeof window !== 'undefined' && window.KARTU_GLB_BASE64) {
        try {
          const binStr = window.atob(window.KARTU_GLB_BASE64);
          const len = binStr.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binStr.charCodeAt(i);
          }
          loader.parse(bytes.buffer, '', (gltf) => {
            setupGLTFModel(gltf);
          }, (err) => {
            console.warn('GLTF base64 parse failed, trying URL load...', err);
            loader.load('theme/kartu.glb', setupGLTFModel);
          });
          return;
        } catch (e) {
          console.warn('Error decoding base64 GLTF:', e);
        }
      }

      // Priority 2: Standard fetch from theme/kartu.glb
      loader.load('theme/kartu.glb', setupGLTFModel, undefined, (err) => {
        console.error('Failed to load theme/kartu.glb:', err);
      });
    }
    tryLoad();
  }

  loadCardModel();

  // 7. Multi-Body Chain Physics System (Authentic Rapier 3D Engine matching fattahmaulana/3D_CARD)
  function calculateAnchorX() {
    return (window.innerWidth > 768) ? 2.5 : 0;
  }
  const ANCHOR_POS = new THREE.Vector3(calculateAnchorX(), 4.0, 0);
  const SEG_LEN = 1.0; // Segment rest reach matching original App.js

  function getDropInitialState(anchorX) {
    const isDesktop = (window.innerWidth > 768);
    const dropAngle = isDesktop ? 0.38 : 0.30; // ~22 deg on desktop, ~17 deg on mobile
    const sinA = Math.sin(dropAngle);
    const cosA = Math.cos(dropAngle);

    // Realistic held state: card held up higher and pulled slightly to the right
    const heldX = anchorX + (isDesktop ? 0.85 : 0.65);
    const heldY = 1.0;

    // Card attachment point in world space
    const attachX = heldX - sinA * STRAP_ATTACH_Y;
    const attachY = heldY + cosA * STRAP_ATTACH_Y;

    // Distribute strap segments along a natural smooth curve from anchor down to clip
    const j1_x = anchorX + (attachX - anchorX) * 0.33;
    const j1_y = 4.0 + (attachY - 4.0) * 0.33;
    const j2_x = anchorX + (attachX - anchorX) * 0.66;
    const j2_y = 4.0 + (attachY - 4.0) * 0.66;
    const j3_x = attachX;
    const j3_y = attachY;

    return {
      dropAngle,
      j1_x, j1_y,
      j2_x, j2_y,
      j3_x, j3_y,
      card_x: heldX,
      card_y: heldY
    };
  }

  // Genuine Rapier 3D WASM Physics Instances
  let rapierWorld = null;
  let rbFixed = null, rbJ1 = null, rbJ2 = null, rbJ3 = null, rbCard = null;
  let isRapierActive = false;
  let isRapierInitializing = false;

  async function initRapierPhysics() {
    if (isRapierActive || isRapierInitializing) return;
    if (typeof window.RAPIER === 'undefined') {
      setTimeout(initRapierPhysics, 40);
      return;
    }
    isRapierInitializing = true;
    try {
      await window.RAPIER.init();
      const R = window.RAPIER;
      // Authentic Rapier WASM: 24 solver iterations to prevent joint stretch (rope stays at exact 3.0 length)
      rapierWorld = new R.World({ x: 0, y: -40.0, z: 0 });
      rapierWorld.integrationParameters.numSolverIterations = 24;
      rapierWorld.integrationParameters.numInternalPgsIterations = 2;

      const anchorX = calculateAnchorX();
      const dropInit = getDropInitialState(anchorX);

      // <RigidBody ref={fixed} {...segmentProps} type="fixed" /> at [anchorX, 4.0, 0]
      rbFixed = rapierWorld.createRigidBody(R.RigidBodyDesc.fixed().setTranslation(anchorX, 4.0, 0));

      // segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };
      function makeSegment(x, y, z) {
        const desc = R.RigidBodyDesc.dynamic()
          .setTranslation(x, y, z)
          .setLinearDamping(4.0)
          .setAngularDamping(4.0)
          .setCanSleep(true);
        const body = rapierWorld.createRigidBody(desc);
        rapierWorld.createCollider(R.ColliderDesc.ball(0.1), body);
        return body;
      }

      // Initial tilted positions for entrance swing drop
      rbJ1 = makeSegment(dropInit.j1_x, dropInit.j1_y, 0);
      rbJ2 = makeSegment(dropInit.j2_x, dropInit.j2_y, 0);
      rbJ3 = makeSegment(dropInit.j3_x, dropInit.j3_y, 0);

      const cardDesc = R.RigidBodyDesc.dynamic()
        .setTranslation(dropInit.card_x, dropInit.card_y, 0)
        .setRotation({
          x: 0,
          y: 0,
          z: Math.sin(dropInit.dropAngle / 2),
          w: Math.cos(dropInit.dropAngle / 2)
        })
        .setLinearDamping(4.0)
        .setAngularDamping(4.0)
        .setCanSleep(true);
      rbCard = rapierWorld.createRigidBody(cardDesc);
      rapierWorld.createCollider(R.ColliderDesc.cuboid(0.87, 1.125, 0.01), rbCard);

      // useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
      // useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
      // useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
      // useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);
      rapierWorld.createImpulseJoint(R.JointData.rope(1.0, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }), rbFixed, rbJ1, true);
      rapierWorld.createImpulseJoint(R.JointData.rope(1.0, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }), rbJ1, rbJ2, true);
      rapierWorld.createImpulseJoint(R.JointData.rope(1.0, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }), rbJ2, rbJ3, true);
      rapierWorld.createImpulseJoint(R.JointData.spherical({ x: 0, y: 0, z: 0 }, { x: 0, y: STRAP_ATTACH_Y, z: 0 }), rbJ3, rbCard, true);

      isRapierActive = true;
      isRapierInitializing = false;
      window.rbCard = rbCard;
      window.rbFixed = rbFixed;
      window.rbJ1 = rbJ1;
      window.rbJ2 = rbJ2;
      window.rbJ3 = rbJ3;
      window.rapierWorld = rapierWorld;
      console.log('3D Lanyard: Genuine Rapier 3D WASM initialized & running (100% original App.js physics)!');

      if (pendingDrop || !isCurrentlyWelcome || window._pendingBadgeDrop) {
        if (window.triggerBadgeDrop) window.triggerBadgeDrop();
      }
    } catch (e) {
      isRapierInitializing = false;
      console.warn('Rapier init failed, using Verlet fallback:', e);
    }
  }

  let pendingDrop = false;
  initRapierPhysics();

  // 3 dynamic joints + 1 fixed anchor matching DexVanScientia (Verlet fallback)
  const fixed = new THREE.Vector3().copy(ANCHOR_POS);
  const j1 = {
    pos: new THREE.Vector3(ANCHOR_POS.x, ANCHOR_POS.y - SEG_LEN, 0),
    vel: new THREE.Vector3(),
    lerped: new THREE.Vector3(ANCHOR_POS.x, ANCHOR_POS.y - SEG_LEN, 0)
  };
  const j2 = {
    pos: new THREE.Vector3(ANCHOR_POS.x, ANCHOR_POS.y - SEG_LEN * 2, 0),
    vel: new THREE.Vector3(),
    lerped: new THREE.Vector3(ANCHOR_POS.x, ANCHOR_POS.y - SEG_LEN * 2, 0)
  };
  const j3 = {
    pos: new THREE.Vector3(ANCHOR_POS.x, ANCHOR_POS.y - SEG_LEN * 3, 0),
    vel: new THREE.Vector3()
  };

  // Card State (Position, Velocity, Orientation)
  const cardPos = new THREE.Vector3(ANCHOR_POS.x, ANCHOR_POS.y - SEG_LEN * 3 - STRAP_ATTACH_Y, 0);
  const cardVel = new THREE.Vector3();
  const cardQuat = new THREE.Quaternion();
  let smoothRoll = 0;
  let smoothPitch = 0;
  let smoothYaw = 0;

  const isWelcomeActive = !homeScreen || !homeScreen.classList.contains('active');
  if (isWelcomeActive) {
    cardPos.y = ANCHOR_POS.y + 6;
  }

  // 8. Continuous CatmullRom Chordal Spline Ribbon with theme/bandd.png
  const SPLINE_SUBDIVS = 32;
  const ribbonWidth = 0.24;
  const ribbonGeo = new THREE.BufferGeometry();
  const numVerts = (SPLINE_SUBDIVS + 1) * 2;
  const ribbonPositions = new Float32Array(numVerts * 3);
  const ribbonUvs = new Float32Array(numVerts * 2);
  const ribbonIndices = [];

  // UV coordinates: U goes along the strap length repeating 3.5 times, V across width
  for (let i = 0; i <= SPLINE_SUBDIVS; i++) {
    const t = i / SPLINE_SUBDIVS;
    const u = (1.0 - t) * 3.5; // Reads '3D CARD' upright from top anchor down to card
    ribbonUvs[i * 4 + 0] = u;
    ribbonUvs[i * 4 + 1] = 0.0;
    ribbonUvs[i * 4 + 2] = u;
    ribbonUvs[i * 4 + 3] = 1.0;

    if (i < SPLINE_SUBDIVS) {
      const row1 = i * 2;
      const row2 = (i + 1) * 2;
      ribbonIndices.push(row1, row1 + 1, row2);
      ribbonIndices.push(row1 + 1, row2 + 1, row2);
      ribbonIndices.push(row2, row1 + 1, row1);
      ribbonIndices.push(row2, row2 + 1, row1 + 1);
    }
  }

  ribbonGeo.setAttribute('position', new THREE.BufferAttribute(ribbonPositions, 3));
  ribbonGeo.setAttribute('uv', new THREE.BufferAttribute(ribbonUvs, 2));
  ribbonGeo.setIndex(ribbonIndices);

  const ribbonMat = new THREE.MeshBasicMaterial({
    map: bandTexture,
    side: THREE.DoubleSide,
    depthTest: false
  });
  ribbonMatRef = ribbonMat;

  const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
  ribbonMesh.renderOrder = 1;
  ribbonMesh.frustumCulled = false;
  scene.add(ribbonMesh);

  const splineCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
  ], false, 'chordal');

  const _tangent = new THREE.Vector3();
  const _eyeVec = new THREE.Vector3();
  const _side = new THREE.Vector3();

  function updateRibbonMesh() {
    const sampledPoints = splineCurve.getPoints(SPLINE_SUBDIVS);
    const posAttr = ribbonGeo.attributes.position;

    for (let i = 0; i <= SPLINE_SUBDIVS; i++) {
      const curr = sampledPoints[i];

      if (i === 0) {
        _tangent.subVectors(sampledPoints[1] || curr, curr);
      } else if (i === SPLINE_SUBDIVS) {
        _tangent.subVectors(curr, sampledPoints[SPLINE_SUBDIVS - 1] || curr);
      } else {
        _tangent.subVectors(sampledPoints[i + 1], sampledPoints[i - 1]);
      }

      if (_tangent.lengthSq() < 0.00001) {
        _tangent.set(0, -1, 0);
      } else {
        _tangent.normalize();
      }

      // Camera-Facing Ribbon Frame (MeshLine algorithm matching original repo):
      // The side vector is strictly perpendicular to the strap path and the camera eye vector
      _eyeVec.subVectors(camera.position, curr).normalize();
      _side.crossVectors(_tangent, _eyeVec);

      if (_side.lengthSq() < 0.00001) {
        _side.set(1, 0, 0);
      } else {
        _side.normalize();
      }

      const halfW = ribbonWidth * 0.5;
      posAttr.setXYZ(i * 2 + 0, curr.x - _side.x * halfW, curr.y - _side.y * halfW, curr.z - _side.z * halfW);
      posAttr.setXYZ(i * 2 + 1, curr.x + _side.x * halfW, curr.y + _side.y * halfW, curr.z + _side.z * halfW);
    }

    posAttr.needsUpdate = true;
    ribbonGeo.computeVertexNormals();
    ribbonGeo.computeBoundingSphere();
  }

  // 9. Interactive Drag & Drop System (100% Exact Replica of fattahmaulana/3D_CARD + Elastic Snap Recoil)
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let isDragging = false;
  const draggedOffset = new THREE.Vector3();
  const dragVelocity = new THREE.Vector3();
  const _dragVec = new THREE.Vector3();
  const _dragDir = new THREE.Vector3();
  const _ang = new THREE.Vector3();
  const _tempQuat = new THREE.Quaternion();
  const _cardEuler = new THREE.Euler(0, 0, 0, 'YXZ');
  const targetCardPos = new THREE.Vector3();

  function onPointerDown(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(cardGroup, true);

    if (intersects.length > 0) {
      isDragging = true;
      isSceneVisible = true;
      dragVelocity.set(0, 0, 0);
      canvas.style.cursor = 'grabbing';
      if (canvas.setPointerCapture) {
        try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      }

      if (isRapierActive && rbCard) {
        rbCard.setBodyType(window.RAPIER.RigidBodyType.KinematicPositionBased, true);
        const cPos = rbCard.translation();
        draggedOffset.copy(intersects[0].point).sub(cPos);
      } else {
        draggedOffset.subVectors(intersects[0].point, cardPos);
        targetCardPos.copy(cardPos);
        cardVel.set(0, 0, 0);
      }
    }
  }

  function onPointerMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (!isDragging) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(cardGroup, true);
      canvas.style.cursor = intersects.length > 0 ? 'grab' : 'default';
    }
  }

  function onPointerUp(e) {
    if (isDragging) {
      isDragging = false;
      canvas.style.cursor = 'grab';
      if (canvas.releasePointerCapture) {
        try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
      }
      if (isRapierActive && rbCard) {
        rbCard.setBodyType(window.RAPIER.RigidBodyType.Dynamic, true);
        [rbCard, rbJ1, rbJ2, rbJ3, rbFixed].forEach(b => b && b.wakeUp());
      }
      if (typeof updateSceneVisibility === 'function') {
        updateSceneVisibility();
      }
    }
  }

  window.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  // 10. Global Drop and Reset Control Functions with Proactive 250px Pre-Wake & Offscreen Pause
  let isSceneVisible = !isWelcomeActive;
  let isBadgeInView = true;

  function updateSceneVisibility() {
    if (document.hidden) {
      isSceneVisible = false;
      return;
    }
    if (!homeScreen || !homeScreen.classList.contains('active')) {
      isSceneVisible = false;
      return;
    }
    if (isDragging || pendingDrop) {
      isSceneVisible = true;
      return;
    }
    const vh = window.innerHeight || 800;
    if (homeScreen.scrollTop < vh * 1.25) {
      isBadgeInView = true;
      isSceneVisible = true;
      return;
    }
    isSceneVisible = isBadgeInView;
  }

  // Pre-wake IntersectionObserver: starts rendering 250px before entering viewport for 0ms delay
  const lanyardWrap = document.getElementById('lanyardBadge') || canvas;
  if (lanyardWrap && typeof IntersectionObserver !== 'undefined') {
    const badgeObserver = new IntersectionObserver(([entry]) => {
      isBadgeInView = entry.isIntersecting;
      updateSceneVisibility();
    }, {
      root: homeScreen,
      rootMargin: '250px 0px 250px 0px'
    });
    badgeObserver.observe(lanyardWrap);
  }

  // Instantly pause WebGL & physics when tab is inactive to preserve battery
  document.addEventListener('visibilitychange', updateSceneVisibility, { passive: true });

  // Direct scroll-distance check for rock-solid reliability across all devices
  if (homeScreen) {
    homeScreen.addEventListener('scroll', () => {
      const vh = window.innerHeight || 800;
      if (homeScreen.scrollTop > vh * 1.25) {
        if (isBadgeInView) {
          isBadgeInView = false;
          updateSceneVisibility();
        }
      } else if (homeScreen.scrollTop < vh * 1.1) {
        if (!isBadgeInView) {
          isBadgeInView = true;
          updateSceneVisibility();
        }
      }
    }, { passive: true });
  }

  window.triggerBadgeDrop = function() {
    window._pendingBadgeDrop = false;
    isBadgeInView = true;
    isSceneVisible = true;
    pendingDrop = true;
    lastFrameTime = performance.now();
    canvas.style.display = 'block';
    canvas.style.visibility = 'visible';
    canvas.style.opacity = '1';

    const anchorX = calculateAnchorX();
    const drop = getDropInitialState(anchorX);

    if (isRapierActive && rbCard) {
      rbFixed.setTranslation({ x: anchorX, y: 4.0, z: 0 }, true);
      rbJ1.setTranslation({ x: drop.j1_x, y: drop.j1_y, z: 0 }, true);
      rbJ1.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rbJ1.setAngvel({ x: 0, y: 0, z: 0 }, true);
      rbJ2.setTranslation({ x: drop.j2_x, y: drop.j2_y, z: 0 }, true);
      rbJ2.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rbJ2.setAngvel({ x: 0, y: 0, z: 0 }, true);
      rbJ3.setTranslation({ x: drop.j3_x, y: drop.j3_y, z: 0 }, true);
      rbJ3.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rbJ3.setAngvel({ x: 0, y: 0, z: 0 }, true);
      rbCard.setTranslation({ x: drop.card_x, y: drop.card_y, z: 0 }, true);
      rbCard.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rbCard.setAngvel({ x: 0, y: 0, z: 0 }, true);
      rbCard.setRotation({
        x: 0,
        y: 0,
        z: Math.sin(drop.dropAngle / 2),
        w: Math.cos(drop.dropAngle / 2)
      }, true);
      [rbFixed, rbJ1, rbJ2, rbJ3, rbCard].forEach(b => b && b.wakeUp());

      if (rbJ1.lerped) rbJ1.lerped.set(drop.j1_x, drop.j1_y, 0);
      if (rbJ2.lerped) rbJ2.lerped.set(drop.j2_x, drop.j2_y, 0);
    }

    fixed.set(anchorX, 4.0, 0);
    j1.pos.set(drop.j1_x, drop.j1_y, 0);
    j1.lerped.copy(j1.pos);
    j1.vel.set(0, 0, 0);

    j2.pos.set(drop.j2_x, drop.j2_y, 0);
    j2.lerped.copy(j2.pos);
    j2.vel.set(0, 0, 0);

    j3.pos.set(drop.j3_x, drop.j3_y, 0);
    j3.vel.set(0, 0, 0);

    cardPos.set(drop.card_x, drop.card_y, 0);
    cardVel.set(0, 0, 0);

    cardQuat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), drop.dropAngle);
    cardGroup.position.copy(cardPos);
    cardGroup.quaternion.copy(cardQuat);
  };

  window.resetBadgeToTop = function() {
    isBadgeInView = true;
    updateSceneVisibility();
    const anchorX = calculateAnchorX();
    const drop = getDropInitialState(anchorX);

    if (isRapierActive && rbCard) {
      rbFixed.setTranslation({ x: anchorX, y: 4.0, z: 0 }, true);
      rbJ1.setTranslation({ x: drop.j1_x, y: drop.j1_y, z: 0 }, true);
      rbJ1.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rbJ2.setTranslation({ x: drop.j2_x, y: drop.j2_y, z: 0 }, true);
      rbJ2.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rbJ3.setTranslation({ x: drop.j3_x, y: drop.j3_y, z: 0 }, true);
      rbJ3.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rbCard.setTranslation({ x: drop.card_x, y: drop.card_y, z: 0 }, true);
      rbCard.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rbCard.setRotation({
        x: 0,
        y: 0,
        z: Math.sin(drop.dropAngle / 2),
        w: Math.cos(drop.dropAngle / 2)
      }, true);
      [rbFixed, rbJ1, rbJ2, rbJ3, rbCard].forEach(b => b && b.wakeUp());

      if (rbJ1.lerped) rbJ1.lerped.set(drop.j1_x, drop.j1_y, 0);
      if (rbJ2.lerped) rbJ2.lerped.set(drop.j2_x, drop.j2_y, 0);
    }

    fixed.set(anchorX, 4.0, 0);
    j1.pos.set(drop.j1_x, drop.j1_y, 0);
    j1.lerped.copy(j1.pos);
    j1.vel.set(0, 0, 0);

    j2.pos.set(drop.j2_x, drop.j2_y, 0);
    j2.lerped.copy(j2.pos);
    j2.vel.set(0, 0, 0);

    j3.pos.set(drop.j3_x, drop.j3_y, 0);
    j3.vel.set(0, 0, 0);

    cardPos.set(drop.card_x, drop.card_y, 0);
    cardVel.set(0, 0, 0);

    cardQuat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), drop.dropAngle);
    cardGroup.position.copy(cardPos);
    cardGroup.quaternion.copy(cardQuat);
  };

  if (window._pendingBadgeDrop) {
    window.triggerBadgeDrop();
  } else {
    window.resetBadgeToTop();
  }

  // 11. Physics Simulation Loop (Genuine Rapier WASM with Verlet Fallback)
  let lastFrameTime = performance.now();
  let wasSceneVisible = isSceneVisible;
  const GRAVITY = new THREE.Vector3(0, -40.0, 0);
  const LINEAR_DAMPING = 4.0;

  function solveDistance(pA, pB, restDist, weightA, weightB) {
    const delta = new THREE.Vector3().subVectors(pB, pA);
    const dist = delta.length();
    if (dist > 0.0001) {
      const diff = (dist - restDist) / dist;
      if (weightA > 0) pA.addScaledVector(delta, diff * weightA);
      if (weightB > 0) pB.addScaledVector(delta, -diff * weightB);
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    if (!isSceneVisible) {
      wasSceneVisible = false;
      return;
    }

    const now = performance.now();
    if (!wasSceneVisible) {
      lastFrameTime = now;
      wasSceneVisible = true;
    }
    let dt = (now - lastFrameTime) / 1000;
    lastFrameTime = now;
    if (dt > 0.033) dt = 0.033;
    if (dt < 0.001) dt = 0.016;

    if (isRapierActive && rapierWorld) {
      // 1. Interactive Dragging matching original App.js 1:1 (unclamped stretch & authentic recoil)
      if (isDragging) {
        _dragVec.set(mouse.x, mouse.y, 0.5).unproject(camera);
        _dragDir.copy(_dragVec).sub(camera.position).normalize();
        _dragVec.add(_dragDir.multiplyScalar(camera.position.length()));

        let tx = _dragVec.x - draggedOffset.x;
        let ty = _dragVec.y - draggedOffset.y;
        const tz = _dragVec.z - draggedOffset.z;

        // Physical strap reach limit: strap cannot stretch beyond its real length of 3.0
        const attachX = tx;
        const attachY = ty + STRAP_ATTACH_Y;
        const rDx = attachX - ANCHOR_POS.x;
        const rDy = attachY - ANCHOR_POS.y;
        const rDist = Math.hypot(rDx, rDy);
        const maxReach = 3.0;
        if (rDist > maxReach && rDist > 0.0001) {
          const scale = maxReach / rDist;
          tx = ANCHOR_POS.x + rDx * scale;
          ty = ANCHOR_POS.y + rDy * scale - STRAP_ATTACH_Y;
        }

        [rbCard, rbJ1, rbJ2, rbJ3, rbFixed].forEach((ref) => ref?.wakeUp());
        rbCard.setNextKinematicTranslation({
          x: tx,
          y: ty,
          z: tz
        });
      }

      // 2. Advance Genuine Rapier WASM Physics Simulation
      rapierWorld.step();

      // 3. Synchronize Card Rigid Body with Three.js Mesh
      const cPos = rbCard.translation();
      const cRot = rbCard.rotation();
      cardGroup.position.set(cPos.x, cPos.y, cPos.z);
      cardGroup.quaternion.set(cRot.x, cRot.y, cRot.z, cRot.w);
      cardPos.set(cPos.x, cPos.y, cPos.z);

      // 4. Synchronize Dynamic Ribbon Spline Points with Distance-Clamped Lerp matching original App.js
      if (rbFixed) {
        const p0 = rbFixed.translation();
        const p1 = rbJ1.translation();
        const p2 = rbJ2.translation();
        const p3 = rbJ3.translation();

        [rbJ1, rbJ2].forEach((ref) => {
          if (!ref.lerped) ref.lerped = new THREE.Vector3().copy(ref.translation());
          const curTrans = ref.translation();
          const clampedDistance = Math.max(0.1, Math.min(1.0, ref.lerped.distanceTo(curTrans)));
          ref.lerped.lerp(curTrans, dt * (10 + clampedDistance * 40));
        });

        splineCurve.points[0].copy(p3);
        splineCurve.points[1].copy(rbJ2.lerped);
        splineCurve.points[2].copy(rbJ1.lerped);
        splineCurve.points[3].copy(p0);

        updateRibbonMesh();

        // 5. Auto-rotation restoring torque matching original App.js: ang.y - rot.y * 0.25
        _ang.copy(rbCard.angvel());
        _tempQuat.set(cRot.x, cRot.y, cRot.z, cRot.w);
        _cardEuler.setFromQuaternion(_tempQuat, 'YXZ');
        rbCard.setAngvel({
          x: _ang.x,
          y: _ang.y - _cardEuler.y * 0.25,
          z: _ang.z
        }, true);
      }
    } else {
      // Fallback Verlet Physics Simulation
      fixed.copy(ANCHOR_POS);
      const linDamp = Math.exp(-3.2 * dt);
      const attachLocalY = STRAP_ATTACH_Y; // 1.45

      if (isDragging) {
        const prevPos = cardPos.clone();
        cardPos.lerp(targetCardPos, Math.min(1.0, 28 * dt));
        cardVel.subVectors(cardPos, prevPos).divideScalar(dt);
        cardVel.clampLength(0, 24);

        const attachWorld = cardPos.clone().add(new THREE.Vector3(0, attachLocalY, 0).applyQuaternion(cardQuat));
        j3.pos.lerp(attachWorld, Math.min(1.0, 32 * dt));
        j3.vel.copy(cardVel);

        j1.vel.addScaledVector(GRAVITY, dt);
        j1.vel.multiplyScalar(linDamp);
        j1.pos.addScaledVector(j1.vel, dt);

        j2.vel.addScaledVector(GRAVITY, dt);
        j2.vel.multiplyScalar(linDamp);
        j2.pos.addScaledVector(j2.vel, dt);

        for (let iter = 0; iter < 12; iter++) {
          solveDistance(fixed, j1.pos, SEG_LEN, 0.0, 1.0);
          solveDistance(j1.pos, j2.pos, SEG_LEN, 0.5, 0.5);
          solveDistance(j2.pos, j3.pos, SEG_LEN, 0.8, 0.2);
        }

        const pullDir = new THREE.Vector3().subVectors(j2.pos, attachWorld);
        const strapAngle = Math.atan2(pullDir.x, pullDir.y);
        const targetRoll = strapAngle * 0.75;
        const targetPitch = THREE.MathUtils.clamp(-cardVel.y * 0.015, -0.3, 0.4);
        const targetYaw = THREE.MathUtils.clamp(cardVel.x * 0.015, -0.2, 0.2);

        smoothRoll = THREE.MathUtils.damp(smoothRoll, targetRoll, 12, dt);
        smoothPitch = THREE.MathUtils.damp(smoothPitch, targetPitch, 12, dt);
        smoothYaw = THREE.MathUtils.damp(smoothYaw, targetYaw, 12, dt);

        cardQuat.setFromEuler(new THREE.Euler(smoothPitch, smoothYaw, smoothRoll, 'YXZ'));
      } else {
        const strapDamp = Math.exp(-2.5 * dt);
        j1.vel.addScaledVector(GRAVITY, dt);
        j1.vel.multiplyScalar(strapDamp);
        j1.pos.addScaledVector(j1.vel, dt);

        j2.vel.addScaledVector(GRAVITY, dt);
        j2.vel.multiplyScalar(strapDamp);
        j2.pos.addScaledVector(j2.vel, dt);

        j3.vel.addScaledVector(GRAVITY, dt);
        j3.vel.multiplyScalar(strapDamp);
        j3.pos.addScaledVector(j3.vel, dt);

        for (let iter = 0; iter < 14; iter++) {
          solveDistance(fixed, j1.pos, SEG_LEN, 0.0, 1.0);
          solveDistance(j1.pos, j2.pos, SEG_LEN, 0.5, 0.5);
          solveDistance(j2.pos, j3.pos, SEG_LEN, 0.5, 0.5);
        }

        const swingAngle = Math.atan2(j3.pos.x - j2.pos.x, -(j3.pos.y - j2.pos.y));
        const targetRoll = -swingAngle * 0.85 + THREE.MathUtils.clamp(j3.vel.x * 0.02, -0.2, 0.2);
        const targetPitch = THREE.MathUtils.clamp(-j3.vel.y * 0.025, -0.3, 0.35);
        const targetYaw = THREE.MathUtils.clamp(j3.vel.x * 0.02, -0.2, 0.2);

        smoothRoll = THREE.MathUtils.damp(smoothRoll, targetRoll, 8, dt);
        smoothPitch = THREE.MathUtils.damp(smoothPitch, targetPitch, 8, dt);
        smoothYaw = THREE.MathUtils.damp(smoothYaw, targetYaw, 8, dt);

        cardQuat.setFromEuler(new THREE.Euler(smoothPitch, smoothYaw, smoothRoll, 'YXZ'));
        cardPos.copy(j3.pos).add(new THREE.Vector3(0, -attachLocalY, 0).applyQuaternion(cardQuat));
      }

      cardGroup.position.copy(cardPos);
      if (!isDragging) {
        const hoverEuler = new THREE.Euler(-mouseScreenY * 0.025, mouseScreenX * 0.03, 0, 'YXZ');
        cardGroup.quaternion.copy(cardQuat).multiply(new THREE.Quaternion().setFromEuler(hoverEuler));
      } else {
        cardGroup.quaternion.copy(cardQuat);
      }

      splineCurve.points[0].copy(j3.pos);
      splineCurve.points[1].copy(j2.pos);
      splineCurve.points[2].copy(j1.pos);
      splineCurve.points[3].copy(fixed);
      updateRibbonMesh();
    }

    // 4. Render 3D Scene
    renderer.render(scene, camera);
  }

  // Pre-warm WebGL shaders during welcome screen idle time to eliminate GPU compile hitch
  try {
    renderer.compile(scene, camera);
  } catch (err) {}

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    const newAnchorX = calculateAnchorX();
    ANCHOR_POS.x = newAnchorX;
    fixed.x = newAnchorX;

    if (isRapierActive && rbFixed) {
      rbFixed.setTranslation({ x: newAnchorX, y: 4.0, z: 0 }, true);
      [rbFixed, rbJ1, rbJ2, rbJ3, rbCard].forEach(b => b && b.wakeUp());
    }

    const homeScreenEl = document.getElementById('homeScreen');
    const isDesktop = window.innerWidth > 768;

    if (isDesktop) {
      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(['.hero-greeting', '.hero-sub-student', '.hero-sub-role', '.hero-desc', '.hero-cta-group', '.hero-name']);
        gsap.set(['.hero-greeting', '.hero-sub-student', '.hero-sub-role', '.hero-desc', '.hero-cta-group', '.hero-name'], {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1
        });
      }
      const heroEl = document.querySelector('.hero-section');
      if (heroEl && (!homeScreenEl || homeScreenEl.scrollTop === 0)) {
        heroEl.style.opacity = '1';
        heroEl.style.transform = 'none';
        heroEl.style.pointerEvents = 'auto';
      }
      const nameEl = document.getElementById('typewriterName');
      if (nameEl && !nameEl.textContent.trim()) {
        nameEl.textContent = 'PEEPHUWIT';
      }
      const roleEl = document.getElementById('typewriterRole');
      if (roleEl && !roleEl.textContent.trim()) {
        roleEl.textContent = 'Developer';
      }
      const nameCursor = document.getElementById('nameCursor');
      if (nameCursor) nameCursor.style.opacity = '1';
      hasHeroAnimatedOnMobile = false;
    } else {
      if (homeScreenEl && homeScreenEl.scrollTop > (window.innerHeight || 800) * 0.15) {
        if (typeof gsap !== 'undefined') {
          gsap.set(['.hero-greeting', '.hero-sub-student', '.hero-sub-role', '.hero-desc', '.hero-cta-group', '.hero-name'], {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1
          });
        }
        const nameEl = document.getElementById('typewriterName');
        if (nameEl && !nameEl.textContent.trim()) {
          nameEl.textContent = 'PEEPHUWIT';
        }
      }
    }

    if (typeof handleHeroScrollZoom === 'function') {
      handleHeroScrollZoom();
    }
  });
}

/**
 * Prevent zooming to maintain fixed viewport integrity
 */
function preventPageZoom() {
  document.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
      e.preventDefault();
    }
  });

  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
}
