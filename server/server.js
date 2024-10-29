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
app.get("/groups", async (req, res) => {
  const groupName = req.query.groupName;
  console.log(groupName);
  const result = await db.query("SELECT * FROM taskgroups WHERE name = $1", [
    groupName,
  ]);
  const groupData = result.rows;
  console.log(groupData);
  res.json(groupData);
});

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
  const result = await db.query("UPDATE tasks SET status = $1 WHERE id = $2", [
    data,
  ]);
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
