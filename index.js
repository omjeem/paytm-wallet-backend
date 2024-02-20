const express = require("express")
const cors = require("cors")
const app = express()
const dotenv = require("dotenv");

app.use(cors())
app.use(express.json())
dotenv.config({ path: "./config.env" }); 
const PORT =  3000

const userRoute = require("./routes/index");
app.use("/api/v1", userRoute);

app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`)
});
