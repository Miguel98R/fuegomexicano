let ms = require('../helpers/apiato.helper')
let slidersModel = require('../models/sliders.model')


//APIATO CONFIGURE
let validationObject = {}
let populationObject = false
let options = {}
let aggregate_pipeline_dt = []
let aggregate_pipeline = []


module.exports = {
    createOne: ms.createOne(slidersModel, validationObject, populationObject, options),
    createMany: ms.createMany(slidersModel, validationObject, populationObject, options),

    getOneWhere: ms.getOneWhere(slidersModel, populationObject, options),
    getOneById: ms.getOneById(slidersModel, populationObject, options),
    getMany: ms.getMany(slidersModel, populationObject, options),

    findUpdateOrCreate: ms.findUpdateOrCreate(slidersModel, validationObject, populationObject, options),
    findUpdate: ms.findUpdate(slidersModel, validationObject, populationObject, options),
    updateById: ms.updateById(slidersModel, validationObject, populationObject, options),

    findIdAndDelete: ms.findIdAndDelete(slidersModel, options),

    datatable_aggregate: ms.datatable_aggregate(slidersModel, aggregate_pipeline_dt, ''),
    aggregate: ms.aggregate(slidersModel, aggregate_pipeline, options),
}
