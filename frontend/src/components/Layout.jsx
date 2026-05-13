import { useState } from "react";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="app-shell" data-theme={theme}>
      <Navbar theme={theme} onToggle={toggleTheme} />
      <main className="page-content">{children}</main>
    </div>
  );
}
