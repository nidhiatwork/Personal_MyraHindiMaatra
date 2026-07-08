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
    const msg = (serverProgress && serverProgress.message) || ("नमस्ते " + APP.child.hindi + "! आज Day " + unlocked + " खेलो!");
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

    // journey heading + big Play button for today
    $app.appendChild(el("div", "h", "🗺️ तुम्हारा सफ़र · Your Journey"));
    const play = el("button", "btn big next", "▶️ आज का पाठ खेलो · Play Day " + unlocked);
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
        '<div class="dnum">' + d.day + "</div>" +
        '<div class="dmt">' + glyph + "</div>" +
        '<div class="dlbl">' + label + "</div>" +
        (done ? '<span class="tick">✅</span>' : "") +
        (done && state.stars[d.day] ? '<span class="stars">' + "⭐".repeat(Math.min(3, state.stars[d.day])) + "</span>" : "");
      node.onclick = () => {
        if (isUnlocked) openDay(d.day);
        else { toast("यह Day " + d.day + " को खुलेगा 🔒", false); speak("यह पाठ बाद में खुलेगा"); }
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
    steps.push("game");
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
      head.appendChild(el("h2", null, d.title + "<small>Day " + d.day + " · " + d.titleEn + "</small>"));
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
      if (step === "game") return stepGame();
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
        const nb = el("button", "btn big next", "🎮 खेल खेलो · Play Game →");
        nb.onclick = next;
        stage.appendChild(nb);
      });
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
      const rounds = shuffle(pool).slice(0, Math.min(4, pool.length));
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
      const rounds = shuffle(pool).slice(0, Math.min(4, pool.length));
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
      const pool = shuffle(d.words).slice(0, Math.min(3, d.words.length));
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
      const rounds = shuffle(pool).slice(0, Math.min(4, pool.length));
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
        "<p>Day " + d.day + " पूरा हुआ, " + APP.child.hindi + "!</p>" +
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
