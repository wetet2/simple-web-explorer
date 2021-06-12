
const fs = require('fs');
const path = require('path');
const moment = require('moment');

let iconFiles = fs.readdirSync(path.resolve(__dirname, '../../public/images/ext'))
const iconList = iconFiles.map(e => e.split('.')[0])

const imageList = ['jpg', 'jpeg', 'gif', 'png', 'svg', 'ico'];

module.exports = {
   getIcon: (name) => {
      let ext = name.split('.').pop();
      if(ext) ext = ext.toLowerCase();
      if (iconList.includes(ext)) return ext;
      else return 'unknown';
   },


   isImage: (name) => {
      let ext = name.split('.').pop();
      if(ext) ext = ext.toLowerCase();
      return imageList.includes(ext);
   },

   getFileSize: (bytes) => {
      if (bytes > 1048576) {
         return parseInt(bytes / 1048576) + ' MB';
      } else if (bytes > 1024) {
         return parseInt(bytes / 1024) + ' KB';
      } else {
         return '1 KB';
      }
   },

   isRecentUpdated: (time) => moment(time).isSame(moment(new Date()), "day"),

   isRecentCreated: (time) => moment(time).isSameOrAfter(moment(new Date()), "day"),

}