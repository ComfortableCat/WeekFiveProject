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
    ///CHANGE TO GROUP_ID
    "SELECT * FROM groupmembers WHERE displayname = $1",
    [displayName]
  );
  const response = {};
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
    const memberResult = await db.query(
      "SELECT * FROM groupmembers WHERE displayname = $1",
      [displayName]
    );
    response.member = memberResult.rows;
  } else {
    response.member = displayData.rows;
  }
  response.group = groupData;
  response.message = message;

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

  const result = await db.query(
    "SELECT * FROM groupmembers WHERE group_id = $1",
    [Number(groupId.groupId)]
  );
  const members = result.rows;
  res.json(members);
});

// TASK ROUTES //
// Retrieve tasks and associated members assigned
app.get("/tasks", async function (req, res) {
  const result = await db.query("SELECT * from tasks");
  const tasks = result.rows;
  res.json(tasks);
});

// Post new task
app.post("/tasks", async function (req, res) {
  const { name, description, status, duedate, priority, groupId } = req.body;
  console.log(req.body);
  const result = await db.query(
    "INSERT INTO tasks (name, description, status, duedate, priority, group_id) VALUES ($1, $2, $3, $4, $5, $6)",
    [name, description, status, duedate, priority, groupId]
  );
  res.json("200 OK");
  console.log("Yay");
});

// Update task
app.put("/tasks", async function (req, res) {
  const id = req.body[0];
  const name = req.body[1];
  const status = req.body[2];
  const priority = req.body[3];
  const member_id = req.body[4];
  const description = req.body[5];
  const duedate = req.body[6];
  const result = await db.query(
    "UPDATE tasks SET name = $1, description = $2, status = $3, duedate = $4, priority = $5, member_id = $6 WHERE id = $7",
    [name, description, status, duedate, priority, member_id, id]
  );
});

// Delete task
app.delete("/tasks/:id", async function (req, res) {
  const getTaskId = req.url.split("/", [3]);
  const taskId = getTaskId[2];
  const result = await db.query("DELETE FROM tasks WHERE id = $1", [taskId]);
});

// CHAT ROUTES //
app.get("/chat", async (req, res) => {
  const groupId = req.query;
  const result = await db.query(
    "SELECT t2.message, t1.displayname, t2.group_id FROM groupmembers t1 INNER JOIN chat t2 ON t1.group_id = t2.group_id AND t1.id = t2.member_id WHERE t2.group_id = $1",
    [Number(groupId.groupId)]
  );
  const chats = result.rows;
  res.json(chats);
});

app.post("/chat", async (req, res) => {
  const { message, groupId, memberId } = req.body;
  console.log(req.body);
  const result = await db.query(
    "INSERT INTO chat (message, group_id, member_id) VALUES ($1, $2, $3)",
    [message, groupId, memberId]
  );
  res.json("200 OK");
  console.log("Yay");
});

// Run server
app.listen(8080, () => console.log("App is running on port 8080"));
