const fs = require('fs')
const axios = require('axios').default
const FormData = require('form-data')
const { map } = require('../routes/uploadImage')
const _ = require('lodash')
const { Storage } = require('@google-cloud/storage')


const storage = new Storage({
    keyFilename : './meta-map-351711-90fab2172d72.json'
})
const bucketName = 'machine-learning-object-bucket-1'
const bucket = storage.bucket(bucketName)

function uploadImage(req, res) {
    const file = req.file
    if(!file){
        return res.status(400).send({'message':'No file selected'})
    }

    bucket.upload(file.path,{
        destination: 'images/' + file.filename,
    }, function(err, file){
        if(err)throw err
        return res.send({
            'status': 200,
            'message': 'upload success'
        })
    })
    // Read file
    // fs.readFile(data = file.path, function (err, data){
    //     if(err) throw err
    // })

    // Save file
    // fs.writeFile('../MachineLearningAPI/images' + file.filename, data, function(err){
    //     if(err) throw err

    //     // send response
    //     return res.send({
    //         'status': 200,
    //         'message': 'upload success'
    //     })
    // })
}

async function returnImage(req, res){
    // console.log(req.body.filename)
    axios.defaults.baseURL = 'http://34.101.154.114:5000'
    const fileName = req.body.filename
    const dir = '~/images'
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir)
    }
    console.log(dir)
    await bucket.file('images/'+fileName).download({destination: dir+'/'+fileName})
    const file = fs.createReadStream(dir+'/'+fileName)
    // const file = fs.createReadStream(dir+'/'+fileName)
    let formData = new FormData()
    formData.append('file', file)
    const apiResponse = axios.post('/', formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }).then((response) => {
        // console.log(JSON.parse(response.data.results))
        let data = []
        JSON.parse(response.data.results).forEach((item) => {
            data.push({'name': item.name, 'confidence' : item.confidence, 'class': item.class})
        })
        // const dataFilter = data.filter((item) => item.name).map((item) => item.name)
        // const finalRes = {
        //     'name': data.name,
        //     'count' : dataFilter.length,
        //     'object' : dataFilter
        // }
        const arrayGroup = _.groupBy(data,'name')
        const arrayGroupCount = _.countBy(data,'name')
        const arrayGroupMerge = _.map(arrayGroup, (value, key) => {
            return {
                'name': key,
                'count': arrayGroupCount[key],
                'object': value
            }
        })
        
        data = arrayGroupMerge
        
        return res.send({
            'status': 200,
            'message': 'success',
            'image' : response.data.image,
            'data' : data
        })
    })
    // res.send({
    //     'status': 200
    // })
}

module.exports = {uploadImage, returnImage}