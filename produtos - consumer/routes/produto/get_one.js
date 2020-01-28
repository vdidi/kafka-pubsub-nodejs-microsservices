module.exports = (router) => {
    const controller = require('../../controllers/produto/get_one')

    router.route('/produtos/:id').get(controller.get_one)
}