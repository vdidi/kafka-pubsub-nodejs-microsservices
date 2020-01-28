const mongoose = require('mongoose')
const Schema  = mongoose.Schema

const deleteProduct = (id) => {
    return mongoose.model('ProdutoSchema').findByIdAndDelete(id);
}

const ProdutoSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true 
    },  
    descricao: {
        type: String,
        required: false
    }
}, {versionKey: false})

ProdutoSchema.methods.deleteProduct = deleteProduct;

module.exports = mongoose.model('Produto', ProdutoSchema)