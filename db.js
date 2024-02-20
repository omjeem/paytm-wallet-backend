const mongoose = require("mongoose")
const moment = require("moment-timezone");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" }); 
const DB = process.env.DATABASE_URL

mongoose.connect(DB);

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
})

const AccountSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    },
    balance : {
        type : Number,
        required : true
    }
})

const TrasactionSchema = mongoose.Schema({
    toId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    },
    fromId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    },
    toName : {
        type : String,
        required : true
    },
    fromName : {
        type : String,
        required : true
    },

    amount : {
        type : Number,
        required : true
    },

    time : {
        type : Date,
        required : true,
        default: () => moment().tz('Asia/Kolkata').format()
    }
})

const User = mongoose.model("User", userSchema);
const Accounts = mongoose.model("Accounts",AccountSchema);
const Trasaction = mongoose.model("Trasaction",TrasactionSchema);

module.exports = {
    User,
    Accounts,
    Trasaction
}