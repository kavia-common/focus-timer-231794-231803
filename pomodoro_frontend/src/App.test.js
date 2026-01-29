import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders pomodoro session label", () => {
  render(<App />);
  expect(screen.getByText(/work/i)).toBeInTheDocument();
});
