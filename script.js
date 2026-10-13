// Dados editáveis do site
const CONFIG = {
  // WhatsApp com DDI+DDD, só dígitos
  whatsapp: "553438428126",
  instagram: "https://www.instagram.com/onix.seg/",
  msgBase: "Olá! Vim pelo site e gostaria de um orçamento de segurança.",
  msgServico: (s) => `Olá! Vim pelo site e gostaria de um orçamento de ${s}.`,
};

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// Monta link do WhatsApp; sem número configurado, abre o seletor de contato com a mensagem pronta
function waLink(text) {
  const q = "?text=" + encodeURIComponent(text);
  return CONFIG.whatsapp ? `https://wa.me/${CONFIG.whatsapp}${q}` : `https://wa.me/${q}`;
}

function setupWhatsApp() {
  $$("[data-wa]").forEach((a) => {
    a.href = waLink(CONFIG.msgBase);
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$("[data-service]").forEach((card) => {
    const a = $("[data-wa-service]", card);
    a.href = waLink(CONFIG.msgServico(card.dataset.service));
    a.target = "_blank";
    a.rel = "noopener";
  });
  const n = CONFIG.whatsapp.replace(/^55/, "");
  if (n.length >= 10) {
    const label = `(${n.slice(0, 2)}) ${n.slice(2, -4)}-${n.slice(-4)}`;
    $$("[data-wa-label]").forEach((el) => { el.textContent = label; });
  }
}

function setupNav() {
  const nav = $(".nav");
  const toggle = $(".nav__toggle");
  const menu = $("#menu");
  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 20);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const close = () => { menu.hidden = true; toggle.setAttribute("aria-expanded", "false"); };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    menu.hidden = open;
  });
  $$("a", menu).forEach((a) => a.addEventListener("click", close));
}

function setupClock() {
  const el = $("[data-clock]");
  const tick = () => { el.textContent = new Date().toLocaleTimeString("pt-BR", { hour12: false }); };
  tick();
  setInterval(tick, 1000);
}

// Grade de sensores do hero, acesa pela passagem do feixe de varredura
function setupHeroGrid() {
  const canvas = $(".hero__grid");
  const beam = $(".hero__beam");
  const ctx = canvas.getContext("2d");
  const hero = canvas.parentElement;
  let w, h, dpr, dots = [], visible = true, raf;
  const period = 7000;

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = hero.clientWidth; h = hero.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gap = w < 640 ? 26 : 34;
    dots = [];
    for (let y = gap / 2; y < h; y += gap)
      for (let x = gap / 2; x < w; x += gap)
        dots.push({ x, y, cross: Math.random() < 0.06, glow: 0 });
  }

  function beamX(t) {
    const p = (t % period) / period;
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    return -0.4 * w + e * 1.5 * w;
  }

  function draw(t) {
    const bx = reduced ? -9999 : beamX(t) + w * 0.34;
    if (!reduced) beam.style.transform = `translateX(${bx - beam.offsetWidth}px)`;
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      const dx = bx - d.x;
      const hit = dx > 0 && dx < 180 ? 1 - dx / 180 : 0;
      d.glow = Math.max(hit, d.glow * 0.985);
      const a = 0.12 + d.glow * 0.85;
      ctx.fillStyle = d.glow > 0.05 ? `rgba(110,232,236,${a})` : "rgba(170,195,215,.12)";
      if (d.cross) {
        ctx.fillRect(d.x - 4, d.y - 0.5, 8, 1);
        ctx.fillRect(d.x - 0.5, d.y - 4, 1, 8);
      } else {
        ctx.fillRect(d.x - 0.75, d.y - 0.75, 1.5, 1.5);
      }
    }
  }

  function loop(t) {
    draw(t);
    raf = visible && !document.hidden ? requestAnimationFrame(loop) : null;
  }
  const start = () => { if (!raf && !reduced) raf = requestAnimationFrame(loop); };

  resize();
  beam.style.animation = "none";
  if (reduced) { beam.style.display = "none"; draw(0); }
  else start();

  let rt;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { resize(); if (reduced) draw(0); }, 150); });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }).observe(hero);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && visible) start(); });
}

// Inclinação 3D leve nos cards, com brilho seguindo o cursor
function setupTilt() {
  if (reduced || !finePointer) return;
  $$("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.classList.add("is-tilting");
      card.style.setProperty("--ry", `${(px - 0.5) * 10}deg`);
      card.style.setProperty("--rx", `${(0.5 - py) * 8}deg`);
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
    });
    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-tilting");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}

