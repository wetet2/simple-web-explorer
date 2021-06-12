const nopt = require('nopt');
const knownOpts = {
   "port": [Number], // Node 포트
}
const nodeArgs = nopt(knownOpts, null, process.argv);
process.nodeArgs = nodeArgs;

module.exports = {};