const mongoose = require('mongoose')
const Produto = mongoose.model('Produto')
// const redis = require('redis')
// const client = redis.createClient();

exports.get = (req, res) => {

    // client.get('produtos', (err, reply) => {
    //     if(reply){
    //         console.log('redis')
    //         res.send(JSON.parse(reply))
    //     }else{
    //         Produto.find()
    //         .then((data) => {
    //             client.set('produtos', JSON.stringify(data));
    //             client.expire('produtos', 10);
    //             console.log('db')
    //             res.send(data)
    //         })
    //         .catch((err) => {
    //             res.send({message: err.message})
    //         })
    //     }
    // })

    Produto.find()
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        res.send({message: err.message})
    })
}