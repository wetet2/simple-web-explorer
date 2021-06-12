module.exports = (asyncFunction) => {
    return async (req, res, next) => {
        return await asyncFunction(req, res, next).catch(next);
    }
}