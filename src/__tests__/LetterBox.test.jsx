import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LetterBox from "../LetterBox";

describe("LetterBox", () => {
  test("renders an enabled button and calls onGuess when clicked", async () => {
    const onGuess = jest.fn();

    render(
      <LetterBox
        letter="A"
        disabled={false}
        onGuess={onGuess}
      />
    );

    const btn = screen.getByRole("button", { name: /A/i });
    expect(btn).toBeEnabled();

    await userEvent.click(btn);
    expect(onGuess).toHaveBeenCalledWith("A");
  });

  test("button becomes disabled when disabled prop is true", () => {
    const onGuess = jest.fn();

    const { rerender } = render(
      <LetterBox
        letter="B"
        disabled={false}
        onGuess={onGuess}
      />
    );

    let btn = screen.getByRole("button", { name: /B/i });
    expect(btn).toBeEnabled();

    // change the prop and keep onGuess so it still renders a button
    rerender(
      <LetterBox
        letter="B"
        disabled={true}
        onGuess={onGuess}
      />
    );

    btn = screen.getByRole("button", { name: /B/i });
    expect(btn).toBeDisabled();
  });
});
