let apiato = require('apiato')
let ms = new apiato()

let blogsModel = require('../models/blogs.model')


//APIATO CONFIGURE
let validationObject = {}
let populationObject = false
let options = {}
let aggregate_pipeline_dt = []
let aggregate_pipeline = []


module.exports = {
    createOne: ms.createOne(blogsModel, validationObject, populationObject, options),
    createMany: ms.createMany(blogsModel, validationObject, populationObject, options),

    getOneWhere: ms.getOneWhere(blogsModel, populationObject, options),
    getOneById: ms.getOneById(blogsModel, populationObject, options),
    getMany: ms.getMany(blogsModel, populationObject, options),

    findUpdateOrCreate: ms.findUpdateOrCreate(blogsModel, validationObject, populationObject, options),
    findUpdate: ms.findUpdate(blogsModel, validationObject, populationObject, options),
    updateById: ms.updateById(blogsModel, validationObject, populationObject, options),

    findIdAndDelete: ms.findIdAndDelete(blogsModel, options),

    datatable_aggregate: ms.datatable_aggregate(blogsModel, aggregate_pipeline_dt, ''),
    aggregate: ms.aggregate(blogsModel, aggregate_pipeline, options),
}
