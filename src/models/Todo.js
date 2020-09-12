const { Schema, SchemaTypes } = require("../utils/db");
const mongoose = require("../utils/db");
const Todo = mongoose.model('Todo', new mongoose.Schema({
    title: String,
    uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    } 
}));

exports.Todo = Todo;