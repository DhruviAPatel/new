import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Fetch tasks from backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:5000/api/tasks');
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!newTask) return;
    const res = await axios.post('http://localhost:5000/api/tasks', { title: newTask });
    setTasks([...tasks, res.data]);
    setNewTask('');
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    setTasks(tasks.filter(task => task._id !== id));
  };

  const toggleTaskCompletion = async (id, completed) => {
    const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, { completed: !completed });
    setTasks(tasks.map(task => (task._id === id ? res.data : task)));
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>To-Do List</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((task) => (
          <li key={task._id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.title}
            <button onClick={() => toggleTaskCompletion(task._id, task.completed)}>
              {task.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
