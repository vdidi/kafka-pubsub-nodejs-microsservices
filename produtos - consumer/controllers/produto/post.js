const mongoose = require('mongoose')
const Produto = mongoose.model('Produto')

exports.post = (req, res) =>{
    const produto = new Produto(req.body)
    produto.save()
    .then((result) => {
        res.status(201).send(result)
    })
    .catch((err) => {
        res.status(400).send({message: "Ocorreu um erro ao cadastrar o produto!", err})
    })
}