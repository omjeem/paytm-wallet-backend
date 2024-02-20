const express = require("express")
const { User } = require("../db")
const router = new express.Router()
const { authMiddleware } = require("./middleware")
const { UpdateInfo } = require("./Types")
const accountRoute = require("./accounts")
const userRoute = require("./user")
const StatusCode = require("../statusCode")


router.use("/user", userRoute)
router.use("/account", accountRoute);




router.put("/updateProfile", authMiddleware, async function (req, res) {
    const body = UpdateInfo.safeParse(req.body.data)
    if (!body) {
        res.status(StatusCode.Request_Refused).json({
            message: "Error while updating information"
        })
    }
    const isDone = await User.updateOne({ _id: req.userId }, { $set: req.body.data })
    res.status(StatusCode.SUCCESS).json({
        message: "Updated Successfully"
    })

})



module.exports = router