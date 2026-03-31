import "dotenv/config"
import express, { json } from "express"
import pkg from "pg"
import cors from "cors"

let app = express()
const {Pool} = pkg
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
  const { name, grade, bus_id, class_grade } = req.body;
  // console.log(name, grade, bus_id);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if student already exists
    let check = await client.query(`SELECT * FROM students WHERE name = $1`, [name]);
    if (check.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "student record already exists" });
    }

    // Insert new student
    const insertResult = await client.query(
      "INSERT INTO students (name, grade, bus_id, class_grade) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, grade, bus_id, class_grade]
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

app.post('/register_driver', async (req, res) => {
  const { bus_id, name, route, license, phone, status} = req.body;
  // console.log(bus_id, name, route, license, phone);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if student already exists
    let check = await client.query(`SELECT bus_id FROM buses WHERE bus_id = $1`, [bus_id]);
    if (check.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "driver record already exists" });
    }

    // Insert new student
    const insertResult = await client.query(
      "INSERT INTO buses (bus_id, name, route, license, phone, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [bus_id, name, route, license, phone, status]
    );

    await client.query("COMMIT");

    return res.status(200).json({ 
      message: "driver record saved successfully", 
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

app.post('/discipline_register', async (req, res) => {
  const {id, reson,  severity, date, action} = req.body;
  console.log(id, reson, severity, date, action);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

  
    // Insert new student
    const insertResult = await client.query(
      "INSERT INTO discipline (student_id, reson, severity, date, action) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, reson, severity, date, action]
    );

    await client.query("COMMIT");

    return res.status(200).json({ 
      message: "discipline record saved successfully", 
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
app.get('/get_drivers', async (req, res) => {
  
  const client = await pool.connect();

  try {
    await client.query("BEGIN");


    // Select drivers
    const insertResult = await client.query("SELECT *FROM buses");
    const get_students_perDriver = await client.query("SELECT *FROM students as s LEFT JOIN buses as b ON s.bus_id = b.id")

    await client.query("COMMIT");

    return res.status(200).json({ 
      data: insertResult.rows,
      students_perBus: get_students_perDriver.rows
  });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  } finally {
    client.release();
  }
});
app.get('/get_students', async (req, res) => {
  
  const client = await pool.connect();

  try {
    await client.query("BEGIN");


    // Select drivers
    const insertResult = await client.query("SELECT s.id, s.bus_id, s.name, s.grade, b.route, s.class_grade FROM students as s LEFT JOIN buses as b ON s.bus_id = b.bus_id ");

    await client.query("COMMIT");

    return res.status(200).json({ 
      data: insertResult.rows
  });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  } finally {
    client.release();
  }
});
app.get('/get_discipline', async (req, res) => {
  
  const client = await pool.connect();

  try {
    await client.query("BEGIN");


    // Select drivers
    const insertResult = await client.query("SELECT *FROM discipline");

    await client.query("COMMIT");

    return res.status(200).json({ 
      data: insertResult.rows
  });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  } finally {
    client.release();
  }
});

app.delete('/delete_driver/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM buses WHERE id = $1",
      [id]
    );

    res.json({ message: "Driver deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});
app.delete('/student_delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM students WHERE id = $1",
      [id]
    );

    res.json({ message: "student deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/batch_students", async (req, res) => {
  const students = req.body;
  console.log(students)
  const client = await pool.connect();
   
  try {
    await client.query("BEGIN");

    for (let s of students) {
      let check = await client.query(`SELECT name FROM students WHERE name = $1`, [s.name]);
      if (check.rows.length > 0) {
        await client.query("ROLLBACK");
        return res.status(403).json({ error: "at least one  record already exists in the database" });
      }
      await client.query(
        `INSERT INTO students (name, grade, bus_id, class_grade)
         VALUES ($1, $2, $3, $4)`,
        [s.name, s.grade, s.bus_id, s.class_grade]
      );
    }

    await client.query("COMMIT");
    res.json({ success: true });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Batch insert failed" });
  } finally {
    client.release();
  }
});

app.listen(3000, "localhost", () => {
    console.log("Server running on http://localhost:3000")
})