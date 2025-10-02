import React, { useEffect, useMemo, useState } from "react";
import WORDS from "./words.json";

// ------------ small helpers ------------
const rand = (n) => Math.floor(Math.random() * n);
const sample = (arr) => arr[rand(arr.length)];
const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a,b)=>a[0]-b[0]).map(([,v])=>v);

function speak(text) {
  try {
    const u = new window.SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch (e) { /* silently ignore */ }
}

function useBeep() {
  const play = (type = "win") => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type === "win" ? "triangle" : type === "tap" ? "square" : "sine";
      o.frequency.value = type === "win" ? 784 : type === "tap" ? 440 : 220;
      o.connect(g); g.connect(ctx.destination);
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.start(); o.stop(t + 0.19);
    } catch (e) { /* ignore */ }
  };
  return play;
}



const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function makeKeyboard(targetWord) {
  const uniqueTarget = Array.from(new Set(targetWord.split("")));
  const decoys = shuffle(ALPHABET.filter((L) => !uniqueTarget.includes(L))).slice(0, Math.max(3, 6 - uniqueTarget.length));
  return shuffle([...uniqueTarget, ...decoys]);
}

export default function SpellBeeFinder({ onBack }) {
  const beep = useBeep();
  const [level, setLevel] = useState(0);
  const [streak, setStreak] = useState(0);
  const [stars, setStars] = useState(0);
  const [muted, setMuted] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const current = WORDS[level % WORDS.length];
  const target = current.word.toUpperCase();
  const keys = useMemo(() => makeKeyboard(target), [target, level]);

  const [answer, setAnswer] = useState("");

  useEffect(() => { setAnswer(""); }, [level]);

  function press(letter) {
    if (answer.length >= target.length) return;
    const next = (answer + letter).slice(0, target.length);
    setAnswer(next);
    if (!muted) beep("tap");
  }
  function clearOne() { setAnswer((a) => a.slice(0, -1)); }
  function clearAll() { setAnswer(""); }

  useEffect(() => {
    if (answer.length !== target.length) return;
    if (answer === target) {
      if (!muted) beep("win");
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 900);
      setStars((s) => Math.min(3, s + 1));
      setStreak((s) => s + 1);
      // advance after short pause
      const id = setTimeout(() => setLevel((lv) => lv + 1), 850);
      return () => clearTimeout(id);
    } else {
      setStreak(0);
    }
  }, [answer]);

  function handleSpeak() { speak(current.word.toLowerCase()); }

  // simple confetti burst using emojis
  const Confetti = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }).map((_, i) => (
        <span key={i} className="absolute text-2xl" style={{ left: `${rand(100)}%`, top: `${rand(30)}%`, animation: `fall 900ms ease-out forwards`, transform: `translateY(-20px)` }}>
          {sample(["🎉","✨","🌟","💫","🎈","⭐"]) }
        </span>
      ))}
    </div>
  );

  return (
    <div className="spellme-root">
      <style>{`
        @keyframes pop { 0%{transform:scale(.9);opacity:.6} 100%{transform:scale(1);opacity:1} }
        @keyframes fall { to { transform: translateY(40vh) rotate(25deg); opacity: .9 } }
        .spellme-root {
          min-height: 100dvh;
          width: 100vw;
          background: linear-gradient(135deg, #fffbe7 0%, #b3e5fc 100%);
          color: #222;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 0;
          box-sizing: border-box;
          overflow-x: hidden; /* Prevent horizontal scroll/cutoff */
        }
        .spellme-container {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 12px 12px 0 12px;
          box-sizing: border-box;
        }
        .spellme-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .spellme-title {
          font-size: 2em;
          font-weight: bold;
          color: #1976d2;
          text-shadow: 1px 1px 0 #fff;
        }
        .spellme-stats {
          display: flex;
          gap: 12px;
          font-size: 1em;
        }
        .spellme-main {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 2px 16px rgba(33,150,243,0.08);
          padding: 32px 8px 28px 8px;
          margin-bottom: 12px;
          position: relative;
          min-height: 420px;
          width: 100%;
          box-sizing: border-box;
          overflow-x: auto; /* Prevent content cutoff */
        }
        /* Responsive: make container and main fill more width on large screens */
        @media (min-width: 600px) {
          .spellme-container {
            max-width: 98vw;
            padding-left: 32px;
            padding-right: 32px;
          }
          .spellme-main {
            padding-left: 32px;
            padding-right: 32px;
          }
        }
        @media (min-width: 1000px) {
          .spellme-container {
            max-width: 1200px;
          }
        }
        .spellme-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }
        .spellme-prompt-row {
          flex-direction: row !important;
          justify-content: center;
          align-items: center;
          gap: 12px;
          width: 100%;              /* Make prompt row fill available width */
          max-width: 100%;          /* Prevent overflow */
        }
        .spellme-emoji,
        .spellme-clue,
        .spellme-say {
          flex-shrink: 0;
        }
        .spellme-clue {
          flex: 1 1 0;
          font-size: 1em;
          max-width: 320px;
          text-align: left;
          word-break: break-word;
        }
        @media (max-width: 700px) {
          .spellme-prompt-row {
            gap: 6px;
          }
          .spellme-clue {
            max-width: 120px;
            font-size: 0.95em;
          }
        }
        .spellme-emoji {
          font-size: 2.2em;
        }
        .spellme-clue {
          font-size: 1em;
          max-width: 120px;
          text-align: left;
        }
        .spellme-say {
          margin-top: 6px;
          padding: 7px 18px;
          border-radius: 12px;
          background: #1976d2;
          color: #fff;
          font-weight: bold;
          border: none;
          font-size: 1em;
          box-shadow: 0 2px 8px rgba(33,150,243,0.10);
        }
        .spellme-answer {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 14px;
          width: 100%;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        .spellme-slot {
          flex: 1 1 0;
          min-width: 0;
          width: 100%;
          height: 54px;
          border-radius: 12px;
          border: 2.5px solid #b3e5fc;
          background: #e3f2fd;
          font-size: 2em;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, border-color 0.2s;
        }
        .spellme-slot.filled {
          border-color: #1976d2;
          background: #bbdefb;
        }
        .spellme-keyboard-row {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 8px;
          text-align: center;
          width: 100%;
        }
        .spellme-keyboard-clear-row {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 28px; /* Increased gap above the clear button */
          width: 100%;
        }
        .spellme-key {
          flex: 1 1 0;
          min-width: 0;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #fffbe7 0%, #b3e5fc 100%);
          border: 1.5px solid #b3e5fc;
          font-size: 1.2em;
          font-weight: bold;
          box-shadow: 0 1px 4px rgba(33,150,243,0.06);
          transition: background 0.15s, transform 0.1s;
          color: #7c3aed;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0;
          max-width: 80px;
        }
        .spellme-key:active {
          background: #1976d2;
          color: #fff;
          transform: scale(0.96);
        }
        .spellme-key.special {
          background: #ffe082;
          border: 1.5px solid #ffd600;
          color: #333;
          min-width: 100px;
          max-width: 160px;
          margin-left: auto;
          margin-right: auto;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        @media (max-width: 700px) {
          .spellme-answer {
            max-width: 98vw;
            gap: 4px;
          }
          .spellme-slot {
            font-size: 1.3em;
            height: 40px;
          }
          .spellme-key {
            font-size: 1em;
            height: 40px;
            max-width: 60px;
          }
        }
        .spellme-footer {
          text-align: center;
          font-size: 0.78em;               /* Smaller footer text */
          color: #888;
          margin-top: 4px;
        }
        .spellme-back-btn {
          position: absolute;
          top: 18px;
          left: 18px;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          z-index: 10;
        }
        .spellme-back-btn svg {
          width: 44px;
          height: 44px;
          display: block;
          border-radius: 50%;
          background: #fffbe7;
          box-shadow: 0 2px 8px rgba(33,150,243,0.10);
          border: 2.5px solid #1976d2;
          transition: background 0.15s, border 0.15s;
        }
        .spellme-back-btn:hover svg {
          background: #ffe082;
          border: 2.5px solid #ff9800;
        }
      `}</style>

      {/* Back Icon Button */}
      <button className="spellme-back-btn" aria-label="Back" onClick={onBack}>
        <svg viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="#fffbe7" stroke="#1976d2" strokeWidth="3"/>
          <path d="M28 16L20 24L28 32" stroke="#1976d2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="spellme-container">
        <header className="spellme-header">
          <div className="spellme-title">SpellBee Finder 🐝</div>
          <div className="spellme-stats">
            <span>Streak: <b>{streak}</b></span>
            <span>Stars: <b>{"★".repeat(stars)}{"☆".repeat(3 - stars)}</b></span>
            <button onClick={() => setMuted(m => !m)} className="spellme-say" style={{background: muted ? "#bdbdbd" : "#1976d2"}}>{muted ? "Unmute" : "Mute"}</button>
          </div>
        </header>

        <main className="spellme-main">
          {celebrate && <Confetti />}

          {/* prompt */}
          <section className="spellme-prompt spellme-prompt-row">
            <div className="spellme-emoji" aria-hidden>{current.emoji}</div>
            <div className="spellme-clue">{current.clue}</div>
            <button onClick={handleSpeak} className="spellme-say">Say it 🔊</button>
          </section>

          {/* answer slots */}
          <section className="spellme-answer">
            {target.split("").map((_, i) => (
              <div key={i} className={`spellme-slot${answer[i] ? " filled" : ""}`}>{answer[i] || ''}</div>
            ))}
          </section>

          {/* keyboard in one row with clear button on next row */}
          <section>
            <div className="spellme-keyboard-row">
              {keys.map((L, i) => (
                <button
                  key={L + i}
                  onClick={() => press(L)}
                  className="spellme-key"
                >
                  {L}
                </button>
              ))}
            </div>
            <div className="spellme-keyboard-clear-row">
              <button onClick={clearAll} className="spellme-key special">Clear</button>
            </div>
          </section>
        </main>

        <footer className="spellme-footer">
          Level {level + 1} • {current.word.length} letters<br />
          <span>Tip: tiles are big and tappable—perfect for phones and tablets.</span>
        </footer>
      </div>
    </div>
  );
}
