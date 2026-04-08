import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config();

// console.log("mongo", process.env.MONGODB_URI);
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running at : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB conncetion failed", error);
  });
