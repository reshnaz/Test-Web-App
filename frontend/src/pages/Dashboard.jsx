import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function Dashboard() {
  const { token, logout } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('pending');
  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    if (!token) return;

    async function fetchTasks() {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (filterStatus) params.append('status', filterStatus);

        const res = await fetch(`http://localhost:3000/api/tasks?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
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
  }, [token, searchTerm, filterStatus]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setAdding(true);
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

      setTasks([data, ...tasks]);
      setTitle('');
      setDescription('');
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
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

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditStatus(task.status || 'pending');
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  const saveEditing = async () => {
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:3000/api/tasks/${editingTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          status: editStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update task');

      setTasks(tasks.map(task => (task._id === editingTaskId ? data : task)));
      setEditingTaskId(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Your Tasks</h1>
        <div className="space-x-0 sm:space-x-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 w-full sm:w-auto">
          <Link to="/profile" className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-700 text-center">
            Profile
          </Link>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={handleAddTask} className="mb-8 flex flex-wrap space-x-0 sm:space-x-3 space-y-3 sm:space-y-0">
        <input
          className="mb-2 border p-2 rounded w-full sm:w-3/5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={adding}
        />
        <input
          className="border p-2 rounded w-full sm:w-3/5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          type="text"
          placeholder="Task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={adding}
        />
        <button
          type="submit"
          disabled={adding}
          className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto ${adding ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {adding ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      <div className="mb-8 flex flex-col sm:flex-row space-x-0 sm:space-x-4 space-y-3 sm:space-y-0">
      <div className="relative w-full sm:w-1/2">
      <input
      type="text"
      placeholder="Search tasks..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border p-2 pr-10 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <MagnifyingGlassIcon className="absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      ) : tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li
              key={task._id}
              className="mb-5 p-5 border rounded shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              {editingTaskId === task._id ? (
                <div className="flex-1 mr-0 sm:mr-4 mb-4 sm:mb-0 w-full sm:w-auto">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="border p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={saving}
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="border p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Description (optional)"
                    disabled={saving}
                  />
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={saving}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              ) : (
                <div className="flex-1 mr-0 sm:mr-4 mb-4 sm:mb-0 w-full sm:w-auto">
                  <h3 className="font-semibold mb-2">{task.title}</h3>
                  {task.description && (
                    <p className="text-gray-600 mb-1">{task.description}</p>
                  )}
                  <p className="text-sm italic text-gray-500">Status: {task.status}</p>
                </div>
              )}

              <div className="flex flex-wrap justify-start sm:justify-end items-center space-x-0 sm:space-x-3 space-y-0 sm:space-y-0 w-full sm:w-auto">
                {editingTaskId === task._id ? (
                  <>
                    <button
                      onClick={saveEditing}
                      disabled={saving}
                      className={`bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 cursor-pointer ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEditing}
                      disabled={saving}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(task)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
