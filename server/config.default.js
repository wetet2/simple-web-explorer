/** Copy this file to config.js in the same folder then modify config.js options with your information */
module.exports = {
    port: 80,
    root: 'd://anyfolder//anyfolder',
    previewImage: true,
    prefixForHidden: '_h_',
    useLogin: false,
    loginPassList: ['YourPassword1','YourPassword2', '...'],
    sessionExpireMinutes: 60,
    useSearch: true,
    searchExclude: ['node_modules', 'bower_components', '.git'],
    useUpload: true,
    canCreateFolder: true,
    adminAuthIp: [ '127.0.0.1', '...' ]
};
