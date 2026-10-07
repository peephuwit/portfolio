/**
 * 3D Mechanical Skills Keypad Module
 * Embedded into Portfolio Showcase Tech Stack Tab (#tab-tech-stack)
 */

(function () {
  'use strict';

  // 1. All 20 Skills mapped across a 4x5 Mechanical Macro Pad Grid in the user's exact order
  const SKILLS_DATA = [
    // ROW 1 (Top row, left to right: HTML, CSS, Python, JavaScript, TypeScript)
    { id: 'html', name: 'HTML', key: '1', keycode: 'Digit1', col: '#9E351B', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-plain.svg', forceWhite: true, cat: 'Frontend Core', tag: 'Semantic web markup, accessibility standards, and clean DOM trees.', level: 'Expert' },
    { id: 'css', name: 'CSS', key: '2', keycode: 'Digit2', col: '#1D3AB2', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-plain.svg', forceWhite: true, cat: 'Styling & Motion', tag: 'Advanced CSS Grid, Flexbox layouts, fluid typography, and animations.', level: 'Advanced' },
    { id: 'python', name: 'Python', key: '3', keycode: 'Digit3', col: '#C2C7CE', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg', cat: 'General & Data', tag: 'Clean, elegant syntax for automation, AI algorithms, and backend APIs.', level: 'Proficient' },
    { id: 'js', name: 'JavaScript', key: '4', keycode: 'Digit4', col: '#A85F10', cat: 'Core Language', tag: 'yeeting code into the DOM since \'95, no cap!', level: 'Expert' },
    { id: 'ts', name: 'TypeScript', key: '5', keycode: 'Digit5', col: '#17527E', cat: 'Typed Language', tag: 'JavaScript that actually tells you what went wrong before runtime.', level: 'Advanced' },

    // ROW 2 (Second row, left to right: Next.js, Node.js, Java, Express, C++)
    { id: 'next', name: 'Next.js', key: 'Q', keycode: 'KeyQ', col: '#101318', cat: 'Full-Stack Web', tag: 'SSR, React Server Components, and App Router for blazing speed.', level: 'Proficient' },
    { id: 'node', name: 'Node.js', key: 'W', keycode: 'KeyW', col: '#1E5621', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', cat: 'Backend Runtime', tag: 'Event-driven, asynchronous I/O backend powerhouse on Google V8.', level: 'Advanced' },
    { id: 'java', name: 'Java', key: 'E', keycode: 'KeyE', col: '#C2C7CE', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg', cat: 'Enterprise OOP', tag: 'Robust object-oriented backend programming and enterprise ecosystems.', level: 'Intermediate' },
    { id: 'express', name: 'Express', key: 'R', keycode: 'KeyR', col: '#1E222A', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg', forceWhite: true, cat: 'Backend Framework', tag: 'Fast, unopinionated, minimalist web framework for Node.js routing and RESTful APIs.', level: 'Advanced' },
    { id: 'cpp', name: 'C++', key: 'T', keycode: 'KeyT', col: '#15456E', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-plain.svg', forceWhite: true, cat: 'Low-Level Systems', tag: 'High-performance memory management, pointers, and optimized data structures.', level: 'Intermediate' },

    // ROW 3 (Third row, left to right: React, Tailwind CSS, PHP, SQL, WordPress)
    { id: 'react', name: 'React', key: 'A', keycode: 'KeyA', col: '#1A5F8C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', cat: 'Frontend UI', tag: 'Declarative components, reactive hooks, and modern virtual DOM architecture.', level: 'Advanced' },
    { id: 'tailwind', name: 'Tailwind CSS', key: 'S', keycode: 'KeyS', col: '#0C4A6E', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', cat: 'CSS Framework', tag: 'Utility-first CSS framework for rapid and responsive UI development.', level: 'Advanced' },
    { id: 'php', name: 'PHP', key: 'D', keycode: 'KeyD', col: '#3A4474', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-plain.svg', forceWhite: true, cat: 'Web Backend', tag: 'Server-side scripting powering millions of dynamic applications worldwide.', level: 'Proficient' },
    { id: 'sql', name: 'SQL', key: 'F', keycode: 'KeyF', col: '#134D66', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mysql.svg', forceWhite: true, cat: 'Database', tag: 'Relational database architecture, queries, indexes, and normalized schemas.', level: 'Advanced' },
    { id: 'wordpress', name: 'WordPress', key: 'G', keycode: 'KeyG', col: '#145078', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/wordpress/wordpress-plain.svg', forceWhite: true, cat: 'CMS Platform', tag: 'Custom theme development, REST APIs, and scalable content management.', level: 'Advanced' },

    // ROW 4 (Bottom row, left to right: Docker, Git, GitHub, Figma, Linux)
    { id: 'docker', name: 'Docker', key: 'Z', keycode: 'KeyZ', col: '#15577D', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg', forceWhite: true, cat: 'DevOps Containers', tag: '"It works on my machine" is officially obsolete and containerized.', level: 'Proficient' },
    { id: 'git', name: 'Git', key: 'X', keycode: 'KeyX', col: '#962615', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-plain.svg', forceWhite: true, cat: 'Version Control', tag: 'git commit -m "Fixed bug (for real this time)" and merge branches.', level: 'Expert' },
    { id: 'github', name: 'GitHub', key: 'C', keycode: 'KeyC', col: '#13161C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', forceWhite: true, cat: 'Collaboration', tag: 'Pull requests, CI/CD automated workflows, and team version control.', level: 'Expert' },
    { id: 'figma', name: 'Figma', key: 'V', keycode: 'KeyV', col: '#12151B', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg', cat: 'UI/UX Design', tag: 'Pixel-perfect vector designs, auto-layout components, and interactive prototypes.', level: 'Proficient' },
    { id: 'terminal', name: 'Linux', key: 'B', keycode: 'KeyB', col: '#1A1E24', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linux.svg', forceWhite: true, cat: 'Operating System', tag: 'Unix bash command line, shell scripts, servers, and kernel power.', level: 'Everyday' }
  ];

  // Sound Synthesizer (Mechanical switch click)
  let isSoundEnabled = true;
  let audioCtx = null;

  function playKeyClickSound(pitch = 1.0) {
    if (!isSoundEnabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.035);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (err) {}
  }

  function initKeypad() {
    try {
      const canvas = document.getElementById('keypadCanvas');
      const container = document.getElementById('keypadCanvasContainer');
      if (!canvas || !container || typeof THREE === 'undefined') return;

      let width = container.clientWidth || 1000;
    let height = container.clientHeight || 740;

    // Three.js Scene, Camera, and Lighting
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, 0, 10.4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Orbit Controls (Zoom disabled so page scroll is seamless!)
    let controls = null;
    if (typeof THREE.OrbitControls !== 'undefined') {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enableZoom = false; // Disable scroll-zoom to preserve smooth page scrolling
      controls.maxDistance = 18;
      controls.minDistance = 4;
      controls.target.set(0.0, -0.05, 0);
      controls.minPolarAngle = Math.PI / 4;
      controls.maxPolarAngle = Math.PI / 2 + 0.15;
      if (window.innerWidth < 1000) {
        controls.minAzimuthAngle = -Math.PI / 8;
        controls.maxAzimuthAngle = Math.PI / 8;
      }
    }

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.72);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.95);
    keyLight.position.set(6, 12, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.radius = 2.5;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.22);
    fillLight.position.set(-7, 5, 7);
    scene.add(fillLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 0.18);
    frontLight.position.set(2, -2, 8);
    scene.add(frontLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.35);
    rimLight.position.set(-6, -2, -5);
    scene.add(rimLight);

    // Key Shadow Texture
    function createKeyShadowTexture() {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(128, 128, 18, 128, 128, 124);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.92)');
      grad.addColorStop(0.38, 'rgba(0, 0, 0, 0.68)');
      grad.addColorStop(0.72, 'rgba(0, 0, 0, 0.22)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(c);
    }

    // Sculpted MOA Profile Keycap Geometry
    function createSculptedKeycapGeometry() {
      const N = 48;
      const Q = N / 4;

      function getRoundedRectPoints(w, d, r) {
        const pts = [];
        const hx = w / 2;
        const hz = d / 2;
        const cr = Math.min(r, hx, hz);

        const corners = [
          { cx: hx - cr, cz: hz - cr, startA: 0 },
          { cx: -hx + cr, cz: hz - cr, startA: Math.PI / 2 },
          { cx: -hx + cr, cz: -hz + cr, startA: Math.PI },
          { cx: hx - cr, cz: -hz + cr, startA: (3 * Math.PI) / 2 }
        ];

        for (let c = 0; c < 4; c++) {
          const corner = corners[c];
          for (let i = 0; i < Q; i++) {
            const theta = corner.startA + (i / Q) * (Math.PI / 2);
            pts.push({
              x: corner.cx + cr * Math.cos(theta),
              z: corner.cz + cr * Math.sin(theta)
            });
          }
        }
        return pts;
      }

      const keycapHeight = 0.78;
      const sideRingsConfig = [
        { y: 0.00, w: 1.26, d: 1.26, r: 0.22 },
        { y: 0.16, w: 1.22, d: 1.22, r: 0.20 },
        { y: 0.36, w: 1.14, d: 1.14, r: 0.18 },
        { y: 0.56, w: 1.04, d: 1.04, r: 0.15 },
        { y: 0.70, w: 0.95, d: 0.95, r: 0.12 },
        { y: 0.78, w: 0.90, d: 0.90, r: 0.10 }
      ];

      const positions = [];
      const uvs = [];
      const indices = [];

      const ringOffsets = [];
      for (let rIdx = 0; rIdx < sideRingsConfig.length; rIdx++) {
        const cfg = sideRingsConfig[rIdx];
        const pts = getRoundedRectPoints(cfg.w, cfg.d, cfg.r);
        ringOffsets.push(positions.length / 3);

        for (let i = 0; i < N; i++) {
          positions.push(pts[i].x, cfg.y, pts[i].z);
          uvs.push(i / N, cfg.y / keycapHeight);
        }
      }

      const sideIndicesStart = 0;
      for (let rIdx = 0; rIdx < sideRingsConfig.length - 1; rIdx++) {
        const o0 = ringOffsets[rIdx];
        const o1 = ringOffsets[rIdx + 1];
        for (let i = 0; i < N; i++) {
          const next = (i + 1) % N;
          indices.push(o0 + i, o1 + next, o0 + next);
          indices.push(o0 + i, o1 + i, o1 + next);
        }
      }
      const sideIndicesCount = indices.length;

      const topIndicesStart = indices.length;
      const topRimConfig = sideRingsConfig[sideRingsConfig.length - 1];
      const topRimPts = getRoundedRectPoints(topRimConfig.w, topRimConfig.d, topRimConfig.r);
      const dishDepth = 0.055;
      const dishRings = 7;
      const dishOffsets = [];

      for (let d = 0; d < dishRings; d++) {
        const s = 1.0 - (d / dishRings);
        const curY = topRimConfig.y - dishDepth * (1.0 - s * s);
        dishOffsets.push(positions.length / 3);

        for (let i = 0; i < N; i++) {
          const px = topRimPts[i].x * s;
          const pz = topRimPts[i].z * s;
          positions.push(px, curY, pz);
          const u = (px / topRimConfig.w) + 0.5;
          const v = 0.5 - (pz / topRimConfig.d);
          uvs.push(u, v);
        }
      }

      for (let d = 0; d < dishRings - 1; d++) {
        const o0 = dishOffsets[d];
        const o1 = dishOffsets[d + 1];
        for (let i = 0; i < N; i++) {
          const next = (i + 1) % N;
          indices.push(o0 + i, o1 + i, o1 + next);
          indices.push(o0 + i, o1 + next, o0 + next);
        }
      }

      const centerIdx = positions.length / 3;
      const centerY = topRimConfig.y - dishDepth;
      positions.push(0, centerY, 0);
      uvs.push(0.5, 0.5);

      const lastDishRing = dishOffsets[dishRings - 1];
      for (let i = 0; i < N; i++) {
        const next = (i + 1) % N;
        indices.push(lastDishRing + i, centerIdx, lastDishRing + next);
      }
      const topIndicesCount = indices.length - topIndicesStart;

      const bottomIndicesStart = indices.length;
      const bottomCenterIdx = positions.length / 3;
      positions.push(0, 0, 0);
      uvs.push(0.5, 0.5);

      const baseRingOffset = ringOffsets[0];
      for (let i = 0; i < N; i++) {
        const next = (i + 1) % N;
        indices.push(baseRingOffset + i, baseRingOffset + next, bottomCenterIdx);
      }
      const bottomIndicesCount = indices.length - bottomIndicesStart;

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      geo.center();

      geo.addGroup(topIndicesStart, topIndicesCount, 0);
      geo.addGroup(sideIndicesStart, sideIndicesCount, 1);
      geo.addGroup(bottomIndicesStart, bottomIndicesCount, 1);

      geo.userData = {
        topIndicesStart: topIndicesStart,
        topIndicesCount: topIndicesCount
      };

      return geo;
    }

    // Keyboard Chassis Geometry
    function createRoundedChassisGeometry(width, depth, height, radius, bevel) {
      const shape = new THREE.Shape();
      const x = -width / 2;
      const y = -depth / 2;
      const w = width;
      const h = depth;
      const r = radius;

      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r);
      shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h);
      shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);

      const geo = new THREE.ExtrudeGeometry(shape, {
        steps: 1,
        depth: height,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel,
        bevelSegments: 6
      });
      geo.center();
      geo.rotateX(-Math.PI / 2);
      return geo;
    }

    // Keycap Top Texture (1024x1024 Vector Logos)
    function createKeycapTexture(skill) {
      const c = document.createElement('canvas');
      c.width = 1024;
      c.height = 1024;
      const ctx = c.getContext('2d');

      function renderCanvas(img = null) {
        ctx.fillStyle = skill.col;
        ctx.fillRect(0, 0, 1024, 1024);

        // Highlight top region
        const topHighlight = ctx.createLinearGradient(0, 0, 0, 220);
        topHighlight.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
        topHighlight.addColorStop(0.35, 'rgba(255, 255, 255, 0.08)');
        topHighlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = topHighlight;
        ctx.fillRect(0, 0, 1024, 220);

        // Dark gradient flowing downwards
        const faceDarkGrad = ctx.createLinearGradient(0, 180, 0, 1024);
        faceDarkGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        faceDarkGrad.addColorStop(0.55, 'rgba(0, 0, 0, 0.16)');
        faceDarkGrad.addColorStop(1, 'rgba(0, 0, 0, 0.36)');
        ctx.fillStyle = faceDarkGrad;
        ctx.fillRect(0, 0, 1024, 1024);

        // Side vignette
        const sideVignette = ctx.createLinearGradient(0, 0, 1024, 0);
        sideVignette.addColorStop(0, 'rgba(0, 0, 0, 0.16)');
        sideVignette.addColorStop(0.12, 'rgba(0, 0, 0, 0)');
        sideVignette.addColorStop(0.88, 'rgba(0, 0, 0, 0)');
        sideVignette.addColorStop(1, 'rgba(0, 0, 0, 0.20)');
        ctx.fillStyle = sideVignette;
        ctx.fillRect(0, 0, 1024, 1024);

        // Ergonomic Concave Dish Depth
        const dishGrad = ctx.createRadialGradient(512, 520, 90, 512, 520, 480);
        dishGrad.addColorStop(0, 'rgba(0, 0, 0, 0.20)');
        dishGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.06)');
        dishGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = dishGrad;
        ctx.fillRect(0, 0, 1024, 1024);

        if (img) {
          const isWhiteKey = (skill.col === '#FFFFFF' || skill.id === 'python' || skill.id === 'java');
          const pad = isWhiteKey ? 185 : 240;
          const logoSize = 1024 - pad * 2;

          if (skill.forceWhite) {
            const oc = document.createElement('canvas');
            oc.width = logoSize;
            oc.height = logoSize;
            const octx = oc.getContext('2d');
            octx.drawImage(img, 0, 0, logoSize, logoSize);
            octx.globalCompositeOperation = 'source-in';
            octx.fillStyle = '#ffffff';
            octx.fillRect(0, 0, logoSize, logoSize);
            ctx.drawImage(oc, pad, pad);
          } else if (isWhiteKey) {
            const sc = document.createElement('canvas');
            sc.width = logoSize;
            sc.height = logoSize;
            const sctx = sc.getContext('2d');
            sctx.drawImage(img, 0, 0, logoSize, logoSize);
            sctx.globalCompositeOperation = 'source-in';
            sctx.fillStyle = 'rgba(18, 22, 30, 0.88)';
            sctx.fillRect(0, 0, logoSize, logoSize);

            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.40)';
            ctx.shadowBlur = 22;
            ctx.shadowOffsetY = 8;
            ctx.drawImage(sc, pad, pad);
            ctx.restore();

            const offsets = [
              [-3, 0], [3, 0], [0, -3], [0, 3],
              [-2, -2], [2, -2], [-2, 2], [2, 2]
            ];
            ctx.save();
            ctx.globalAlpha = 0.78;
            for (let i = 0; i < offsets.length; i++) {
              ctx.drawImage(sc, pad + offsets[i][0], pad + offsets[i][1]);
            }
            ctx.restore();

            ctx.save();
            if ('filter' in ctx) {
              ctx.filter = 'contrast(1.28) saturate(1.40) brightness(0.96)';
            }
            ctx.drawImage(img, pad, pad, logoSize, logoSize);
            ctx.restore();
          } else {
            ctx.drawImage(img, pad, pad, logoSize, logoSize);
          }
        } else {
          drawSkillLogo(ctx, skill.id, skill.name);
        }
      }

      renderCanvas();

      const texture = new THREE.CanvasTexture(c);
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      if (renderer.capabilities && renderer.capabilities.getMaxAnisotropy) {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      }
      texture.needsUpdate = true;

      if (skill.icon) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          renderCanvas(img);
          texture.needsUpdate = true;
        };
        img.onerror = () => {
          renderCanvas(null);
          texture.needsUpdate = true;
        };
        img.src = skill.icon;
      }

      return texture;
    }

    // Side texture with dark gradient
    function createKeycapSideTexture(skill) {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 512;
      const ctx = c.getContext('2d');

      ctx.fillStyle = skill.col;
      ctx.fillRect(0, 0, 64, 512);

      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.18)');
      grad.addColorStop(0.32, 'rgba(0, 0, 0, 0.28)');
      grad.addColorStop(0.70, 'rgba(0, 0, 0, 0.52)');
      grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.72)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 512);

      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    }

    // Fallback Vector Logo Drawing
    function drawSkillLogo(ctx, id, name) {
      ctx.save();
      const isDarkText = (id === 'python' || id === 'java');
      ctx.fillStyle = isDarkText ? '#1e2229' : '#ffffff';
      ctx.strokeStyle = isDarkText ? '#1e2229' : '#ffffff';
      ctx.lineWidth = 44;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const cx = 512;
      const cy = 512;

      if (id === 'html') {
        ctx.beginPath();
        ctx.moveTo(cx - 180, cy - 200);
        ctx.lineTo(cx + 180, cy - 200);
        ctx.lineTo(cx + 140, cy + 140);
        ctx.lineTo(cx, cy + 220);
        ctx.lineTo(cx - 140, cy + 140);
        ctx.closePath();
        ctx.stroke();
        ctx.font = 'bold 230px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('5', cx, cy - 5);
      } else if (id === 'css') {
        ctx.beginPath();
        ctx.moveTo(cx - 180, cy - 200);
        ctx.lineTo(cx + 180, cy - 200);
        ctx.lineTo(cx + 140, cy + 140);
        ctx.lineTo(cx, cy + 220);
        ctx.lineTo(cx - 140, cy + 140);
        ctx.closePath();
        ctx.stroke();
        ctx.font = 'bold 230px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('3', cx, cy - 5);
      } else if (id === 'js') {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        if (typeof Path2D !== 'undefined') {
          ctx.translate(355, 345);
          ctx.scale(4.2, 4.2);
          const jsLetterPath = new Path2D('M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581zM69.462 58.943H57.753l-.048 30.272c0 6.438.333 12.34-.714 14.149-1.713 3.558-6.152 3.117-8.175 2.427-2.059-1.012-3.106-2.451-4.319-4.485-.333-.584-.583-1.036-.667-1.071l-9.52 5.83c1.583 3.249 3.915 6.069 6.902 7.901 4.462 2.678 10.459 3.499 16.731 2.059 4.082-1.189 7.604-3.652 9.448-7.401 2.666-4.915 2.094-10.864 2.07-17.444.06-10.735.001-21.468.001-32.237z');
          ctx.fill(jsLetterPath);
        } else {
          ctx.font = '900 240px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
          ctx.fillText('JS', 850, 850);
        }
        ctx.restore();
      } else if (id === 'ts') {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 350px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText('TS', 850, 845);
        ctx.restore();
      } else if (id === 'next') {
        const r = 240;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.lineWidth = 16;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();

        const topY = cy - 140;
        const botY = cy + 140;
        const leftX = cx - 110;
        ctx.lineWidth = 36;
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(leftX, topY);
        ctx.lineTo(leftX, botY);
        ctx.stroke();

        const rightX = cx + 110;
        ctx.beginPath();
        ctx.moveTo(rightX, topY);
        ctx.lineTo(rightX, cy + 40);
        ctx.stroke();

        const dGrad = ctx.createLinearGradient(leftX, topY, rightX + 20, botY);
        dGrad.addColorStop(0, '#ffffff');
        dGrad.addColorStop(0.7, '#ffffff');
        dGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
        ctx.strokeStyle = dGrad;
        ctx.beginPath();
        ctx.moveTo(leftX, topY);
        ctx.lineTo(rightX + 20, botY);
        ctx.stroke();
      } else if (id === 'tailwind') {
        ctx.save();
        ctx.fillStyle = '#38bdf8';
        const p = new Path2D('M64.004 25.602c-17.067 0-27.73 8.53-32 25.597 6.398-8.531 13.867-11.73 22.398-9.597 4.871 1.214 8.352 4.746 12.207 8.66C72.883 56.629 80.145 64 96.004 64c17.066 0 27.73-8.531 32-25.602-6.399 8.536-13.867 11.735-22.399 9.602-4.87-1.215-8.347-4.746-12.207-8.66-6.27-6.367-13.53-13.738-29.394-13.738zM32.004 64c-17.066 0-27.73 8.531-32 25.602C6.402 81.066 13.87 77.867 22.402 80c4.871 1.215 8.352 4.746 12.207 8.66 6.274 6.367 13.536 13.738 29.395 13.738 17.066 0 27.73-8.53 32-25.597-6.399 8.531-13.867 11.73-22.399 9.597-4.87-1.214-8.347-4.746-12.207-8.66C55.128 71.371 47.868 64 32.004 64z');
        ctx.translate(cx - 256, cy - 256);
        ctx.scale(4, 4);
        ctx.fill(p);
        ctx.restore();
      } else if (id === 'express') {
        ctx.font = '700 200px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('EX', cx, cy - 10);
      } else if (id === 'c') {
        ctx.font = '900 280px "Anton", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('C', cx, cy - 10);
      } else if (id === 'python') {
        ctx.font = '900 210px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#26547c';
        ctx.fillText('PY', cx, cy - 80);
        ctx.fillStyle = '#cc8b00';
        ctx.fillText('THON', cx, cy + 90);
      } else if (id === 'java') {
        ctx.font = '900 230px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#c02626';
        ctx.fillText('JAVA', cx, cy - 10);
      } else {
        ctx.font = '900 250px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const displayShort = name.length > 5 ? name.substring(0, 4).toUpperCase() : name.toUpperCase();
        ctx.fillText(displayShort, cx, cy - 10);
      }
      ctx.restore();
    }

    // Build Scroll Stage Group (handles dynamic scroll-in/scroll-out & mouse wheel inertia)
    const scrollStageGroup = new THREE.Group();
    scene.add(scrollStageGroup);

    // Build Keyboard Group
    const keyboardGroup = new THREE.Group();
    scrollStageGroup.add(keyboardGroup);
    window._keypadDebug = { keyboardGroup, scrollStageGroup, scene, camera };

    const COLS = 5;
    const ROWS = 4;
    const KEY_SPACING = 1.34;
    const TOTAL_WIDTH = COLS * KEY_SPACING + 0.38;
    const TOTAL_HEIGHT = ROWS * KEY_SPACING + 0.38;

    // Chassis
    const chassisGeo = createRoundedChassisGeometry(TOTAL_WIDTH, TOTAL_HEIGHT, 0.85, 0.35, 0.12);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x090b0e,
      roughness: 0.60,
      metalness: 0.25,
    });
    const keyboardChassis = new THREE.Mesh(chassisGeo, chassisMat);
    keyboardChassis.position.set(0, -0.48, 0);
    keyboardChassis.receiveShadow = true;
    keyboardGroup.add(keyboardChassis);

    // Switch Plate
    const plateGeo = createRoundedChassisGeometry(TOTAL_WIDTH - 0.20, TOTAL_HEIGHT - 0.20, 0.10, 0.20, 0.04);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x11141b,
      roughness: 0.70,
      metalness: 0.10
    });
    const switchPlate = new THREE.Mesh(plateGeo, plateMat);
    switchPlate.position.set(0, -0.06, 0);
    switchPlate.receiveShadow = true;
    keyboardGroup.add(switchPlate);

    // Contact Shadow setup
    const shadowGeo = new THREE.PlaneGeometry(1.36, 1.36);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowTex = createKeyShadowTexture();

    const keyTilts = [
      { rx:  0.005, ry: -0.006, rz:  0.006 },
      { rx: -0.006, ry:  0.004, rz: -0.005 },
      { rx:  0.004, ry:  0.006, rz: -0.006 },
      { rx: -0.005, ry: -0.005, rz:  0.005 },
      { rx:  0.006, ry:  0.005, rz: -0.006 },
      { rx: -0.005, ry:  0.005, rz:  0.004 },
      { rx:  0.005, ry: -0.004, rz: -0.005 },
      { rx: -0.004, ry:  0.005, rz:  0.006 },
      { rx:  0.006, ry: -0.004, rz: -0.004 },
      { rx: -0.005, ry:  0.005, rz:  0.004 },
      { rx:  0.004, ry: -0.006, rz:  0.005 },
      { rx: -0.005, ry:  0.005, rz: -0.005 },
      { rx:  0.005, ry:  0.006, rz:  0.004 },
      { rx: -0.004, ry: -0.005, rz: -0.005 },
      { rx:  0.006, ry:  0.004, rz:  0.005 },
      { rx: -0.005, ry:  0.006, rz: -0.004 },
      { rx:  0.005, ry: -0.005, rz:  0.006 },
      { rx: -0.006, ry:  0.005, rz: -0.005 },
      { rx:  0.004, ry: -0.005, rz:  0.004 },
      { rx: -0.005, ry:  0.004, rz: -0.005 }
    ];

    const keycaps = [];
    const interactiveMeshes = [];
    const keycapGeometry = createSculptedKeycapGeometry();

    SKILLS_DATA.forEach((skill, index) => {
      const colIdx = index % COLS;
      const rowIdx = Math.floor(index / COLS);

      const posX = (colIdx - (COLS - 1) / 2) * KEY_SPACING;
      const posZ = (rowIdx - (ROWS - 1) / 2) * KEY_SPACING;
      const tilt = keyTilts[index % keyTilts.length];

      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.82,
        depthWrite: false
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.position.set(posX, 0.005, posZ);
      keyboardGroup.add(shadowMesh);

      const topTexture = createKeycapTexture(skill);
      const sideTexture = createKeycapSideTexture(skill);

      const capMat = new THREE.MeshStandardMaterial({
        map: topTexture,
        roughness: 0.44,
        metalness: 0.04,
        side: THREE.DoubleSide
      });

      const sideMat = new THREE.MeshStandardMaterial({
        map: sideTexture,
        roughness: 0.50,
        metalness: 0.04,
        side: THREE.DoubleSide
      });

      const keyMaterials = [capMat, sideMat];

      const defaultY = 0.40;
      const keyMesh = new THREE.Mesh(keycapGeometry, keyMaterials);
      keyMesh.position.set(posX, defaultY, posZ);
      keyMesh.rotation.set(tilt.rx, tilt.ry, tilt.rz);
      keyMesh.castShadow = true;
      keyMesh.receiveShadow = true;

      keyMesh.userData = {
        skill: skill,
        defaultY: defaultY,
        baseRotX: tilt.rx,
        baseRotY: tilt.ry,
        baseRotZ: tilt.rz,
        isPressed: false,
        index: index,
        shadowMesh: shadowMesh
      };

      keyboardGroup.add(keyMesh);
      keycaps.push(keyMesh);
      interactiveMeshes.push(keyMesh);
    });

    const raycastTargets = [...interactiveMeshes, keyboardChassis, switchPlate];

    // Camera & Keyboard Angle Constants
    // IDLE: Horizontal Level View (แนวนอน)
    const IDLE_ROT_X = THREE.MathUtils.degToRad(68.0);
    const IDLE_ROT_Y = 0.0;
    const IDLE_ROT_Z = 0.0;

    // ACTIVE: Diagonal 3D Perspective View (matching ex3.png exactly)
    const ACTIVE_ROT_X = THREE.MathUtils.degToRad(65.0);
    const ACTIVE_ROT_Y = THREE.MathUtils.degToRad(-20.0);
    const ACTIVE_ROT_Z = THREE.MathUtils.degToRad(-8.5);

    // Scale & Position Coordinates (Enlarged & Raised closer to navbar)
    const DESKTOP_SCALE = 0.98;
    const DESKTOP_Y = 1.48;
    const MOBILE_Y = -0.75;
    const MOBILE_ROT_X = THREE.MathUtils.degToRad(63.0);
    const IDLE_POS_X = 0.0;
    const ACTIVE_POS_X = 1.35; // Slid to right just enough so typography info panel is fully clear

    function getMobileScale() {
      const w = container ? (container.clientWidth || window.innerWidth) : window.innerWidth;
      const h = container ? (container.clientHeight || 680) : 680;
      const aspect = (w > 0 && h > 0) ? (w / h) : 0.55;
      const visibleWidth = 2.0 * 10.4 * Math.tan(THREE.MathUtils.degToRad(22)) * aspect;
      const fitScale = (visibleWidth * 0.86) / TOTAL_WIDTH;
      return Math.max(0.46, Math.min(0.64, fitScale));
    }

    keyboardGroup.rotation.order = 'YXZ';
    keyboardGroup.rotation.x = IDLE_ROT_X;
    keyboardGroup.rotation.y = IDLE_ROT_Y;
    keyboardGroup.rotation.z = IDLE_ROT_Z;

    let activePressedMesh = null;
    let isEntranceAnimating = false;
    let isKeypadActive = false;
    let idleResetTimer = null;
    let hasMouseMovedSinceReset = true;

    function updateLayoutForScreen() {
      const isMobile = window.innerWidth < 1000;
      if (isMobile) {
        const mobileScale = getMobileScale();
        keyboardGroup.position.set(0, MOBILE_Y, 0);
        keyboardGroup.scale.set(mobileScale, mobileScale, mobileScale);
        keyboardGroup.rotation.set(MOBILE_ROT_X, 0, 0);
        if (controls) {
          controls.target.set(0, MOBILE_Y, 0);
          controls.minAzimuthAngle = -Math.PI / 8;
          controls.maxAzimuthAngle = Math.PI / 8;
        }
      } else {
        const curX = isKeypadActive ? ACTIVE_POS_X : IDLE_POS_X;
        const curRotX = isKeypadActive ? ACTIVE_ROT_X : IDLE_ROT_X;
        const curRotY = isKeypadActive ? ACTIVE_ROT_Y : IDLE_ROT_Y;
        const curRotZ = isKeypadActive ? ACTIVE_ROT_Z : IDLE_ROT_Z;
        keyboardGroup.position.set(curX, DESKTOP_Y, 0);
        keyboardGroup.scale.set(DESKTOP_SCALE, DESKTOP_SCALE, DESKTOP_SCALE);
        keyboardGroup.rotation.set(curRotX, curRotY, curRotZ);
        if (controls) {
          controls.target.set(curX, DESKTOP_Y, 0);
          controls.minAzimuthAngle = -Infinity;
          controls.maxAzimuthAngle = Infinity;
        }
      }
    }
    updateLayoutForScreen();

    // UI Elements
    const skillCategoryEl = document.getElementById('skillCategory');
    const skillNameEl = document.getElementById('skillName');
    const skillTaglineEl = document.getElementById('skillTagline');
    const skillShortcutEl = document.getElementById('skillShortcut');
    const skillLevelEl = document.getElementById('skillLevel');
    const skillInfoPanelEl = document.getElementById('skillInfoPanel');

    let currentSkillId = '';

    function updateSkillInfo(skill) {
      if (!skill || currentSkillId === skill.id) return;
      currentSkillId = skill.id;

      if (typeof gsap !== 'undefined' && skillInfoPanelEl) {
        gsap.to(skillInfoPanelEl, {
          opacity: 0.2,
          y: 8,
          duration: 0.12,
          ease: 'power2.in',
          onComplete: () => {
            if (skillCategoryEl) {
              skillCategoryEl.textContent = skill.cat;
              skillCategoryEl.style.color = skill.col;
              skillCategoryEl.style.borderColor = skill.col;
              skillCategoryEl.style.background = `${skill.col}22`;
            }
            if (skillNameEl) {
              skillNameEl.textContent = skill.name;
              skillNameEl.style.textShadow = `0 0 40px ${skill.col}66, 0 4px 20px rgba(0,0,0,0.8)`;
            }
            if (skillTaglineEl) skillTaglineEl.textContent = `"${skill.tag}"`;
            if (skillShortcutEl) skillShortcutEl.textContent = skill.key;
            if (skillLevelEl) skillLevelEl.textContent = skill.level;

            if (skillInfoPanelEl) {
              skillInfoPanelEl.classList.add('is-active');
              skillInfoPanelEl.style.pointerEvents = 'auto';
            }
            gsap.to(skillInfoPanelEl, {
              opacity: 1,
              y: 0,
              duration: 0.25,
              ease: 'power2.out'
            });
          }
        });
      }
    }

    // Slide keypad to right and rotate to horizontal (Active Mode)
    function activateKeyboardStage() {
      if (isKeypadActive) return;
      isKeypadActive = true;

      if (idleResetTimer) {
        clearTimeout(idleResetTimer);
        idleResetTimer = null;
      }

      const isMobile = window.innerWidth < 1000;
      if (!isMobile && typeof gsap !== 'undefined') {
        gsap.killTweensOf(keyboardGroup.position);
        gsap.killTweensOf(keyboardGroup.rotation);

        gsap.to(keyboardGroup.position, {
          x: ACTIVE_POS_X,
          y: DESKTOP_Y,
          duration: 0.52,
          ease: 'power2.out'
        });

        gsap.to(keyboardGroup.rotation, {
          x: ACTIVE_ROT_X,
          y: ACTIVE_ROT_Y,
          z: ACTIVE_ROT_Z,
          duration: 0.52,
          ease: 'power2.out'
        });
      }
    }

    // Release currently pressed key switch without snapping whole stage back
    function releaseKeycapSwitchOnly() {
      if (!activePressedMesh) return;
      const prev = activePressedMesh;
      prev.userData.isPressed = false;
      activePressedMesh = null;

      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(prev.position);
        gsap.killTweensOf(prev.rotation);
        gsap.to(prev.position, {
          y: prev.userData.defaultY,
          duration: 0.20,
          ease: 'power2.out'
        });
        gsap.to(prev.rotation, {
          x: prev.userData.baseRotX,
          y: prev.userData.baseRotY,
          z: prev.userData.baseRotZ,
          duration: 0.20,
          ease: 'power2.out'
        });
        if (prev.userData.shadowMesh) {
          gsap.to(prev.userData.shadowMesh.scale, { x: 1, y: 1, z: 1, duration: 0.20 });
          gsap.to(prev.userData.shadowMesh.material, { opacity: 0.82, duration: 0.20 });
        }
      }
    }

    // Return keypad to center and diagonal 3D tilt (Idle Mode)
    function deactivateKeyboardStage(force = false) {
      const isMobile = window.innerWidth < 1000;
      if (isMobile && !force) {
        return; // Retain active skill on mobile so panel never vanishes into an empty void
      }

      if (idleResetTimer) {
        clearTimeout(idleResetTimer);
        idleResetTimer = null;
      }

      isKeypadActive = false;
      hasMouseMovedSinceReset = false; // Prevent re-triggering under stationary mouse
      currentSkillId = '';

      releaseKeycapSwitchOnly();

      // Fade out left info panel
      if (skillInfoPanelEl && typeof gsap !== 'undefined') {
        skillInfoPanelEl.classList.remove('is-active');
        skillInfoPanelEl.style.pointerEvents = 'none';
        gsap.killTweensOf(skillInfoPanelEl);
        gsap.to(skillInfoPanelEl, {
          opacity: 0,
          y: 8,
          duration: 0.22,
          ease: 'power2.out'
        });
      }

      // Slide keypad back to center AND smoothly rotate back to diagonal tilted view (on desktop)
      if (!isMobile && typeof gsap !== 'undefined') {
        gsap.killTweensOf(keyboardGroup.position);
        gsap.killTweensOf(keyboardGroup.rotation);

        gsap.to(keyboardGroup.position, {
          x: IDLE_POS_X,
          y: DESKTOP_Y,
          duration: 0.52,
          ease: 'power2.out'
        });

        gsap.to(keyboardGroup.rotation, {
          x: IDLE_ROT_X,
          y: IDLE_ROT_Y,
          z: IDLE_ROT_Z,
          duration: 0.52,
          ease: 'power2.out'
        });
      }
    }

    // Alias for existing callers
    function releaseActiveKey(force = false) {
      deactivateKeyboardStage(force);
    }

    // Smooth entrance animation: rotates and rises up smoothly from below into center
    function playEntranceAnimation() {
      const isMobile = window.innerWidth < 1000;
      const targetX = IDLE_POS_X;
      const targetY = isMobile ? MOBILE_Y : DESKTOP_Y;
      const targetZ = 0;
      const targetScale = isMobile ? getMobileScale() : DESKTOP_SCALE;
      const targetRotX = isMobile ? MOBILE_ROT_X : IDLE_ROT_X;
      const targetRotY = isMobile ? 0 : IDLE_ROT_Y;
      const targetRotZ = isMobile ? 0 : IDLE_ROT_Z;

      isEntranceAnimating = true;

      // Start position lowered and tilted smoothly from below
      keyboardGroup.position.set(targetX, targetY - 1.5, targetZ - 0.4);
      keyboardGroup.rotation.set(targetRotX + 0.18, targetRotY - 0.08, targetRotZ + 0.06);
      keyboardGroup.scale.set(targetScale * 0.85, targetScale * 0.85, targetScale * 0.85);

      if (controls) {
        controls.target.set(targetX, targetY, targetZ);
      }

      // Reset any active pressed key
      releaseActiveKey(true);

      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(keyboardGroup.position);
        gsap.killTweensOf(keyboardGroup.rotation);
        gsap.killTweensOf(keyboardGroup.scale);

        const animDuration = 1.05;
        const animEase = 'power2.out';

        gsap.to(keyboardGroup.position, {
          x: targetX,
          y: targetY,
          z: targetZ,
          duration: animDuration,
          ease: animEase,
          onComplete: () => {
            isEntranceAnimating = false;
          }
        });

        gsap.to(keyboardGroup.rotation, {
          x: targetRotX,
          y: targetRotY,
          z: targetRotZ,
          duration: animDuration,
          ease: animEase
        });

        gsap.to(keyboardGroup.scale, {
          x: targetScale,
          y: targetScale,
          z: targetScale,
          duration: animDuration,
          ease: animEase
        });
      } else {
        keyboardGroup.position.set(targetX, targetY, targetZ);
        keyboardGroup.rotation.set(targetRotX, targetRotY, targetRotZ);
        keyboardGroup.scale.set(targetScale, targetScale, targetScale);
        isEntranceAnimating = false;
      }

      renderer.render(scene, camera);
    }

    function triggerKeyPress(mesh) {
      if (!mesh) return;
      if (activePressedMesh === mesh) return;

      if (idleResetTimer) {
        clearTimeout(idleResetTimer);
        idleResetTimer = null;
      }

      if (activePressedMesh && activePressedMesh !== mesh) {
        releaseKeycapSwitchOnly();
      }

      activePressedMesh = mesh;
      mesh.userData.isPressed = true;
      playKeyClickSound(1.0 + (mesh.userData.index % 5) * 0.08);
      updateSkillInfo(mesh.userData.skill);

      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(mesh.position);
        gsap.killTweensOf(mesh.rotation);
        gsap.to(mesh.position, {
          y: mesh.userData.defaultY - 0.26,
          duration: 0.08,
          ease: 'power2.out'
        });
        // Keep keycap flat when pressed without extra tilt
        gsap.to(mesh.rotation, {
          x: mesh.userData.baseRotX,
          y: mesh.userData.baseRotY,
          z: mesh.userData.baseRotZ,
          duration: 0.08,
          ease: 'power2.out'
        });
        if (mesh.userData.shadowMesh) {
          gsap.to(mesh.userData.shadowMesh.scale, { x: 0.86, y: 0.86, z: 0.86, duration: 0.08 });
          gsap.to(mesh.userData.shadowMesh.material, { opacity: 0.96, duration: 0.08 });
        }
      }

      // Ensure stage is smoothly shifted to Active Mode on desktop
      activateKeyboardStage();
    }

    // Raycaster for Mouse Interaction (Container-relative coordinates)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-9999, -9999);
    let downTime = 0;
    let isPointerDragging = false;

    // Strict validation: returns true ONLY when mouse points directly at the front/top face (ส่วนหน้า) of a keycap
    function isKeycapTopFace(intersection) {
      if (!intersection || !intersection.object || !intersection.face) return false;
      const mesh = intersection.object;
      if (!mesh.userData || !mesh.userData.skill) return false;

      // 1. Must belong to material 0 (the top cap face where logo and color are mapped)
      if (intersection.face.materialIndex !== 0) return false;

      // 2. Normal in local object space must point upwards (dish surface normal.y is 0.975 - 1.0)
      if (intersection.face.normal && intersection.face.normal.y < 0.75) return false;

      // 3. Elevation in centered local geometry must be at top dish level (local Y >= 0.26)
      if (intersection.point) {
        const localPoint = mesh.worldToLocal(intersection.point.clone());
        if (localPoint.y < 0.26) return false;
      }

      // 4. Index range verification within top dish group
      const geo = mesh.geometry;
      if (geo && geo.userData && geo.userData.topIndicesCount) {
        const startIdx = (intersection.faceIndex !== undefined) ? intersection.faceIndex * 3 : -1;
        if (
          startIdx < geo.userData.topIndicesStart ||
          startIdx >= geo.userData.topIndicesStart + geo.userData.topIndicesCount
        ) {
          return false;
        }
      }

      return true;
    }

    function updateMousePos(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    }

    canvas.addEventListener('mousemove', (e) => {
      hasMouseMovedSinceReset = true;
      updateMousePos(e.clientX, e.clientY);
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
      canvas.style.cursor = 'grab';
      if (window.innerWidth >= 1000) {
        deactivateKeyboardStage();
      }
    });

    canvas.addEventListener('pointerdown', (e) => {
      hasMouseMovedSinceReset = true;
      downTime = Date.now();
      isPointerDragging = true;
      updateMousePos(e.clientX, e.clientY);
    });

    canvas.addEventListener('pointerup', (e) => {
      hasMouseMovedSinceReset = true;
      const isDrag = Date.now() - downTime > 220;
      isPointerDragging = false;
      updateMousePos(e.clientX, e.clientY);
      if (isDrag) return;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastTargets);
      const isMobile = window.innerWidth < 1000;

      if (intersects.length > 0) {
        if (isMobile) {
          const hitKey = intersects.find(hit => hit.object && hit.object.userData && hit.object.userData.skill);
          if (hitKey) {
            triggerKeyPress(hitKey.object);
            return;
          }
        } else if (isKeycapTopFace(intersects[0])) {
          triggerKeyPress(intersects[0].object);
          return;
        }
      }

      if (!isMobile) {
        deactivateKeyboardStage();
      }
    });

    // Info panel mouseenter/leave to pause idle reset while user is reading details
    if (skillInfoPanelEl) {
      skillInfoPanelEl.addEventListener('mouseenter', () => {
        if (idleResetTimer) {
          clearTimeout(idleResetTimer);
          idleResetTimer = null;
        }
      });
      skillInfoPanelEl.addEventListener('mouseleave', () => {
        if (isKeypadActive && !idleResetTimer) {
          idleResetTimer = setTimeout(() => {
            deactivateKeyboardStage();
          }, 900);
        }
      });
    }

    // Keyboard physical keybind listener
    window.addEventListener('keydown', (e) => {
      const pane = document.getElementById('tab-tech-stack');
      if (!pane || !pane.classList.contains('active')) return;

      const matchedMesh = keycaps.find(mesh => {
        const s = mesh.userData.skill;
        return (
          e.code === s.keycode ||
          e.key.toUpperCase() === s.key.toUpperCase()
        );
      });

      if (matchedMesh) {
        hasMouseMovedSinceReset = true;
        if (idleResetTimer) {
          clearTimeout(idleResetTimer);
          idleResetTimer = null;
        }
        triggerKeyPress(matchedMesh);
      }
    });

    // Resize handling
    function handleResize() {
      if (!container || !canvas) return;
      const w = container.clientWidth || 1000;
      const h = container.clientHeight || 740;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
      if (!isEntranceAnimating) {
        updateLayoutForScreen();
      }
      renderer.render(scene, camera);
    }

    window.addEventListener('resize', handleResize);

    // Dynamic Scroll & Mouse Wheel Interaction State
    let smoothScrollProgress = 0;
    let wheelVelocity = 0;
    let targetWheelVelocity = 0;
    let activeScrollBlend = 1.0;

    const handleWheelEvent = (e) => {
      const pane = document.getElementById('tab-tech-stack');
      if (!pane || !pane.classList.contains('active')) return;
      const delta = Math.max(-100, Math.min(100, e.deltaY));
      targetWheelVelocity += delta * 0.0006;
      targetWheelVelocity = Math.max(-0.12, Math.min(0.12, targetWheelVelocity));
    };

    window.addEventListener('wheel', handleWheelEvent, { passive: true });

    const homeScreenEl = document.getElementById('homeScreen');
    if (homeScreenEl) {
      homeScreenEl.addEventListener('scroll', () => {
        const pane = document.getElementById('tab-tech-stack');
        if (pane && pane.classList.contains('active') && !isRendering) {
          isRendering = true;
          renderLoop();
        }
      }, { passive: true });
    }

    // Rendering control
    let isRendering = false;
    let animFrameId = null;

    function renderLoop() {
      if (!isRendering) return;
      animFrameId = requestAnimationFrame(renderLoop);

      if (controls) controls.update();

      // Dynamic Scroll-in / Scroll-out & Mouse Scroll Reaction
      if (!isEntranceAnimating && container) {
        const rect = container.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        const targetCenterY = vh * 0.48;
        const currentCenterY = rect.top + rect.height * 0.5;
        const deltaY = currentCenterY - targetCenterY;
        const scrollRange = Math.max(vh * 0.75, 420);
        const targetScrollProgress = Math.max(-1, Math.min(1, deltaY / scrollRange));

        // Smooth 60fps lerp damping
        smoothScrollProgress += (targetScrollProgress - smoothScrollProgress) * 0.085;

        // Smoothly decay mouse wheel velocity impulse
        wheelVelocity += (targetWheelVelocity - wheelVelocity) * 0.10;
        targetWheelVelocity *= 0.88;
        if (Math.abs(targetWheelVelocity) < 0.0001) targetWheelVelocity = 0;

        // When keypad is active (hovered/pressed), smoothly zero out scroll offsets
        // so the keypad turns to the exact intended horizontal active orientation without any skew!
        const targetBlend = isKeypadActive ? 0.0 : 1.0;
        activeScrollBlend += (targetBlend - activeScrollBlend) * 0.12;
        const sp = smoothScrollProgress * activeScrollBlend;
        const wv = wheelVelocity * activeScrollBlend;

        const tiltX = (sp > 0 ? sp * 0.11 : sp * 0.13) + wv;
        const tiltZ = sp * 0.035;
        const offsetY = sp > 0 ? -sp * 0.38 : -Math.abs(sp) * 0.32;
        const offsetZ = -Math.abs(sp) * 0.35;
        const currentScale = 1.0 - Math.abs(sp) * 0.08;

        scrollStageGroup.rotation.x = tiltX;
        scrollStageGroup.rotation.z = tiltZ;
        scrollStageGroup.position.y = offsetY;
        scrollStageGroup.position.z = offsetZ;
        scrollStageGroup.scale.set(currentScale, currentScale, currentScale);
      } else if (isEntranceAnimating) {
        smoothScrollProgress = 0;
        wheelVelocity = 0;
        targetWheelVelocity = 0;
        scrollStageGroup.rotation.set(0, 0, 0);
        scrollStageGroup.position.set(0, 0, 0);
        scrollStageGroup.scale.set(1, 1, 1);
      }

      const isDesktop = window.innerWidth >= 1000;
      if (isDesktop) {
        let isTopHit = false;

        if (!isPointerDragging && mouse.x > -100 && mouse.y > -100) {
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(raycastTargets);

          if (intersects.length > 0 && isKeycapTopFace(intersects[0])) {
            isTopHit = true;
            if (hasMouseMovedSinceReset) {
              if (idleResetTimer) {
                clearTimeout(idleResetTimer);
                idleResetTimer = null;
              }
              const hoveredMesh = intersects[0].object;
              if (hoveredMesh !== activePressedMesh) {
                triggerKeyPress(hoveredMesh);
              }
            }
          } else {
            // Mouse is not over any keycap top face right now.
            // Do NOT immediately snap stage back to idle (this eliminates the jitter loop!).
            // Instead, gracefully release the stage after a 900ms inactivity grace period.
            if (isKeypadActive && !idleResetTimer) {
              idleResetTimer = setTimeout(() => {
                deactivateKeyboardStage();
              }, 900);
            }
          }
        }

        canvas.style.cursor = isTopHit ? 'pointer' : (isPointerDragging ? 'grabbing' : 'grab');
      }

      renderer.render(scene, camera);
    }

    // Global refresh function called when Tech Stack tab is activated
    window.refreshKeypadCanvas = function () {
      isRendering = true;
      if (!animFrameId) {
        renderLoop();
      }
      handleResize();
      playEntranceAnimation();

      if (window.innerWidth < 1000) {
        setTimeout(() => {
          if (!activePressedMesh && keycaps.length > 0) {
            const defaultMesh = keycaps.find(k => k.userData.skill && k.userData.skill.id === 'react') || keycaps[0];
            if (defaultMesh) {
              triggerKeyPress(defaultMesh);
            }
          }
        }, 450);
      }
    };

    window.playKeypadEntrance = playEntranceAnimation;
    window._keypadDebug = {
      keyboardGroup,
      scene,
      camera,
      controls,
      playEntranceAnimation,
      activateKeyboardStage,
      deactivateKeyboardStage
    };

    function checkRenderingState() {
      const pane = document.getElementById('tab-tech-stack');
      const isTabActive = pane && pane.classList.contains('active');

      if (isTabActive) {
        if (!isRendering) {
          isRendering = true;
          renderLoop();
        }
        handleResize();
      } else {
        if (isRendering) {
          isRendering = false;
          if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
          }
        }
      }
    }

    // Tab buttons listener directly inside keypad module
    document.querySelectorAll('.portfolio-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabKey = btn.getAttribute('data-tab');
        if (tabKey === 'tech-stack') {
          setTimeout(() => {
            window.refreshKeypadCanvas();
          }, 30);
        } else {
          checkRenderingState();
        }
      });
    });

    // MutationObserver on #tab-tech-stack to automatically detect class change to 'active'
    const techStackPane = document.getElementById('tab-tech-stack');
    if (techStackPane && typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(m => {
          if (m.attributeName === 'class') {
            const isActive = techStackPane.classList.contains('active');
            if (isActive) {
              window.refreshKeypadCanvas();
            } else {
              checkRenderingState();
            }
          }
        });
      });
      observer.observe(techStackPane, { attributes: true });
    }

    checkRenderingState();
    renderer.render(scene, camera);
    } catch (err) {
      window.__KEYPAD_ERROR__ = (err && err.stack) ? err.stack : String(err);
      console.error("KEYPAD INIT ERROR:", err);
    }
  }

  let keypadInitialized = false;
  let keypadInitPromise = null;

  function startKeypadInit() {
    if (keypadInitPromise) return keypadInitPromise;
    keypadInitPromise = new Promise((resolve) => {
      if (keypadInitialized) {
        resolve();
        return;
      }
      keypadInitialized = true;
      try {
        initKeypad();
      } catch (err) {
        console.error("Keypad init error:", err);
      }
      resolve();
    });
    return keypadInitPromise;
  }

  // Expose prewarm function for Stage 2 (quiet background load on Home screen)
  if (typeof window !== 'undefined') {
    window.prewarmKeypad = startKeypadInit;

    // Safety fallback: If user clicks Tech Stack tab before prewarm fires, initialize immediately
    const onTabReady = () => {
      document.querySelectorAll('.portfolio-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.getAttribute('data-tab') === 'tech-stack') {
            startKeypadInit();
          }
        });
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onTabReady);
    } else {
      onTabReady();
    }
  }
})();
