const express = require("express");
const router = express.Router();
const config = require('../config');
const Servers = require('../models/servers');

router.post('/login', function(req,res){
    const {server_name, server_password} = req.body;
    Servers.findOne({server_name}, function(err, server){
        if(server){
            if(server.active == true){
                if(server.server_password == server_password){
                    req.session.serverId = server._id;
                    res.redirect('/');
                }else{
                    res.send('Şifre yanlış!');
                }
            }else{
                res.send('Bu panel kullanım dışı!');
            }
        }else{
            res.send('Sunucu adı yanlış!');
        }
    })
});

router.post('/console', function(req,res){
	if(req.session.serverId){
        Servers.findById(req.session.serverId, function(err,server){
        if(err) return res.send('Bir hata oluştu!');
         
            const util = require('minecraft-server-util');

const client = new util.RCON();

const connectOpts = {
    timeout: 1000 * 5
    // ... any other connection options specified by
    // NetConnectOpts in the built-in `net` Node.js module
};

const loginOpts = {
    timeout: 1000 * 5
};

(async () => {
    await client.connect(server.server_ip, server.rcon_port, connectOpts);
    await client.login(server.rcon_password, loginOpts);
    
    const message = await client.execute(req.body.code);
    req.flash('konsol-istek', req.body.code);
    req.flash('console', message);
    await client.close();
    await res.redirect('/');
})();
        });
    }else{
        res.redirect('/');
    }
})

router.post('/admin', function(req,res){
   if(req.body.password != config.admin) return res.send('Parola yanlış!');
   req.session.admin = config.admin;
   res.redirect('/admin')
})

router.post('/admin/create', function(req,res){
    if(!req.session.admin) return res.redirect('/');
    const {server_name,server_password,server_ip,server_port,rcon_port,rcon_password,query_port,ftp_port} = req.body;
	const server = new Servers({
        server_name: server_name,
        server_password: server_password,
        server_ip: server_ip,
        server_port: server_port,
        rcon_port: rcon_port,
        rcon_password: rcon_password,
        query_port: query_port,
        ftp_port: ftp_port,
        active: true
    })
    server.save();
    res.redirect('/admin');
})

module.exports = router;