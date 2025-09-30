import React, { useState, useEffect, useRef } from "react";
import "./ShapeColors.css";

const SHAPES = ["circle", "square", "triangle"];
const COLORS = ["red", "blue", "green", "yellow", "purple", "orange"];

function getRandomShapeColor() {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  return { shape, color };
}

function generateGrid(target, difficulty) {
  let gridSize = 9;
  if (difficulty === 'easy') gridSize = 4;
  else if (difficulty === 'medium') gridSize = 9;
  else if (difficulty === 'hard') gridSize = 16;
  const grid = [];
  const correctIdx = Math.floor(Math.random() * gridSize);
  for (let i = 0; i < gridSize; i++) {
    if (i === correctIdx && target) {
      grid.push({ shape: target.shape, color: target.color });
    } else {
      let sc = getRandomShapeColor();
      while (target && sc.shape === target.shape && sc.color === target.color) {
        sc = getRandomShapeColor();
      }
      grid.push(sc);
    }
  }
  return grid;
}

function ShapeColors({ onBack }) {
  const [difficulty, setDifficulty] = useState(null);
  const [target, setTarget] = useState(null);
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(25);
  const [streak, setStreak] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(true);
  const [level, setLevel] = useState(1);
  useEffect(() => {
    if (showLevelUp && level === 1) {
      const timer = setTimeout(() => setShowLevelUp(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [showLevelUp, level]);
  const [intervalMs, setIntervalMs] = useState(1000);
  const timerRef = useRef();

  useEffect(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [intervalMs]);

  // Set target and grid when difficulty is chosen
  useEffect(() => {
    if (!difficulty) return;
    const firstTarget = getRandomShapeColor();
    setTarget(firstTarget);
    setGrid(generateGrid(firstTarget, difficulty));
  }, [difficulty]);

  // Regenerate grid whenever target changes (after click)
  useEffect(() => {
    if (!difficulty || !target) return;
    setGrid(generateGrid(target, difficulty));
  }, [target]);

  function handleTileClick(shape, color) {
    if (timer === 0) return;
    let nextScore = score;
    if (shape === target.shape && color === target.color) {
      nextScore = score + 1;
      setScore(nextScore);
      setStreak((st) => st + 1);
      // Level up logic
      if (nextScore % 10 === 0 && nextScore !== 0) {
        setShowLevelUp(true);
        setLevel((lvl) => lvl + 1);
        setIntervalMs((ms) => Math.max(100, ms - 100));
        setTimeout(() => setShowLevelUp(false), 1200);
      }
    } else {
      setStreak(0);
    }
    // Reset timer for each question, reduce by level
    setTimer(Math.max(5, 25 - (level - 1)));
    // Pick next target and grid after scoring
    const nextTarget = getRandomShapeColor();
    setTarget(nextTarget);
  }

  function handleRestart() {
    setScore(0);
    setStreak(0);
    setTimer(25);
    setLevel(1);
    setIntervalMs(1000);
    setShowLevelUp(false);
    const newTarget = getRandomShapeColor();
    setTarget(newTarget);
  }

  if (!difficulty) {
    return (
      <div className="scq-container">
        {/* Cartoon clouds background */}
        <div className="scq-cloud" style={{ top: '8vh' }} />
        <div className="scq-cloud small" style={{ top: '22vh', left: '10vw' }} />
        <div className="scq-cloud tiny" style={{ top: '60vh', left: '70vw' }} />
        <div className="scq-cloud small" style={{ top: '70vh', left: '30vw' }} />
        <div className="scq-cloud" style={{ top: '40vh', left: '80vw' }} />
        <button className="scq-back" onClick={onBack}>&#8592; Back</button>
        <h2 className="scq-title">Shapes & Colors Quest</h2>
        <h3 style={{ fontWeight: 'bold', color: '#43a047', marginBottom: 24 }}>Select Difficulty</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', marginBottom: 32 }}>
          <button className="scq-diff-btn" style={{ background: '#43a047', color: 'white', fontWeight: 'bold', width: 180, fontSize: '1.2em' }} onClick={() => setDifficulty('easy')}>Easy (2x2)</button>
          <button className="scq-diff-btn" style={{ background: '#ff9800', color: 'white', fontWeight: 'bold', width: 180, fontSize: '1.2em' }} onClick={() => setDifficulty('medium')}>Medium (3x3)</button>
          <button className="scq-diff-btn" style={{ background: '#e53935', color: 'white', fontWeight: 'bold', width: 180, fontSize: '1.2em' }} onClick={() => setDifficulty('hard')}>Hard (4x4)</button>
        </div>
      </div>
    );
  }

  return (
    <div className="scq-container">
      {/* Cartoon clouds background */}
      <div className="scq-cloud" style={{ top: '8vh' }} />
      <div className="scq-cloud small" style={{ top: '22vh', left: '10vw' }} />
      <div className="scq-cloud tiny" style={{ top: '60vh', left: '70vw' }} />
      <div className="scq-cloud small" style={{ top: '70vh', left: '30vw' }} />
      <div className="scq-cloud" style={{ top: '40vh', left: '80vw' }} />

      <button className="scq-back" onClick={onBack}>&#8592; Back</button>
      <h2 className="scq-title">Shapes & Colors Quest</h2>
      <div className="scq-timer">⏰ {timer}s</div>
      {showLevelUp && (
        <div className="scq-dialog" style={{ background: '#e3fcef', border: '3px solid #43a047', color: '#43a047', fontWeight: 'bold', fontSize: '1.5em', position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, 0)', zIndex: 10 }}>
          <span role="img" aria-label="level up">🚀</span> Level Up! <span style={{fontSize:'1.2em'}}>Level {level}</span>
        </div>
      )}
      <div className="scq-prompt">
        Find the <span style={{ color: target?.color }}>{target?.color}</span> {target?.shape}
      </div>
      <div className="scq-grid" style={{
        gridTemplateColumns: difficulty === 'easy' ? 'repeat(2, 1fr)' : difficulty === 'medium' ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
        gridTemplateRows: difficulty === 'easy' ? 'repeat(2, 1fr)' : difficulty === 'medium' ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
      }}>
        {grid.map(({ shape, color }, idx) => (
          <button
            key={idx}
            className={`scq-tile scq-${shape} scq-${color}`}
            onClick={() => handleTileClick(shape, color)}
            disabled={timer === 0}
          >
            <span className="scq-shape" style={{ color }}>
              {shape === "circle" && <svg width="64" height="64"><circle cx="32" cy="32" r="26" fill={color} /></svg>}
              {shape === "square" && <svg width="64" height="64"><rect x="12" y="12" width="40" height="40" fill={color} /></svg>}
              {shape === "triangle" && <svg width="64" height="64"><polygon points="32,10 58,54 6,54" fill={color} /></svg>}
            </span>
          </button>
        ))}
      </div>
      <div className="scq-score">Score: <span>{score}</span> | Streak: <span>{streak}</span></div>
      {timer === 0 && (
        <div className="scq-dialog">
          <h3>Time's Up!</h3>
          <p>Your Score: {score}</p>
          <button className="scq-restart" onClick={handleRestart}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default ShapeColors;
