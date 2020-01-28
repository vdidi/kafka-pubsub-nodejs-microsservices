module.exports = (router) => {
    const controller = require('../../controllers/produto/post')

    router.route('/produtos').post(controller.post)
}