const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// Middleware

app.use(express.static('Clients'));
app.use(cors());
app.use(express.json()); // req.body

// Routes

// Create a todo

app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body;

        // Check if description is provided
        if (!description) {
            return res.status(400).json({ error: "Description is required" });
        }

        // Insert new todo into the database
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description]
        );

        // Log request body and newTodo for debugging purposes
        console.log(req.body);
        console.log(newTodo);

        // Return the new todo
        res.json(newTodo.rows[0]); } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Retrieve all todos
app.get("/todos", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo ORDER BY todo_id ASC");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//get a todo
app.get("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);

        if (todo.rows.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.json(todo.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// Update a todo
app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({ error: "Description is required" });
        }

        await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2",
            [description, id]
        );
        res.json("Todo was updated!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// Delete a todo

app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        res.json("Todo was deleted!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


app.listen(5000, () => {
    console.log("server has started on port 5000");
});
