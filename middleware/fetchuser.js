var jwt = require("jsonwebtoken");

const JWT_token = process.env.JWT_TOKEN;

const fetchuser = async (req, res, next) => {
  //get the user from jwttoken and add id to req object

  // console.log("headers:", req.headers);

  const token = req.headers.authtoken;
  // console.log("token", token);
  if (!token) {
    res.status(401).send({ error: "Authenticate using a valid token" });
  }
  // console.log("here 1");
  try {
    // console.log("here 2");
    // console.log(token);
    // console.log(JWT_token);
    const data = await jwt.verify(token, JWT_token);
    // console.log("Data after jwt verification : ", data);
    req.user = data.user;
    next();
  } catch (error) {
    console.log("Error: ", error.message);
    res.status(401).send({ error: "Authenticate using a valid token" });
  }
};

module.exports = fetchuser;
