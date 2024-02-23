<h1>PDV API com firebase</h1>

## 📂 Abrir e rodar API
Faça download do NodeJs caso não tenha instalado em sua máquina

https://nodejs.org/en/download

1-
  ```
  $ git clone https://github.com/davidfontesfelix/PDV-backend
  ```
2- Abrir projeto na IDE 

3- crie um .env com as configs do firebase baseando no .env.example

4 - No terminal executar os comandos abaixo

  ```
  $ npm ci
  ```
  ```
  $ npm run dev
  ```
### Usando
O projeto estará rodando no link abaixo: 

 ```
  http://localhost:3001
  ```

## Swagger
### acessar documentação do swagger

 ```
  http://localhost:3001/api-docs
  ```
## 🔨 Ferramentas utilizadas
 - [Node](https://nodejs.org/en)
 - [Express](https://expressjs.com/pt-br/)
 - [Firebase](https://firebase.google.com/?hl=pt-br)
 - [bcrypt](https://www.npmjs.com/package/bcrypt)
 - [JsonWebToken](https://www.npmjs.com/package/jsonwebtoken)

## Técnicas utilizadas
- Graceful shutdown: É usado para garantir que o servidor termine suas operações evitando interrupções abruptas.

## Perguntas que você pode ter:
### ❓ Por que quando cadastro o usuário a senha sai criptografada?
Isso ocorre devido ao uso do bcrypt, que criptografa a senha antes de armazená-la no banco de dados para garantir a segurança. Não se preocupe, na rota de login você poderá usar a senha que inseriu no cadastro sem problemas.

### ❓ Por que não consigo acessar a rota de procurar user por id?
Primeiro, você precisa obter o token gerado durante o login e colocá-lo no cabeçalho da requisição com a chave "Authorization" e o valor "Bearer token".

```bash 
  fetch('URL', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```