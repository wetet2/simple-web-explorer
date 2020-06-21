var config = {
    port: 10280,
    root: 'd://publish/output',
    previewImage: true,
    prefixForHidden: '_h_',
    useLogin: false,
    loginPassList: ['YourPassword1','YourPassword2', '1', 'a'],
    sessionExpireMinutes: 60,
    useSearch: true,
    useUpload: true,
    canCreateFolder: true,
    adminAuthIp: [ '192.168.245.233',  '192.168.245.5',  '192.168.246.104' ]
}
module.exports = config;
