import React, { useState } from "react";
import { addAccount, findAccountByEmail } from "../../../utils/Accounts";

export default function SignUpForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // reset previous error

    if (!email || !password) return setError("Email & password required");

    const exists = findAccountByEmail(email); // check only email
    if (exists) return setError("Account already exists");

    const newUser = { email, password, name: email.split("@")[0], role: "user" };
    addAccount(newUser);
    onSuccess(newUser);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
