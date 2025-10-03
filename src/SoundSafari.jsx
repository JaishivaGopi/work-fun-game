import React, { useEffect, useMemo, useState } from "react";

/**
 * Sound Safari – Reception Phonics Mini‑App (UK)
 * -------------------------------------------------
 * Goal: "Find something that starts with the sound /s/" etc.
 * Mobile‑first, emoji pictures (no assets), big tap targets, voice prompts.
 *
 * Drop this component into a Vite + React project and export as default.
 * Tailwind recommended for styles but not required (basic inline styles also used).
 */

// -------- helpers --------
const rand = (n) => Math.floor(Math.random() * n);
const sample = (arr) => arr[rand(arr.length)];
const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a,b)=>a[0]-b[0]).map(([,v])=>v);

function speak(text) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95; // gentle, kid‑friendly pace
    u.pitch = 1;
    u.lang = "en-GB"; // prefer UK voice where available
    const voices = window.speechSynthesis.getVoices?.() || [];
    const gb = voices.find(v => v.lang?.startsWith("en-GB")) || voices.find(v => v.lang?.startsWith("en"));
    if (gb) u.voice = gb;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch (e) {
    // no‑op
  }
}

// speak the prompt then the pure sound cue (avoids TTS reading slashes)
function speakPrompt(soundCue) {
  try {
    speak("Find something that starts with the sound");
    setTimeout(() => speak(soundCue), 350);
  } catch (e) {}
}

function useCountdown(active, seconds, onEnd) {
  const [time, setTime] = useState(seconds);
  useEffect(() => setTime(seconds), [seconds]);
  useEffect(() => {
    if (!active) return;
    if (time <= 0) { onEnd && onEnd(); return; }
    const id = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [active, time]);
  return [time, setTime];
}

// -------- phonics bank (initial sound) --------
// Choose Reception‑friendly sounds (Phase 2/3): s, a, t, p, i, n, m, d, g, o, c, k
const SOUND_BANK = [
  {
    key: "s",
    phoneme: "/s/",
    speak: "sss",
    words: [
      { word: "sun", emoji: "☀️" },
      { word: "snake", emoji: "🐍" },
      { word: "sock", emoji: "🧦" },
      { word: "sand", emoji: "🏖️" },
      { word: "soap", emoji: "🧼" },
    ],
  },
  {
    key: "a",
    phoneme: "/a/",
    speak: "a as in apple",
    words: [
      { word: "apple", emoji: "🍎" },
      { word: "ant", emoji: "🐜" },
      { word: "axe", emoji: "🪓" },
      { word: "astronaut", emoji: "👩‍🚀" },
      { word: "acorn", emoji: "🌰" },
    ],
  },
  {
    key: "t",
    phoneme: "/t/",
    speak: "t",
    words: [
      { word: "tiger", emoji: "🐯" },
      { word: "train", emoji: "🚂" },
      { word: "tomato", emoji: "🍅" },
      { word: "tent", emoji: "⛺" },
      { word: "tooth", emoji: "🦷" },
    ],
  },
  {
    key: "p",
    phoneme: "/p/",
    speak: "p",
    words: [
      { word: "pig", emoji: "🐖" },
      { word: "pen", emoji: "🖊️" },
      { word: "pizza", emoji: "🍕" },
      { word: "pan", emoji: "🥘" },
      { word: "pear", emoji: "🍐" },
    ],
  },
  {
    key: "i",
    phoneme: "/i/",
    speak: "i as in insect",
    words: [
      { word: "ink", emoji: "🖋️" },
      { word: "igloo", emoji: "🏠" },
      { word: "insect", emoji: "🐞" },
      { word: "ice", emoji: "🧊" },
      { word: "iguana", emoji: "🦎" },
    ],
  },
  {
    key: "n",
    phoneme: "/n/",
    speak: "n",
    words: [
      { word: "nose", emoji: "👃" },
      { word: "net", emoji: "🕸️" },
      { word: "nest", emoji: "🪺" },
      { word: "ninja", emoji: "🥷" },
      { word: "nuts", emoji: "🥜" },
    ],
  },
  {
    key: "m",
    phoneme: "/m/",
    speak: "mmm",
    words: [
      { word: "moon", emoji: "🌕" },
      { word: "mug", emoji: "☕" },
      { word: "map", emoji: "🗺️" },
      { word: "mask", emoji: "🎭" },
      { word: "milk", emoji: "🥛" },
    ],
  },
  {
    key: "d",
    phoneme: "/d/",
    speak: "d",
    words: [
      { word: "dog", emoji: "🐶" },
      { word: "door", emoji: "🚪" },
      { word: "drum", emoji: "🥁" },
      { word: "duck", emoji: "🦆" },
      { word: "doll", emoji: "🪆" },
    ],
  },
  {
    key: "g",
    phoneme: "/g/",
    speak: "g",
    words: [
      { word: "goat", emoji: "🐐" },
      { word: "grapes", emoji: "🍇" },
      { word: "gift", emoji: "🎁" },
      { word: "guitar", emoji: "🎸" },
      { word: "game", emoji: "🎮" },
    ],
  },
  {
    key: "o",
    phoneme: "/o/",
    speak: "o as in octopus",
    words: [
      { word: "octopus", emoji: "🐙" },
      { word: "orange", emoji: "🍊" },
      { word: "onion", emoji: "🧅" },
      { word: "ox", emoji: "🐂" },
      { word: "otter", emoji: "🦦" },
    ],
  },
  {
    key: "c",
    phoneme: "/k/ (c)",
    speak: "k",
    words: [
      { word: "cat", emoji: "🐱" },
      { word: "car", emoji: "🚗" },
      { word: "cake", emoji: "🎂" },
      { word: "corn", emoji: "🌽" },
      { word: "coin", emoji: "🪙" },
    ],
  },
  {
    key: "k",
    phoneme: "/k/ (k)",
    speak: "k",
    words: [
      { word: "kite", emoji: "🪁" },
      { word: "key", emoji: "🔑" },
      { word: "koala", emoji: "🐨" },
      { word: "king", emoji: "🤴" },
      { word: "kettle", emoji: "🫖" },
    ],
  },
];

// -------- UI bits --------
const Pill = ({ children }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "6px 12px", borderRadius: 9999, background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)", fontSize: 14
  }}>{children}</span>
);

function CardButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        aspectRatio: "1 / 1",
        width: "100%",
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
        display: "grid",
        placeItems: "center",
        fontSize: 44,
        transition: "transform .06s ease",
        touchAction: "manipulation",
        padding: 0,
        overflow: "hidden",
      }}
      onPointerDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
      onPointerUp={e => (e.currentTarget.style.transform = "scale(1)")}
      className="sound-safari-card-btn"
    >
      {children}
    </button>
  );
}

// -------- round generator --------
function makeRound() {
  const sound = sample(SOUND_BANK);
  // 2-3 correct answers among 6 tiles
  const correct = shuffle(sound.words).slice(0, 3);
  const distractPool = SOUND_BANK.filter((s) => s.key !== sound.key).flatMap((s) => s.words);
  const distractors = shuffle(distractPool).slice(0, 6 - correct.length);
  const tiles = shuffle([...correct.map((w) => ({ ...w, correct: true })), ...distractors.map((w) => ({ ...w, correct: false }))]);
  return { sound, tiles };
}

export default function SoundSafari({ onBack }) {
  const [muted, setMuted] = useState(false);
  const [{ sound, tiles }, setState] = useState(makeRound());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [found, setFound] = useState(0); // correct found in this round
  const [round, setRound] = useState(1);

  const [timeLeft, setTimeLeft] = useCountdown(true, 60, () => {});

  useEffect(() => {
    // Speak the prompt at round start
    // speak a friendly cue (no slashes)
    const phrase = null;
    if (!muted) speakPrompt(sound.speak);
  }, [sound, round, muted]);

  function nextRound() {
    setRound((r) => r + 1);
    setFound(0);
    setState(makeRound());
  }

  function handleTileClick(tile) {
    if (tile._disabled) return;
    if (tile.correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      setFound((f) => {
        const nf = f + 1;
        if (nf >= 2) {
          // require 2 correct taps before advancing (tunable)
          setTimeout(nextRound, 400);
        }
        return nf;
      });
      if (!muted) speak(tile.word);
    } else {
      setStreak(0);
      if (!muted) speak("Try again");
    }
  }

  function repeatSound() {
    if (!muted) speak(sound.speak);
  }

  function resetGame() {
    setScore(0); setStreak(0); setFound(0); setRound(1);
    setState(makeRound()); setTimeLeft(60);
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(#f8fafc, #eef6ff)", padding: 16, position: "relative" }}>
      {/* Back Icon Button */}
      <button
        onClick={onBack}
        aria-label="Back"
        style={{
          position: "absolute",
          top: 18,
          left: 18,
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        <svg viewBox="0 0 48 48" width="44" height="44" fill="none">
          <circle cx="24" cy="24" r="22" fill="#fffbe7" stroke="#1976d2" strokeWidth="3"/>
          <path d="M28 16L20 24L28 32" stroke="#1976d2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <header style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 28 }}>Sound Safari 🐾</div>
            <div style={{ color: "#475569", fontSize: 14 }}>Tap the pictures that start with the sound you hear.</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Pill>Round: <b style={{ marginLeft: 6 }}>{round}</b></Pill>
            <Pill>Score: <b style={{ marginLeft: 6 }}>{score}</b></Pill>
            <Pill>Streak: <b style={{ marginLeft: 6 }}>{streak}</b></Pill>
            <Pill>Time: <b style={{ marginLeft: 6 }}>{timeLeft}s</b></Pill>
            <button onClick={() => setMuted((m) => !m)} style={{ padding: "6px 12px", borderRadius: 9999, background: "#0f172a", color: "#fff", fontSize: 14 }}>{muted ? "Unmute" : "Mute"}</button>
          </div>
        </header>

        <main style={{ background: "#fff", borderRadius: 24, boxShadow: "0 10px 30px rgba(2,6,23,0.08)", padding: 16 }}>
          {/* prompt row */}
          <section style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 40 }} aria-hidden>🦁🌴</div>
            <div>
              <div style={{ color: "#075985", fontWeight: 800, fontSize: 18 }}>Find the sound</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0ea5e9" }}>{sound.phoneme}</div>
            </div>
            <div style={{ flex: 1 }} />
            <button onClick={repeatSound} style={{ padding: "10px 14px", borderRadius: 14, background: "#0284c7", color: "white", fontWeight: 700 }}>Play sound 🔊</button>
          </section>

          {/* tiles grid */}
          <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
            {tiles.map((t, i) => (
              <CardButton key={t.word + i} onClick={() => handleTileClick(t)}>
                <div style={{ display: "grid", placeItems: "center", gap: 6 }}>
                  <div style={{ fontSize: 56 }} aria-hidden>{t.emoji}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#334155", textTransform: "capitalize" }}>{t.word}</div>
                </div>
              </CardButton>
            ))}
          </section>

          {/* footer controls */}
          <section style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <div style={{ color: "#64748b", fontSize: 12 }}>Tip: Try to find <b>two</b> pictures that start with the sound.</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={resetGame} style={{ padding: "10px 14px", borderRadius: 14, background: "#e2e8f0", fontWeight: 700 }}>Reset</button>
              <button onClick={nextRound} style={{ padding: "10px 14px", borderRadius: 14, background: "#22c55e", color: "white", fontWeight: 700 }}>Next</button>
            </div>
          </section>
        </main>

        <footer style={{ textAlign: "center", color: "#94a3b8", fontSize: 12, padding: 16 }}>© {new Date().getFullYear()} Sound Safari</footer>
      </div>
    </div>
  );
}
<style>{`
  @media (max-width: 600px) {
    .sound-safari-card-btn {
      font-size: 28px !important;
      min-height: 64px;
      max-height: 90px;
    }
    .sound-safari-card-btn div[aria-hidden] {
      font-size: 32px !important;
    }
    .sound-safari-card-btn div {
      font-size: 13px !important;
    }
    main[style] section[style*="grid"] {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 8px !important;
    }
  }
  @media (max-width: 400px) {
    .sound-safari-card-btn {
      font-size: 20px !important;
      min-height: 48px;
      max-height: 64px;
    }
    .sound-safari-card-btn div[aria-hidden] {
      font-size: 22px !important;
    }
    .sound-safari-card-btn div {
      font-size: 11px !important;
    }
  }
`}</style>
