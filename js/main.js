/**
 * FlashNet - Main JavaScript Engine
 * Handles all interactive elements, animations, and dynamic content.
 */

document.addEventListener("DOMContentLoaded", () => {
  /* --- 1. SYNAPTIC GRID PULSE ENGINE --- */
  const initGridPulses = () => {
    const container = document.querySelector(".grid-overlay");
    const GRID_SIZE = 50;

    if (!container) return;

    // Spawn rate for synaptic network effect
    setInterval(() => {
      spawnPulse(container, GRID_SIZE);
    }, 1200);
  };

  const spawnPulse = (container, gridSize) => {
    const pulse = document.createElement("div");
    pulse.classList.add("grid-pulse");

    const distance = Math.random() * 800 + 600;
    const duration = Math.random() * 1800 + 1800;

    const maxX = window.innerWidth;
    const maxY = window.innerHeight;

    const startX = Math.floor(Math.random() * (maxX / gridSize)) * gridSize;
    const startY = Math.floor(Math.random() * (maxY / gridSize)) * gridSize;

    const glowIntensity = Math.random() * 0.4 + 0.8;
    const glowColor = `rgba(0, 224, 31, ${glowIntensity})`;
    const rayLength = 300;

    pulse.style.height = "1px";
    pulse.style.width = rayLength + "px";
    pulse.style.top = startY + "px";
    pulse.style.left = startX + "px";

    pulse.style.background = `linear-gradient(90deg, 
            transparent 0%, 
            rgba(0, 224, 31, 0.1) 10%,
            rgba(0, 224, 31, 0.8) 85%,
            rgba(255, 255, 255, 1) 98%,
            #00E01F 100%)`;
    pulse.style.boxShadow = `
            0 0 15px ${glowColor}, 
            0 0 30px rgba(0, 224, 31, 0.4),
            -5px 0 20px rgba(0, 224, 31, 0.2)`;
    pulse.style.mixBlendMode = "screen";

    const keyframes = [
      { transform: "translateX(0) scaleX(0.8)", opacity: 0 },
      { offset: 0.1, transform: "translateX(0) scaleX(1)", opacity: 0.8 },
      { offset: 0.2, opacity: 1, filter: "brightness(1.5)" },
      { offset: 0.8, opacity: 1, filter: "brightness(1)" },
      { offset: 0.95, opacity: 0.5 },
      { transform: `translateX(${distance}px) scaleX(0.8)`, opacity: 0 },
    ];

    pulse.animate(keyframes, {
      duration: duration,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    }).onfinish = () => pulse.remove();

    container.appendChild(pulse);
  };

  initGridPulses();

  /* --- 2. HERO SLIDER LOGIC --- */
  const initHeroSlider = () => {
    const textSlides = document.querySelectorAll(".hero-slide");
    const imageSlides = document.querySelectorAll(".hero-visual img");
    if (!textSlides.length) return;

    let currentSlide = 0;
    const rotateInterval = 12000;

    const typeWriter = (element) => {
      const text = element.getAttribute("data-text");
      if (!text) return;

      let i = 0;
      element.textContent = "";
      element.classList.add("typing");

      function type() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, Math.floor(Math.random() * 40) + 30);
        } else {
          element.classList.remove("typing");
        }
      }
      type();
    };

    const showSlide = (index) => {
      textSlides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
        if (imageSlides[i])
          imageSlides[i].classList.toggle("active", i === index);

        if (i === index) {
          const tagline = slide.querySelector(".hero-mono");
          if (tagline) typeWriter(tagline);
        }
      });
    };

    showSlide(0);

    setInterval(() => {
      currentSlide = (currentSlide + 1) % textSlides.length;
      showSlide(currentSlide);
    }, rotateInterval);
  };

  initHeroSlider();

  /* --- 3. REVEAL ANIMATIONS (Intersection Observer) --- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.1 },
  );

  document
    .querySelectorAll(".reveal")
    .forEach((el) => revealObserver.observe(el));

  /* --- 4. PARALLAX EFFECTS --- */
  window.addEventListener(
    "scroll",
    () => {
      const scrolled = window.scrollY;

      // Hero visual parallax
      const heroVisual = document.querySelector(".hero-visual");
      if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
      }

      // Grid parallax
      const gridOverlay = document.querySelector(".grid-overlay");
      if (gridOverlay) {
        gridOverlay.style.backgroundPositionY = `${scrolled * 0.15}px`;
      }
    },
    { passive: true },
  );

  // Mouse movement parallax for interactive cards
  document.addEventListener("mousemove", (e) => {
    const cards = document.querySelectorAll(".obsidian-card");
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    cards.forEach((card, index) => {
      const speed = (index + 1) * 20;
      card.style.transform = `translate(${x * speed}px, ${y * speed}px) rotate(${
        x * 5
      }deg)`;
    });
  });

  /* --- 5. REVIEWS CAROUSEL --- */
  const reviewsData = [
    { name: "Edgar D.", initials: "ED", text: "Excelente" },
    { name: "Juan M.", initials: "JM", text: "Buen servicio" },
    {
      name: "Dinámica Despachos",
      initials: "Dd",
      text: "Excelente servicio, 10 puntos.",
    },
  ];

  let currentReviewIndex = 0;
  let reviewInterval;

  const renderReviews = () => {
    const container = document.getElementById("google-reviews-container");
    const dotsContainer = document.getElementById("review-dots");
    if (!container || !dotsContainer) return;

    container.innerHTML = "";
    dotsContainer.innerHTML = "";

    reviewsData.forEach((review, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "review-card-wrapper";

      wrapper.innerHTML = `
                <div class="review-card">
                    <span class="neon-border"></span>
                    <div class="review-card-header">
                        <div class="review-avatar">${review.initials}</div>
                        <div><h4 class="review-name">${review.name}</h4></div>
                        <svg class="review-quote-icon" width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    </div>
                    <p class="review-text">"${review.text}"</p>
                </div>
            `;
      container.appendChild(wrapper);

      const dot = document.createElement("div");
      dot.className = `review-dot ${index === 0 ? "active" : ""}`;
      dot.addEventListener("click", () => goToReview(index));
      dotsContainer.appendChild(dot);
    });

    startReviewTimer();
  };

  window.moveReview = (step) => {
    goToReview(
      (currentReviewIndex + step + reviewsData.length) % reviewsData.length,
    );
  };

  const goToReview = (index) => {
    currentReviewIndex = index;
    const container = document.getElementById("google-reviews-container");
    const dots = document.querySelectorAll(".review-dot");

    if (container) container.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    resetReviewTimer();
  };

  const startReviewTimer = () => {
    clearInterval(reviewInterval);
    reviewInterval = setInterval(() => moveReview(1), 8000);
  };

  const resetReviewTimer = () => {
    startReviewTimer();
  };

  // Swipe Gestures for Reviews
  const initSwipeGestures = () => {
    const container = document.querySelector(".reviews-carousel-viewport");
    if (!container) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const minSwipeDistance = 50;

    container.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        resetReviewTimer();
      },
      { passive: true },
    );

    container.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (
          Math.abs(deltaX) > minSwipeDistance &&
          Math.abs(deltaX) > Math.abs(deltaY)
        ) {
          if (deltaX > 0) moveReview(-1);
          else moveReview(1);
        }
        startReviewTimer();
      },
      { passive: true },
    );
  };

  renderReviews();
  initSwipeGestures();

  /* --- 6. HACKER TEXT ENGINE --- */
  class HackerText {
    constructor(el) {
      this.el = el;
      this.chars = "01!<>-_\\/[]{}—=+*^?#________01010101";
      this.originalText = el.dataset.text || el.textContent;
      this.hackerColor = el.dataset.hackerColor || "var(--flash-green)";
      this.el.textContent = this.originalText;
      this.update = this.update.bind(this);
    }

    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => (this.resolve = resolve));
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || "";
        const to = newText[i] || "";
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }

    update() {
      let output = "";
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.chars[Math.floor(Math.random() * this.chars.length)];
            this.queue[i].char = char;
          }
          output += `<span style="color: ${this.hackerColor};">${char}</span>`;
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
  }

  document.querySelectorAll(".hacker-text").forEach((el) => {
    const fx = new HackerText(el);
    const triggerEffect = () => {
      fx.setText(fx.originalText).then(() => {
        setTimeout(triggerEffect, 12000);
      });
    };
    setTimeout(triggerEffect, 1000);
  });

  /* --- 7. TYPING EFFECT SYSTEM --- */
  document.querySelectorAll(".typing-effect").forEach((el) => {
    const originalHTML = el.innerHTML;
    const originalText = el.textContent;

    const triggerTyping = () => {
      el.textContent = "";
      let i = 0;
      const type = () => {
        if (i < originalText.length) {
          el.textContent += originalText.charAt(i);
          i++;
          setTimeout(type, 30 + Math.random() * 50);
        } else {
          el.innerHTML = originalHTML;
          setTimeout(triggerTyping, 15000);
        }
      };
      type();
    };
    triggerTyping();
  });

  /* --- 8. ELECTRIC BORDER CANVAS --- */
  const initElectricBorder = () => {
    const ebContainer = document.getElementById("recommended-plan-card");
    const ebCanvas = ebContainer?.querySelector(".eb-canvas");
    if (!ebContainer || !ebCanvas) return;

    const ctx = ebCanvas.getContext("2d");
    let time = 0;
    let lastFrameTime = 0;
    let isAnimating = false;
    let animationId = null;
    const speed = 1.8;
    const chaos = 0.08;
    const color = "#00E01F";

    const random = (x) => (Math.sin(x * 12.9898) * 43758.5453) % 1;
    const noise2D = (x, y) => {
      const i = Math.floor(x),
        j = Math.floor(y);
      const fx = x - i,
        fy = y - j;
      const a = random(i + j * 57),
        b = random(i + 1 + j * 57);
      const c = random(i + (j + 1) * 57),
        d = random(i + 1 + (j + 1) * 57);
      const ux = fx * fx * (3.0 - 2.0 * fx),
        uy = fy * fy * (3.0 - 2.0 * fy);
      return (
        a * (1 - ux) * (1 - uy) +
        b * ux * (1 - uy) +
        c * (1 - ux) * uy +
        d * ux * uy
      );
    };

    const octavedNoise = (
      x,
      octaves,
      lacunarity,
      gain,
      amp,
      freq,
      time,
      seed,
    ) => {
      let y = 0;
      for (let i = 0; i < octaves; i++) {
        y += amp * noise2D(freq * x + seed * 100, time * freq * 0.3);
        freq *= lacunarity;
        amp *= gain;
      }
      return y;
    };

    const getRoundedRectPoint = (t, l, tE, w, h, r) => {
      const sw = w - 2 * r,
        sh = h - 2 * r,
        ca = (Math.PI * r) / 2;
      const tp = 2 * sw + 2 * sh + 4 * ca,
        d = t * tp;
      let acc = 0;
      const gCP = (cX, cY, r, sA, aL, p) => ({
        x: cX + r * Math.cos(sA + p * aL),
        y: cY + r * Math.sin(sA + p * aL),
      });
      if (d <= acc + sw) return { x: l + r + ((d - acc) / sw) * sw, y: tE };
      acc += sw;
      if (d <= acc + ca)
        return gCP(
          l + w - r,
          tE + r,
          r,
          -Math.PI / 2,
          Math.PI / 2,
          (d - acc) / ca,
        );
      acc += ca;
      if (d <= acc + sh) return { x: l + w, y: tE + r + ((d - acc) / sh) * sh };
      acc += sh;
      if (d <= acc + ca)
        return gCP(l + w - r, tE + h - r, r, 0, Math.PI / 2, (d - acc) / ca);
      acc += ca;
      if (d <= acc + sw)
        return { x: l + w - r - ((d - acc) / sw) * sw, y: tE + h };
      acc += sw;
      if (d <= acc + ca)
        return gCP(l + r, tE + h - r, r, Math.PI, Math.PI / 2, (d - acc) / ca);
      acc += ca;
      if (d <= acc + sh) return { x: l, y: tE + h - r - ((d - acc) / sh) * sh };
      acc += sh;
      return gCP(l + r, tE + r, r, Math.PI, Math.PI / 2, (d - acc) / ca);
    };

    const updateSize = () => {
      const rect = ebContainer.getBoundingClientRect();
      const bO = 60;
      const w = rect.width + bO * 2,
        h = rect.height + bO * 2;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      ebCanvas.width = w * dpr;
      ebCanvas.height = h * dpr;
      ebCanvas.style.width = `${w}px`;
      ebCanvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h, bO };
    };

    let { w, h, bO } = updateSize();
    const draw = (currentTime) => {
      if (!isAnimating) return;
      const dT = (currentTime - lastFrameTime) / 1000;
      time += dT * speed || 0;
      lastFrameTime = currentTime;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const scale = 50,
        l = bO,
        tE = bO,
        bW = w - 2 * bO,
        bH = h - 2 * bO;
      const r = 0;
      const sC = Math.floor((2 * (bW + bH) + 2 * Math.PI * r) / 4);
      ctx.beginPath();
      for (let i = 0; i <= sC; i++) {
        const prog = i / sC,
          pt = getRoundedRectPoint(prog, l, tE, bW, bH, r);
        const xN = octavedNoise(prog * 12, 3, 2.0, 0.5, chaos, 12, time, 0);
        const yN = octavedNoise(prog * 12, 3, 2.0, 0.5, chaos, 12, time, 1);
        if (i === 0) ctx.moveTo(pt.x + xN * scale, pt.y + yN * scale);
        else ctx.lineTo(pt.x + xN * scale, pt.y + yN * scale);
      }
      ctx.stroke();
      animationId = requestAnimationFrame(draw);
    };

    new ResizeObserver(() => {
      const s = updateSize();
      w = s.w;
      h = s.h;
      bO = s.bO;
    }).observe(ebContainer);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isAnimating) {
              isAnimating = true;
              lastFrameTime = performance.now();
              animationId = requestAnimationFrame(draw);
            }
          } else {
            isAnimating = false;
            if (animationId) cancelAnimationFrame(animationId);
          }
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(ebContainer);
  };

  initElectricBorder();

  /* --- 9. HAMBURGER MENU --- */
  const initHamburger = () => {
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const navMenu = document.getElementById("nav-menu");
    const mobileOverlay = document.getElementById("mobile-overlay");

    if (!hamburgerBtn || !navMenu || !mobileOverlay) return;

    const toggleMenu = () => {
      hamburgerBtn.classList.toggle("active");
      navMenu.classList.toggle("active");
      mobileOverlay.classList.toggle("active");
      document.body.style.overflow = navMenu.classList.contains("active")
        ? "hidden"
        : "";
    };

    hamburgerBtn.addEventListener("click", toggleMenu);
    mobileOverlay.addEventListener("click", toggleMenu);
    navMenu
      .querySelectorAll("a")
      .forEach((link) => link.addEventListener("click", toggleMenu));
  };

  initHamburger();

  /* --- 10. BACK TO TOP --- */
  const initBackToTop = () => {
    const backToTopBtn = document.getElementById("backToTop");
    if (!backToTopBtn) return;

    window.addEventListener(
      "scroll",
      () => {
        backToTopBtn.classList.toggle("active", window.scrollY > 300);
      },
      { passive: true },
    );

    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  initBackToTop();

  /* --- 11. MAP INITIALIZATION --- */
  const initMap = () => {
    if (typeof L === "undefined") return;

    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    const map = L.map("map", {
      zoomControl: false,
      dragging: !L.Browser.mobile,
      touchZoom: L.Browser.mobile,
      scrollWheelZoom: false,
    }).setView([-24.6628056, -56.4467222], 15);

    // CartoDB Positron (Light Mode)
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      },
    ).addTo(map);

    const boltIcon = L.divIcon({
      className: "custom-bolt-marker",
      html: `<div class="bolt-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg></div>`,
      iconSize: [50, 50],
      iconAnchor: [25, 25],
    });

    const marker = L.marker([-24.6628056, -56.4467222], {
      icon: boltIcon,
    }).addTo(map);
    marker.bindTooltip(
      `
            <h4 style="font-size: 1.3rem; color: #fff; margin: 0; font-weight: 800; letter-spacing: 0.5px;">FlashNet<span style="color: var(--flash-green);">py</span></h4>
            <div style="font-family: var(--font-mono); color: #888; font-size: 0.75rem; letter-spacing: 1px; text-transform: uppercase;">oficina principal</div>
        `,
      {
        permanent: false,
        direction: "top",
        offset: [0, -25],
        className: "custom-map-tooltip",
      },
    );

    L.control.zoom({ position: "bottomright" }).addTo(map);
  };

  // Delay map init slightly for smoother page load
  setTimeout(initMap, 500);

  /* --- 12. PREMIUM CTA AND BUTTON EFFECTS --- */
  // Hero CTA Interactivity
  const heroBtn = document.querySelector(".hero-cta .btn-primary");
  if (heroBtn) {
    heroBtn.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href?.startsWith("#")) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }

  // Ripple and Data Flow effects for service buttons
  document.querySelectorAll(".service-text .btn-primary").forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      ripple.className = "ripple-effect";
      // Styles are handled in CSS now
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
});
