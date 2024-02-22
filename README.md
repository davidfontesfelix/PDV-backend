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

4- Crie as coleções users e products no seu firestore database

5 - No terminal executar os comandos abaixo

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