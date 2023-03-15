const mongoose = require("mongoose");

// const mongoURI = "mongodb://127.0.0.1:27017/BlogPost";

// mongoose.connect(process.env.mongoURI, () => {
//   console.log("connected to mongo..");
// });
// console.log(process.env.mongoURI);
const connectToMongo = () => {
  mongoose
    .connect(
      process.env.ACCESS_MONGOURI
      //    {
      //   useNewUrlParser: true,
      //   useCreateIndex: true,
      //   useUnifiedTopology: true,
      //   // useFindAndModify: false,
      // }
    )
    .then(() => {
      console.log("connection is successful");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectToMongo;
