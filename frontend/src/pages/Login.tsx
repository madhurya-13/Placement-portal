// src/pages/Login.tsx
// Login screen — renders the animated sign-in card from
// components/ui/sign-in-card-2, wired to the real auth flow.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import SignInCard from "../components/ui/sign-in-card-2";

export default function Login() {
  const [error, setError] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  async function handleSignIn({
    email,
    password,
  }: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) {
    setError("");
    try {
      const loggedInUser = await loginUser(email, password);
      if (loggedInUser.role === "recruiter") {
        navigate("/recruiter-dashboard");
      } else if (loggedInUser.role === "placement_officer") {
        navigate("/officer-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch {
      // Failures are surfaced in the card's error slot instead of throwing,
      // so the card can drop its loading state cleanly.
      setError("Invalid email or password.");
    }
  }

  return <SignInCard error={error} onSubmit={handleSignIn} signUpTo="/register" />;
}
