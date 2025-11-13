// src/SingleLetterSearchBar.js
import React from "react";

class SingleLetterSearchBar extends React.Component {
  static defaultProps = {
    disabled: false,
    placeholder: "a-z",
    autoFocus: true,
    clearOnSubmit: true,
    label: "Guess a letter:",
  };

  state = { value: "" };

  inputRef = React.createRef();

  componentDidMount() {
    if (this.props.autoFocus && this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  componentDidUpdate(prevProps) {
    // If we become enabled after being disabled, refocus for smoother play
    if (prevProps.disabled && !this.props.disabled && this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  handleChange = (e) => {
    // Keep only the first A–Z character
    const raw = e.target.value || "";
    const letter = raw.replace(/[^a-zA-Z]/g, "").slice(0, 1);
    this.setState({ value: letter });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { value } = this.state;
    const { onGuess, disabled, clearOnSubmit } = this.props;

    if (disabled) return;
    if (!value || !/^[A-Za-z]$/.test(value)) return;

    // Normalize to lower-case for the game logic
    onGuess && onGuess(value.toLowerCase());

    if (clearOnSubmit) {
      this.setState({ value: "" }, () => {
        if (this.inputRef.current) this.inputRef.current.focus();
      });
    }
  };

  render() {
    const { value } = this.state;
    const { disabled, placeholder, label } = this.props;

    const canSubmit = !!value && /^[A-Za-z]$/.test(value) && !disabled;

    return (
      <form className="controls" onSubmit={this.handleSubmit}>
        <label className="label">
          {label}
          <input
            ref={this.inputRef}
            type="text"
            inputMode="text"
            maxLength={1}
            className="guessInput"
            placeholder={placeholder}
            aria-label="Guess a letter"
            value={value}
            onChange={this.handleChange}
            disabled={disabled}
            pattern="[A-Za-z]"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck="false"
          />
        </label>
        <button className="guessBtn" disabled={!canSubmit}>
          Guess
        </button>
      </form>
    );
  }
}

export default SingleLetterSearchBar;
