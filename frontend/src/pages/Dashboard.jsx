import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Fetch tasks on component mount
  useEffect(() => {
    if (!token) return;

    async function fetchTasks() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:3000/api/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch tasks');
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [token]);

  // Create a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add task');

      setTasks([data, ...tasks]); // prepend new task
      setTitle('');
      setDescription('');
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete a task
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete task');
      }
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6">
      <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>

      <form onSubmit={handleAddTask} className="mb-6">
        <input
          className="border p-2 mr-2 rounded w-2/5"
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="border p-2 mr-2 rounded w-3/5"
          type="text"
          placeholder="Task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Task
        </button>
      </form>

      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <ul>
          {tasks.map(({ _id, title, description, status }) => (
            <li key={_id} className="mb-4 p-4 border rounded flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{title}</h3>
                {description && <p className="text-gray-600">{description}</p>}
                <p className="text-sm italic">Status: {status}</p>
              </div>
              <button
                onClick={() => handleDelete(_id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
