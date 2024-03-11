const express = require("express")
const cors = require("cors")
const app = express()
const dotenv = require("dotenv");

app.use(cors())
app.use(express.json())
dotenv.config({ path: "./config.env" }); 
const PORT =  process.env.PORT || 3000

app.get("/", function(req,res){
    return res.status(200).send("Hey this is Paytm wallet backend");
})
const userRoute = require("./routes/index");
app.use("/api/v1", userRoute);

app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`)
});
