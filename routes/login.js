var express = require('express');
var router = express.Router();
var isNull = require('../script').isNull;
var Database = require('../Database');
const Cryptr = require('cryptr');
const config = require('../config');
const cryptr = new Cryptr(config.security.key);

// rota de autenticação
router.post('/', (req, res, next) => {
	console.log('tentando autenticar...');
	
	try {
			
		// após o body, são os nomes dos campos no formulário	
		var login = req.body.login;
		var senha = req.body.senha;
		console.log (senha , login);
		
		const msgErro = {'mensagem': 'Login e/ou senha inválidos!'};
		
		if (isNull(login) || isNull(senha)) {
			console.log('Login e/ou senha inválidos');
			res.status(400).send({'mensagem' : 'login e senha obrigatórios'});
		} else {
			console.log('tentando consulta no banco...');
			// altere aqui o seu select de acordo com sua tabela
			Database.query(`SELECT nome, usuario , senha FROM usuarios WHERE usuario = '${login}';`).then(results => {
				console.log(`Linhas: ${results.recordsets[0].length}`);
				let linhas = results.recordsets[0];
				if (linhas.length > 0) {
					let senhaBanco = linhas[0].senha; // é 'senha' o nome de seu campo?
					if (senhaBanco === senha) {
						let user = {
							// mantenha "nome" e "login" nos antes dos ":"
							nome: linhas[0].nome, // é 'nome' o nome de seu campo?
							login: linhas[0].usuario, // é 'login' o nome de seu campo?
						};
						req.session.user = user;
						res.status(200).send('ok');
					} else {
						res.status(401).send(msgErro);
					}
				} else {
					res.status(401).send(msgErro);
				}
				
			}).catch(error => {
				res.status(401).send(msgErro);
				
			});
		}
    
	} catch (e) {
		console.error(`erro: ${e}`);
		res.send({'mensagem':`${e}`});
	}

});

// rota que recupera os dados do usuário na sessão
// a princípio, não precisa mexer aqui
router.get('/sessao', (req, res, next) => {
    if (req.session.user && req.session.user) {
		const usuario = req.session.user;
        res.json({
            'nome': usuario.nome,
            'login': usuario.usuario,
        });
    } else {
        res.status(401).json({
            'mensagem': 'Nenhum usuário na sessão'
        });
    }
});

module.exports = router;
