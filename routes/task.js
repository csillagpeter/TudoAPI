const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all tasks
router.get("/", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "failed to fetch tasks" });
    }
    return res.status(200).json(results);
  });
});

// get one task by id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM tasks WHERE ID = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "failed to fetch task" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "task not found" });
    }
    return res.status(200).json(results[0]);
  });
});

// post a new task
router.post("/", (req, res) => {
  const { title, description, deadline } = req.body;
  db.query('INSERT INTO tasks (title, description, deadline) VALUES (?, ?, ?)', [title, description, deadline], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "failed to create task" });
    }
    return res.status(201).json({ id: results.insertId, title, description, deadline });
  });
});


// patch a task by id
router.patch("/:id", (req, res) => {
    const id = req.params.id;
    

    let updateFields = Object.keys(req.body).map(field => `${field} = ?`).join(", ");
    let updateValues = Object.values(req.body);

    db.query(`UPDATE tasks SET ${updateFields} WHERE ID = ?`, [...updateValues, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "failed to update task" });
        }
        return res.status(200).json({ message: "task updated successfully" });
    });
});




// delete a task by id
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM tasks WHERE ID = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "failed to delete task" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "task not found" });
        }
        return res.status(200).json({ message: "task deleted successfully" });
    });
});

// delete all tasks
router.delete("/", (req, res) => {
    db.query('DELETE FROM tasks', (err, results) => {
        if (err) {
            return res.status(500).json({ error: "failed to delete tasks" });
        }
        return res.status(200).json({ message: "all tasks deleted successfully" });
    });
});

module.exports = router;
