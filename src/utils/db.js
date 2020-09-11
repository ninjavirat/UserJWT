const mongoose = require("mongoose");
const dbPath = "mongodb+srv://ReactReserve:vishnu77299@@reserve.rrbi2.mongodb.net/Reserve?retryWrites=true&w=majority";
mongoose.connect(dbPath, {
    useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", () => {
    console.log("> error occurred from the database");
});
db.once("open", () => {
    console.log("> successfully connected the database");
});
module.exports = mongoose;