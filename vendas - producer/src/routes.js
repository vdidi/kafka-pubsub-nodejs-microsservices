import mongoose from "mongoose";
import vendasModel from "./vendasModel";

const Vendas = mongoose.model("VendasSchema");

module.exports = (app, producer, kafka_topic) => {
    app.post('/vendas', async (req, res) => {
        try {
            const venda = await vendasModel.salvarVenda(req.body.valor, 
                                                        req.body.produtoId);

            if(venda) {
                let payload = [{
                    topic : kafka_topic,
                    messages : JSON.stringify({
                        type : "PRODUTO_VENDIDO",
                        data : req.body.produtoId
                    })
                }]

                producer.send(payload,(err,data) => {
                    if(err) {
                        console.log('[kafka-producer -> '+kafka_topic+']: broker update failed')
                    }
            
                    console.log('[kafka-producer -> '+kafka_topic+']: broker update success');
                })
            }
            res.status(200).send(venda)
        } catch (error) {
            res.status(500).send(error);
        }
    })

    app.get('/vendas', async (req, res) => {
        try {
            const vendas = await vendasModel.listarVendas();
            res.status(200).send(vendas);
        } catch (error) {
            res.status(400).send(error);
        }
    })
} 

// module.exports = router;
