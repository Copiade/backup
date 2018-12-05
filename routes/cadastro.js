const express = require('express');
const router = express.Router();
const isNull = require('../script').isNull;
const Database = require('../Database');
const Cryptr = require('cryptr');
const config = require('../config');
const cryptr = new Cryptr(config.security.key);

router.get('/', (req, res, next) => {
    Database.query('SELECT * FROM usuarios').then((results) => {
        res.json(results);
    }).catch((error) => {
        res.json(error);
    });
});

router.post('/', (req, res, next) => {
    var nome = req.body.nome;
    var usuario = req.body.usuario;
    var senha = req.body.senha;
    var empresa = req.body.empresa;
    var telefone = req.body.telefone;


    Database.query(`INSERT INTO usuarios (nome, usuario, senha , empresa , foneempresa ) VALUES ('${nome}', '${usuario}', '${senha}' , '${empresa}' , ' ${telefone} ');`).then((results) => {
        res.status(200).json({
            mensagem: 'Concluído',
            results: results
        });
    }).catch((error) => {
        res.status(401).json({
            mensagem: 'Deu erro',
            error: error
        });
    });
});

module.exports = router;
