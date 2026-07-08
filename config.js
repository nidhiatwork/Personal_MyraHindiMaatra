/* App configuration.
   startDate drives automatic day-unlocking so Myra always gets today's lesson
   even if the daily automation misses a run. The automation ALSO pushes
   progress.json daily (unlockedDay + a fresh "Word of the Day"). */
const APP_CONFIG = {
  startDate: "2026-07-08",   // Day 1 = this date
  totalDays: 31,
  child:  { name: "Myra", hindi: "मायरा" },
  mascot: { name: "मिठू",  nameEn: "Mithu", emoji: "🦜" },
  lang: "hi-IN"
};
if (typeof window !== "undefined") { window.APP_CONFIG = APP_CONFIG; }
if (typeof module !== "undefined") { module.exports = APP_CONFIG; }
