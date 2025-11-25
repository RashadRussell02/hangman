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

    // NEW for player login + stats
    playerName: "",
    playerStats: null,
    isLoggedIn: false,
  };

  componentDidMount() {
    const { initialWord } = this.props;
    if (initialWord) this.setState({ wordList: [initialWord] });
    else this.setState({ wordList: words });
  }

  // 📌 Detect win/loss and update stats
  componentDidUpdate(prevProps, prevState) {
    if (prevState.gameStatus !== this.state.gameStatus) {
      if (this.state.gameStatus === "won") {
        this.updateStats(true);
      }
      if (this.state.gameStatus === "lost") {
        this.updateStats(false);
      }
    }
  }

  // 🎮 Start a new game
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

  // 💻 Handle one letter guess
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

  // ====================== DB/LOGIN AREA ========================

  API_URL = "http://localhost:4000";

  // 🧾 Save stats when win/loss happens
  updateStats = async (didWin) => {
    if (!this.state.isLoggedIn || !this.state.playerStats) return;

    const { playerName, playerStats } = this.state;
    const updated = {
      wins: playerStats.wins + (didWin ? 1 : 0),
      losses: playerStats.losses + (didWin ? 0 : 1),
    };

    this.setState({ playerStats: { ...playerStats, ...updated } });

    try {
      await fetch(`${this.API_URL}/players`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName, ...updated }),
      });
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // 🎟 Login or create player
  loginPlayer = async () => {
    const { playerName } = this.state;
    if (!playerName) return;

    try {
      // Try GET
      let res = await fetch(`${this.API_URL}/players?playerName=${playerName}`);
      if (res.status === 404) {
        // Create POST if not found
        res = await fetch(`${this.API_URL}/players`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerName }),
        });
      }
      const data = await res.json();
      this.setState({ playerStats: data, isLoggedIn: true });
    } catch (err) {
      console.error(err);
    }
  };

  // ===================== HELPER UTILS ===========================

  currentWord = () => {
    const { wordList, curWord } = this.state;
    return wordList && wordList.length ? wordList[curWord] || "" : "";
  };

  isSolved = (norm, used) =>
    norm.split("").every((ch) => !/[a-z]/.test(ch) || used.includes(ch));

  maskedWord = (word, used) =>
    word
      .split("")
      .map((ch) => (!/[a-z]/i.test(ch) ? ch : used.includes(ch.toLowerCase()) ? ch : "_"))
      .join(" ");

  correctLetters = (word, used) => {
    const set = new Set(word.toLowerCase().split(""));
    return used.filter((l) => set.has(l));
  };

  wrongLetters = (word, used) => {
    const set = new Set(word.toLowerCase().split(""));
    return used.filter((l) => !set.has(l));
  };

  // ======================== RENDER UI ============================

  render() {
    const { lifeLeft, usedLetters, gameStatus, playerName, playerStats, isLoggedIn } =
      this.state;

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

        {/* 🧍 Login UI */}
        {!isLoggedIn && (
          <div style={{ margin: "12px auto", textAlign: "center" }}>
            <input
              placeholder="Enter name..."
              value={playerName}
              onChange={(e) => this.setState({ playerName: e.target.value })}
            />
            <button onClick={this.loginPlayer} style={{ marginLeft: "8px" }}>
              Login
            </button>
          </div>
        )}

        {/* 👤 Player Stats */}
        {isLoggedIn && playerStats && (
          <div style={{ textAlign: "center", margin: "8px", fontSize: "18px" }}>
            <strong>{playerName}</strong> — Wins: {playerStats.wins} | Losses:{" "}
            {playerStats.losses} | Win %:{" "}
            {playerStats.wins + playerStats.losses === 0
              ? 0
              : Math.round(
                  (playerStats.wins /
                    (playerStats.wins + playerStats.losses)) *
                    100
                )}
            %
          </div>
        )}

        <div className="board">
          <aside className="left">
            <div className="lettersBox">
              <div className="lettersTitle">Letters Guessed</div>
              <div className="lettersList">
                {correct.length
                  ? correct.map((c) => <LetterBox key={`c-${c}`} letter={c} isVisible />)
                  : <span className="muted">—</span>}
              </div>

              <div className="lettersTitle sub">Missed</div>
              <div className="lettersList">
                {wrong.length
                  ? wrong.map((c) => <LetterBox key={`w-${c}`} letter={c} isVisible wrong />)
                  : <span className="muted">—</span>}
              </div>
            </div>
          </aside>

          <main className="center">
            <h1 className="title">Hangman</h1>

            <img src={imgSrc} alt="hangman" style={{ maxWidth: "380px", margin: "8px auto", display: "block" }}/>

            <div className="wordDisplay" data-testid="masked-word">
              {masked}
            </div>

            <SingleLetterSearchBar onGuess={this.onGuess} disabled={gameStatus !== "playing"} />
          </main>

          <aside className="right">
            <div className="livesBox">
              <div className="livesLabel">Lives Left</div>
              <div className="livesNum" data-testid="lives-num">{livesRemaining}</div>
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

