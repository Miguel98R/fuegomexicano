let ms = require('../helpers/apiato.helper')

let congresosModel = require('../models/congresos.model')



//APIATO CONFIGURE
let validationObject = {}
let populationObject = false
let options = {}
let aggregate_pipeline_dt = []
let aggregate_pipeline = []


module.exports = {
    createOne: ms.createOne(congresosModel, validationObject, populationObject, options),
    createMany: ms.createMany(congresosModel, validationObject, populationObject, options),

    getOneWhere: ms.getOneWhere(congresosModel, populationObject, options),
    getOneById: ms.getOneById(congresosModel, populationObject, options),
    getMany: ms.getMany(congresosModel, populationObject, options),

    findUpdateOrCreate: ms.findUpdateOrCreate(congresosModel, validationObject, populationObject, options),
    findUpdate: ms.findUpdate(congresosModel, validationObject, populationObject, options),
    updateById: ms.updateById(congresosModel, validationObject, populationObject, options),

    findIdAndDelete: ms.findIdAndDelete(congresosModel, options),

    datatable_aggregate: ms.datatable_aggregate(congresosModel, aggregate_pipeline_dt, ''),
    aggregate: ms.aggregate(congresosModel, aggregate_pipeline, options),
}
