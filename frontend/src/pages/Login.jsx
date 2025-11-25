import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validate fields on change
  useEffect(() => {
    setEmailError(email && !emailRegex.test(email) ? 'Invalid email format' : '');
  }, [email]);

  useEffect(() => {
    setPasswordError(password && password.length < 6 ? 'Password must be at least 6 characters' : '');
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Final validation before submitting
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      login(data.token); // Save token in context and localStorage
      navigate('/dashboard');
    } catch (err) {
      setError('Network error');
    }
  };

  // Disable submit if validation errors or fields empty
  const isSubmitDisabled = !email || !password || emailError || passwordError;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <p className="mb-4">
      New user?{' '}
      <a href="/register" className="text-blue-600 hover:underline">
      Register here
      </a>
      </p>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <label className="block mb-1 font-semibold" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={`w-full mb-1 p-2 border rounded focus:outline-none focus:ring ${
            emailError ? 'border-red-500 ring-red-300' : 'border-gray-300 ring-blue-300'
          }`}
          value={email}
          onChange={e => setEmail(e.target.value)}
          aria-describedby="email-error"
        />
        {emailError && <p id="email-error" className="text-red-500 text-sm mb-2">{emailError}</p>}

        <label className="block mb-1 font-semibold" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className={`w-full mb-1 p-2 border rounded focus:outline-none focus:ring ${
            passwordError ? 'border-red-500 ring-red-300' : 'border-gray-300 ring-blue-300'
          }`}
          value={password}
          onChange={e => setPassword(e.target.value)}
          aria-describedby="password-error"
        />
        {passwordError && <p id="password-error" className="text-red-500 text-sm mb-2">{passwordError}</p>}

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`w-full py-2 rounded text-white ${
            isSubmitDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Login
        </button>
      </form>
    </div>
  );
}
