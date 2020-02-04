const express = require('express');
const app = express();
const port = 10480;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser());

app.listen(port, () => {
    console.log(`Server is listening to port ${port}`);
});