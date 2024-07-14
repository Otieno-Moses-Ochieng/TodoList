document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const descriptionInput = document.getElementById('description');
    const todoList = document.getElementById('todo-list');
    const editFormModal = document.getElementById('edit-form-modal');
    const editForm = document.getElementById('edit-form');
    const editDescriptionInput = document.getElementById('edit-description');
  
    // Function to fetch all todos from the backend
    async function fetchTodos() {
      try {
        const response = await fetch('http://localhost:5000/todos');
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        const todos = await response.json();
        todos.forEach(todo => addTodoToList(todo));
      } catch (error) {
        console.error('Error fetching todos:', error.message);
      }
    }
  
    // Function to add a todo item to the list
    function addTodoToList(todo) {
      const li = document.createElement('li');
      li.dataset.todoId = todo.todo_id;
      li.innerHTML = `
        <span class="todo-item">${todo.description}</span>
        <div class="actions">
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </div>
      `;
  
      const editButton = li.querySelector('.edit');
      editButton.addEventListener('click', () => openEditForm(todo));
  
      const deleteButton = li.querySelector('.delete');
      deleteButton.addEventListener('click', () => deleteTodoHandler(todo.todo_id));
  
      todoList.appendChild(li);
    }
  
    // Function to open edit form modal
    function openEditForm(todo) {
      editDescriptionInput.value = todo.description; // Populate current description
      editForm.dataset.todoId = todo.todo_id; // Set todo_id as dataset attribute
      editFormModal.style.display = 'block'; // Show the modal
    }
  
    // Function to close edit form modal
    function closeEditForm() {
      editFormModal.style.display = 'none'; // Hide the modal
    }
  
    // Event listener for closing the modal when clicking the close button
  const closeButton = editFormModal.querySelector('.close');
  closeButton.addEventListener('click', () => {
    closeEditForm();
  });
  
    // Event listener for submitting the edit form
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const todoId = editForm.dataset.todoId;
      const newDescription = editDescriptionInput.value;
      if (newDescription.trim() === '') {
        alert('Please enter a valid description.');
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/todos/${todoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ description: newDescription })
        });
        if (!response.ok) {
          throw new Error('Failed to update todo');
        }
        const updatedTodo = await response.json();
  
        // Update the todo item in the UI
        const todoItem = todoList.querySelector(`[data-todo-id="${todoId}"]`);
        todoItem.querySelector('.todo-item').textContent = updatedTodo.description;
  
        closeEditForm(); // Close the edit form modal
        // Reload the page after a short delay to reflect changes
    setTimeout(() => {
        window.location.reload();
      }, 100); // 500 milliseconds delay (adjust as needed)
    } catch (error) {
        console.error('Error updating todo:', error.message);
      }
    });

    // Event listener for closing the modal when clicking the close button
document.addEventListener('DOMContentLoaded', () => {
    const editFormModal = document.getElementById('edit-form-modal');
    const closeBtn = editFormModal.querySelector('.close');
  
    closeBtn.addEventListener('click', () => {
      editFormModal.style.display = 'none';
    });
  });
  
  
    // Function to handle deleting a todo
    async function deleteTodoHandler(todoId) {
      if (!confirm('Are you sure you want to delete this todo?')) return;
  
      try {
        const response = await fetch(`http://localhost:5000/todos/${todoId}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Failed to delete todo');
        }
  
        // Remove the todo item from the UI
        const todoItem = todoList.querySelector(`[data-todo-id="${todoId}"]`);
        todoItem.remove();
      } catch (error) {
        console.error('Error deleting todo:', error.message);
      }
    }
  
    // Event listener to add a new todo
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const description = descriptionInput.value;
      if (description.trim() === '') {
        alert('Please enter a valid description.');
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ description })
        });
        if (!response.ok) {
          throw new Error('Failed to add todo');
        }
        const newTodo = await response.json();
  
        // Add new todo to the list
        addTodoToList(newTodo);
  
        // Clear input field
        descriptionInput.value = '';
      } catch (error) {
        console.error('Error adding todo:', error.message);
      }
    });
  
    // Initial fetch of todos when the page loads
    fetchTodos();
  });
  