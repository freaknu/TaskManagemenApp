import express from "express";
import "dotenv/config";
import connectDB from "./config/databaseConnect.js";
import router from "./routes/user.router.js";
const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use("/api", router);
connectDB();


app.listen(PORT, () => {
  console.log(`Server is Listening On ${PORT}`);
});
