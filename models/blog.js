let mongoose = require("mongoose");
//Getters : rootDirectory/images/<imageName> 
const imageRootPath = "rootDirectory/images"
const blogSchema = new mongoose.Schema({
    title: String,
    content: {type: String},
    author: {type:String},
    date: {type: Date, default: Date.now},
    subTitle: String,
    imagePath: {
        type: String,
        get: v => `${imageRootPath}/${v}`
    },
    comments: [{
        postedBy: String,
        body: String,
        date: {type: Date, default: Date.now}
    }],
    likes: Number,
});

// collection name (model) + exports
// module.exports = mongoose.model("Blog",blogSchema);

const Blog = mongoose.model("Blog",blogSchema);
module.exports = Blog;

