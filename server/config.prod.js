module.exports = {
   rootStorage: '/home/pi/nodejs/output',
   dateFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
   loginPassList: ['1028'],
   adminPassList: ['1028'],
   prefixForHidden: '_h_',
   searchExclude: ['node_modules', '.vscode', '.git'],

   /* Need MongoDB for login. if you dont need login, change config.useLogin to false. */
   useLogin: true,
   sessionExpireMinutes: 60,
   mongo: {
      connStr: `mongodb://localhost`, options: {
         useUnifiedTopology: true, connectTimeoutMS: 180000, socketTimeoutMS: 120000
      }
   }
}