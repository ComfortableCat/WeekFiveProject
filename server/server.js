import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// ROOT ROUTES //
app.get("/", (req, res) => res.json("Root route"));

// GROUP ROUTES //

// MEMBER ROUTES //

// TASK ROUTES //
// Retrieve tasks
app.get("/tasks", async function (req, res) {
  const result = await db.query("SELECT * FROM tasks");
  const tasks = result.rows;
  res.json(tasks);
});

// Post new task
app.post("/tasks", async function (req, res) {
  const { name, description, status, duedate, priority, groupId } = req.body;
  const result = await db.query(
    "INSERT INTO tasks (name, description, status, duedate, priority, group_id) VALUES ($1, $2, $3, $4, $5, $6)",
    [name, description, status, duedate, priority, groupId]
  );
});

// Update task
app.put("/tasks", async function (req, res) {
  const data = req.body;
  const id = data[0];
  const name = data[1];
  const status = data[2];
  const member_id = data[3];
  const description = data[4];
  const duedate = data[5];
  const result = await db.query(
    "UPDATE tasks SET name = $1, status = $2, member_id = $3, description = $4, duedate = $5 WHERE id = $1",
    [id, name, status, member_id, description, duedate]
  );
});

// Delete task
app.delete("/tasks/:id", async function (req, res) {
  const getTaskId = req.url.split("/", [3]);
  const taskId = getTaskId[2];
  const result = await db.query("DELETE FROM tasks WHERE id = $1", [taskId]);
});

// CHAT ROUTES //

// Run server
app.listen(8080, () => console.log("App is running on port 8080"));
