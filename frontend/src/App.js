import React, { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([
    { _id: '1', name: 'Complete project documentation' },
    { _id: '2', name: 'Review pull requests' },
    { _id: '3', name: 'Prepare team meeting agenda' }
  ]);
  const [newTask, setNewTask] = useState('');

  // Simulated API calls for demo
  const fetchTasks = async () => {
    // In real app, this would be: const res = await axios.get('http://localhost:5002/api/tasks');
    console.log('Fetching tasks...');
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    
    const newTaskObj = {
      _id: Date.now().toString(),
      name: newTask
    };
    
    setTasks([...tasks, newTaskObj]);
    setNewTask('');
  };

  const handleDeleteTask = async (id) => {
    setTasks(tasks.filter(task => task._id !== id));
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  };

  const headerStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '2rem',
    textAlign: 'center',
    letterSpacing: '-0.025em'
  };

  const inputContainerStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '2rem',
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: '1px solid #e2e8f0'
  };

  const inputStyle = {
    flex: '1',
    padding: '14px 16px',
    fontSize: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    backgroundColor: '#ffffff'
  };

  const inputFocusStyle = {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  };

  const addButtonStyle = {
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    minWidth: '120px'
  };

  const addButtonHoverStyle = {
    backgroundColor: '#2563eb',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
  };

  const tasksContainerStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden'
  };

  const taskItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid #f1f5f9',
    transition: 'background-color 0.2s ease-in-out'
  };

  const taskItemHoverStyle = {
    backgroundColor: '#f8fafc'
  };

  const taskTextStyle = {
    fontSize: '16px',
    color: '#334155',
    fontWeight: '500',
    flex: '1'
  };

  const deleteButtonStyle = {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#dc2626',
    backgroundColor: 'transparent',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out'
  };

  const deleteButtonHoverStyle = {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
    transform: 'translateY(-1px)'
  };

  const emptyStateStyle = {
    padding: '60px 24px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '16px'
  };

  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Task Manager</h1>
      
      <div style={inputContainerStyle}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task..."
          style={{
            ...inputStyle,
            ...(inputFocused ? inputFocusStyle : {})
          }}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <button
          onClick={handleAddTask}
          style={{
            ...addButtonStyle,
            ...(hoveredButton === 'add' ? addButtonHoverStyle : {})
          }}
          onMouseEnter={() => setHoveredButton('add')}
          onMouseLeave={() => setHoveredButton(null)}
          disabled={!newTask.trim()}
        >
          Add Task
        </button>
      </div>

      <div style={tasksContainerStyle}>
        {tasks.length === 0 ? (
          <div style={emptyStateStyle}>
            <p>No tasks yet. Add your first task above!</p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={task._id}
              style={{
                ...taskItemStyle,
                ...(hoveredTask === task._id ? taskItemHoverStyle : {}),
                ...(index === tasks.length - 1 ? { borderBottom: 'none' } : {})
              }}
              onMouseEnter={() => setHoveredTask(task._id)}
              onMouseLeave={() => setHoveredTask(null)}
            >
              <span style={taskTextStyle}>{task.name}</span>
              <button
                onClick={() => handleDeleteTask(task._id)}
                style={{
                  ...deleteButtonStyle,
                  ...(hoveredButton === `delete-${task._id}` ? deleteButtonHoverStyle : {})
                }}
                onMouseEnter={() => setHoveredButton(`delete-${task._id}`)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
