module.exports = {
   rootStorage: 'D:/node/repository',
   dateFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
   loginPassList: ['1028'],
   adminPassList: ['1028'],
   prefixForHidden: '_h_',
   searchExclude: ['node_modules', '.vscode', '.git'],

   /* Need MongoDB for login. if you dont need login, change config.useLogin to false. */
   useLogin: false,
   sessionExpireMinutes: 60,
   mongo: {
      connStr: `mongodb:///192.168.0.20`, options: {
         useUnifiedTopology: true, connectTimeoutMS: 180000, socketTimeoutMS: 120000
      }
   }
}