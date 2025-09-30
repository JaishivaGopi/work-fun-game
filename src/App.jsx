
import { useState } from "react";
import CompoundWordSolo from "./CompoundWordSolo";
import compoundWords from "./compoundWords.json";
import AlphaShoot from "./AlphaShoot";
import FindAdjective from "./FindAdjective";
import VR from "./VR";
import NVR from "./NVR";

const GAME_OPTIONS = [
  { key: 'compound', label: 'Compound Word-Solo' },
  { key: 'adjective', label: 'Find Adjective' },
  { key: 'vr', label: 'VR' },
  { key: 'nvr', label: 'NVR' },
  { key: 'alpha', label: 'Alpha Shoot' },
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
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100dvh',
          width: '100%',
          background: 'linear-gradient(135deg, #fceabb 0%, #f8b500 100%)',
        }}
      >
        <h2
          style={{
            color: '#ff4081',
            fontWeight: 'bold',
            fontSize: '2.2em',
            marginBottom: '24px',
            textShadow: '2px 2px 0 #fffbe7',
          }}
        >
          Enter Username
        </h2>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Your name"
          className="input"
          style={{
            width: '320px',
            maxWidth: '90%',
            padding: '16px 20px',
            fontSize: '1.3em',
            borderRadius: '16px',
            border: '2.5px solid #ff9800',
            boxShadow: '0 2px 12px rgba(255, 152, 0, 0.15)',
            marginBottom: '24px',
            background: '#fffbe7',
            color: '#e53935',
            textAlign: 'center',
            fontWeight: 'bold',
            outline: 'none',
            transition: 'border 0.2s',
          }}
        />
        <button
          className="btn"
          disabled={!username.trim()}
          onClick={() => setPage('select')}
          style={{
            width: '180px',
            padding: '16px 0',
            fontSize: '1.3em',
            borderRadius: '16px',
            background: '#43a047',
            color: '#fff',
            fontWeight: 'bold',
            boxShadow: '0 2px 12px rgba(67, 160, 71, 0.15)',
            marginBottom: '8px',
            cursor: username.trim() ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s',
          }}
        >
          <span role="img" aria-label="rocket" style={{ marginRight: '8px' }}>🚀</span>Join
        </button>
      </div>
    );
  }

  // Game selection page
  if (page === 'select') {
    const buttonColors = [
      'linear-gradient(135deg, #ff9800 0%, #ffd600 100%)',
      'linear-gradient(135deg, #43a047 0%, #8bc34a 100%)',
      'linear-gradient(135deg, #2196f3 0%, #00bcd4 100%)',
      'linear-gradient(135deg, #e91e63 0%, #f8bbd0 100%)',
      'linear-gradient(135deg, #8e24aa 0%, #e1bee7 100%)', // Alpha Shoot
    ];
    return (
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100dvh',
          width: '100%',
          background: 'linear-gradient(135deg, #fceabb 0%, #f8b500 100%)',
        }}
      >
        <h2 style={{ color: '#ff4081', fontWeight: 'bold', fontSize: '2.2em', marginBottom: '18px', textShadow: '2px 2px 0 #fffbe7' }}>
          Welcome, {username}!
        </h2>
        <h3 style={{ color: '#e53935', fontWeight: 'bold', fontSize: '1.5em', marginBottom: '24px', textShadow: '1px 1px 0 #fffbe7' }}>
          Select a Game
        </h3>
        <div className="game-options" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', marginBottom: '32px' }}>
          {GAME_OPTIONS.map((opt, idx) => (
            <button
              key={opt.key}
              className="btn game-btn"
              onClick={() => {
                setSelectedGame(opt.key);
                setPage(opt.key === 'compound' ? 'level' : 'game');
              }}
              style={{
                background: buttonColors[idx % buttonColors.length],
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.25em',
                borderRadius: '18px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                padding: '24px 36px',
                margin: '0',
                outline: 'none',
                border: 'none',
                transition: 'transform 0.15s',
                cursor: 'pointer',
                letterSpacing: '1px',
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span role="img" aria-label="game" style={{ marginRight: '12px', fontSize: '1.3em' }}>🎮</span>{opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Level selection for Compound Word-Solo
  if (page === 'level') {
    const levelColors = [
      'linear-gradient(135deg, #43a047 0%, #8bc34a 100%)', // easy
      'linear-gradient(135deg, #ff9800 0%, #ffd600 100%)', // medium
      'linear-gradient(135deg, #e53935 0%, #ff8a65 100%)', // hard
    ];
    return (
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100dvh',
          width: '100%',
          background: 'linear-gradient(135deg, #fceabb 0%, #f8b500 100%)',
        }}
      >
        <h2 style={{ color: '#ff4081', fontWeight: 'bold', fontSize: '2.2em', marginBottom: '18px', textShadow: '2px 2px 0 #fffbe7' }}>
          Select Difficulty
        </h2>
        <div className="game-options" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', marginBottom: '32px' }}>
          {['easy', 'medium', 'hard'].map((lvl, idx) => (
            <button
              key={lvl}
              className={`btn game-btn${level === lvl ? ' selected' : ''}`}
              style={{
                background: levelColors[idx],
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.25em',
                borderRadius: '18px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                padding: '24px 36px',
                margin: '0',
                outline: 'none',
                border: 'none',
                transition: 'transform 0.15s',
                cursor: 'pointer',
                letterSpacing: '1px',
              }}
              onClick={() => {
                setLevel(lvl);
                setPage('game');
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span role="img" aria-label="level" style={{ marginRight: '12px', fontSize: '1.3em' }}>⭐</span>{lvl.charAt(0).toUpperCase() + lvl.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ height: '20vh' }} />
        <button
          className="btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontWeight: 'bold',
            fontSize: '1.05em',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2196f3 0%, #00bcd4 100%)',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
          }}
          onClick={() => setPage('select')}
        >
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
    if (selectedGame === 'alpha') {
      return (
        <AlphaShoot
          onBack={() => setPage('select')}
        />
      );
    }
    if (selectedGame === 'adjective') {
      return (
        <FindAdjective
          onBack={() => setPage('select')}
        />
      );
    }
    if (selectedGame === 'vr') {
      return (
        <VR
          onBack={() => setPage('select')}
        />
      );
    }
    if (selectedGame === 'nvr') {
      return (
        <NVR
          onBack={() => setPage('select')}
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
