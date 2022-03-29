const express = require("express");
const router = express.Router();
const Servers = require('../models/servers');
const util = require('minecraft-server-util');

router.get("/", (req,res)=>{
    if(req.session.serverId){
        Servers.findById(req.session.serverId, function(err,server){
        if(err) return res.send('Bir hata oluştu!');
        //minecraft server util
        const options = {
          sessionID: 1,
          enableSRV: true
        };    
        util.queryBasic(server.server_ip, server.query_port, options)
        .then((result) => res.render("index", {title: "Ana Sayfa", server: server, query: result, console: req.flash('console'), istek: req.flash('konsol-istek')}))
        .catch(() => res.send('Bir hata oluştu!'));
        })
    }else{
        res.render('login', {title: "Giriş Yap"})
    }
})

router.get('/admin', function(req,res){
    if(!req.session.admin) return res.redirect('/');
    Servers.find({}, function(err,servers){
        res.render('admin', {
            servers: servers,
            title: 'Admin Panel'
        })
    })
})

router.get('/admin/create', (req,res)=>{
    if(!req.session.admin) return res.redirect('/');
    res.render('create', {title: "Create"});
})

router.get('/admin/delete/:id', (req,res)=>{
    if(!req.session.admin) return res.redirect('/');
    Servers.findByIdAndDelete(req.params.id, function(error){
    if(error) return res.send('Bir hata oluştu');
    res.redirect('/admin');
})
})

router.get('/logout', (req,res)=>{
	if(!req.session.serverId) return res.redirect('/');
    req.session.destroy();
    res.redirect('/');
})

module.exports = router;