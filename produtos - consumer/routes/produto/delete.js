module.exports = (router) => {
    const controller = require('../../controllers/produto/delete')

    router.route('/produtos/:id').delete(controller.delete)
}