const express = require("express")
const { default: mongoose } = require("mongoose")
const { Accounts, Trasaction, User } = require("../db")
const StatusCode = require("../statusCode")
const { authMiddleware } = require("./middleware")
const { BalanceTransfer } = require("./Types")
const router = new express.Router()


router.get("/balance", authMiddleware, async function (req, res) {
    const balance = await Accounts.findOne({ userId: req.userId })
    if (!balance) {
        return res.status(StatusCode.SUCCESS).json({
            message: "Balance not found"
        })
    }
    return res.status(StatusCode.SUCCESS).json({
        balance: balance.balance
    })
})



router.post("/transfer", authMiddleware, async function (req, res) {
    const body = BalanceTransfer.safeParse(req.body)

    if (!body.success) {
        return res.status(StatusCode.BAD_REQUEST).json({
            message: "Invalid Body"
        })
    }
    const session = await mongoose.startSession();
    session.startTransaction();

    const { to, amount } = req.body

    const account = await Accounts.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(StatusCode.NOT_FOUND).json({
            message: "Insufficient Balance / Account not found"
        })
    }

    const toAccount = await Accounts.findOne({ userId: to }).session(session);
    if (!toAccount) {
        await session.abortTransaction();
        return res.status(StatusCode.NOT_FOUND).json({
            message: "Invalid Account"
        })
    }

    await Accounts.updateOne({ userId: req.userId }, { $inc: { balance: -amount } })
    await Accounts.updateOne({ userId: to }, { $inc: { balance: +amount } })

    const fromName = await User.findById(req.userId)
    const toName = await User.findById(toAccount.userId)
    await Trasaction.create({ fromId: req.userId, toId: to, amount: amount, fromName: fromName.username, toName: toName.username })

    await session.commitTransaction();

    res.status(StatusCode.SUCCESS).json({
        message: "Trasaction Successfull"
    })

})




router.get("/trasaction", authMiddleware, async function (req, res) {
    const filter = req.query.filter || "";

    const response = await Trasaction.find({
        $or: [
            { fromId: req.userId },
            { toId: req.userId },
        ]
    })
    const filteredTransactions = response.map(transactions => {
        let username;
        let status;
        if (transactions.toId.toString() == req.userId.toString()) {
            username = transactions.fromName
            status = "+"
        }
        else {
            username = transactions.toName
            status = "-"
        }
        return {
            username: username,
            status: status,
            amount: transactions.amount,
            time: transactions.time
        };
    })
    filteredTransactions.sort((a, b) => b.time - a.time)

    const escapedFilter = filter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexPattern = new RegExp(escapedFilter, 'i');
    const trasaction = filteredTransactions.filter(transactions => regexPattern.test(transactions.username));

    return res.status(StatusCode.SUCCESS).json({
        trasaction
    })
})

module.exports = router