/* CarTyper landing page — live typing demo + platform-aware CTAs.
   Loaded after main.js (which handles links, menu, reveals). */
(function () {
  "use strict";

  /* ---------- Platform detection ---------- */
  var ua = navigator.userAgent || "";
  var uad = navigator.userAgentData;
  var plat = (uad && uad.platform) || navigator.platform || "";
  var isWindows = /win/i.test(plat) || /Windows/.test(ua);
  var isMobile =
    (uad && uad.mobile) ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(ua) ||
    (navigator.maxTouchPoints > 1 && /Mac/i.test(plat)); // iPadOS reports "Mac"

  if (!isWindows) {
    var winLabel = document.getElementById("hero-win-label");
    if (winLabel) winLabel.textContent = "Windows app for school labs";
    var hint = document.getElementById("hero-hint");
    if (hint) hint.textContent = "Runs in any modern browser · Free · No accounts";
    var web = document.getElementById("dl-web");
    if (web) web.classList.add("order-first"); // lead with the browser version
  }
  if (isMobile) {
    var note = document.getElementById("kb-note");
    if (note) note.classList.remove("hidden");
  }

  /* ---------- Live typing demo ---------- */
  var input = document.getElementById("demo-input");
  var textEl = document.getElementById("demo-text");
  if (!input || !textEl) return;

  var you = document.getElementById("demo-you");
  var ai = document.getElementById("demo-ai");
  var wpmEl = document.getElementById("demo-wpm");
  var accEl = document.getElementById("demo-acc");
  var result = document.getElementById("demo-result");
  var resultText = document.getElementById("demo-result-text");
  var again = document.getElementById("demo-again");

  var SENTENCES = [
    "the quick brown fox jumps over the lazy dog",
    "rockets burn strong fuel to lift heavy satellites into space",
    "a cheetah can sprint faster than any other land animal",
    "the moon pulls on the ocean to make the tides rise and fall",
    "practice every day and your fingers will learn the keys",
    "bees dance to tell each other where the best flowers are",
    "volcanoes form when hot magma pushes up through the crust"
  ];
  var AI_WPM = 28; // beatable by a decent student, a stretch for beginners
  var AI_CPS = (AI_WPM * 5) / 60;

  var target = "";
  var last = -1;
  var start = 0;
  var keys = 0;
  var errs = 0;
  var done = false;
  var raf = 0;

  function place(car, p) {
    // 8px start offset, 56px car, 16px finish strip + gap
    car.style.left = "calc(8px + " + p + " * (100% - 88px))";
  }

  function render(ok, bad) {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < target.length; i++) {
      var s = document.createElement("span");
      s.textContent = target[i];
      if (i < ok) s.className = "text-slate-900";
      else if (i === ok && bad) s.className = "rounded-sm bg-rose-500 text-white";
      else if (i === ok) s.className = "border-b-2 border-rose-500 text-slate-900";
      frag.appendChild(s);
    }
    textEl.textContent = "";
    textEl.appendChild(frag);
  }

  function correctPrefix(v) {
    var n = 0;
    while (n < v.length && v.charCodeAt(n) === target.charCodeAt(n)) n++;
    return n;
  }

  function elapsed() {
    return start ? (performance.now() - start) / 1000 : 0;
  }

  function stats(ok) {
    var t = elapsed();
    wpmEl.textContent = t > 1 ? Math.round(ok / 5 / (t / 60)) : 0;
    accEl.textContent = keys ? Math.round(((keys - errs) / keys) * 100) : 100;
  }

  function tick() {
    place(ai, Math.min(1, (elapsed() * AI_CPS) / target.length));
    stats(correctPrefix(input.value));
    if (!done) raf = requestAnimationFrame(tick);
  }

  function setup() {
    var i;
    do i = Math.floor(Math.random() * SENTENCES.length);
    while (i === last && SENTENCES.length > 1);
    last = i;
    target = SENTENCES[i];
    input.value = "";
    input.maxLength = target.length;
    start = keys = errs = 0;
    done = false;
    cancelAnimationFrame(raf);
    place(you, 0);
    place(ai, 0);
    render(0, false);
    stats(0);
    result.classList.add("hidden");
  }

  function finish() {
    done = true;
    cancelAnimationFrame(raf);
    var t = elapsed();
    var aiTime = target.length / AI_CPS;
    stats(target.length);
    place(ai, Math.min(1, t / aiTime));
    var wpm = wpmEl.textContent;
    var acc = accEl.textContent;
    resultText.textContent =
      t < aiTime
        ? "You won! " + wpm + " WPM at " + acc + "% accuracy — you left Viper in the dust."
        : "Viper got there first. You hit " + wpm + " WPM at " + acc + "% accuracy — race again?";
    result.classList.remove("hidden");
  }

  input.addEventListener("input", function (e) {
    if (done) return;
    if (!start) {
      start = performance.now();
      raf = requestAnimationFrame(tick);
    }
    var v = input.value;
    var ok = correctPrefix(v);
    if (!e.inputType || e.inputType.indexOf("insert") === 0) {
      keys++;
      if (ok < v.length) errs++;
    }
    render(ok, ok < v.length);
    place(you, ok / target.length);
    if (v === target) finish();
  });

  // Typing practice — pasting would defeat the point.
  input.addEventListener("paste", function (e) {
    e.preventDefault();
  });
  textEl.addEventListener("click", function () {
    input.focus();
  });
  again.addEventListener("click", function () {
    setup();
    input.focus();
  });

  setup();
})();
