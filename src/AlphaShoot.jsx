import React, { useState, useEffect, useRef } from "react";

const ALPHABETS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

function getRandomLetter() {
  return ALPHABETS[Math.floor(Math.random() * ALPHABETS.length)];
}

export default function AlphaShoot({ onBack }) {
  const [target, setTarget] = useState(getRandomLetter());
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(false);
  const [timer, setTimer] = useState(5);
  const timerRef = useRef();

  useEffect(() => {
    if (gameOver || winner) return;
    setTimer(5);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleMiss();
          return 5;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [target, gameOver, winner]);

  function handleLetterClick(letter) {
    if (gameOver || winner) return;
    if (letter === target) {
      setScore((s) => {
        if (s + 1 === 10) {
          setWinner(true);
          clearInterval(timerRef.current);
        }
        return s + 1;
      });
      setTarget(getRandomLetter());
    } else {
      handleMiss();
    }
  }

  function handleMiss() {
    setMisses((m) => {
      if (m + 1 === 3) {
        setGameOver(true);
        clearInterval(timerRef.current);
      }
      return m + 1;
    });
    setTarget(getRandomLetter());
  }

  function handleRestart() {
    setScore(0);
    setMisses(0);
    setGameOver(false);
    setWinner(false);
    setTarget(getRandomLetter());
    setTimer(5);
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100vw",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e1bee7 0%, #8e24aa 100%)",
        position: "relative",
      }}
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          background: "#fffbe7",
          border: "2px solid #8e24aa",
          borderRadius: 12,
          fontWeight: "bold",
          fontSize: "1.1em",
          padding: "10px 18px",
          boxShadow: "0 2px 8px rgba(33,150,243,0.10)",
          cursor: "pointer",
        }}
      >
        &#8592; Back
      </button>
      {/* Timer */}
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 32,
          fontSize: "1.3em",
          color: "#d32f2f",
          fontWeight: "bold",
          background: "#fffbe7",
          borderRadius: 10,
          padding: "8px 18px",
          boxShadow: "0 2px 8px rgba(33,150,243,0.10)",
        }}
      >
        ⏰ {timer}s
      </div>
      {/* Game Title */}
      <h2
        style={{
          color: "#8e24aa",
          fontWeight: "bold",
          fontSize: "2.2em",
          marginBottom: 18,
          textShadow: "2px 2px 0 #fffbe7",
          fontFamily: "Luckiest Guy, Comic Sans MS, Bubblegum Sans, cursive",
        }}
      >
        Alpha Shoot
      </h2>
      {/* Target Prompt */}
      {!gameOver && !winner && (
        <h3 style={{ color: "#e53935", fontWeight: "bold", fontSize: "1.5em", marginBottom: 24 }}>
          Find the letter: <span style={{ color: "#43a047", fontSize: "1.5em" }}>{target}</span>
        </h3>
      )}
      {/* Alphabet List */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "18px",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 32,
          maxWidth: "600px",
        }}
      >
        {ALPHABETS.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            disabled={gameOver || winner}
            style={{
              fontSize: "1.5em",
              fontWeight: "bold",
              background: letter === target ? "#ffeb3b" : "#fffbe7",
              color: letter === target ? "#d32f2f" : "#8e24aa",
              border: letter === target ? "3px solid #fbc02d" : "2px solid #8e24aa",
              borderRadius: 12,
              padding: "18px 24px",
              margin: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              cursor: gameOver || winner ? "not-allowed" : "pointer",
              transition: "background 0.2s, color 0.2s, border 0.2s",
            }}
          >
            {letter}
          </button>
        ))}
      </div>
      {/* Score & Misses */}
      <div style={{ fontSize: "1.2em", color: "#333", marginBottom: 18 }}>
        Score: <span style={{ color: "#43a047", fontWeight: "bold" }}>{score}</span> | Misses: <span style={{ color: "#d32f2f", fontWeight: "bold" }}>{misses}</span>
      </div>
      {/* Winner Dialog */}
      {winner && (
        <div
          style={{
            background: "#fffbe7",
            border: "3px solid #ffd600",
            borderRadius: 24,
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            padding: "32px 28px 24px 28px",
            minWidth: 260,
            textAlign: "center",
            fontFamily: "inherit",
            position: "relative",
            marginTop: 24,
          }}
        >
          <h2 style={{ color: "#43a047", fontWeight: "bold", fontSize: "2em", marginBottom: 18 }}>
            🎉 Winner!
          </h2>
          <p style={{ fontSize: "1.2em", color: "#333", marginBottom: 18 }}>
            You found 10 letters!
          </p>
          <button
            onClick={handleRestart}
            style={{
              fontWeight: "bold",
              fontSize: "1.1em",
              borderRadius: 14,
              background: "linear-gradient(135deg, #2196f3 0%, #00bcd4 100%)",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(33,150,243,0.10)",
              padding: "16px 32px",
              marginTop: 12,
            }}
          >
            Play Again
          </button>
        </div>
      )}
      {/* Game Over Dialog */}
      {gameOver && (
        <div
          style={{
            background: "#fffbe7",
            border: "3px solid #e57373",
            borderRadius: 24,
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            padding: "32px 28px 24px 28px",
            minWidth: 260,
            textAlign: "center",
            fontFamily: "inherit",
            position: "relative",
            marginTop: 24,
          }}
        >
          <h2 style={{ color: "#d32f2f", fontWeight: "bold", fontSize: "2em", marginBottom: 18 }}>
            Game Over
          </h2>
          <p style={{ fontSize: "1.2em", color: "#333", marginBottom: 18 }}>
            You missed 3 times.
          </p>
          <button
            onClick={handleRestart}
            style={{
              fontWeight: "bold",
              fontSize: "1.1em",
              borderRadius: 14,
              background: "linear-gradient(135deg, #2196f3 0%, #00bcd4 100%)",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(33,150,243,0.10)",
              padding: "16px 32px",
              marginTop: 12,
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
