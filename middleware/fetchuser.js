var jwt = require("jsonwebtoken");

const JWT_secret = process.env.JWT_TOKEN;

const fetchuser = async (req, res, next) => {
  //get the user from jwttoken and add id to req object

  console.log("headers:", req.headers);

  const token = req.headers.authtoken;
  // const token = req.headers["authorization"]?.split(" ")[1];

  console.log("token", token);
  if (!token) {
    res.status(401).send({ error: "Authenticate using a valid token initial" });
  }

  try {
    const data = await jwt.verify(token, JWT_secret);
    // console.log("Data after jwt verification : ", data);
    req.user = data.user;
    next();
  } catch (error) {
    console.log("Error: ", error.message);
    res.status(401).send({ error: "Authenticate using a valid token" });
  }
};

module.exports = fetchuser;
