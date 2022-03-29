const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
	server_name: {
        type: String,
        require: true,
        unique: true
    },
    server_password: {
        type: String,
        require: true
    },
    server_ip: {
      type: String,
      require: true
    },
    server_port: {
      type: Number,
      require: true  
    },
    rcon_port: {
        type: Number,
        require: true
    },
    rcon_password: {
        type: String,
        require: true
    },
    query_port: {
        type: Number,
        require: true
    },
    ftp_port: {
        type: String,
        require: true
    },
    active: Boolean
});

module.exports = mongoose.model("Servers", Schema);