module.exports = (router) => {
    const controller = require('../../controllers/produto/update')

    router.route('/produtos/:id').put(controller.update)
}