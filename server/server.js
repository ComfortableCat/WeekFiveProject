import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.get("/", (req, res) => res.json("Root route"));

app.get("/groups", async function (req, res) {
  const result = await db.query("SELECT * FROM taskgroups");
  const reviews = result.rows;
  res.json(reviews);
});

app.listen(8080, () => console.log("App is running on port 8080"));
