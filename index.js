const express = require('express')
const app = express()
const uploadImage = require('./routes/uploadImage')


const port = 3000
app.use('/', uploadImage)

app.listen(port, (err) => {
    if (err) throw err
    console.log(`Server listening at http://localhost:${port}`)
})