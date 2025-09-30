import React, { useState, useEffect } from "react";

function CompoundWordSolo({ onBack, deck, onRestart }) {

  // All state declarations first
  const [dialog, setDialog] = useState({ open: false, type: '', text: '' });
  const [pendingDraw, setPendingDraw] = useState(false);
  // Pick random 5 pairs from deck
  const randomPairs = React.useMemo(() => {
    const pairs = [...deck];
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    return pairs.slice(0, 5);
  }, [deck]);
  // Flatten for card drawing
  const shuffled = React.useMemo(() => {
    const cards = randomPairs.flat();
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }, [randomPairs]);
  const [drawn, setDrawn] = useState(shuffled.slice(0, 5));
  const [remaining, setRemaining] = useState(shuffled.slice(5));
  const [selected, setSelected] = useState([]);
  const [found, setFound] = useState([]);
  const [message, setMessage] = useState("");
  const [winner, setWinner] = useState(false);

  // Show dialog when message changes
  useEffect(() => {
    if (message.startsWith('🎉 Success!')) {
      setDialog({ open: true, type: 'success', text: message });
      setTimeout(() => setDialog({ open: false, type: '', text: '' }), 1500);
    } else if (message.startsWith('❌')) {
      setDialog({ open: true, type: 'error', text: message });
      setTimeout(() => setDialog({ open: false, type: '', text: '' }), 1500);
    } else if (message.startsWith('Already found')) {
      setDialog({ open: true, type: 'info', text: message });
      setTimeout(() => setDialog({ open: false, type: '', text: '' }), 1200);
    }
  }, [message]);

  // Show winner dialog
  useEffect(() => {
    if (winner) {
      setDialog({ open: true, type: 'winner', text: '🎉 Winner! All words found.' });
    }
  }, [winner]);

  // Draw card after found is updated
  useEffect(() => {
    if (pendingDraw) {
      // Remove used cards
      let newDrawn = drawn.filter((c) => !pendingDraw.includes(c));
      let newRemaining = remaining;
      // Automatically draw 2 cards if available
      if (remaining.length > 0) {
        newDrawn.push(remaining[0]);
        newRemaining = newRemaining.slice(1);
      }
      if (newRemaining.length > 0) {
        newDrawn.push(newRemaining[0]);
        newRemaining = newRemaining.slice(1);
      }
      setDrawn(newDrawn);
      setRemaining(newRemaining);
      setSelected([]);
      // Check winner
      if (found.length === randomPairs.length) {
        setWinner(true);
      }
      setPendingDraw(false);
    }
  }, [found, pendingDraw, drawn, remaining, deck.length]);

  function handleSelect(card) {
    if (selected.length < 2 && !selected.includes(card)) {
      const newSelected = [...selected, card];
      setSelected(newSelected);
      if (newSelected.length === 2) {
        setTimeout(() => checkCompound(newSelected), 400); // slight delay for UI feedback
      }
    }
  }

  function checkCompound(sel) {
    const selectedCards = sel || selected;
    // Check if selected cards form a compound word
  for (let pair of randomPairs) {
      if (
        (selectedCards[0] === pair[0] && selectedCards[1] === pair[1]) ||
        (selectedCards[1] === pair[0] && selectedCards[0] === pair[1])
      ) {
        const word = pair.join("");
          if (!found.includes(word)) {
            setFound((prev) => [...prev, word]);
            setPendingDraw(selectedCards);
            setMessage(`🎉 Success! You formed "${word}".`);
          } else {
            setMessage("Already found this word!");
            setSelected([]);
          }
        return;
      }
    }
    setMessage("❌ Not found. Try again!");
    setSelected([]);
  }

  function handleDrawCard() {
    if (remaining.length > 0) {
      // Only draw if not already in drawn
      const nextCard = remaining[0];
      if (!drawn.includes(nextCard)) {
        setDrawn([...drawn, nextCard]);
        setRemaining(remaining.slice(1));
      }
    }
  }

  // Helper for colorful cards
  function kidCardColor(idx) {
    const colors = [
      "#f44336",
      "#2196f3",
      "#4caf50",
      "#ff9800",
      "#9c27b0",
      "#00bcd4",
      "#e91e63",
      "#8bc34a",
      "#ffc107",
      "#3f51b5",
    ];
    return colors[idx % colors.length];
  }

  return (
    <div
      className="compound-game kid-bg"
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "grid",
        gridTemplateRows: "10vh 50vh 20vh 20vh",
        gridTemplateColumns: "1fr",
        gap: "0",
        margin: "0",
        position: "relative",
        maxWidth: "100vw",
        background: "linear-gradient(135deg, #fceabb 0%, #f8b500 100%)",
      }}
    >
      {/* Header Section (10%) */}
      <div
        style={{
          gridRow: "1",
          gridColumn: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2vw",
        }}
      >
        <button
          className="btn kid-btn simple-btn"
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            boxShadow: 'none',
            padding: 0,
            margin: 0,
            cursor: 'pointer',
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Back to Game Selection"
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              display: 'block',
              fontSize: '3.2em',
              color: '#ff9800',
              filter: 'drop-shadow(2px 2px 0 #fffbe7)',
              transition: 'transform 0.15s',
            }}
          >
            <circle cx="28" cy="28" r="27" fill="#ff9800" stroke="#fffbe7" strokeWidth="3" />
            <path d="M34 16L22 28L34 40" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h2
            className="rainbow-text"
            style={{
              margin: 0,
              fontSize: "2em",
              fontWeight: "bold",
              textAlign: "center",
              letterSpacing: "3px",
              textShadow: "3px 3px 0 #fffbe7, 0 0 8px #ff9800",
              display: "inline-block",
              fontFamily: 'Luckiest Guy, Comic Sans MS, Bubblegum Sans, cursive',
              background: "linear-gradient(90deg, #ff9800 0%, #ffd600 40%, #43a047 80%, #2196f3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "rainbow 3s linear infinite",
                backgroundSize: "200% auto",
            }}
          >
            <span style={{fontFamily: 'Luckiest Guy, Comic Sans MS, Bubblegum Sans, cursive'}}>Compound Word</span>
          </h2>
        </div>
  <div style={{ width: "10%" }}></div>
      </div>

      {/* Hand Section (50%) - Only show if not winner */}
      {!winner && (
        <div
          style={{
            gridRow: "2",
            gridColumn: "1",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <h3
            className="hand-title"
            style={{
              marginBottom: "18px",
              color: "#ff9800",
              fontWeight: "bold",
              fontSize: "2em",
              textShadow: "2px 2px 0 #fffbe7",
              letterSpacing: "2px",
              animation: "bounceHand 1.2s infinite"
            }}
          >
            <span role="img" aria-label="hand" style={{ marginRight: '10px', fontSize: '1.2em' }}>🖐️</span>Your Hand
          </h3>
          <style>{`
            @keyframes bounceHand {
              0%, 100% { transform: translateY(0); }
              20% { transform: translateY(-8px); }
              40% { transform: translateY(0); }
              60% { transform: translateY(-4px); }
              80% { transform: translateY(0); }
            }
          `}</style>
          <div className="cards-row hand-row" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "18px" }}>
            {drawn.map((card, idx) => (
              <button
                key={card + idx}
                className={`card-btn kid-card simple-btn${selected.includes(card) ? " selected" : ""}`}
                style={{
                  background: selected.includes(card)
                    ? "#ffeb3b"
                    : kidCardColor(idx),
                  color: selected.includes(card) ? "#d32f2f" : "#fff",
                  border: selected.includes(card)
                    ? "2.5px solid #fbc02d"
                    : "1.5px solid #fff",
                  minWidth: "80px",
                  minHeight: "60px",
                  fontSize: "1.5em",
                  boxShadow: selected.includes(card)
                    ? "0 0 12px #fbc02d"
                    : "0 2px 8px rgba(0,0,0,0.10)",
                  borderRadius: "10px",
                  transition: "border 0.2s",
                }}
                onClick={() => handleSelect(card)}
                disabled={selected.length === 2 || selected.includes(card)}
              >
                <b>{card}</b>
              </button>
            ))}
          </div>
          <div style={{ marginTop: "40px", marginBottom: "12px", display: 'flex', justifyContent: 'center' }}>
            <button
              className="btn kid-btn draw-card-btn"
              onClick={handleDrawCard}
              disabled={remaining.length === 0}
              style={{
                minWidth: "180px",
                fontSize: "1.4em",
                padding: "18px 32px",
                borderRadius: "24px",
                background: "linear-gradient(135deg, #2196f3 0%, #00bcd4 100%)",
                color: '#fff',
                fontWeight: 'bold',
                boxShadow: '0 4px 16px rgba(33,150,243,0.15)',
                border: 'none',
                outline: 'none',
                letterSpacing: '1px',
                transition: 'transform 0.15s',
                cursor: remaining.length === 0 ? 'not-allowed' : 'pointer',
                margin: '0',
                position: 'relative',
                animation: 'pulseDrawCard 1.5s infinite',
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span role="img" aria-label="draw" style={{ marginRight: '10px', fontSize: '1.2em' }}>🎲</span>Draw Card
            </button>
            <style>{`
              @keyframes pulseDrawCard {
                0%, 100% { box-shadow: 0 4px 16px rgba(33,150,243,0.15); }
                50% { box-shadow: 0 0 32px 8px #00bcd4; }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* Message Section (20%) */}
      <div
        style={{
          gridRow: "3",
          gridColumn: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        {winner ? (
          <div
            className={`kid-inline-dialog kid-modal-winner`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              background: 'rgba(255,251,231,0.85)',
            }}
          >
            <div style={{
              textAlign: "center",
              minHeight: "64px",
              width: "90%",
              maxWidth: "480px",
              margin: "0 auto",
              borderRadius: "24px",
              background: "#fffbe7",
              boxShadow: "0 2px 24px rgba(0,0,0,0.12)",
              border: "3px solid #ffd600",
              padding: "32px 0 32px 0",
              fontSize: "2em",
              fontWeight: "bold",
              color: "#333",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{ fontSize: "3em", marginBottom: 12, animation: "bounce 1s infinite" }}>🏆</div>
              <div>🎉 Winner! All words found.</div>
              <div style={{ display: 'flex', gap: '24px', marginTop: 18, justifyContent: 'center' }}>
                  <button
                    className="btn kid-btn simple-btn"
                    style={{ background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)', borderRadius: '24px', width: '90px', height: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginRight: '20px', boxShadow: '0 2px 12px rgba(76, 175, 80, 0.15)', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1em', padding: 0 }}
                    onClick={onRestart}
                    aria-label="Restart Game"
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '2px' }}>
                      <circle cx="12" cy="12" r="12" fill="#8bc34a"/>
                      <path d="M12 6v6l4 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20 12a8 8 0 1 1-8-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ color: '#43a047', fontWeight: 'bold', fontSize: '0.7em', textShadow: '0 1px 4px #fff', margin: 0, lineHeight: 1 }}>Restart</span>
                  </button>
                  <button
                    className="btn kid-btn simple-btn"
                    style={{ background: 'linear-gradient(135deg, #ff9800 0%, #ffd600 100%)', borderRadius: '24px', width: '90px', height: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(255, 152, 0, 0.15)', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1em', padding: 0 }}
                    onClick={onBack}
                    aria-label="Home Page"
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '2px' }}>
                      <circle cx="12" cy="12" r="12" fill="#ffd600"/>
                      <path d="M3 12l9-9 9 9" stroke="#ff9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="7" y="12" width="10" height="7" fill="#fff" stroke="#ff9800" strokeWidth="2" rx="2"/>
                    </svg>
                    <span style={{ color: '#ff9800', fontWeight: 'bold', fontSize: '0.7em', textShadow: '0 1px 4px #fff', margin: 0, lineHeight: 1 }}>Home</span>
                  </button>
              </div>
            </div>
          </div>
        ) : dialog.open ? (
          <div
            className={`kid-inline-dialog kid-modal-${dialog.type}`}
            style={{
              textAlign: "center",
              minHeight: "48px",
              width: "340px",
              maxWidth: "340px",
              borderRadius: "18px",
              background: "#fffbe7",
              boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
              border: "2.5px solid #ffe082",
              padding: "16px 12px",
              fontSize: "1.15em",
              fontWeight: "bold",
              color: "#333",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {dialog.type === "success" && (
              <div style={{ fontSize: "2em", marginBottom: 4 }}>🌟</div>
            )}
            {dialog.type === "error" && (
              <div style={{ fontSize: "2em", marginBottom: 4 }}>😕</div>
            )}
            {dialog.type === "info" && (
              <div style={{ fontSize: "2em", marginBottom: 4 }}>🔎</div>
            )}
            <div>{dialog.text}</div>
          </div>
        ) : null}
      </div>

      {/* Found Words Section (20%) - 3x3 grid of buttons */}
      <div
        style={{
          gridRow: "4",
          gridColumn: "1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <h4 className="rainbow-text" style={{ margin: "12px 0 8px 0" }}>Found Words:</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(randomPairs.length, 3)}, 1fr)`,
            gridAutoRows: "1fr",
            gap: "12px",
            width: "100%",
            maxWidth: "600px",
            minHeight: "48px",
            margin: "0 auto",
            padding: "12px 0",
          }}
        >
          {[...Array(randomPairs.length)].map((_, idx) => {
            const word = found[idx];
            return (
              <button
                key={"found-" + idx}
                className="btn kid-btn simple-btn"
                style={{
                  background: word ? "#e0f7fa" : "#f5f5f5",
                  color: word ? "#2e7d32" : "#aaa",
                  fontWeight: "bold",
                  fontSize: "1.1em",
                  border: word ? "2px solid #26a69a" : "2px dashed #ccc",
                  borderRadius: "12px",
                  minHeight: "48px",
                  minWidth: "0",
                  opacity: word ? 1 : 0.5,
                  cursor: "default",
                }}
                disabled
              >
                {word || ""}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CompoundWordSolo;
