'use strict';

// configurações gerais, mexer com cautela
var express = require('express');
var router = express.Router();
var isNull = require('../script').isNull;
var Database = require('../Database');
const Cryptr = require('cryptr');
const config = require('../config');
const cryptr = new Cryptr(config.security.key);
const moment = require('moment-timezone');
// configurações gerais, mexer com cautela


// consulta que retorna os N últimos registros de leitura
router.get('/ultimas', (req, res, next) => {

    var limite_linhas = 10;
    var resposta = {};
    Database.query(`SELECT TOP ${limite_linhas} momento, temperatura, umidade FROM leitura order by momento desc`).then(resultados => {
        resultados = resultados.recordsets[0];

        resposta.cols = [
            {id: 'momento', label: 'momento', type: 'timeofday'},
            {id: 'temperatura', label: 'temperatura', type: 'number'},
            {id: 'umidade', label: 'umidade', type: 'number'}
        ];
        
        var linhas = [];
        
        for (var i = 1; i < resultados.length; i++) {
            var row = resultados[i];
            var momento = moment(row.momento).format('HH-mm-ss').split('-');
            var registro = {
                c: [{v: momento},
                    {v: row.temperatura},
                    {v: row.umidade}
                   ]
               };
            linhas.push(registro);
        }
        resposta.rows = linhas;
        
        res.json(resposta);
    }).catch(error => {
        console.log(error);
        res.status(400).json({"error": `erro na consulta junto ao banco de dados ${error}`});
    });

});

// consulta que retorna as médias de temperatura e umidade
router.get('/medias', (req, res, next) => {

    Database.query(`SELECT avg(temperatura) as media_temp , max(temperatura) as max_temp , min(temperatura) as min_temp,
    min(temperatura) + 1 * ( ( max(temperatura) - min(temperatura)  ) / 4 ) as q1T_temp,
    min(temperatura) + 2 * ( ( max(temperatura) - min(temperatura)  ) / 4 ) as q2T_temp,
    min(temperatura) + 3 * ( ( max(temperatura) - min(temperatura)  ) / 4 ) as q3T_temp,
    avg(umidade) as media_umid , max(umidade) as max_humi , min(umidade) as min_humi,
    min(umidade) + 1 * ( ( max(umidade) - min(umidade)  ) / 4 ) as q1H_humi,
    min(umidade) + 2 * ( ( max(umidade) - min(umidade)  ) / 4 ) as q2H_humi,
    min(umidade) + 3 * ( ( max(umidade) - min(umidade)  ) / 4 ) as q3H_humi FROM leitura`).then(resultados => {

        var linha = resultados.recordsets[0][0];
        
        console.log(resultados.recordsets);

        var temperatura = linha.media_temp.toFixed(2);
        var temperatura_min = linha.min_temp.toFixed(2);
        var temperatura_max = linha.max_temp.toFixed(2);
        var temperatura_q1T = linha.q1T_temp.toFixed(2);
        var temperatura_q2T = linha.q2T_temp.toFixed(2);
        var temperatura_q3T = linha.q3T_temp.toFixed(2);
        var umidade = linha.media_umid.toFixed(2);
        var umidade_max = linha.max_humi.toFixed(2);
        var umidade_min = linha.min_humi.toFixed(2);
        var umidade_q1H = linha.q1H_humi.toFixed(2);
        var umidade_q2H = linha.q2H_humi.toFixed(2);
        var umidade_q3H = linha.q3H_humi.toFixed(2);



        res.json({temperatura:temperatura , temperatura_min:temperatura_min , temperatura_max:temperatura_max ,  temperatura_q1T: temperatura_q1T , temperatura_q2T:temperatura_q2T 
            , temperatura_q3T:temperatura_q3T , umidade:umidade , umidade_min:umidade_min , umidade_max:umidade_max ,  umidade_q1H: umidade_q1H , umidade_q2H:umidade_q2H 
            , umidade_q3H:umidade_q3H});
    }).catch(error => {
        console.log(error);
        res.status(400).json({"error": `erro na consulta junto ao banco de dados ${error}`});
    });

});



module.exports = router;
