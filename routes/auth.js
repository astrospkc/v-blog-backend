// import express
// express js is the backend part of MEAN and manages routing, sessions, HTTP requests, error handling
const express = require("express");
const config = require("./config");
const router = express.Router();
const { body, validationResult } = require("express-validator");

var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = process.env.JWT_TOKEN;

//importing user scema
const User = require("../models/User");

//create a User using: POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter valid name ").isLength({
      min: 1,
    }),
    body("email").isEmail(),

    body("password", "Enter password of minimum length 5").isLength({ min: 1 }),
  ],
  async (req, res) => {
    // console.log(req.body);
    let success = false;
    // finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400, "Place to be filled.")
        .json({ errors: errors.array() });
    }
    // console.log(req.body);

    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res.status(400).json({
          success,
          error: "Sorry a user with this email already exist.",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hashSync(req.body.password, salt);

      // create a user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;

      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal error occurred");
    }
  }
);

//Login : POST "/api/auth/login".
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),

    body("password", "Enter password of minimum length 5").exists({ min: 1 }),
  ],
  async (req, res) => {
    let success = false;
    // finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // console.log(req.body);

    const { email, password } = req.body;

    try {
      // if (
      //   email === config.defaultEmail &&
      //   password === config.defaultPassword
      // ) {
      let user = await User.findOne({ email });
      // console.log({ user });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Please login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({ error: "Please login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      console.log("req.headers: ", req.headers);
      console.log(success, authtoken);

      res.json({ success, authtoken });
      // }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal error occurred");
    }
  }
);

// ROUTE 3: get user details, POST : "api/auth/getuser" Login required
router.get("/getuser/:userid", fetchuser, async (req, res) => {
  try {
    // const userId = req.user._id;
    const userId = req.params.userid;
    const user = await User.findById(userId).select("password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occurred");
  }
});

router.get("/getalluser", async (req, res) => {
  try {
    const users = await User.find();
    console.log("user: ", users);
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occurred");
  }
});

module.exports = router;
