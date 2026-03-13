import "dotenv/config"
import express, { json } from "express"
import {Pool} from "pg"
import cors from "cors"

let app = express()

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "DELETE", "PUT", "OPTIONS"],
}))

app.use(express.json())

let pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false
    }

})
pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("Postgres connection error:", err));

app.post('/register_student', async (req, res) => {
  const { name, grade, bus_id } = req.body;
  console.log(name, grade, bus_id);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if student already exists
    let check = await client.query(`SELECT * FROM students WHERE name = $1`, [name]);
    if (check.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(200).json({ message: "User record already exists" });
    }

    // Insert new student
    const insertResult = await client.query(
      "INSERT INTO students (name, grade, bus_id) VALUES ($1, $2, $3) RETURNING *",
      [name, grade, bus_id]
    );

    await client.query("COMMIT");

    return res.status(200).json({ 
      message: "Student record saved successfully", 
      student: insertResult.rows[0] 
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  } finally {
    client.release();
  }
});



app.listen(3000, "localhost", () => {
    console.log("Server running on http://localhost:3000")
})