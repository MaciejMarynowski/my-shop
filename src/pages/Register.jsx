import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };

  const allValid = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Hasła nie są takie same!");
      return;
    }

    if (!allValid) {
      setError("Hasło nie spełnia wymagań bezpieczeństwa!");
      return;
    }

    try {
      await register(email, password);
      navigate("/login");
    } catch (err) {
      setError("Błąd podczas rejestracji. Sprawdź dane.");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-3">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Rejestracja</h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="wpisz e-mail"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Hasło</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setTouched(true);
            }}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="••••••••"
            required
          />

          {touched && (
            <ul className="text-sm mt-2 space-y-1">
              <PasswordRule
                valid={passwordRequirements.length}
                text="Minimum 8 znaków"
              />
              <PasswordRule
                valid={passwordRequirements.uppercase}
                text="Przynajmniej jedna wielka litera (A–Z)"
              />
              <PasswordRule
                valid={passwordRequirements.number}
                text="Przynajmniej jedna cyfra (0–9)"
              />
              <PasswordRule
                valid={passwordRequirements.special}
                text="Przynajmniej jeden znak specjalny (!@#$%^&*)"
              />
            </ul>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Powtórz hasło</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded-lg text-white transition-colors ${
            allValid
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!allValid}
        >
          Zarejestruj się
        </button>

        <p className="text-center text-sm mt-4 text-gray-600">
          Masz już konto?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Zaloguj się
          </Link>
        </p>
      </form>
    </div>
  );
}

function PasswordRule({ valid, text }) {
  return (
    <li
      className={`flex items-center gap-2 ${
        valid ? "text-green-600" : "text-gray-500"
      }`}
    >
      {valid ? "✅" : "⚪"} {text}
    </li>
  );
}