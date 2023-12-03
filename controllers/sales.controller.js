let ms = require('../helpers/apiato.helper')
let salesModel = require('../models/sales.model')


//APIATO CONFIGURE
let validationObject = {}
let populationObject = false
let options = {}
let aggregate_pipeline_dt = []
let aggregate_pipeline = []


module.exports = {
    createOne: ms.createOne(salesModel, validationObject, populationObject, options),
    createMany: ms.createMany(salesModel, validationObject, populationObject, options),

    getOneWhere: ms.getOneWhere(salesModel, populationObject, options),
    getOneById: ms.getOneById(salesModel, populationObject, options),
    getMany: ms.getMany(salesModel, populationObject, options),

    findUpdateOrCreate: ms.findUpdateOrCreate(salesModel, validationObject, populationObject, options),
    findUpdate: ms.findUpdate(salesModel, validationObject, populationObject, options),
    updateById: ms.updateById(salesModel, validationObject, populationObject, options),

    findIdAndDelete: ms.findIdAndDelete(salesModel, options),

    datatable_aggregate: ms.datatable_aggregate(salesModel, aggregate_pipeline_dt, ''),
    aggregate: ms.aggregate(salesModel, aggregate_pipeline, options),
}
