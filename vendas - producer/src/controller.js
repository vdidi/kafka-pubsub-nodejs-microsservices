import mongoose from "mongoose";
import kafka from "kafka-node";
const Vendas = mongoose.model('VendasSchema')

exports.post = async (req, res) => {
    const venda = new Vendas(req.body)
    venda.save()
    .then(result => {
        res.status(201).send(result)
    })
    .catch(err => console.log(err));
}