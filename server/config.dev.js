let config = {
   dateFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
   loginPassList: ['dldk1004', 'votmdnjem', 'vptmdnjem', '1028', '1004'],
   adminPassList: ['dldk1004', '1028'],
   rootStorage: 'D:/node/repository',
   
   prefixForHidden: '_h_',
   searchExclude: ['node_modules', '.vscode', '.git'],

   // Need MongoDB for login. if you dont need login, change config.useLogin to false.
   useLogin: false,
   sessionExpireMinutes: 60,
}

config.mongo = { connStr: `mongodb:///192.168.0.20`, options: { useUnifiedTopology: true, connectTimeoutMS: 180000, socketTimeoutMS: 120000 } };

module.exports = config;





