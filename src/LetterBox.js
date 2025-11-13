// src/LetterBox.js
import React from "react";

export default function LetterBox({
  letter = "",
  onGuess,
  disabled = false,
  isVisible,
  wrong = false,
  boxStyle = {},
  letterStyle = {},
}) {
  const content = String(letter).toUpperCase();

  const defaultBoxStyle = {
    border: "1px solid black",
    width: "50px",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
    fontWeight: "bold",
    borderRadius: "6px",
    margin: "4px",
    userSelect: "none",
  };

  const defaultLetterStyle = {
    fontSize: "30px",
  };

  const combinedBoxStyle = {
    ...defaultBoxStyle,
    ...(wrong ? { borderColor: "crimson" } : {}),
    ...boxStyle,
  };

  const combinedLetterStyle = {
    ...defaultLetterStyle,
    ...(wrong ? { color: "crimson" } : {}),
    ...letterStyle,
  };

  // When onGuess is provided (like in tests), render a real button
  if (typeof onGuess === "function") {
    return (
      <button
        type="button"
        aria-label={content}
        disabled={disabled}
        onClick={() => onGuess(letter)}
        style={{
          ...combinedBoxStyle,
          cursor: disabled ? "not-allowed" : "pointer",
          background: disabled ? "#f2f2f2" : "white",
        }}
      >
        <span style={combinedLetterStyle}>{content}</span>
      </button>
    );
  }

  // When used just for display (guessed/missed lists), keep it as a box
  return (
    <div style={combinedBoxStyle} aria-label={content}>
      <span style={combinedLetterStyle}>{content}</span>
    </div>
  );
}
