// Nodes
// Server
// Set up DB connection

app.get("/tasks", async function (request, response) {
  const result = await db.query("SELECT * FROM tasks");
  const watchtv = result.rows;
  response.json(tasks);
}); // #does this work?

app.post("/tasks", async function (request, response) {
  const name = request.body.name;
  const description = request.body.description;
  const status = request.body.status;
  const duedate = request.body.duedate;
  const priority = request.body.priority;

  const result = await db.query(
    "INSERT INTO watchtv (name, description, status, duedate, priority) VALUES ($1, $2, $3, $4, $5)",
    [name, description, status, duedate, priority]
  );
  response.json(result);
});

app.listen(8080, function () {
  console.log("App is running of PORT 8080");
});
