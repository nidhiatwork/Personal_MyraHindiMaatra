/* =========================================================================
   Myra's Hindi Maatra Adventure — engine (vanilla JS)
   Big ideas:
   • Everything is tappable to HEAR it (Hindi TTS, hi-IN, slow & clear).
   • Optional 🎤 "bolo" lets Myra SAY a word (very lenient, always encouraging).
   • 31 lessons unlock one-per-day (date-based, robust) + daily automation push.
   • 6 kid games, stars, confetti, weekly badges, graduation certificate.
   ========================================================================= */
(function () {
  "use strict";

  const APP = window.APP_CONFIG;
  const DAYS = window.CURRICULUM;
  const $app = document.getElementById("app");
  const $footer = document.getElementById("footer");
  const $toast = document.getElementById("toast");
  const STORE_KEY = "myra_hindi_v1";
  const PRAISE = ["शाबाश!", "बहुत बढ़िया!", "वाह!", "कमाल!", "सुपर!"];
  const OOPS = ["फिर से सुनो", "अच्छी कोशिश!", "एक बार और"];
  const CONFETTI_COLORS = ["#ff5d8f", "#ffd23f", "#38b6ff", "#37c871", "#7c4dff", "#ff922b"];

  /* ---------------- persistent progress (stars / completed) -------------- */
  let state = load();
  function load() {
    try { return Object.assign({ completed: {}, stars: {}, total: 0 }, JSON.parse(localStorage.getItem(STORE_KEY) || "{}")); }
    catch (e) { return { completed: {}, stars: {}, total: 0 }; }
  }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} }
  function addStars(day, n) {
    state.stars[day] = Math.max(state.stars[day] || 0, (state.stars[day] || 0)); // keep best
    state.total = (state.total || 0) + n;
    save();
  }

  /* ---------------- daily unlock (date-based + progress.json) ------------ */
  let serverProgress = null;
  function daysSinceStart() {
    const s = new Date(APP.startDate + "T00:00:00");
    const now = new Date();
    const d0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.floor((d0 - new Date(s.getFullYear(), s.getMonth(), s.getDate())) / 86400000);
  }
  function unlockedDay() {
    const dateBased = Math.min(APP.totalDays, Math.max(1, daysSinceStart() + 1));
    const pushed = serverProgress && serverProgress.unlockedDay ? serverProgress.unlockedDay : 1;
    return Math.min(APP.totalDays, Math.max(dateBased, pushed));
  }

  /* ---------------- date labels (Myra wants real dates, not Day N) ------- */
  const HI_MONTHS = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
  const HI_MONTHS_SHORT = ["जन", "फ़र", "मार्च", "अप्रैल", "मई", "जून", "जुल", "अग", "सित", "अक्टू", "नव", "दिस"];
  const HI_DOW = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
  const HI_DOW_SHORT = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
  function dateForDay(dayNum) {
    const s = new Date(APP.startDate + "T00:00:00");
    return new Date(s.getFullYear(), s.getMonth(), s.getDate() + (dayNum - 1));
  }
  function fmtDateShort(dt) { return dt.getDate() + " " + HI_MONTHS_SHORT[dt.getMonth()]; }
  function fmtDateLong(dt) { return HI_DOW_SHORT[dt.getDay()] + ", " + dt.getDate() + " " + HI_MONTHS[dt.getMonth()]; }

  /* ------------------------------ Speech (TTS) --------------------------- */
  let hiVoice = null;
  function pickVoice() {
    const vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    hiVoice = vs.find(v => /hi[-_]?IN/i.test(v.lang)) || vs.find(v => /^hi/i.test(v.lang)) ||
              vs.find(v => /hindi/i.test(v.name)) || null;
  }
  if (window.speechSynthesis) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }
  function speak(text, opts) {
    if (!window.speechSynthesis || !text) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "hi-IN";
      if (hiVoice) u.voice = hiVoice;
      u.rate = (opts && opts.rate) || 0.78;   // slower for a young learner
      u.pitch = (opts && opts.pitch) || 1.12;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  const praise = () => PRAISE[Math.floor(Math.random() * PRAISE.length)];

  /* ------------------------- Speech recognition (STT) -------------------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const canListen = !!SR;
  function listenOnce(onDone) {
    if (!canListen) { onDone(null); return; }
    let rec;
    try { rec = new SR(); } catch (e) { onDone(null); return; }
    rec.lang = "hi-IN"; rec.interimResults = false; rec.maxAlternatives = 3;
    let got = false;
    rec.onresult = (ev) => {
      got = true;
      const alts = [];
      for (let i = 0; i < ev.results[0].length; i++) alts.push(ev.results[0][i].transcript);
      onDone(alts);
    };
    rec.onerror = () => { if (!got) onDone(null); };
    rec.onend = () => { if (!got) onDone(null); };
    try { rec.start(); } catch (e) { onDone(null); }
  }
  function looseMatch(said, target) {
    if (!said) return false;
    const norm = s => (s || "").replace(/[\s।.,!?]/g, "");
    const t = norm(target);
    return said.some(a => { const x = norm(a); return x && (x === t || x.indexOf(t) >= 0 || t.indexOf(x) >= 0); });
  }

  /* ------------------------------ helpers -------------------------------- */
  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
  function sample(arr, n, exclude) { return shuffle(arr.filter(x => x !== exclude)).slice(0, n); }
  function graphemes(str) {
    if (window.Intl && Intl.Segmenter) {
      try { return Array.from(new Intl.Segmenter("hi", { granularity: "grapheme" }).segment(str), s => s.segment); } catch (e) {}
    }
    const out = [], comb = /[\u0900-\u0903\u093A-\u094F\u0951-\u0957\u0962\u0963\u093C\u200D]/;
    for (const ch of str) { if (out.length && comb.test(ch)) out[out.length - 1] += ch; else out.push(ch); }
    return out;
  }
  let toastTimer;
  function toast(msg, ok) {
    $toast.textContent = msg;
    $toast.className = "toast show" + (ok === false ? " oops" : "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $toast.className = "toast"; }, 1200);
  }
  function confetti(n) {
    n = n || 30;
    for (let i = 0; i < n; i++) {
      const c = el("div", "confetti");
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      c.style.animationDuration = (1.6 + Math.random() * 1.4) + "s";
      c.style.animationDelay = (Math.random() * 0.3) + "s";
      c.style.transform = "rotate(" + (Math.random() * 360) + "deg)";
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 3200);
    }
  }
  function celebrate(msg) { confetti(40); toast(msg || praise(), true); }

  /* ------------------------------ speak buttons -------------------------- */
  function speakBtn(text, label, cls) {
    const b = el("button", "btn " + (cls || "speak"), (label || "🔊 सुनो"));
    b.onclick = () => speak(text);
    return b;
  }
  function micBtn(target, onResult) {
    if (!canListen) return null;
    const b = el("button", "icn mc", "🎤");
    b.title = "बोलो";
    b.onclick = () => {
      b.textContent = "👂";
      speak(target, { rate: 0.85 });
      setTimeout(() => listenOnce((alts) => {
        b.textContent = "🎤";
        const ok = looseMatch(alts, target);
        if (ok) { celebrate("शाबाश! 🎉"); speak(praise()); }
        else { toast("अच्छी कोशिश! 👍", true); }
        if (onResult) onResult(ok);
      }), 700);
    };
    return b;
  }

  /* ======================================================================
     HANDWRITING  —  trace a letter/maatra, then a real (lenient) check
     • Prompts come from the day's syllables (letter + today's maatra),
       the day's plain letters (day 1), or short words (review/word days).
     • A faint guide is drawn to TRACE over. Assessment renders the target
       glyph to offscreen masks and scores coverage + how much ink stayed
       inside the letter — forgiving, always encouraging for a 5-year-old.
     ==================================================================== */
  const WRITE_FONT = "700 210px 'Tiro Devanagari Hindi','Nirmala UI','Noto Sans Devanagari',serif";
  const HI_MAATRA_NAME = {
    "ा": "आ की मात्रा", "ि": "छोटी इ की मात्रा", "ी": "बड़ी ई की मात्रा",
    "ु": "छोटे उ की मात्रा", "ू": "बड़े ऊ की मात्रा", "े": "ए की मात्रा",
    "ै": "ऐ की मात्रा", "ो": "ओ की मात्रा", "ौ": "औ की मात्रा",
    "ं": "अनुस्वार (बिंदी)", "ँ": "चंद्रबिंदु"
  };
  function buildWritePrompts(d) {
    const out = [];
    const hasMaatra = !!(d.maatra && d.maatra.length);
    if (hasMaatra) {
      let list = (d.syllables || []).filter(s => s.s.indexOf(d.maatra) >= 0);
      if (!list.length) list = (d.syllables || []).slice();
      list.slice(0, 6).forEach(s => {
        const base = s.s.split(d.maatra).join("");
        const nm = HI_MAATRA_NAME[d.maatra] || (d.sound + " की मात्रा");
        out.push({
          target: s.s, roman: s.r,
          hint: base + " + " + d.maatra + " → " + s.s,
          label: base + " पे " + nm + " लगाओ — " + s.s,
          speak: base + " के साथ " + d.sound + " की मात्रा लगाओ। " + s.s + " लिखो।"
        });
      });
    } else if (d.letters && d.letters.length) {
      shuffle(d.letters).slice(0, 7).forEach(ch => out.push({
        target: ch, roman: "", hint: ch + " लिखो", label: ch + " लिखो",
        speak: ch + "। " + ch + " लिखो।"
      }));
    } else {
      const short = (d.words || []).filter(w => graphemes(w.w).length <= 4);
      shuffle(short.length ? short : (d.words || [])).slice(0, 6).forEach(w => out.push({
        target: w.w, roman: w.r, hint: w.w + "  (" + w.r + ")", label: w.w + " लिखो",
        speak: w.w + " लिखो।"
      }));
    }
    return out;
  }
  function buildWritePad(target) {
    const S = 300;
    const wrap = el("div", "write-pad");
    const canvas = el("canvas", "wp-draw");
    canvas.width = S; canvas.height = S;
    wrap.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    function guide() {
      ctx.clearRect(0, 0, S, S);
      ctx.save();
      ctx.globalAlpha = 0.15; ctx.fillStyle = "#7c4dff";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = WRITE_FONT;
      ctx.fillText(target, S / 2, S / 2 + 8);
      ctx.restore();
    }
    guide();
    function maskOf(build) {
      const c = document.createElement("canvas"); c.width = S; c.height = S;
      const x = c.getContext("2d");
      x.textAlign = "center"; x.textBaseline = "middle"; x.font = WRITE_FONT;
      x.fillStyle = "#000"; x.strokeStyle = "#000"; x.lineJoin = "round";
      build(x); return x.getImageData(0, 0, S, S).data;
    }
    const core = maskOf(x => x.fillText(target, S / 2, S / 2 + 8));
    const band = maskOf(x => { x.lineWidth = 46; x.strokeText(target, S / 2, S / 2 + 8); x.fillText(target, S / 2, S / 2 + 8); });
    const fatC = document.createElement("canvas"); fatC.width = S; fatC.height = S;
    const fx = fatC.getContext("2d"); fx.strokeStyle = "#000"; fx.lineWidth = 40; fx.lineCap = "round"; fx.lineJoin = "round";
    const inkC = document.createElement("canvas"); inkC.width = S; inkC.height = S;
    const ix = inkC.getContext("2d"); ix.strokeStyle = "#000"; ix.lineWidth = 16; ix.lineCap = "round"; ix.lineJoin = "round";
    let down = false, lx = 0, ly = 0;
    function P(e) { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * (S / r.width), y: (e.clientY - r.top) * (S / r.height) }; }
    function seg(x1, y1, x2, y2) {
      ctx.strokeStyle = "#ff2e88"; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      fx.beginPath(); fx.moveTo(x1, y1); fx.lineTo(x2, y2); fx.stroke();
      ix.beginPath(); ix.moveTo(x1, y1); ix.lineTo(x2, y2); ix.stroke();
    }
    canvas.style.touchAction = "none";
    canvas.addEventListener("pointerdown", e => { e.preventDefault(); down = true; const p = P(e); lx = p.x; ly = p.y; seg(lx, ly, lx + 0.01, ly + 0.01); try { canvas.setPointerCapture(e.pointerId); } catch (_) { } });
    canvas.addEventListener("pointermove", e => { if (!down) return; e.preventDefault(); const p = P(e); seg(lx, ly, p.x, p.y); lx = p.x; ly = p.y; });
    const up = () => { down = false; };
    canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up); canvas.addEventListener("pointerleave", up);
    function clear() { guide(); fx.clearRect(0, 0, S, S); ix.clearRect(0, 0, S, S); }
    function assess() {
      const F = fx.getImageData(0, 0, S, S).data, I = ix.getImageData(0, 0, S, S).data;
      let coreN = 0, cov = 0, inkN = 0, ins = 0;
      for (let i = 3; i < core.length; i += 4) {
        if (core[i] > 40) { coreN++; if (F[i] > 40) cov++; }
        if (I[i] > 40) { inkN++; if (band[i] > 40) ins++; }
      }
      const coverage = coreN ? cov / coreN : 0;
      const inside = inkN ? ins / inkN : 0;
      const enough = inkN >= coreN * 0.12;
      return { ok: enough && coverage >= 0.55 && inside >= 0.45, coverage: coverage, inside: inside, ink: inkN, need: coreN };
    }
    return { wrap: wrap, clear: clear, assess: assess };
  }

  /* ======================================================================
     TRANSLATE  —  hear/read an English sentence, SAY it in Hindi, get graded
     • 10 easy sentences a day, generated from THIS day's own words so the
       vocabulary is always something Myra has met (plus a global easy bank).
     • Uses the browser's Hindi speech recognition; lenient word-overlap match.
     ==================================================================== */
  const EASY_TR = [
    { en: "This is a mango.", hi: "यह आम है।", key: "आम" },
    { en: "That is a house.", hi: "वह घर है।", key: "घर" },
    { en: "I like milk.", hi: "मुझे दूध पसंद है।", key: "दूध" },
    { en: "Give me water.", hi: "मुझे पानी दो।", key: "पानी" },
    { en: "The cow is here.", hi: "गाय यहाँ है।", key: "गाय" },
    { en: "This is my book.", hi: "यह मेरी किताब है।", key: "किताब" },
    { en: "Look, the moon!", hi: "देखो, चाँद!", key: "चाँद" },
    { en: "I have a flower.", hi: "मेरे पास फूल है।", key: "फूल" },
    { en: "Where is the cat?", hi: "बिल्ली कहाँ है?", key: "बिल्ली" },
    { en: "The elephant is big.", hi: "हाथी बड़ा है।", key: "हाथी" },
    { en: "I see a bird.", hi: "मुझे चिड़िया दिखती है।", key: "चिड़िया" },
    { en: "The apple is red.", hi: "सेब लाल है।", key: "सेब" }
  ];
  const TR_SKIP = new Set(["यह", "वह", "है", "और", "में", "को", "से", "नहीं", "हाँ", "क्या", "मैं", "तुम", "हम", "मेरा", "तेरा", "अच्छा", "बड़ा", "छोटा", "दो", "गिन", "सुन", "मिल", "तैर", "बैठ", "कैसा", "सौ", "आठ", "तीन", "एक", "पाँच", "नौ", "गोल", "बुरा", "पक्का", "होशियार", "खुश", "दूर", "डर", "पर", "मन", "हल", "सुबह", "दावत", "नाम", "बधाई", "एक्सपर्ट", "शाबाश", "दोस्त", "बाहर", "जीवन", "जल", "काम", "आग", "रंग", "लाल", "नीला", "पीला", "हरा", "काला", "सफेद", "दौड़"]);
  function cleanMeaning(m) { return (m || "").split("/")[0].split("(")[0].trim(); }
  function buildTranslations(d) {
    const out = [], seen = new Set();
    const add = (en, hi, key) => { if (hi && en && !seen.has(hi)) { seen.add(hi); out.push({ en: en, hi: hi, key: key || "" }); } };
    (d.sentences || []).forEach(s => add(s.m, s.s, ""));
    const nouns = (d.words || []).filter(w => !TR_SKIP.has(w.w) && graphemes(w.w).length <= 5 && cleanMeaning(w.m));
    const art = m => (/^[aeiou]/i.test(m) ? "an " : "a ");
    const T = [
      w => ["This is " + art(cleanMeaning(w.m)) + cleanMeaning(w.m) + ".", "यह " + w.w + " है।"],
      w => ["That is " + art(cleanMeaning(w.m)) + cleanMeaning(w.m) + ".", "वह " + w.w + " है।"],
      w => ["I like the " + cleanMeaning(w.m) + ".", "मुझे " + w.w + " पसंद है।"],
      w => ["Give me the " + cleanMeaning(w.m) + ".", "मुझे " + w.w + " दो।"],
      w => ["Where is the " + cleanMeaning(w.m) + "?", w.w + " कहाँ है?"],
      w => ["The " + cleanMeaning(w.m) + " is here.", w.w + " यहाँ है।"],
      w => ["The " + cleanMeaning(w.m) + " is there.", w.w + " वहाँ है।"],
      w => ["I have " + art(cleanMeaning(w.m)) + cleanMeaning(w.m) + ".", "मेरे पास " + w.w + " है।"],
      w => ["This is my " + cleanMeaning(w.m) + ".", "यह मेरा " + w.w + " है।"],
      w => ["Look, " + art(cleanMeaning(w.m)) + cleanMeaning(w.m) + "!", "देखो, " + w.w + "!"]
    ];
    const pool = shuffle(nouns);
    let ti = 0;
    for (let i = 0; i < pool.length && out.length < 10; i++) { const pr = T[ti++ % T.length](pool[i]); add(pr[0], pr[1], pool[i].w); }
    const bank = shuffle(EASY_TR.slice());
    for (let i = 0; i < bank.length && out.length < 10; i++) add(bank[i].en, bank[i].hi, bank[i].key);
    return out.slice(0, 10);
  }
  function sentenceMatch(alts, hi, key) {
    if (!alts) return false;
    const norm = s => (s || "").replace(/[\s।._,!?'"“”|]/g, "");
    const expFull = norm(hi);
    const expWords = hi.replace(/[।._,!?]/g, " ").split(/\s+/).filter(Boolean).map(norm).filter(Boolean);
    const need = Math.max(2, Math.ceil(expWords.length * 0.5));
    const k = norm(key);
    return alts.some(a => {
      const x = norm(a); if (!x) return false;
      if (x === expFull || x.indexOf(expFull) >= 0 || expFull.indexOf(x) >= 0) return true;
      const hits = expWords.filter(w => x.indexOf(w) >= 0).length;
      if (k && x.indexOf(k) >= 0 && hits >= Math.min(need, 2)) return true;
      return hits >= need;
    });
  }

  /* =======================================================================
     HOME  —  the level map
     ===================================================================== */
  function renderHome() {
    window.scrollTo(0, 0);
    $app.innerHTML = "";
    const unlocked = unlockedDay();

    // top bar
    const top = el("div", "topbar");
    top.innerHTML =
      '<div class="who"><span class="av">🦜</span><div>' + APP.child.hindi +
      ' <small>' + APP.child.name + "'s Hindi</small></div></div>" +
      '<div class="stars-chip">⭐ ' + (state.total || 0) + "</div>";
    $app.appendChild(top);

    // mascot bubble
    const msg = (serverProgress && serverProgress.message) || ("नमस्ते " + APP.child.hindi + "! आज " + fmtDateLong(dateForDay(unlocked)) + " — चलो खेलें!");
    const mithu = el("div", "mithu");
    mithu.innerHTML = '<span class="bird">🦜</span><div class="bubble"><b>मिठू:</b> ' + msg + "</div>";
    mithu.onclick = () => speak(msg);
    $app.appendChild(mithu);

    // Today's new word (pushed daily by the automation)
    const bw = (serverProgress && serverProgress.bonusWord) || DAYS[unlocked - 1].words[0];
    const bonus = el("div", "bonus");
    bonus.innerHTML =
      '<div class="lbl">🌟 आज का नया शब्द · Today\'s Word</div>' +
      '<div class="bw"><span class="em">' + (bw.e || "✨") + '</span>' +
      '<div><div class="hw">' + bw.w + '</div><div class="ro">' + bw.r + " · " + (bw.m || "") + "</div></div></div>";
    const sayB = el("button", "btn speak say", "🔊 सुनो");
    sayB.onclick = () => speak(bw.w);
    bonus.appendChild(sayB);
    $app.appendChild(bonus);

    // Explore sections — open anytime (numbers, weekdays, months)
    $app.appendChild(el("div", "h", "🧭 सीखो और खोजो · Explore"));
    const ex = el("div", "explore");
    const exBtn = (cls, icon, hi, en, fn) => {
      const b = el("button", "exbtn " + cls, '<span class="exi">' + icon + '</span><span class="ext"><b>' + hi + '</b><small>' + en + '</small></span>');
      b.onclick = fn; return b;
    };
    ex.appendChild(exBtn("n", "🔢", "गिनती १–१००", "Numbers 1–100", renderNumbers));
    ex.appendChild(exBtn("d", "📅", "हफ़्ते के दिन", "Weekdays", renderWeekdays));
    ex.appendChild(exBtn("m", "🗓️", "साल के महीने", "Months", renderMonths));
    $app.appendChild(ex);

    // journey heading + big Play button for today
    $app.appendChild(el("div", "h", "🗺️ तुम्हारा सफ़र · Your Journey"));
    const play = el("button", "btn big next", "▶️ आज का पाठ · " + fmtDateLong(dateForDay(unlocked)));
    play.onclick = () => openDay(unlocked);
    $app.appendChild(play);

    // map grid
    const map = el("div", "map");
    DAYS.forEach((d) => {
      const done = !!state.completed[d.day];
      const isUnlocked = d.day <= unlocked;
      const isToday = d.day === unlocked;
      const glyph = d.maatra || ({ celebrate: "🎉", review: "🔁" }[d.kind]) || "📖";
      const label = d.maatra ? d.soundRoman : ({ celebrate: "Party", review: "Review" }[d.kind] || "Read");
      const node = el("div", "node " + (done ? "done " : "") + (isToday ? "today " : (isUnlocked ? "unlocked " : "locked ")) + d.kind);
      node.innerHTML =
        '<div class="dnum date">' + fmtDateShort(dateForDay(d.day)) + "</div>" +
        '<div class="dmt">' + glyph + "</div>" +
        '<div class="dlbl">' + label + "</div>" +
        (done ? '<span class="tick">✅</span>' : "") +
        (done && state.stars[d.day] ? '<span class="stars">' + "⭐".repeat(Math.min(3, state.stars[d.day])) + "</span>" : "");
      node.onclick = () => {
        if (isUnlocked) openDay(d.day);
        else { toast("यह " + fmtDateShort(dateForDay(d.day)) + " को खुलेगा 🔒", false); speak("यह पाठ बाद में खुलेगा"); }
      };
      map.appendChild(node);
    });
    $app.appendChild(map);
    renderFooter();
  }

  /* =======================================================================
     LESSON PLAYER
     ===================================================================== */
  function buildSteps(d) {
    const steps = ["meet"];
    if (d.syllables && d.syllables.length) steps.push("syllables");
    if (d.words && d.words.length) steps.push("words");
    steps.push("write");
    steps.push("game");
    steps.push("translate");
    steps.push("reward");
    return steps;
  }

  function openDay(dayNum) {
    const d = DAYS[dayNum - 1];
    const steps = buildSteps(d);
    let idx = 0;
    let earned = 0;

    function shell(bodyBuilder) {
      window.scrollTo(0, 0);
      $app.innerHTML = "";
      const head = el("div", "lesson-top");
      const back = el("button", "back", "←");
      back.onclick = renderHome;
      head.appendChild(back);
      head.appendChild(el("h2", null, d.title + "<small>" + fmtDateLong(dateForDay(d.day)) + " · " + d.titleEn + "</small>"));
      $app.appendChild(head);

      const dots = el("div", "dots");
      steps.forEach((s, i) => dots.appendChild(el("i", i === idx ? "on" : "")));
      $app.appendChild(dots);

      const stage = el("div", "stage");
      $app.appendChild(stage);
      bodyBuilder(stage);
      renderFooter();
    }
    function next() { idx++; if (idx < steps.length) render(); }
    function render() {
      const step = steps[idx];
      if (step === "meet") return stepMeet();
      if (step === "syllables") return stepSyllables();
      if (step === "words") return stepWords();
      if (step === "write") return stepWrite();
      if (step === "game") return stepGame();
      if (step === "translate") return stepTranslate();
      if (step === "reward") return stepReward();
    }

    /* ---- step: meet the maatra ---- */
    function stepMeet() {
      shell((stage) => {
        const m = el("div", "meet");
        const glyph = d.maatra || d.sound || "अ";
        m.innerHTML =
          '<div class="bigmt">' + glyph + "</div>" +
          '<div class="snd">आवाज़: “' + d.sound + "” <i>(" + d.soundRoman + ")</i></div>" +
          '<div class="desc">' + d.introEn + "</div>" +
          (d.tip ? '<div class="tip">💡 ' + d.tip + "</div>" : "");
        stage.appendChild(m);
        const row = el("div", "reward");
        row.appendChild(speakBtn(d.sound + "... " + d.intro, "🔊 मिठू से सुनो"));
        stage.appendChild(el("div", "", "<br>"));
        stage.appendChild(row);
        const nb = el("button", "btn big next", "आगे बढ़ो →");
        nb.onclick = next;
        stage.appendChild(nb);
        speak(d.sound + "। " + d.intro);
      });
    }

    /* ---- step: syllables ---- */
    function stepSyllables() {
      shell((stage) => {
        stage.appendChild(el("div", "game-q", "हर बटन दबाओ और आवाज़ सुनो 👂<br><small>Tap each to hear it</small>"));
        const chips = el("div", "chips");
        d.syllables.forEach((s) => {
          const c = el("button", "chip", s.s + "<small>" + s.r + "</small>");
          c.onclick = () => { speak(s.s); c.animate([{ transform: "scale(1)" }, { transform: "scale(1.18)" }, { transform: "scale(1)" }], { duration: 260 }); };
          chips.appendChild(c);
        });
        stage.appendChild(chips);
        const nb = el("button", "btn big next", "शब्द सीखो →");
        nb.onclick = next;
        stage.appendChild(el("div", "", "<br>"));
        stage.appendChild(nb);
      });
    }

    /* ---- step: words ---- */
    function stepWords() {
      shell((stage) => {
        stage.appendChild(el("div", "game-q", "शब्द पढ़ो 📚<br><small>Tap 🔊 to hear · 🎤 to say it</small>"));
        d.words.forEach((w) => {
          const card = el("div", "wordcard");
          card.innerHTML = '<span class="em">' + (w.e || "✨") + '</span>' +
            '<div class="txt"><div class="hw">' + w.w + '</div><div class="ro">' + w.r + '</div><div class="mn">' + (w.m || "") + "</div></div>";
          const acts = el("div", "acts");
          const sp = el("button", "icn sp", "🔊"); sp.onclick = () => speak(w.w);
          acts.appendChild(sp);
          const mc = micBtn(w.w); if (mc) acts.appendChild(mc);
          card.appendChild(acts);
          card.onclick = (e) => { if (e.target === card || e.target.classList.contains("hw") || e.target.classList.contains("em")) speak(w.w); };
          stage.appendChild(card);
        });
        const nb = el("button", "btn big next", "✍️ अब लिखो · Write →");
        nb.onclick = next;
        stage.appendChild(nb);
      });
    }

    /* ---- step: handwriting practice (trace + real assessment) ---- */
    function stepWrite() {
      const prompts = buildWritePrompts(d);
      if (!prompts.length) return next();
      let p = 0;
      function round() {
        const it = prompts[p];
        shell((stage) => {
          stage.appendChild(el("div", "game-q",
            "✍️ उँगली से ट्रेस करो 🖐️ (" + (p + 1) + "/" + prompts.length + ")<br><small>धुँधली लकीरों के ऊपर लिखो</small>"));
          const instr = el("div", "write-instr");
          instr.innerHTML = '<div class="wt-target">' + it.target + '</div><div class="wt-say">' + it.label + '</div>' +
            (it.roman ? '<div class="wt-ro">' + it.roman + '</div>' : '');
          stage.appendChild(instr);
          const say = el("button", "btn speak", "🔊 मिठू से सुनो"); say.onclick = () => speak(it.speak);
          stage.appendChild(say);
          const pad = buildWritePad(it.target);
          stage.appendChild(pad.wrap);
          const row = el("div", "write-actions");
          const clr = el("button", "btn ghost", "🔄 मिटाओ"); clr.onclick = pad.clear;
          const chk = el("button", "btn next", "✅ हो गया?");
          chk.onclick = () => {
            const r = pad.assess();
            if (r.ok) {
              celebrate("शाबाश! ✍️"); speak(praise() + " " + it.target);
              earned++; addStars(d.day, 1); p++;
              setTimeout(() => p < prompts.length ? round() : next(), 1000);
            } else if (r.ink < r.need * 0.12) {
              toast("थोड़ा और लिखो ✏️", false); speak("लकीरों के ऊपर " + it.target + " लिखो");
            } else {
              toast("फिर से कोशिश करो 💪", false); speak("फिर से " + it.target + " लिखो");
            }
          };
          row.appendChild(clr); row.appendChild(chk);
          stage.appendChild(row);
          const skip = el("button", "btn warn big", "छोड़ो · आगे →");
          skip.onclick = () => { p++; p < prompts.length ? round() : next(); };
          stage.appendChild(el("div", "", "<br>"));
          stage.appendChild(skip);
          setTimeout(() => speak(it.speak), 350);
        });
      }
      round();
    }

    /* ---- step: translate an English sentence into spoken Hindi ---- */
    function stepTranslate() {
      const items = buildTranslations(d);
      if (!items.length) return next();
      let p = 0;
      function round() {
        const it = items[p];
        shell((stage) => {
          stage.appendChild(el("div", "game-q", "🗣️ इसे हिंदी में बोलो (" + (p + 1) + "/" + items.length + ")<br><small>Say this in Hindi</small>"));
          const card = el("div", "tr-card");
          card.innerHTML = '<div class="tr-en">' + it.en + '</div>';
          stage.appendChild(card);
          const result = el("div", "tr-result");
          stage.appendChild(result);

          function showResult(ok, alts, selfMark) {
            result.className = "tr-result show";
            if (ok) {
              const heard = (!selfMark && alts && alts[0]) ? '<div class="tr-heard">तुमने कहा: “' + alts[0] + '”</div>' : '';
              result.innerHTML = '<div class="tr-ok">✅ ' + (selfMark ? "बहुत बढ़िया!" : "सही! " + praise()) + '</div>' +
                '<div class="tr-hi">' + it.hi + '</div>' + heard;
              celebrate("शाबाश! 🗣️"); speak(selfMark ? it.hi : (praise() + "। " + it.hi));
              earned++; addStars(d.day, 1);
              setTimeout(adv, 1400);
            } else {
              const heard = (alts && alts[0]) ? '<div class="tr-heard">सुना: “' + alts[0] + '”</div>' : '';
              result.innerHTML = '<div class="tr-no">❌ फिर से कोशिश करो</div>' + heard;
              speak("फिर से बोलो");
            }
          }

          const acts = el("div", "write-actions");
          if (canListen) {
            const mic = el("button", "btn mic", "🎤 हिंदी में बोलो");
            mic.onclick = () => {
              mic.textContent = "👂 सुन रहा…"; result.className = "tr-result";
              listenOnce((alts) => { mic.textContent = "🎤 फिर से बोलो"; showResult(sentenceMatch(alts, it.hi, it.key), alts, false); });
            };
            acts.appendChild(mic);
          } else {
            const said = el("button", "btn mic", "🗣️ मैंने बोल दिया ✓");
            said.onclick = () => showResult(true, null, true);
            acts.appendChild(said);
          }
          const hear = el("button", "btn speak", "🔊 उत्तर सुनो"); hear.onclick = () => speak(it.hi);
          acts.appendChild(hear);
          stage.appendChild(acts);

          const reveal = el("button", "btn ghost", "👀 उत्तर दिखाओ");
          reveal.onclick = () => { result.className = "tr-result show"; result.innerHTML = '<div class="tr-hi">' + it.hi + '</div>'; speak(it.hi); };
          stage.appendChild(reveal);
          const skip = el("button", "btn warn big", "आगे →");
          skip.onclick = adv;
          stage.appendChild(el("div", "", "<br>"));
          stage.appendChild(skip);
        });
      }
      function adv() { p++; p < items.length ? round() : next(); }
      round();
    }

    /* ---- step: game (dispatch) ---- */
    function stepGame() {
      const type = d.game || "read";
      if (type === "listen") return gameListen();
      if (type === "match") return gameMatch();
      if (type === "build") return gameBuild();
      if (type === "whichMaatra") return gameWhichMaatra();
      if (type === "sentence") return gameSentence();
      return gameRead();
    }

    function finishGame() { next(); }

    /* GAME: listen & tap the word you hear */
    function gameListen() {
      const pool = d.words;
      const rounds = shuffle(pool).slice(0, Math.min(6, pool.length));
      let r = 0;
      function round() {
        const target = rounds[r];
        const opts = shuffle([target].concat(sample(pool, Math.min(3, pool.length - 1), target)));
        shell((stage) => {
          stage.appendChild(el("div", "game-q", "कौन सा शब्द बोला? 👂 <br>(" + (r + 1) + "/" + rounds.length + ")"));
          const rep = el("button", "btn speak", "🔊 फिर से सुनो"); rep.onclick = () => speak(target.w);
          stage.appendChild(rep);
          const opts_ = el("div", "opts");
          opts.forEach((o) => {
            const b = el("button", "opt", '<span class="em">' + (o.e || "") + "</span> " + o.w);
            b.onclick = () => {
              if (o === target) { b.classList.add("right"); celebrate(praise()); speak(praise()); earned++; addStars(d.day, 1); r++; setTimeout(() => r < rounds.length ? round() : finishGame(), 900); }
              else { b.classList.add("wrong"); toast(OOPS[0], false); speak(target.w); setTimeout(() => b.classList.remove("wrong"), 500); }
            };
            opts_.appendChild(b);
          });
          stage.appendChild(opts_);
        });
        setTimeout(() => speak(target.w), 400);
      }
      round();
    }

    /* GAME: match spoken word to the correct emoji */
    function gameMatch() {
      const pool = d.words.filter(w => w.e);
      const rounds = shuffle(pool).slice(0, Math.min(6, pool.length));
      let r = 0;
      function round() {
        const target = rounds[r];
        const opts = shuffle([target].concat(sample(pool, Math.min(3, pool.length - 1), target)));
        shell((stage) => {
          stage.appendChild(el("div", "game-q", "इस शब्द की तस्वीर चुनो 🖼️ (" + (r + 1) + "/" + rounds.length + ")"));
          const word = el("div", "meet");
          word.innerHTML = '<div class="bigmt" style="font-size:3.4rem">' + target.w + '</div><div class="snd">' + target.r + "</div>";
          const sp = el("button", "btn speak", "🔊 सुनो"); sp.onclick = () => speak(target.w);
          stage.appendChild(word); stage.appendChild(sp);
          const opts_ = el("div", "opts");
          opts.forEach((o) => {
            const b = el("button", "opt", '<span class="em" style="font-size:3rem">' + o.e + "</span>");
            b.onclick = () => {
              if (o === target) { b.classList.add("right"); celebrate(praise()); speak(praise()); earned++; addStars(d.day, 1); r++; setTimeout(() => r < rounds.length ? round() : finishGame(), 900); }
              else { b.classList.add("wrong"); toast(OOPS[1], false); setTimeout(() => b.classList.remove("wrong"), 500); }
            };
            opts_.appendChild(b);
          });
          stage.appendChild(opts_);
        });
        setTimeout(() => speak(target.w), 400);
      }
      round();
    }

    /* GAME: build the word from scrambled letter-tiles */
    function gameBuild() {
      const pool = shuffle(d.words).slice(0, Math.min(5, d.words.length));
      let r = 0;
      function round() {
        const target = pool[r];
        const parts = graphemes(target.w);
        const built = [];
        shell((stage) => {
          stage.appendChild(el("div", "game-q", "अक्षर जोड़कर शब्द बनाओ 🧩 (" + (r + 1) + "/" + pool.length + ")"));
          stage.appendChild(el("div", "reward", '<span class="em" style="font-size:54px">' + (target.e || "✨") + "</span>"));
          const sp = el("button", "btn speak", "🔊 शब्द सुनो"); sp.onclick = () => speak(target.w);
          stage.appendChild(sp);
          const slots = el("div", "slots"); stage.appendChild(slots);
          const tiles = el("div", "tiles"); stage.appendChild(tiles);
          function draw() {
            slots.innerHTML = built.length ? built.map(p => '<span class="slot">' + p + "</span>").join("") : '<span class="slot" style="opacity:.4">?</span>';
          }
          draw();
          shuffle(parts.map((p, i) => ({ p, i }))).forEach((it) => {
            const t = el("button", "tile", it.p);
            t.onclick = () => {
              const need = parts[built.length];
              if (it.p === need && !t.classList.contains("used")) {
                t.classList.add("used"); built.push(it.p); speak(it.p); draw();
                if (built.length === parts.length) {
                  celebrate(praise()); speak(target.w + "। " + praise()); earned++; addStars(d.day, 1);
                  r++; setTimeout(() => r < pool.length ? round() : finishGame(), 1100);
                }
              } else { toast("इसके पहले वाला अक्षर ढूँढो", false); t.animate([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 300 }); }
            };
            tiles.appendChild(t);
          });
        });
        setTimeout(() => speak(target.w), 400);
      }
      round();
    }

    /* GAME: which maatra is in this word? */
    function gameWhichMaatra() {
      const SIGNS = [
        { s: "ा", n: "aa" }, { s: "ि", n: "choti ee" }, { s: "ी", n: "badi ee" },
        { s: "ु", n: "chota u" }, { s: "ू", n: "bada u" }, { s: "े", n: "e" },
        { s: "ै", n: "ai" }, { s: "ो", n: "o" }, { s: "ौ", n: "au" }, { s: "ं", n: "anusvar" }, { s: "ँ", n: "chandra" }
      ];
      const withSign = d.words.map(w => {
        const found = SIGNS.find(sg => w.w.indexOf(sg.s) >= 0);
        return found ? { w, sign: found } : null;
      }).filter(Boolean);
      const pool = withSign.length ? withSign : d.words.map(w => ({ w, sign: SIGNS[0] }));
      const rounds = shuffle(pool).slice(0, Math.min(6, pool.length));
      let r = 0;
      function round() {
        const target = rounds[r];
        const others = shuffle(SIGNS.filter(s => s.s !== target.sign.s)).slice(0, 2);
        const opts = shuffle([target.sign].concat(others));
        shell((stage) => {
          stage.appendChild(el("div", "game-q", "इस शब्द में कौन सी मात्रा है? 🔍 (" + (r + 1) + "/" + rounds.length + ")"));
          const word = el("div", "meet");
          word.innerHTML = '<div class="bigmt" style="font-size:3.6rem">' + target.w.w + '</div><div class="snd">' + target.w.r + "</div>";
          const sp = el("button", "btn speak", "🔊 सुनो"); sp.onclick = () => speak(target.w.w);
          stage.appendChild(word); stage.appendChild(sp);
          const opts_ = el("div", "opts");
          opts.forEach((o) => {
            const b = el("button", "opt", '<span style="font-size:2.4rem">' + ("क" + o.s) + '</span><small style="font-size:.7rem">' + o.n + "</small>");
            b.style.flexDirection = "column";
            b.onclick = () => {
              if (o.s === target.sign.s) { b.classList.add("right"); celebrate(praise()); speak(o.n + "। " + praise()); earned++; addStars(d.day, 1); r++; setTimeout(() => r < rounds.length ? round() : finishGame(), 950); }
              else { b.classList.add("wrong"); toast(OOPS[2], false); setTimeout(() => b.classList.remove("wrong"), 500); }
            };
            opts_.appendChild(b);
          });
          stage.appendChild(opts_);
        });
        setTimeout(() => speak(target.w.w), 400);
      }
      round();
    }

    /* GAME: arrange words into a sentence */
    function gameSentence() {
      const list = (d.sentences && d.sentences.length) ? d.sentences : null;
      if (!list) return gameRead();
      let r = 0;
      function round() {
        const target = list[r];
        const words = target.s.replace(/।/g, " ।").split(/\s+/).filter(Boolean);
        const built = [];
        shell((stage) => {
          stage.appendChild(el("div", "game-q", "शब्दों को सही क्रम में लगाओ ✍️ (" + (r + 1) + "/" + list.length + ")"));
          stage.appendChild(el("div", "reward", '<div class="mn" style="opacity:.7">' + target.m + "</div>"));
          const sp = el("button", "btn speak", "🔊 वाक्य सुनो"); sp.onclick = () => speak(target.s);
          stage.appendChild(sp);
          const slots = el("div", "slots"); stage.appendChild(slots);
          const tiles = el("div", "tiles"); stage.appendChild(tiles);
          function draw() { slots.innerHTML = built.length ? built.map(p => '<span class="slot sent-word">' + p + "</span>").join(" ") : '<span class="slot" style="opacity:.4">…</span>'; }
          draw();
          shuffle(words.map((p, i) => ({ p, i }))).forEach((it) => {
            const t = el("button", "tile sent-word", it.p);
            t.onclick = () => {
              const need = words[built.length];
              if (it.p === need && !t.classList.contains("used")) {
                t.classList.add("used"); built.push(it.p); speak(it.p === "।" ? "" : it.p); draw();
                if (built.length === words.length) { celebrate(praise()); speak(target.s + "। " + praise()); earned++; addStars(d.day, 1); r++; setTimeout(() => r < list.length ? round() : finishGame(), 1300); }
              } else { toast("पहला शब्द ढूँढो", false); }
            };
            tiles.appendChild(t);
          });
        });
        setTimeout(() => speak(target.s), 400);
      }
      round();
    }

    /* GAME: read-aloud flashcards (words + sentences + poem) */
    function gameRead() {
      const cards = [];
      (d.words || []).forEach(w => cards.push({ big: w.w, sub: w.r + " · " + (w.m || ""), em: w.e, say: w.w }));
      (d.sentences || []).forEach(s => cards.push({ big: s.s, sub: s.m, em: "🗣️", say: s.s }));
      (d.poem || []).forEach(p => cards.push({ big: p.s, sub: p.m, em: "🎵", say: p.s }));
      let i = 0;
      function card() {
        const c = cards[i];
        shell((stage) => {
          stage.appendChild(el("div", "game-q", "ज़ोर से पढ़ो 📣 (" + (i + 1) + "/" + cards.length + ")"));
          const box = el("div", "poem-line");
          box.innerHTML = '<div style="font-size:2.6rem" class="em">' + (c.em || "") + '</div><div class="pl">' + c.big + '</div><div class="pr">' + c.sub + "</div>";
          stage.appendChild(box);
          const row = el("div", "opts"); row.style.gridTemplateColumns = "1fr 1fr";
          const sp = el("button", "btn speak", "🔊 सुनो"); sp.onclick = () => speak(c.say);
          row.appendChild(sp);
          const mc = canListen ? (function () { const b = el("button", "btn mic", "🎤 बोलो"); b.onclick = () => { b.textContent = "👂 सुन रहा…"; setTimeout(() => listenOnce(a => { b.textContent = "🎤 बोलो"; if (looseMatch(a, c.say)) { celebrate("शाबाश!"); speak(praise()); } else toast("अच्छी कोशिश! 👍", true); }), 500); }; return b; })() : el("span", "", "");
          row.appendChild(mc);
          stage.appendChild(row);
          const nb = el("button", "btn big next", (i < cards.length - 1 ? "पढ़ लिया ✓ · अगला →" : "पढ़ लिया ✓ · पूरा!"));
          nb.onclick = () => { earned++; addStars(d.day, 1); confetti(12); i++; if (i < cards.length) card(); else finishGame(); };
          stage.appendChild(nb);
          speak(c.say);
        });
      }
      if (cards.length) card(); else finishGame();
    }

    /* ---- step: reward ---- */
    function stepReward() {
      state.completed[d.day] = true;
      state.stars[d.day] = Math.max(state.stars[d.day] || 0, earned);
      save();
      window.scrollTo(0, 0);
      $app.innerHTML = "";
      const wrap = el("div", "reward");
      wrap.innerHTML = '<div class="trophy">' + (d.certificate ? "🎓" : (d.kind === "celebrate" ? "🏆" : "🌟")) + "</div>" +
        "<h2>" + praise() + "</h2>" +
        '<div class="earned">' + "⭐".repeat(Math.min(5, Math.max(1, earned))) + "</div>" +
        "<p>" + fmtDateLong(dateForDay(d.day)) + " पूरा हुआ, " + APP.child.hindi + "!</p>" +
        (d.badge ? '<div class="badge">' + d.badge + "</div>" : "");
      $app.appendChild(wrap);

      if (d.certificate) {
        const cert = el("div", "cert");
        cert.innerHTML = '<div class="seal">🏅</div><h3>हिंदी पढ़ना — प्रमाण-पत्र</h3>' +
          '<div class="nm">' + APP.child.hindi + " (" + APP.child.name + ")</div>" +
          "<p>अब हिंदी शब्द पढ़ने में <b>एक्सपर्ट</b>! 🎉</p><p>Certified Hindi Reader ⭐</p>";
        $app.appendChild(cert);
      }

      const again = el("button", "btn ghost big", "🔁 फिर से खेलो");
      again.onclick = () => openDay(d.day);
      const home = el("button", "btn big next", "🏠 घर जाओ · Home");
      home.onclick = renderHome;
      $app.appendChild(again); $app.appendChild(el("div", "", "<br>")); $app.appendChild(home);

      celebrate("शाबाश " + APP.child.hindi + "!");
      speak((d.certificate ? "बधाई हो " : praise() + " ") + APP.child.hindi + "!");
      renderFooter();
    }

    render();
  }

  /* =======================================================================
     EXPLORE  —  standalone sections Myra can open anytime (not day-gated):
     Numbers 1–100, Weekdays, and Months. Tap anything to hear it in Hindi,
     count along, and play a quick listen-&-tap quiz.
     ===================================================================== */
  // Hindi numbers 1..100 as "word|roman" (index 0 = number 1)
  const NUM_RAW = (
    "एक|ek दो|do तीन|teen चार|chaar पाँच|paanch छह|chhah सात|saat आठ|aath नौ|nau दस|das " +
    "ग्यारह|gyaarah बारह|baarah तेरह|terah चौदह|chaudah पंद्रह|pandrah सोलह|solah सत्रह|satrah अठारह|athaarah उन्नीस|unnees बीस|bees " +
    "इक्कीस|ikkees बाईस|baaees तेईस|teees चौबीस|chaubees पच्चीस|pachchees छब्बीस|chhabbees सत्ताईस|sattaaees अट्ठाईस|atthaaees उनतीस|untees तीस|tees " +
    "इकतीस|iktees बत्तीस|battees तैंतीस|taintees चौंतीस|chauntees पैंतीस|paintees छत्तीस|chhattees सैंतीस|saintees अड़तीस|adtees उनतालीस|untaalees चालीस|chaalees " +
    "इकतालीस|iktaalees बयालीस|bayaalees तैंतालीस|taintaalees चवालीस|chavaalees पैंतालीस|paintaalees छियालीस|chhiyaalees सैंतालीस|saintaalees अड़तालीस|adtaalees उनचास|unchaas पचास|pachaas " +
    "इक्यावन|ikyaavan बावन|baavan तिरेपन|tirepan चौवन|chauvan पचपन|pachpan छप्पन|chhappan सत्तावन|sattaavan अट्ठावन|atthaavan उनसठ|unsath साठ|saath " +
    "इकसठ|iksath बासठ|baasath तिरेसठ|tiresath चौंसठ|chaunsath पैंसठ|painsath छियासठ|chhiyaasath सड़सठ|sadsath अड़सठ|adsath उनहत्तर|unhattar सत्तर|sattar " +
    "इकहत्तर|ikhattar बहत्तर|bahattar तिहत्तर|tihattar चौहत्तर|chauhattar पचहत्तर|pachhattar छिहत्तर|chhihattar सतहत्तर|satahattar अठहत्तर|athhattar उनासी|unaasee अस्सी|assee " +
    "इक्यासी|ikyaasee बयासी|bayaasee तिरासी|tiraasee चौरासी|chauraasee पचासी|pachaasee छियासी|chhiyaasee सत्तासी|sattaasee अट्ठासी|atthaasee नवासी|navaasee नब्बे|nabbe " +
    "इक्यानवे|ikyaanave बानवे|baanave तिरानवे|tiraanave चौरानवे|chauraanave पचानवे|pachaanave छियानवे|chhiyaanave सत्तानवे|sattaanave अट्ठानवे|atthaanave निन्यानवे|ninyaanave सौ|sau"
  ).split(/\s+/).map(s => { const p = s.split("|"); return { w: p[0], r: p[1] }; });
  const DEV_DIG = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  function toDev(n) { return String(n).split("").map(c => /\d/.test(c) ? DEV_DIG[+c] : c).join(""); }
  const WEEKDAYS = [
    { w: "रविवार", r: "ravivaar", e: "Sunday", em: "☀️" },
    { w: "सोमवार", r: "somvaar", e: "Monday", em: "🌙" },
    { w: "मंगलवार", r: "mangalvaar", e: "Tuesday", em: "🔴" },
    { w: "बुधवार", r: "budhvaar", e: "Wednesday", em: "🟢" },
    { w: "गुरुवार", r: "guruvaar", e: "Thursday", em: "🟡" },
    { w: "शुक्रवार", r: "shukravaar", e: "Friday", em: "⭐" },
    { w: "शनिवार", r: "shanivaar", e: "Saturday", em: "🪐" }
  ];
  const MONTHS = [
    { w: "जनवरी", r: "janvaree", e: "January", em: "❄️" }, { w: "फ़रवरी", r: "farvaree", e: "February", em: "💗" },
    { w: "मार्च", r: "maarch", e: "March", em: "🌱" }, { w: "अप्रैल", r: "aprail", e: "April", em: "🌸" },
    { w: "मई", r: "maee", e: "May", em: "☀️" }, { w: "जून", r: "joon", e: "June", em: "🌻" },
    { w: "जुलाई", r: "julaaee", e: "July", em: "🌦️" }, { w: "अगस्त", r: "agast", e: "August", em: "🌈" },
    { w: "सितंबर", r: "sitambar", e: "September", em: "🍂" }, { w: "अक्टूबर", r: "aktoobar", e: "October", em: "🎃" },
    { w: "नवंबर", r: "navambar", e: "November", em: "🍁" }, { w: "दिसंबर", r: "disambar", e: "December", em: "🎄" }
  ];

  function speakMany(texts) {
    if (!window.speechSynthesis) return;
    try {
      speechSynthesis.cancel();
      texts.forEach(t => { const u = new SpeechSynthesisUtterance(t); u.lang = "hi-IN"; if (hiVoice) u.voice = hiVoice; u.rate = 0.7; u.pitch = 1.12; speechSynthesis.speak(u); });
    } catch (e) {}
  }
  function bonusStar() { state.total = (state.total || 0) + 1; save(); }

  function exploreShell(titleHi, titleEn, bodyBuilder) {
    window.scrollTo(0, 0);
    $app.innerHTML = "";
    const head = el("div", "lesson-top");
    const back = el("button", "back", "←");
    back.onclick = renderHome;
    head.appendChild(back);
    head.appendChild(el("h2", null, titleHi + "<small>" + titleEn + "</small>"));
    $app.appendChild(head);
    const stage = el("div", "stage");
    $app.appendChild(stage);
    bodyBuilder(stage);
    renderFooter();
  }

  /* listen-&-tap quiz over a pool of {say, opt, key} */
  function exploreQuiz(pool, cfg) {
    const rounds = shuffle(pool).slice(0, Math.min(cfg.rounds || 5, pool.length));
    let r = 0, correct = 0;
    function finish() {
      exploreShell(cfg.titleHi, cfg.titleEn, (stage) => {
        const wrap = el("div", "reward");
        wrap.innerHTML = '<div class="trophy">' + (correct >= rounds.length ? "🏆" : "🌟") + "</div>" +
          "<h2>" + praise() + "</h2>" +
          '<div class="earned">' + "⭐".repeat(Math.min(5, Math.max(1, correct))) + "</div>" +
          "<p>" + toDev(correct) + " / " + toDev(rounds.length) + " सही! " + APP.child.hindi + "</p>";
        stage.appendChild(wrap);
        const again = el("button", "btn ghost big", "🔁 फिर से खेलो"); again.onclick = () => exploreQuiz(pool, cfg);
        const back = el("button", "btn big next", "← वापस"); back.onclick = cfg.onDone || renderHome;
        stage.appendChild(again); stage.appendChild(el("div", "", "<br>")); stage.appendChild(back);
        celebrate("शाबाश!"); speak(praise());
      });
    }
    function round() {
      const target = rounds[r];
      const opts = shuffle([target].concat(sample(pool, Math.min(3, pool.length - 1), target)));
      exploreShell(cfg.titleHi, cfg.titleEn, (stage) => {
        stage.appendChild(el("div", "game-q", cfg.q + " 👂 (" + (r + 1) + "/" + rounds.length + ")"));
        const rep = el("button", "btn speak", "🔊 फिर से सुनो"); rep.onclick = () => speak(target.say);
        stage.appendChild(rep);
        const grid = el("div", "opts"); grid.style.marginTop = "10px";
        opts.forEach((o) => {
          const b = el("button", "opt", o.opt);
          b.onclick = () => {
            if (o.key === target.key) { b.classList.add("right"); celebrate(praise()); speak(praise()); correct++; bonusStar(); r++; setTimeout(() => r < rounds.length ? round() : finish(), 900); }
            else { b.classList.add("wrong"); toast("फिर से सुनो", false); speak(target.say); setTimeout(() => b.classList.remove("wrong"), 500); }
          };
          grid.appendChild(b);
        });
        stage.appendChild(grid);
      });
      setTimeout(() => speak(target.say), 420);
    }
    round();
  }

  /* ---- Numbers 1–100 ---- */
  function renderNumbers() {
    exploreShell("🔢 गिनती १–१००", "Numbers 1–100 in Hindi", (stage) => {
      stage.appendChild(el("div", "game-q", "किसी भी नंबर को दबाओ और सुनो 👆<br><small>Tap any number to hear it</small>"));
      const row = el("div", "opts"); row.style.gridTemplateColumns = "1fr 1fr";
      const c1 = el("button", "btn speak", "🔊 १ से १० गिनो"); c1.onclick = () => speakMany(NUM_RAW.slice(0, 10).map(x => x.w));
      const c2 = el("button", "btn speak", "🔊 १०,२०…१००"); c2.onclick = () => speakMany([10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(n => NUM_RAW[n - 1].w));
      row.appendChild(c1); row.appendChild(c2); stage.appendChild(row);
      for (let g = 0; g < 10; g++) {
        const start = g * 10 + 1, end = g * 10 + 10;
        const head = el("div", "numhead", toDev(start) + " – " + toDev(end) + " 🔊");
        head.onclick = () => speakMany(NUM_RAW.slice(start - 1, end).map(x => x.w));
        stage.appendChild(head);
        const grid = el("div", "numgrid");
        for (let n = start; n <= end; n++) {
          const it = NUM_RAW[n - 1];
          const t = el("button", "numtile", '<span class="nd">' + toDev(n) + '</span><span class="nw">' + it.w + "</span>");
          t.onclick = () => { speak(it.w); t.animate([{ transform: "scale(1)" }, { transform: "scale(1.15)" }, { transform: "scale(1)" }], { duration: 240 }); };
          grid.appendChild(t);
        }
        stage.appendChild(grid);
      }
      const quizNums = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,30,40,50,60,70,80,90,100];
      const pool = quizNums.map(n => ({ say: NUM_RAW[n - 1].w, opt: '<span class="nd">' + toDev(n) + "</span>", key: n }));
      const quiz = el("button", "btn big warn", "🎮 नंबर पहचानो · Number Game");
      quiz.onclick = () => exploreQuiz(pool, { titleHi: "🔢 नंबर पहचानो", titleEn: "Which number?", q: "कौन सा नंबर बोला?", rounds: 6, onDone: renderNumbers });
      stage.appendChild(el("div", "", "<br>")); stage.appendChild(quiz);
    });
  }

  /* ---- Weekdays ---- */
  function renderWeekdays() {
    const todayIdx = new Date().getDay();
    exploreShell("📅 हफ़्ते के दिन", "Days of the week", (stage) => {
      stage.appendChild(el("div", "game-q", "आज है: <b>" + WEEKDAYS[todayIdx].w + "</b> " + WEEKDAYS[todayIdx].em + "<br><small>Tap a day to hear it</small>"));
      const say = el("button", "btn speak", "🔊 सातों दिन सुनो"); say.onclick = () => speakMany(WEEKDAYS.map(d => d.w));
      stage.appendChild(say);
      const list = el("div", "cardlist");
      WEEKDAYS.forEach((d, i) => {
        const card = el("button", "explore-card" + (i === todayIdx ? " today" : ""),
          '<span class="ec-em">' + d.em + '</span><span class="ec-txt"><b>' + d.w + '</b><small>' + d.r + " · " + d.e + "</small></span>" + (i === todayIdx ? '<span class="ec-tag">आज</span>' : ""));
        card.onclick = () => { speak(d.w); };
        list.appendChild(card);
      });
      stage.appendChild(list);
      const pool = WEEKDAYS.map(d => ({ say: d.w, opt: '<span style="font-size:1.2rem">' + d.w + "</span>", key: d.w }));
      const quiz = el("button", "btn big warn", "🎮 दिन पहचानो · Day Game");
      quiz.onclick = () => exploreQuiz(pool, { titleHi: "📅 दिन पहचानो", titleEn: "Which day?", q: "कौन सा दिन बोला?", rounds: 5, onDone: renderWeekdays });
      stage.appendChild(el("div", "", "<br>")); stage.appendChild(quiz);
    });
  }

  /* ---- Months ---- */
  function renderMonths() {
    const monIdx = new Date().getMonth();
    exploreShell("🗓️ साल के महीने", "Months of the year", (stage) => {
      stage.appendChild(el("div", "game-q", "यह महीना: <b>" + MONTHS[monIdx].w + "</b> " + MONTHS[monIdx].em + "<br><small>Tap a month to hear it</small>"));
      const say = el("button", "btn speak", "🔊 बारह महीने सुनो"); say.onclick = () => speakMany(MONTHS.map(m => m.w));
      stage.appendChild(say);
      const list = el("div", "cardlist");
      MONTHS.forEach((m, i) => {
        const card = el("button", "explore-card" + (i === monIdx ? " today" : ""),
          '<span class="ec-em">' + m.em + '</span><span class="ec-txt"><b>' + m.w + '</b><small>' + m.r + " · " + m.e + "</small></span><span class=\"ec-num\">" + toDev(i + 1) + "</span>" + (i === monIdx ? '<span class="ec-tag">अभी</span>' : ""));
        card.onclick = () => { speak(m.w); };
        list.appendChild(card);
      });
      stage.appendChild(list);
      const pool = MONTHS.map(m => ({ say: m.w, opt: '<span style="font-size:1.1rem">' + m.w + "</span>", key: m.w }));
      const quiz = el("button", "btn big warn", "🎮 महीना पहचानो · Month Game");
      quiz.onclick = () => exploreQuiz(pool, { titleHi: "🗓️ महीना पहचानो", titleEn: "Which month?", q: "कौन सा महीना बोला?", rounds: 6, onDone: renderMonths });
      stage.appendChild(el("div", "", "<br>")); stage.appendChild(quiz);
    });
  }

  /* ------------------------------- footer -------------------------------- */
  function renderFooter() {
    $footer.innerHTML = "";
    const mk = (icon, label, fn) => { const b = el("button", null, "<b>" + icon + "</b>" + label); b.onclick = fn; return b; };
    $footer.appendChild(mk("🏠", "घर", renderHome));
    $footer.appendChild(mk("🔊", "आवाज़", () => speak("नमस्ते " + APP.child.hindi + "! मैं मिठू हूँ।")));
    $footer.appendChild(mk("👪", "Parents", showParents));
  }
  function showParents() {
    const ov = el("div", "");
    ov.style.cssText = "position:fixed;inset:0;background:rgba(43,33,64,.55);z-index:70;display:flex;align-items:center;justify-content:center;padding:18px;";
    const box = el("div", "stage");
    box.style.cssText = "max-width:420px;background:#fff;";
    box.innerHTML = "<h2 style='color:var(--purple);margin-top:0'>👪 Parent Guide</h2>" +
      "<p><b>Sound on:</b> tap 🔊 anywhere to hear clear Hindi. Ask Myra to repeat.</p>" +
      "<p><b>🎤 Say it:</b> lets her speak the word — always encouraging" + (canListen ? "." : " (not supported on this browser).") + "</p>" +
      "<p><b>✍️ Trace &amp; write:</b> Myra hears “letter + maatra”, traces the faint guide with her finger, and taps ✅ — the app checks it gently and cheers her on. Great for building handwriting.</p>" +
      "<p><b>🗣️ Translate &amp; speak:</b> she reads an English sentence and says it in Hindi; the app listens (🎤) and grades 10 sentences a day" + (canListen ? "." : " (self-marked if this browser can't listen).") + " Tap 🔊 उत्तर सुनो to hear the answer, 👀 to reveal it.</p>" +
      "<p><b>🧭 Explore anytime:</b> tap 🔢 Numbers (1–100), 📅 Weekdays, or 🗓️ Months on the home screen — Myra can hear each one, count along, and play a quick number/day/month game. These are always open, separate from the daily lesson.</p>" +
      "<p><b>One lesson a day:</b> a new day unlocks every morning for 31 days — from vowels to reading full words.</p>" +
      "<p><b>Add to Home Screen</b> for an app feel (Share → Add to Home Screen).</p>";
    const c = el("button", "btn big next", "ठीक है ✓"); c.onclick = () => ov.remove();
    box.appendChild(c); ov.appendChild(box); ov.onclick = (e) => { if (e.target === ov) ov.remove(); };
    document.body.appendChild(ov);
  }

  /* ------------------------------- boot ---------------------------------- */
  function boot() {
    // warm up voices (some browsers need a tick)
    if (window.speechSynthesis) { pickVoice(); setTimeout(pickVoice, 400); }
    fetch("progress.json", { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then(p => { serverProgress = p; })
      .catch(() => { serverProgress = null; })
      .finally(renderHome);
  }
  boot();
})();
