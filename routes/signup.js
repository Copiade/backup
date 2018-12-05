const express = require('express');
const router = express.Router();
const isNull = require('../script').isNull;
const Database = require('../Database');
const Cryptr = require('cryptr');
const config = require('../config');
const cryptr = new Cryptr(config.security.key);


router.get('/', (req, res, next) => {
    res.render('signup', {
        message: ''
    });
});

router.post('/', (req, res, next) => {
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;

    if (isNull(name) || isNull(username) || isNull(password)) {
        res.status(400).json({'error': 'Invalid name, username and/or password!'});
    }

    password = cryptr.encrypt(password);

    //console.log(`name: ${name}, username: ${username}, password: ${password}`);

    createUser(name, username, password).then(results => {
        req.session.message = `User ${username} created succesfully! Please log in...`;
        res.status(302).redirect('/login');
    }).catch(error => {
        res.render('signup', {message: "Error creating user.", error: error});
    });

});

function createUser(name, username, password) {
    return new Promise((resolve, reject) => {
        let create = undefined;
        checkUser(username).then(exists => {
            create = !exists;
            console.log('create:', create);
            if (create) {
                let querystring = `INSERT INTO usuarios (nome, usario , senha) VALUES ('${name}', '${usuario}', '${password}');`;
                Database.query(querystring).then(results => {
                    resolve(results);
                }).catch(error => {
                    console.error(error);
                    reject(error);
                });
            } else {
                reject('User already exists!');
            }
        }).catch((error) => {
            reject(error);
        });
    });
}

 function checkUser(username) {
    let querystring = `SELECT * FROM usuarios WHERE username = '${username}'`;
    return new Promise((resolve, reject) => {
        Database.query(querystring).then(results => {
                let exists = results.length > 0;
                resolve(exists);
            }).catch(error => {
                reject(error);
            });
        });
}

module.exports = router;
