import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const [name, setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setNameError(name && name.length < 2 ? 'Name must be at least 2 characters' : '');
  }, [name]);

  useEffect(() => {
    setEmailError(email && !emailRegex.test(email) ? 'Invalid email format' : '');
  }, [email]);

  useEffect(() => {
    setPasswordError(password && password.length < 6 ? 'Password must be at least 6 characters' : '');
  }, [password]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    // Final validation before submit
    if (!name || name.length < 2 || !emailRegex.test(email) || password.length < 6) {
      setError('Please fix the errors before submitting');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Registration failed');
        return;
      }
      setSuccessMessage('Registration successful! Redirecting to login...');
      setLoading(true);
      
      // Disable inputs and button by using `loading` state
      
      setTimeout(() => {
        setLoading(false);
        navigate('/login');
      }, 3000); // waits 3 seconds before navigating

    } catch (err) {
      setError('Network error');
    }
  };

  const isSubmitDisabled = !name || !email || !password || nameError || emailError || passwordError;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <p className="mb-4">
      Already registered?{' '}
      <a href="/login" className="text-blue-600 hover:underline">
      Login here
      </a>
      </p>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-600 mb-4 flex items-center">
        <svg
        className="animate-spin mr-2 h-5 w-5 text-green-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        >
        <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        ></circle>
        <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
        </svg>
        {successMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <label className="block mb-1 font-semibold" htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          disabled={loading}
          className={`w-full mb-1 p-2 border rounded focus:outline-none focus:ring ${
            nameError ? 'border-red-500 ring-red-300' : 'border-gray-300 ring-green-300'
          }`}
          value={name}
          onChange={e => setName(e.target.value)}
          aria-describedby="name-error"
        />
        {nameError && <p id="name-error" className="text-red-500 text-sm mb-2">{nameError}</p>}

        <label className="block mb-1 font-semibold" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          disabled={loading}
          className={`w-full mb-1 p-2 border rounded focus:outline-none focus:ring ${
            emailError ? 'border-red-500 ring-red-300' : 'border-gray-300 ring-green-300'
          }`}
          value={email}
          onChange={e => setEmail(e.target.value)}
          aria-describedby="email-error"
        />
        {emailError && <p id="email-error" className="text-red-500 text-sm mb-2">{emailError}</p>}

        <label className="block mb-1 font-semibold" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          disabled={loading}
          className={`w-full mb-1 p-2 border rounded focus:outline-none focus:ring ${
            passwordError ? 'border-red-500 ring-red-300' : 'border-gray-300 ring-green-300'
          }`}
          value={password}
          onChange={e => setPassword(e.target.value)}
          aria-describedby="password-error"
        />
        {passwordError && <p id="password-error" className="text-red-500 text-sm mb-2">{passwordError}</p>}

        <button
          type="submit"
          disabled={loading || isSubmitDisabled}
          className={`w-full py-2 rounded text-white ${
            isSubmitDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          Register
        </button>
      </form>
    </div>
  );
}
