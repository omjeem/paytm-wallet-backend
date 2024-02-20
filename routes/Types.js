const { number } = require("zod")
const zod = require("zod")

const UserInfo = zod.object({
	username: zod.string(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

const UserNamePassword = zod.object({
	username: zod.string(),
	password: zod.string()
})

const UpdateInfo = zod.object({
	firstName: zod.string().optional(),
	lastName: zod.string().optional(),
	password: zod.string().optional()
})

const BalanceTransfer = zod.object({
	to : zod.string(),
	amount : number()
})

module.exports = ({
	UserInfo,
	UserNamePassword,
	UpdateInfo,
	BalanceTransfer
})