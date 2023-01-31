const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://user:asdwq123da@mren-blog-udemy.ydc0bzu.mongodb.net/?retryWrites=true&w=majority"
        );
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(`Error ${error.message}`);
    }
};
module.exports = dbConnect;
