// src/HangmanGame.js
import React from "react";
import "./index.css";
import LetterBox from "./LetterBox";
import SingleLetterSearchBar from "./SingleLetterSearchBar";

const pics = [
  "noose.png",
  "upperbody.png",
  "upperandlowerbody.png",
  "1arm.png",
  "botharms.png",
  "1leg.png",
  "Dead.png"
];

const words = [
  "Morehouse",
  "Spelman",
  "Basketball",
  "Table",
  "Museum",
  "Excellent",
  "Fun",
  "React"
];

class HangmanGame extends React.Component {
  state = {
    wordList: [],
    curWord: 0,
    lifeLeft: 0,
    usedLetters: [],
    gameStatus: "idle",
    playerName: "",
  };

  // ✅ UPDATED: allow tests to inject initialWord
  componentDidMount() {
    const { initialWord } = this.props;

    if (initialWord) {
      this.setState({ wordList: [initialWord] });
    } else {
      this.setState({ wordList: words });
    }
  }

  getPlayerName = (name) => {
    this.setState({ playerName: name });
  };

  startNewGame = () => {
    const { wordList } = this.state;
    if (!wordList || !wordList.length) return;

    this.setState({
      curWord: Math.floor(Math.random() * wordList.length),
      lifeLeft: 0,
      usedLetters: [],
      gameStatus: "playing",
    });
  };

  onGuess = (raw) => {
    const { gameStatus, usedLetters, lifeLeft } = this.state;
    if (gameStatus !== "playing") return;

    const letter = (raw || "").toLowerCase().trim();
    if (!/^[a-z]$/.test(letter)) return;
    if (usedLetters.includes(letter)) return;

    const nextUsed = [...usedLetters, letter];
    const word = this.currentWord();
    const norm = word.toLowerCase();

    if (norm.includes(letter)) {
      const solved = this.isSolved(norm, nextUsed);
      this.setState({
        usedLetters: nextUsed,
        gameStatus: solved ? "won" : "playing",
      });
    } else {
      const nextWrong = lifeLeft + 1;
      const MAX_STAGE = pics.length - 1;
      const lost = nextWrong > MAX_STAGE;

      this.setState({
        usedLetters: nextUsed,
        lifeLeft: nextWrong,
        gameStatus: lost ? "lost" : "playing",
      });
    }
  };

  currentWord = () => {
    const { wordList, curWord } = this.state;
    return wordList && wordList.length ? wordList[curWord] || "" : "";
  };

  isSolved = (norm, used) =>
    norm.split("").every((ch) => !/[a-z]/.test(ch) || used.includes(ch));

  maskedWord = (word, used) =>
    word
      .split("")
      .map((ch) => {
        if (!/[a-z]/i.test(ch)) return ch;
        return used.includes(ch.toLowerCase()) ? ch : "_";
      })
      .join(" ");

  correctLetters = (word, used) => {
    const set = new Set(word.toLowerCase().split(""));
    return used.filter((l) => set.has(l));
  };

  wrongLetters = (word, used) => {
    const set = new Set(word.toLowerCase().split(""));
    return used.filter((l) => !set.has(l));
  };

  render() {
    const { lifeLeft, usedLetters, gameStatus } = this.state;

    const word = this.currentWord();
    const correct = this.correctLetters(word, usedLetters);
    const wrong = this.wrongLetters(word, usedLetters);

    const MAX_STAGE = pics.length - 1;
    const stage = Math.min(lifeLeft, MAX_STAGE);
    const imgSrc = `${process.env.PUBLIC_URL}/${pics[stage]}`;

    const masked = this.maskedWord(word, usedLetters);
    const livesRemaining = Math.max(MAX_STAGE - lifeLeft, 0);

    return (
      <div className="page">
        <header className="header">
          <button className="newGameBtn" onClick={this.startNewGame}>
            New Game
          </button>
        </header>

        <div className="board">
          <aside className="left">
            <div className="lettersBox">
              <div className="lettersTitle">Letters Guessed</div>
              <div className="lettersList">
                {correct.length
                  ? correct.map((c) => (
                      <LetterBox key={`c-${c}`} letter={c} isVisible />
                    ))
                  : <span className="muted">—</span>}
              </div>

              <div className="lettersTitle sub">Missed</div>
              <div className="lettersList">
                {wrong.length
                  ? wrong.map((c) => (
                      <LetterBox key={`w-${c}`} letter={c} isVisible wrong />
                    ))
                  : <span className="muted">—</span>}
              </div>
            </div>
          </aside>

          <main className="center">
            <h1 className="title">Hangman</h1>

            <img
              src={imgSrc}
              alt="hangman"
              style={{ maxWidth: "380px", margin: "8px auto", display: "block" }}
            />

            {/* masked word */}
            <div className="wordDisplay" data-testid="masked-word">
              {masked}
            </div>

            <SingleLetterSearchBar
              onGuess={this.onGuess}
              disabled={gameStatus !== "playing"}
            />
          </main>

          <aside className="right">
            <div className="livesBox">
              <div className="livesLabel">Lives Left</div>

              {/* ✅ UPDATED: added data-testid="lives-num" */}
              <div className="livesNum" data-testid="lives-num">
                {livesRemaining}
              </div>
            </div>
          </aside>
        </div>

        {gameStatus !== "playing" && gameStatus !== "idle" && (
          <div className="overlay" role="dialog" aria-modal="true">
            <div className="modal">
              <h2>{gameStatus === "won" ? "You Win! 🎉" : "You Lost 💀"}</h2>

              {gameStatus === "lost" && (
                <p className="reveal">
                  The word was: <strong>{word.toUpperCase()}</strong>
                </p>
              )}

              <button className="newGameBtn" onClick={this.startNewGame}>
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default HangmanGame;

