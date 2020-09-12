const { Schema, SchemaTypes } = require("../utils/db");
const mongoose = require("../utils/db");
const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: String,
    password: String,
}));

exports.User = User;