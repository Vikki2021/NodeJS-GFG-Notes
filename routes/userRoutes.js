let express = require("express");

const User = require("../models/user");
let router = express.Router();

let session = require("express-session");
let cookieParser = require("cookie-parser");
let nodemailer = require("nodemailer");
let checkAuthenticationV2 = require("../middleWares/checkAuthMiddleware");
const { response } = require("express");
const { update } = require("../models/blog");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "officialtech4vikas@gmail.com",
    pass: "ivfidiwnzvuxejsv",
  },
});

//create user session here:
const oneDay = 1000 * 60 * 60 * 24;
router.use(
  session({
    secret: "This is my own secrete",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

// resave: 1st Request : create session
// 2nd Request : modify session --> updated
// 3rd Request : no change to session

router.use(cookieParser());

//middleware --> authenticate
let checkAuthentication = (request, response, next) => {
  //update password
  // find user and then check if password is correct
  User.findOne({ username: request.body.username }, (err, result) => {
    console.log(result);

    if (err) {
      response.send("Authentication fails");
    } else {
      if (result.password === request.body.oldpassword) {
        console.log("Authentication Succeed");
        next();
      } else {
        response.send("Authentication fails");
      }
    }
  });
}

//create user Signup api
// /user
router.post("/signup", async (request, response) => {

  let existingUser = await User.findOne({ username: request.body.username });
  if (existingUser != null)
    response.send("User already exist!");

  const user = new User({
    name: request.body.name,
    age: request.body.age,
    username: request.body.username,
    password: request.body.password,
    email: request.body.email
  });
  await user.save(); //saving that document in the collection
  response.send(user);
});


//create login api
router.post("/login", async (request, response) => {
  //user: we were trying to authenticate the user and then sending success response
  let user = await User.findOne({ username: request.body.username });
  if (user != null && user.password === request.body.password) {
    //create session here
    request.session.username = user.username;
    console.log(request.session);
    response.send("User is authenticate!");
  } else {
    response.send("No user found!");
  }
});


// find user -- api
router.get("/:username", checkAuthenticationV2, (request, response) => {
  // path or query
  User.findOne({ username: request.params.username }, function (err, result) {
    if (err) {
      response.send(err);
    } if (User.username === request.session.username) {
      response.send(result);
    }
  });
});


//PUT : update password api
router.put("/updatePassword:id", (request, response) => {
  if (request.session.token != request.params.token) {
    response.send("Invalid Access");
  } else {
    console.log("Access granted to update password!");
    request.session.destroy();
  }
  User.findOneAndUpdate(
    { username: request.body.username },
    { password: request.body.newPassword },
    function (err, result) {
      if (err) {
        response.send(err);
      } else {
        if (!result){
          response.send("No user found");
        } else
          response.send(result);
        }
      });
    });
    
    


  router.post("/updatePassword", async (request, response) => {
    let user = await User.findOne({ username: request.body.username });
    let randomNumber = Math.random();
    if (user) {
      let mailOptions = {
        from: "vk972832@gmail.com",
        to: request.body.email,
        subject: "Update Password",
        text: `Please update your password. [PUT] http://localhost:8080/user/updatePassword?id=${randomNumber} Sent by nodemailer using node.js`
      };

      transporter.sendMail(mailOptions, function (error, result) {
        if (error) {
          console.log(error);
          response.send(error);
        } else {
          console.log("Email sent : " + result.response);
          //Intialise the session
          request.session.token = randomNumber;

          response.send(result.response);
        }
      });
    } else {
      response.send("No user found with username : " + request.body.username);
    }
  });

  //logout api
  router.get("/logout", checkAuthenticationV2, (request, response) => {
    request.session.destroy();
    response.send("Logged Out !");
  });


  module.exports = router;