function setupAnimations() {
  if (!window.gsap || !window.ScrollTrigger) { document.documentElement.classList.remove("has-gsap"); return; }
  gsap.registerPlugin(ScrollTrigger);

  if (reduced) {
    gsap.set("[data-hero], [data-reveal], [data-stagger] > *", { opacity: 1 });
    $$(".card").forEach((c) => c.classList.add("is-drawn"));
    gsap.set(".steps__fill", { scaleX: 1, scaleY: 1 });
    $$("[data-step]").forEach((s) => s.classList.add("is-on"));
    return;
  }

  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".hero__frame .c", { scale: 1.6, opacity: 0, duration: 0.9, stagger: 0.06 })
    .fromTo("[data-hero]", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.12 }, "-=0.6")
    .from(".hud", { opacity: 0, duration: 0.6 }, "-=0.6");

  $$("[data-reveal]").forEach((el) => {
    gsap.fromTo(el, { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
  });

  $$("[data-stagger]").forEach((group) => {
    gsap.fromTo(group.children, { y: 48, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.09,
      scrollTrigger: { trigger: group, start: "top 82%", once: true },
      onStart: () => $$(".card", group).forEach((c, i) => setTimeout(() => c.classList.add("is-drawn"), i * 90)),
    });
  });

  // Linha do "como funciona" preenche com a rolagem e acende cada passo
  const steps = $$("[data-step]");
  gsap.matchMedia().add({ desk: "(min-width: 1000px)", mob: "(max-width: 999px)" }, (ctx) => {
    const prop = ctx.conditions.desk ? "scaleX" : "scaleY";
    gsap.fromTo(".steps__fill", { [prop]: 0 }, {
      [prop]: 1, ease: "none",
      scrollTrigger: {
        trigger: ".steps-wrap", start: "top 75%", end: "bottom 60%", scrub: 0.6,
        onUpdate: (st) => steps.forEach((s, i) => s.classList.toggle("is-on", st.progress >= i / steps.length + 0.02)),
      },
    });
    steps.forEach((s) => gsap.fromTo(s, { opacity: 0, y: 24 }, {
      opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: s, start: "top 85%", once: true },
    }));
  });

  gsap.fromTo(".why__gem-edge", { strokeDashoffset: 600 }, {
    strokeDashoffset: 0, duration: 2.4, ease: "power2.inOut",
    scrollTrigger: { trigger: ".why__gem", start: "top 85%", once: true },
  });

  gsap.to(".footer__word", {
    yPercent: -12, ease: "none",
    scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true },
  });
}

// Validação no front e envio da mensagem montada para o WhatsApp
function setupForm() {
  const form = $("#form");
  const status = $(".form__status", form);
  form.style.setProperty("--fh", form.offsetHeight + "px");

  const rules = {
    nome: (v) => v.trim().length >= 2 || "Informe seu nome.",
    telefone: (v) => { const d = v.replace(/\D/g, ""); return (d.length >= 10 && d.length <= 13) || "Informe um telefone com DDD."; },
    cidade: (v) => v.trim().length >= 2 || "Informe sua cidade.",
    servico: (v) => !!v || "Escolha um serviço.",
    mensagem: (v) => v.trim().length >= 5 || "Conte um pouco do que você precisa.",
  };

  function check(input) {
    const res = rules[input.name]?.(input.value);
    const field = input.closest(".field");
    const err = $(".field__err", field);
    const ok = res === true || res === undefined;
    field.classList.remove("is-invalid");
    if (!ok) { void field.offsetWidth; field.classList.add("is-invalid"); }
    err.textContent = ok ? "" : res;
    input.setAttribute("aria-invalid", String(!ok));
    return ok;
  }

  // Máscara simples de telefone (DDD) 9 0000-0000
  const tel = $("#f-tel");
  tel.addEventListener("input", () => {
    const d = tel.value.replace(/\D/g, "").slice(0, 11);
    let out = d;
    if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    tel.value = out;
  });

  const fields = $$("input, select, textarea", form);
  fields.forEach((el) => {
    el.addEventListener("blur", () => el.value && check(el));
    el.addEventListener("input", () => el.closest(".field").classList.contains("is-invalid") && check(el));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!fields.map(check).every(Boolean)) { fields.find((f) => f.getAttribute("aria-invalid") === "true")?.focus(); return; }

    const v = Object.fromEntries(new FormData(form));
    const text = [
      "Olá! Vim pelo site e gostaria de um orçamento.",
      "",
      `*Nome:* ${v.nome.trim()}`,
      `*Telefone:* ${v.telefone.trim()}`,
      `*Cidade:* ${v.cidade.trim()}`,
      `*Serviço:* ${v.servico}`,
      `*Mensagem:* ${v.mensagem.trim()}`,
    ].join("\n");
    const url = waLink(text);
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else location.href = url;

    status.hidden = false;
    status.className = "form__status is-ok";
    status.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" opacity=".4"/><path class="check" d="m7.5 12.5 3 3 6-6.5"/></svg><span>Abrimos o WhatsApp com a sua mensagem pronta. É só tocar em enviar.</span>';
    void status.offsetWidth;
    status.classList.add("pop");
  });
}

$$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
setupWhatsApp();
setupNav();
setupClock();
setupHeroGrid();
setupTilt();
setupForm();
setupAnimations();
