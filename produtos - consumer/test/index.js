process.env.NODE_ENV = "test"

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const should = chai.should()

chai.use(chaiHttp)

require('../routes/test.spec')(chai, server)