import mongoose from "mongoose";
const Schema = mongoose.Schema;

const VendasSchema = new Schema({
    valor: {
        type: Number,
        required: true
    },
    produtoId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {versionKey: false})

class Vendas {

    static salvarVenda(valor, produtoId) {
        const venda = this({
            valor,
            produtoId
        })
        return venda.save();
    }
    static listarVendas() {
        return this.find();
    }
}

VendasSchema.loadClass(Vendas);

module.exports = mongoose.model('VendasSchema', VendasSchema)