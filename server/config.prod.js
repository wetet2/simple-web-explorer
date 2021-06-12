let config = {
   dateFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
   loginPassList: ['dldk1004', 'votmdnjem', 'vptmdnjem', '1028', '1004'],
   adminPassList: ['dldk1004', '1028'],
   repoLocation: '/home/pi/nodejs/repository',
   rootStorage: '/home/pi/nodejs/repository/explorer',

   prefixForHidden: '_h_',
   searchExclude: ['node_modules', '.vscode', '.git'],

   // Need MongoDB for login. if you dont need login, change config.useLogin to false.
   useLogin: false,
   sessionExpireMinutes: 60,
}

config.mongo = { connStr: `mongodb://localhost`, options: { useUnifiedTopology: true, connectTimeoutMS: 180000, socketTimeoutMS: 120000 } };

module.exports = config;





