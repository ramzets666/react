import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const styles = {
  appContainer: {
    maxWidth: 400,
    margin: 'auto',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    width: 'calc(100% - 20px)',
    marginRight: 10,
    padding: 10,
    borderRadius: 4,
    border: '1px solid #ddd',
    boxSizing: 'border-box',
  },
  addButton: {
    padding: 10,
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
  deleteAllButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
  taskList: {
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
  },
  categoryText: {
    marginRight: 20,
    cursor: 'pointer',
    transition: 'color 0.3s',
  },
  categoryHover: {
    color: '#007bff',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 4,
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
  },
  deleteButton: {
    marginLeft: 'auto',
    padding: 5,
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      const updatedTasks = [...tasks, { id: Date.now(), text: newTask, completed: false }];
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
      setNewTask('');
    }
  };

  const toggleComplete = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const deleteAllTasks = () => {
    setTasks([]);
    saveTasksToLocalStorage([]);
  };

  const filterTasks = () => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'complete':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };
  return (
    <div style={styles.appContainer}>
      <div style={styles.header}>
        <h1>#Todo</h1>
      </div>
      <div style={styles.taskList}>
        <span
          style={{ ...styles.categoryText, ...(filter === 'all' && styles.categoryHover) }}
          onClick={() => setFilter('all')}
        >
          All
        </span>
        <span
          style={{ ...styles.categoryText, ...(filter === 'active' && styles.categoryHover) }}
          onClick={() => setFilter('active')}
        >
          Active
        </span>
        <span
          style={{ ...styles.categoryText, ...(filter === 'complete' && styles.categoryHover) }}
          onClick={() => setFilter('complete')}
        >
          Complete
        </span>
      </div>
      <div style={styles.inputContainer}>
        {(filter === 'all' || filter === 'active') && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task"
              style={styles.input}
            />
            <button onClick={addTask} style={styles.addButton}>
              Add
            </button>
          </div>
        )}
      </div>
      <div>
        {filterTasks().map(task => (
          <div key={task.id} style={styles.listItem}>
            {(filter === 'all' || filter === 'active') && (
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
              />
            )}
            <div style={{ marginLeft: '10px' }}>
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.text}
              </span>
            </div>
            <button onClick={() => deleteTask(task.id)} style={styles.deleteButton}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ))}
      </div>
      <div>
        {tasks.length > 0 && (
          <button onClick={deleteAllTasks} style={styles.deleteAllButton}>
            Delete All
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
