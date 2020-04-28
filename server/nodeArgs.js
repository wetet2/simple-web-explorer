const nopt = require('nopt');
const knownOpts = {
   "port": [Number],
   "root": [String]
}
const nodeArgs = nopt(knownOpts, null, process.argv);
process.nodeArgs = nodeArgs;

module.exports = {};