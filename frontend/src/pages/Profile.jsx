import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function Profile() {
  const { token } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;

    async function fetchProfile() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:3000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
        setProfile(data);
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      setProfile(data.user);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  if (error) return <div className="text-red-600 p-4">{error}</div>;

  if (!profile) return null;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>

      {editMode ? (
        <>
          <label className="block mb-2">
            Name:
            <input
              type="text"
              className="border p-2 w-full rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
            />
          </label>

          <label className="block mb-4">
            Email:
            <input
              type="email"
              className="border p-2 w-full rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={saving}
            />
          </label>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>

          <button
            onClick={() => setEditMode(false)}
            disabled={saving}
            className="ml-4 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
}
