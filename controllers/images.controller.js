let ms = require('../helpers/apiato.helper')
let imagesModel = require('../models/images.model')


//APIATO CONFIGURE
let validationObject = {}
let populationObject = false
let options = {}
let aggregate_pipeline_dt = []
let aggregate_pipeline = []


module.exports = {
    createOne: ms.createOne(imagesModel, validationObject, populationObject, options),
    createMany: ms.createMany(imagesModel, validationObject, populationObject, options),

    getOneWhere: ms.getOneWhere(imagesModel, populationObject, options),
    getOneById: ms.getOneById(imagesModel, populationObject, options),
    getMany: ms.getMany(imagesModel, populationObject, options),

    findUpdateOrCreate: ms.findUpdateOrCreate(imagesModel, validationObject, populationObject, options),
    findUpdate: ms.findUpdate(imagesModel, validationObject, populationObject, options),
    updateById: ms.updateById(imagesModel, validationObject, populationObject, options),

    findIdAndDelete: ms.findIdAndDelete(imagesModel, options),

    datatable_aggregate: ms.datatable_aggregate(imagesModel, aggregate_pipeline_dt, ''),
    aggregate: ms.aggregate(imagesModel, aggregate_pipeline, options),
}
