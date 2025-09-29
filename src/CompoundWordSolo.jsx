import React, { useState, useEffect } from "react";

function CompoundWordSolo({ onBack, deck, onRestart }) {

  // All state declarations first
  const [dialog, setDialog] = useState({ open: false, type: '', text: '' });
  const [pendingDraw, setPendingDraw] = useState(false);
  const shuffled = (() => {
    const cards = deck.flat();
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  })();
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
      if (found.length === deck.length) {
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
  for (let pair of deck) {
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
        margin: "0 auto",
        position: "relative",
        maxWidth: "100vw",
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
        <button className="btn kid-btn simple-btn" onClick={onBack}>
          ⬅ Back to Game Selection
        </button>
        <h2 className="rainbow-text" style={{ margin: 0, fontSize: "2.2em" }}>
          Compound Word-Solo
        </h2>
        <div style={{ width: "120px" }}></div>
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
          <h3 className="hand-title" style={{ marginBottom: "18px" }}>Your Hand</h3>
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
                  borderColor: selected.includes(card) ? "#fbc02d" : "#fff",
                  minWidth: "80px",
                  minHeight: "60px",
                  fontSize: "1.5em",
                  boxShadow: selected.includes(card)
                    ? "0 0 12px #fbc02d"
                    : "0 2px 8px rgba(0,0,0,0.10)",
                }}
                onClick={() => handleSelect(card)}
                disabled={selected.length === 2 || selected.includes(card)}
              >
                <b>{card}</b>
              </button>
            ))}
          </div>
          <div style={{ marginTop: "24px" }}>
            <button
              className="btn kid-btn simple-btn"
              onClick={handleDrawCard}
              disabled={remaining.length === 0}
              style={{ minWidth: "120px", fontSize: "1.2em", padding: "12px 24px" }}
            >
              🎲 Draw Card
            </button>
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
              textAlign: "center",
              minHeight: "64px",
              width: "90%",
              maxWidth: "90%",
              margin: "-48px auto 0 auto",
              borderRadius: "0",
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
            }}
          >
            <div style={{ fontSize: "3em", marginBottom: 12, animation: "bounce 1s infinite" }}>🏆</div>
            <div>🎉 Winner! All words found.</div>
            <button
              className="btn kid-btn simple-btn"
              style={{ marginTop: 18, fontSize: "1.2em", padding: "16px 32px" }}
              onClick={onRestart}
            >
              Restart Game
            </button>
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
            gridTemplateColumns: `repeat(${Math.min(deck.length, 3)}, 1fr)`,
            gridAutoRows: "1fr",
            gap: "12px",
            width: "100%",
            maxWidth: "600px",
            minHeight: "48px",
            margin: "0 auto",
            padding: "12px 0",
          }}
        >
          {[...Array(deck.length)].map((_, idx) => {
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
