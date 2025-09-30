import React from "react";

function VR({ onBack }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #b2dfdb 0%, #009688 100%)",
      }}
    >
      <h2 style={{
        color: '#009688',
        fontWeight: 'bold',
        fontSize: '2.5em',
        marginBottom: '24px',
        textShadow: '2px 2px 0 #fffbe7',
        fontFamily: 'Luckiest Guy, Comic Sans MS, Bubblegum Sans, cursive',
      }}>
        VR
      </h2>
      <p style={{ fontSize: '1.3em', color: '#333', marginBottom: '32px', textAlign: 'center' }}>
        Welcome to VR!<br />
        (Game logic coming soon)
      </p>
      <button
        className="btn"
        style={{
          fontWeight: 'bold',
          fontSize: '1.1em',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #2196f3 0%, #00bcd4 100%)',
          color: '#fff',
          boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
          padding: '16px 32px',
        }}
        onClick={onBack}
      >
        <span style={{fontSize: '1.2em'}}>&#8592;</span> Back
      </button>
    </div>
  );
}

export default VR;
