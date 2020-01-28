const mongoose = require('mongoose')
const Produto = mongoose.model('Produto')

module.exports = (chai, server) => {
    describe('Produto', () => {
        
        //Cleaning the database to start the tests
        beforeEach((done) => {
            Produto.remove()
            .then(()=>{
                const produto_test = Produto({nome: 'mouse', preco: 99.0, descricao: 'This is a mouse'})
                produto_test.save()
                .then(() => {
                    done()
                })
            })
        })

        describe('/GET produtos', () => {
            it('it should GET ALL the products', (done) => {
                chai.request(server)
                .get(`${server.APIROOTPATH}/produtos`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                    res.body[0].should.to.have.property('nome')
                    res.body[0].should.to.have.property('descricao')
                    res.body[0].should.to.have.property('preco')
                    done()
                })  
            })
            it('it should NOT GET ALL the products (wrong route)', (done) => {
                chai.request(server)
                .get(`${server.APIROOTPATH}/produto`)
                .end((err, res) => {
                    res.should.have.status(404)
                    done()
                })
            })
        })

        describe('/GET ONE produtos/:id', () => {
            it('it SHOULD GET ONE products', (done) =>{
                const product = Produto({
                    nome: 'Laptop',
                    preco: 2000.0,
                    descricao: 'This is a laptop'
                })
                product.save()
                .then((data) =>{
                    chai.request(server)
                        .get(`${server.APIROOTPATH}/produtos/${data.id}`)
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.be.a('object')
                            res.body.should.to.have.property('_id').equals(data.id)
                            res.body.should.to.have.property('nome')
                            res.body.should.to.have.property('descricao')
                            res.body.should.to.have.property('preco')
                            done()
                        })
                })
            })
            it('it SHOULD NOT GET ONE product (inexistent id param)', (done) => {
                const product = Produto({
                    nome: 'Laptop',
                    preco: 2000.0,
                    descricao: 'This is a laptop'
                })
                product.save()
                .then((data) =>{
                    chai.request(server)
                        .get(`${server.APIROOTPATH}/produtos/12dh192312h300`)
                        .end((err, res) => {
                            res.should.have.status(400)
                            res.body.should.be.a('object')
                            done()
                        })
                })
            })
        })
        
        describe('/POST produtos', () => {
            it('it SHOULD POST a product', (done) => {
                const produto = {
                    nome: 'Mouse',
                    preco: 100,
                    descricao: 'This is a mouse'
                }
                chai.request(server)
                .post(`${server.APIROOTPATH}/produtos`)
                .send(produto)
                .end((err, res) => {
                    res.should.have.status(201)
                    res.body.should.be.a('object')
                    res.body.should.to.have.property('nome')
                    res.body.should.to.have.property('preco')
                    res.body.should.to.have.property('descricao')
                    done()
                })
            })
            it('it SHOULD POST a product (without description)', (done) => {
                const produto = {
                    nome: 'Mouse',
                    preco: 100
                }
                chai.request(server)
                .post(`${server.APIROOTPATH}/produtos`)
                .send(produto)
                .end((err, res) => {
                    res.should.have.status(201)
                    res.body.should.be.a('object')
                    res.body.should.to.not.have.property('descricao')
                    done()
                })
            })
            it('it SHOULD NOT POST a product (missing name)', (done) => {
                const produto = {
                    preco: 100,
                    descricao: 'This is a mouse'
                }
                chai.request(server)
                .post(`${server.APIROOTPATH}/produtos`)
                .send(produto)
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.be.a('object')
                    done()
                })
            })
            it('it SHOULD NOT POST a product (missing price)', (done) => {
                const produto = {
                    nome: 'Mouse',
                    descricao: 'This is a mouse'
                }
                chai.request(server)
                .post(`${server.APIROOTPATH}/produtos`)
                .send(produto)
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.be.a('object')
                    done()
                })
            })
        })

        describe('/UPDATE produtos/:id', () => {
            it('it SHOULD UPDATE the product', (done) => {
                const produto = {
                    nome: 'Mouse',
                    preco: 100,
                    descricao: 'This is a mouse'
                }
                
                const data = {
                    'nome': 'Keyboard',
                    'preco': 220,
                    'descricao': 'This is a keyboard'
                }
                chai.request(server)
                .post(`${server.APIROOTPATH}/produtos`)
                .send(produto)
                .end((err, res) => {
                    chai.request(server)
                    .put(`${server.APIROOTPATH}/produtos/${res.body._id}`)
                    .send(data)
                    .end((err, res2) =>{
                        res2.should.have.status(200)
                        res2.body.should.be.a('object')
                        res2.body.should.to.have.property('nome')
                        res2.body.should.to.have.property('preco')
                        res2.body.should.to.have.property('descricao')
                        done()
                    })
                })
            })
            it('it SHOULD NOT update the product (with wrong price)', (done) => {
                const produto = {
                    nome: 'Mouse',
                    preco: 100,
                    descricao: 'This is a mouse'
                }
                
                const data = {
                    'nome': 'Keyboard',
                    'preco': 'Not a number',
                    'descricao': 'This is a keyboard'
                }
                chai.request(server)
                .post(`${server.APIROOTPATH}/produtos`)
                .send(produto)
                .end((err, res) => {
                    chai.request(server)
                    .put(`${server.APIROOTPATH}/produtos/${res.body._id}`)
                    .send(data)
                    .end((err, res2) =>{
                        res2.should.have.status(400)
                        res2.body.should.be.a('object')
                        done()
                    })
                })
            })
        })
        describe('/DELETE produtos/:id', () =>{
            it('it SHOULD delete the product', (done) => {
                const product = {
                    nome: 'Laptop',
                    preco: 2000.0,
                    descricao: 'This is a laptop'
                }
                chai.request(server)
                .post(`${server.APIROOTPATH}/produtos`)
                .send(product)
                .end((err, res) => {
                    chai.request(server)
                    .delete(`${server.APIROOTPATH}/produtos/${res.body._id}`)
                    .end((err, res2) => {
                        res2.should.have.status(200)
                        res2.body.should.be.a('object')
                        done()
                    })
                })
            })
            it('it SHOULD NOT DELETE the product (missing id parameter)', (done) => {
                const product = {
                    nome: 'Laptop',
                    preco: 2000.0,
                    descricao: 'This is a laptop'
                }
                chai.request(server)
                .post(`${server.APIROOTPATH}/produtos`)
                .send(product)
                .end((err, res) => {
                    chai.request(server)
                    .delete(`${server.APIROOTPATH}/produtos/`)
                    .end((err, res2) => {
                        res2.should.have.status(404)
                        res2.body.should.be.a('object')
                        done()
                    })
                })
            })
        })
    })
}