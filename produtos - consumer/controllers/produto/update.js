const mongoose = require('mongoose')
const Produto = mongoose.model('Produto')

exports.update = (req, res) => {
    if(req.params.id){
        checkPrice(req.body)
        .then((result)=> {
            Produto.findByIdAndUpdate(req.params.id, result, {new: true, runValidators: true})
            .then((data) => {
            if(data){
                res.status(200).send(data)
            }else{
                res.status(400).send('Any product matches with this id')
            }
            })
        })
        .catch((err) => {
            res.status(400).send('Insert only numbers for price')
        })
    }

    //Check if the  
    function checkPrice(produto){
        return new Promise((resolve, reject) => {
            if(!produto.preco){
                resolve()
            }else{
                if(typeof produto.preco == 'number')
                    resolve(produto)
                else
                    reject()
            }
        })
    }
}