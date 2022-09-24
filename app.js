let express = require("express"); // express modules, importing express object
let app = express(); // creating object of this express class
let bodyParser = require("body-parser");
//importing routes
let basicRouter = require("./routes/basicRoutes");
let fileRouter = require("./routes/fileRoutes");
let userRouter = require("./routes/userRoutes");
let blogRouter = require("./routes/blogRoutes");
let mongoose = require("mongoose");

//importing Models
let Blog = require("./models/blog");
let User = require("./models/user");

//importing middlewares
let myLogger = require("./middleWares/logger");

app.use(bodyParser.json());  //middleware attached to all routes

// Application Level MiddleWares
app.use(myLogger); 
app.use("/basic",basicRouter); 
app.use("/file",fileRouter);
app.use("/user",userRouter);
app.use("/blog",blogRouter);

mongoose.connect("mongodb+srv://vikaskumar:vikas75@cluster0.b8yynax.mongodb.net/blogwebsite?retryWrites=true&w=majority");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
})


app.listen(8080,function(req,res) {
    console.log("Listening on port " + 8080);
})
