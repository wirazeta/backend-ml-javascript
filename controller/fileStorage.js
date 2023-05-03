const fs = require('fs')
const axios = require('axios').default
const FormData = require('form-data')
const { map } = require('../routes/uploadImage')
const _ = require('lodash')

function uploadImage(req, res) {
    const file = req.file

    if(!file){
        return res.status(400).send({'message':'No file selected'})
    }

    // Read file
    fs.readFile(data = file.path, function (err, data){
        if(err) throw err
    })

    // Save file
    fs.writeFile('../MachineLearningAPI/images' + file.filename, data, function(err){
        if(err) throw err

        // send response
        return res.send({
            'status': 200,
            'message': 'upload success'
        })
    })
}

function returnImage(req, res){
    // console.log(req.body.filename)
    axios.defaults.baseURL = 'http://localhost:5000'
    const fileName = req.body.filename 
    const filePath = `../MachineLearningAPI/images/${fileName}`  
    let formData = new FormData()
    formData.append('file', fs.createReadStream(filePath))
    const apiResponse = axios.post('/', formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }).then((response) => {
        console.log(JSON.parse(response.data.results))
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
        // 'status': 200
    // })
}

module.exports = {uploadImage, returnImage}