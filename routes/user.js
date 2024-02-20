const express = require("express")
const { User, Accounts } = require("../db")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");

const router = express.Router()
const { UserInfo, UserNamePassword } = require("./Types")

const { authMiddleware } = require("./middleware")
const StatusCode = require("../statusCode")

dotenv.config({ path: "../config.env" }); 
const JWT_SECRET = process.env.JWT_SECRET

router.post("/signup", async function (req, res) {
    const payLoad = req.body
    const parsePayLoad = UserInfo.safeParse(payLoad);
    if (!parsePayLoad.success) {
        return res.status(StatusCode.BAD_REQUEST).json({
            message: "Invalid Body"
        })
    }
    const isPresent = await User.findOne({ username: payLoad.username })
    if (isPresent) {
        return res.status(StatusCode.User_Already_Exist).send({
            message: "Email already taken / Incorrect inputs"
        })
    }
    const addUser = await User.create(payLoad);

    await Accounts.create({
        userId: addUser._id,
        balance: (1 + Math.random() * 10000).toFixed(2)
    })

    const token = jwt.sign({ userId: addUser._id }, JWT_SECRET)
    res.status(StatusCode.SUCCESS).send({
        message: "User registered successfully",
        token
    })
})

router.post("/signin", async function (req, res) {
    const payLoad = req.body
    const parsePayLoad = UserNamePassword.safeParse(payLoad);
    if (!parsePayLoad.success) {
        return res.status(StatusCode.BAD_REQUEST)
            .json({
                message: "Invalid Body"
            })
    }
    const isPresent = await User.findOne({ username: payLoad.username, password: payLoad.password })

    if (!isPresent) {
        return res.status(StatusCode.NOT_FOUND).send({
            message: "Wrong Username and password"
        })
    }
    const token = jwt.sign({ userId: isPresent._id }, JWT_SECRET)
    res.status(StatusCode.SUCCESS).json({
        message: "Login successfully",
        token
    })
})

router.get("/bulk", authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";
    const Users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })
    const users = Users.filter(user => user._id != req.userId)
    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })

})




router.get("/username", authMiddleware, async function (req, res) {
    const userInfo = await User.findOne({ _id: req.userId })

    if (!userInfo) {
        return res.status(StatusCode.NOT_FOUND).json({
            message: "User not found"
        })
    }
    return res.json(
        {
            userName: userInfo.username,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName
        })
})

module.exports = router