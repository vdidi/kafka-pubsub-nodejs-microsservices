import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import kafka from "kafka-node";
import Models from "./vendasModel";
import Routes from "./routes";

dotenv.config();
const env = process.env.NODE_ENV;
const port = process.env.PORT || 3002;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(Routes);

try{
    const Producer = kafka.Producer;
    const client = new kafka.KafkaClient('localhost:2181')
    const producer = new Producer(client);

    const kafka_topic = 'feed-service';        

    producer.on('ready',async function() {

        console.log('Kafka Producer is Ready');
    })

    producer.on('error', function(err) {
        console.log(err);
        console.log('[kafka-producer -> '+kafka_topic+']: connection errored');
        throw err;
        });

    mongoose.connect(`mongodb://localhost:27017/vendas`,
        { useNewUrlParser : true })
            .then((err,res) => {
                console.log('MongoDB connected successfully');
                require('./routes')(app, producer, kafka_topic);
            })
}
catch(e) {

    console.log(e);
}

app.listen(port, () => {
    console.log("Vendas rodando na porta 3002")
})


