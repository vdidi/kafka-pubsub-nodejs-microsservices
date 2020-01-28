module.exports = (router) => {
    const controller = require('../../controllers/produto/get')

    router.route('/produtos').get(controller.get)
}