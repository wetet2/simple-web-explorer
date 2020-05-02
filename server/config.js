var config = {
    port: 80,
    root: 'd://shared',
    previewImage: true,
    prefixForHidden: '_h_',
    useLogin: false,
    loginPassList: ['YourPassword1','YourPassword2', '...'],
    sessionExpireMinutes: 60,
    useSearch: true,
    useUpload: true,
    canCreateFolder: true,
    adminAuthIp: [ '127.0.0.1', '192.168.0.2' ]
}
module.exports = config;
