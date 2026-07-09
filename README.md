# मायरा की हिंदी | Myra's Hindi Maatra Adventure 🦜

A bright, engaging web app that teaches **Myra (1st grade)** to read simple Hindi words by
mastering every *maatra* (vowel sign) — with a strong focus on **pronunciation**.

**Live app:** https://nidhiatwork.github.io/Personal_MyraHindiMaatra/

## What it does
- **31-day journey.** One new lesson unlocks every morning — from vowels → each maatra → real
  words → sentences → a graduation certificate. Each day is now a **full ~25-minute session**.
  Days are labelled by **real calendar date** (not "Day 1, 2, 3…") so Myra always knows what today is.
- **Lots to read (~15 words a day).** Every lesson has ~15 picture-words plus syllables and a game,
  so it's a solid 15 minutes of reading — no more finishing in five!
- **✍️ Trace &amp; write (~10 min).** Mithu says “letter + maatra” (e.g. *स पे बड़ी ई की मात्रा*),
  Myra traces the faint guide with her finger, and the app checks her handwriting and cheers her on.
- **Hear everything.** Tap any letter, word, or sentence to hear clear, slow Hindi (browser
  text-to-speech, `hi-IN`). Mithu the parrot 🦜 pronounces and cheers her on.
- **Say it (🎤).** Optional speech practice — Myra taps the mic and says the word; always
  encouraging (graceful fallback if the browser can't listen).
- **6 fun games:** Listen &amp; Tap, Picture Match, Build-the-Word, Maatra Detective, Make-a-Sentence,
  and Read-Aloud flashcards.
- **Rewards:** stars, confetti, weekly badges ⭐, and a Day-31 **Hindi Reader certificate** 🎓.
- **Works on her phone.** Mobile-first, big buttons, offline after first load. Add to Home Screen.

## A lesson, start to finish
Meet the maatra → tap the syllables → read ~15 picture-words → **✍️ trace & write the letters** →
play the day's game → ⭐ reward. About **25 minutes** of learning.

## Curriculum map
| Week | Days | Focus |
|------|------|-------|
| 1 | 1–7   | अ, आ ( ा ), इ ( ि ) choti-ee, ई ( ी ) badi-ee + reviews + 🎉 |
| 2 | 8–14  | उ ( ु ), ऊ ( ू ), ए ( े ), ऐ ( ै ) + reviews + 🎉 |
| 3 | 15–21 | ओ ( ो ), औ ( ौ ), अं ( ं ), ँ chandrabindu + mega review + 🎉 |
| 4 | 22–31 | two-maatra words, long words, sentences, sight words, animals, easy conjuncts, food, colours/numbers/family, a rhyme, and 🎓 GRADUATION |

## How the daily unlock works
- `config.js` sets `startDate`. The app computes today's day automatically, so Myra always gets
  the right lesson **even if an automated push is missed** — nothing ever breaks.
- `progress.json` holds `unlockedDay` + a fresh **"Word of the Day"**. A daily automation updates
  and pushes it each morning, so there's always something new on the home screen.

## Files
| File | Purpose |
|------|---------|
| `index.html` | App shell |
| `style.css` | Kid-friendly, mobile-first styles |
| `curriculum.js` | The 31-day lesson data |
| `script.js` | App engine: TTS, games, rewards |
| `config.js` | Start date + child/mascot settings |
| `progress.json` | Daily unlock + word of the day (auto-updated) |

## Hosting
Static site served by **GitHub Pages** from `main` / root. No build step, no dependencies,
no trackers — everything runs in the browser.

Made with ❤️ for Myra.
