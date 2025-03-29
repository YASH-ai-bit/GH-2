import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import HomePage from "./pages/HomePage.js";
import GamePage from "./pages/GamePage.js";
import ResetPage from "./pages/ResetPage.js";
import LoginPage from "./pages/LoginPage.js";
import RegisterPage from "./pages/RegisterPage.js";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/reset" element={<ResetPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
