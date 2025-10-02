const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const adminRouter = require("./routes/adminRouter");
const blogRouter = require("./routes/blogRouter");

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.send("API is working");
});
app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "quickblog" });
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};

connectDB();
