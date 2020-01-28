const mongoose = require('mongoose')
const Produto = mongoose.model('Produto')

exports.delete = (req, res) => {
    Produto.findByIdAndRemove(req.params.id)
    .then((data) => {
        res.status(200).send({message: `Produto ${data.id} foi removido com sucesso!`})
    })
    .catch((err) => {
        res.status(400).send({message: "Não foi possível remover o produto"})
    })
}