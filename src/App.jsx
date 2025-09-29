
import { useState } from "react";
import CompoundWordSolo from "./CompoundWordSolo";
import compoundWords from "./compoundWords.json";

const GAME_OPTIONS = [
  { key: 'compound', label: 'Compound Word-Solo' },
  { key: 'adjective', label: 'Find Adjective' },
  { key: 'vr', label: 'VR' },
  { key: 'nvr', label: 'NVR' },
];


function App() {
  const [page, setPage] = useState('home');
  const [username, setUsername] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [level, setLevel] = useState('easy');
  const [restartKey, setRestartKey] = useState(0);

  // Home page: username input and join
  if (page === 'home') {
    return (
      <div className="container">
        <h2>Enter Username</h2>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Your name"
          className="input"
        />
        <button
          className="btn"
          disabled={!username.trim()}
          onClick={() => setPage('select')}
        >
          Join
        </button>
      </div>
    );
  }

  // Game selection page
  if (page === 'select') {
    return (
      <div className="container">
        <h2>Welcome, {username}!</h2>
        <h3>Select a Game</h3>
        <div className="game-options">
          {GAME_OPTIONS.map(opt => (
            <button
              key={opt.key}
              className="btn game-btn"
              onClick={() => {
                setSelectedGame(opt.key);
                setPage(opt.key === 'compound' ? 'level' : 'game');
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Level selection for Compound Word-Solo
  if (page === 'level') {
    return (
      <div className="container">
        <h2>Select Difficulty</h2>
        <div className="game-options" style={{ marginBottom: 32 }}>
          {['easy', 'medium', 'hard'].map(lvl => {
            let color = '#43a047'; // green for easy
            if (lvl === 'medium') color = '#ff9800'; // orange
            if (lvl === 'hard') color = '#e53935'; // red
            return (
              <button
                key={lvl}
                className={`btn game-btn${level === lvl ? ' selected' : ''}`}
                style={{ background: color, color: '#fff', fontWeight: 'bold', fontSize: '1.1em', margin: '0 12px 0 0', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
                onClick={() => {
                  setLevel(lvl);
                  setPage('game');
                }}
              >
                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </button>
            );
          })}
        </div>
        <button className="btn" style={{marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 'bold', fontSize: '1.05em'}} onClick={() => setPage('select')}>
          <span style={{fontSize: '1.2em'}}>&#8592;</span> Back
        </button>
      </div>
    );
  }

  // Game page
  if (page === 'game') {
    if (selectedGame === 'compound') {
      return (
        <CompoundWordSolo
          key={restartKey}
          onBack={() => setPage('select')}
          deck={compoundWords[level]}
          onRestart={() => setRestartKey(restartKey + 1)}
        />
      );
    }
    let gameTitle = GAME_OPTIONS.find(g => g.key === selectedGame)?.label || '';
    return (
      <div className="container">
        <h2>{gameTitle}</h2>
        <div className="game-content">
          <p>Game content for <b>{gameTitle}</b> goes here.</p>
        </div>
        <button className="btn" onClick={() => setPage('select')}>
          Back to Game Selection
        </button>
      </div>
    );
  }

  return null;
}

export default App;
