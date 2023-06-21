const express = require('express')
const {upload} = require('../middleware/saving_image')
const {uploadImage, returnImage} = require('../controller/fileStorage')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.post('/upload',upload, uploadImage)
app.post('/download', returnImage)

module.exports = app
