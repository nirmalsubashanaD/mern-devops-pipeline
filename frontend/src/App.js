import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Load tasks on initial render
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5002/api/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      await axios.post('http://localhost:5002/api/tasks', { name: newTask });
      setNewTask('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Task Manager App</h1>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter task name"
      />
      <button onClick={handleAddTask}>Add Task</button>

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.name}
            <button onClick={() => handleDeleteTask(task._id)} style={{ marginLeft: 10 }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
