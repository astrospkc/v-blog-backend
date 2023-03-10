const mongoose = require("mongoose");

const mongoURI = "mongodb://127.0.0.1:27017/BlogPost";
// mongoose.connect(process.env.mongoURI, () => {
//   console.log("connected to mongo..");
// });
// console.log(process.env.mongoURI);
const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("connected to mongodb");
  });
};

module.exports = connectToMongo;
