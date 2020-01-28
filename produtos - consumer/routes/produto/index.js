module.exports = (router) => {
    require('./get')(router)
    require('./post')(router)
    require('./get_one')(router)
    require('./update')(router)
    require('./delete')(router)
}