import bodyParser from "body-parser";
import express from "express";
import pg from "pg";

// Connect to the database using the DATABASE_URL environment

//   variable injected by Railway
const pool = new pg.Pool();
const app = express();
const port = process.env.PORT || 3333;

app.use(bodyParser.json());
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));


//add a ticket
app.post('/ticket', async (req, res) => {
  try {
    const {
      tickettitle,
      section,
      roll,
      seat,
      imgname,
      showdate,
      venue,
      tourtitle,
      ticketheader,
    } = req.body;
    const newTicket = await pool.query(
      'INSERT INTO ticketsys (tickettitle,section,roll,seat,showdate,imgname,venue,tourtitle,ticketheader) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING * ',
     [tickettitle,section, roll, seat,showdate,imgname,venue,tourtitle,ticketheader]
    );
    res.json(newTicket.rows[0]);
  } catch (err) {
    console.log('failed to add ticket');
  }
});

//get all tickets
app.get('/tickets', async(req, res) => {
  try {
    const allTickets = await pool.query('SELECT * FROM ticketsys');
    res.json(allTickets.rows);
  } catch (err) {
    console.log('there is no ticket yet');
  }
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
