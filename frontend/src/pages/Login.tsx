// src/pages/Login.tsx
// Login screen — renders the animated sign-in card from
// components/ui/sign-in-card-2, wired to the real auth flow.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import SignInCard from "../components/ui/sign-in-card-2";

export default function Login() {
  const [error, setError] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  async function handleSignIn({
    email,
    password,
    rememberMe,
  }: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) {
    setError("");
    localStorage.setItem("remember_login", String(rememberMe));
    try {
      const loggedInUser = await loginUser(email, password);
      if (loggedInUser.role === "recruiter") {
        navigate("/recruiter-dashboard");
      } else if (loggedInUser.role === "placement_officer") {
        navigate("/officer-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      // Failures are surfaced in the card's error slot instead of throwing,
      // so the card can drop its loading state cleanly. Surface the API's own
      // detail message when there is one (pending approval, deactivated, ...).
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError(err.response.data?.detail ?? "This account is not yet approved.");
      } else if (axios.isAxiosError(err) && !err.response) {
        setError("The server is unavailable. Start the backend and try again.");
      } else {
        setError("Invalid email or password.");
      }
    }
  }

  return <SignInCard error={error} onSubmit={handleSignIn} signUpTo="/register" />;
}
