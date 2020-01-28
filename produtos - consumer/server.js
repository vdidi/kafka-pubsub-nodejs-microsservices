/**
 * 
 * Arquivo: server.js
 * Descrição: 
 * Author: Vitor Hugo Ramos
 * Data de criação: 21/05/2018
 * 
*/

//Configurar o setup da aplicação
//Chamadas dos pacotes
require('dotenv').config()
const env = process.env.NODE_ENV
const port = process.env.PORT || 3001
const kafka_topic = process.env.KAFKA_TOPIC;
const kafka_server = process.env.KAFKA_SERVER;
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const kafka = require('kafka-node')

const Models = require('./models/index')

try {
  const Consumer = kafka.Consumer;
  const client = new kafka.KafkaClient('localhost:2181');
  let consumer = new Consumer(
    client,
    [{ topic: 'feed-service', partition: 0 }],
    {
      autoCommit: true,
      fetchMaxWaitMs: 1000,
      fetchMaxBytes: 1024 * 1024,
      encoding: 'utf8',
      fromOffset: false
    }
  );
  consumer.on('message', async function(message) {
      const consumerData = JSON.parse(message.value);
      const id = consumerData.data;

      console.log("===>",consumerData);

      if(consumerData.type === 'PRODUTO_VENDIDO'){         
        const Produto = mongoose.model('Produto')

        const prod = await Produto.findByIdAndDelete(id)
        console.log(prod);
     } 
  });
  consumer.on('error', function(err) {
    console.log('error', err);
  });
}
catch(e) {
  console.log(e);
}

if(env === "test")
  app.db_url = process.env.MONGO_URL_TEST || "mongodb://localhost:27017/test"
else
  app.db_url = process.env.MONGO_URL

mongoose.Promise = Promise

//conexão com  banco de dados
mongoose.connect(app.db_url, {
    promiseLibrary: global.Promise
})
const db = mongoose.connection

//caso aconteça algum erro
db.on('error', console.error.bind(console, 'connection error:'))

//abrindo conexão

db.once('open', () => {
    if(env !== "test")
      console.log(`Connected to Mongo at : ${new Date()}`)
})

//setando prefixo da api
app.APIROOTPATH = '/api'

app.use(bodyParser.json())
 
app.all('/*', (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept,Authorization')
    res.setHeader('Access-Control-Allow-Credentials', true)
    if (req.method === 'OPTIONS')
        res.status(200).end()
    else
        next()
})
 
//carrega as rotas da API
app.use(app.APIROOTPATH, require('./routes/'))

//Manda uma resposta 404 se um recurso não é encontrado
app.use((req, res) => {
    res.status(404).send('Not found')
})

//status do servidor
const server = app.listen(port, () => {
    if(env !== "test")
        console.log(`API RESTful started on port ${server.address().port}`)
})

module.exports = app
