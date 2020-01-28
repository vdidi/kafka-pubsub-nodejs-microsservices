const mongoose = require('mongoose')
const Produto = mongoose.model('Produto')

exports.get_one = (req, res) => {
    if(req.params.id){
        Produto.findById(req.params.id)
        .then((data)=>{
            if(data){
                res.status(200).send(data)
            }else{
                res.status(400).send('This product does not exist')
            }
        })
        .catch((err)=>{
            res.status(400).send(`Wrong parameters ${err}`)
        })
    }else{
        res.status(400).send('Missing id parameter')
    }
}