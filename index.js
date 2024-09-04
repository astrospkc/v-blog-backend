require("dotenv").config();
const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
connectToMongo();

const app = express();
const port = 5000;
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5174", "https://v-blog-gold.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// respond with "hello world" when a GET request is made to the homepage
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", function (req, res) {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
