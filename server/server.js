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
  const { groupName, displayName, password } = req.query;
  console.log(groupName, displayName, password);
  const groupData = await groupFetch(groupName);
  console.log(groupData);
  const displayData = await db.query(
    "SELECT * FROM groupmembers WHERE displayname = $1",
    [displayName]
  );
  const message = {
    group: "doesntExist",
    password: "bad",
  };
  if (groupData.length !== 0) {
    message.group = "exists";
    console.log("exists");
  }
  if (groupData[0].password === password) {
    message.password = "good";
    console.log("good");
  }
  if (displayData.rows.length === 0) {
    await db.query(
      "INSERT INTO groupmembers (displayname, group_id) VALUES ($1, (SELECT id FROM taskgroups WHERE name = $2))",
      [displayName, groupName]
    );
  }
  const response = {
    group: groupData,
    member: displayData.rows,
    message: message,
  };
  console.log("js.49", response);
  res.json(response);
});

app.post("/groups", async (req, res) => {
  const { displayName, groupName, password } = req.body;
  const groupData = await groupFetch(groupName);
  if (groupData.length === 0) {
    await db.query("INSERT INTO taskgroups (name,password) VALUES ($1,$2)", [
      groupName,
      password,
    ]);
    await db.query(
      "INSERT INTO groupmembers (displayname, group_id) VALUES ($1, (SELECT id FROM taskgroups WHERE name = $2))",
      [displayName, groupName]
    );
    const response = {};
    response.group = await db.query(
      "SELECT * FROM taskgroups WHERE name = $1",
      [groupName]
    );
    response.member = await db.query(
      "SELECT * FROM groupmembers WHERE displayname = $1",
      [displayName]
    );
    res.json(response); //RETURN ALL DATABASE INFO
  } else {
    res.json("gExists");
  }
});

async function groupFetch(groupName) {
  const result = await db.query("SELECT * FROM taskgroups WHERE name = $1", [
    groupName,
  ]);
  const groupData = result.rows;
  return groupData;
}
// MEMBER ROUTES //
app.get("/members", async (req, res) => {
  const groupId = req.query;
  console.log(groupId);
  const result = await db.query(
    "SELECT * FROM groupmembers WHERE group_id = $1",
    [Number(groupId.groupId)]
  );
  const members = result.rows;
  res.json(members);
});

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
  const id = req.body[0];
  const name = req.body[1];
  const status = req.body[2];
  const member_id = req.body[3];
  const description = req.body[4];
  const duedate = req.body[5];
  const result = await db.query(
    "UPDATE tasks SET name = $1, description = $2, status = $3, duedate = $4, member_id = $5 WHERE id = $6",
    [name, description, status, duedate, member_id, id]
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
