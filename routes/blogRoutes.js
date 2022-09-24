let express = require("express");
const Blog = require("../models/blog");

let checkAuthenticationV2 = require("../middleWares/checkAuthMiddleware");
const { request, response } = require("express");

const router = express.Router();


// create blog api
router.post("/add_blog", async (request, response) => {
  const newBlog = new Blog(request.body);
  await newBlog.save();
  response.send(newBlog);
});


//get blog api- by username from session or from paramas
router.get("/getAllBlogs",checkAuthenticationV2, (request,response) => {
    Blog.find({username: request.session.username}, (err,result) => {
        if(err) {
            response.send(err);
        } else {
            response.send(result);
        }
    });
})
//get blog api- by blogId (how get id)
router.get("/:id", (request, response) => {
  Blog.find({ _id: request.params.id}, function (err, result) {
    if (err) {
      response.send(err);
    } else {
      response.send(result);
    }
  });
});


//update blog api 
router.put("/:id", (request,response) => {
    Blog.findOneAndUpdate ({_id: request.params.id},request.body,{new: true}, function(err,document) {
         if(err) {
        response.send(err);
      } else {
        response.send(document);
      }
    });
});


//delete blog api
router.delete("/:id", (request, response) => {
  Blog.findOneAndDelete({ _id: request.params.id },request.body,(err, document) => {
      if (err) {
        response.send(err);
      } else {
        console.log(document);
        response.send(document);
      }
    }
  );
});



//Adavance Mongoose

//router.post("/understandingQueries", (request, response) => {
  // const blogQuery = Blog.find({ title: "My first Blog" }); //QueryObject
  //   //Query building (1-way)     ----------------------------
  // blogQuery.where('author').equals('Vikas');
  // blogQuery.where('likes').gt(5);
  // blogQuery.select('content');
  // blogQuery.sort({createDate});
  // blogQuery.sort('-likes');
  // blogQuery.limit(10);

  //execution of queries
  // blogQuery.exec((err,result) => {
  //     if (err) {
  //       response.send(err);
  //     } else {
  //       response.send(result);
  //     }
  //   })
  // });


  //Query building (2-way: chaining: but not exactly chaining execute all together and Also not like promises !Remember this)

  // router.post("/understandingQueries", (request, response) => {
  //   const blogQuery = Blog.find({ title: "My first Blog" }) //QueryObject
  //     .where("author")
  //     .equals("Vikas")
  //     .where("likes")
  //     .gt(5)
  //     .select("content") //comment it out if any problem in NodeJS app
  //     .sort({ createDate })
  //     .sort("-likes")
  //     .limit(10)
  //     .exec((err, response) => { //execution of queries simultaneously
  //       if (err) {
  //         response.send(err);
  //       } else {
  //         response.send(response);
  //       }
  //     });
  // });
  
/*
   Mongoose Query
     1. Static Helper function
         ex: findOneAndUpdate
           : findOne : QueryObject
           : UpdateMany : QueryObject
             
           //for More Advance Mongoose: https://mongoosejs.com/queries.html

     2. QueryObjects (.where, .sort, .select )

     3. Advance Mongoose: (we separate callbacks and QueryObjects)
        Notion:- .exec((err,result) => {
           //err
           //result
        })
            
*/

module.exports = router;