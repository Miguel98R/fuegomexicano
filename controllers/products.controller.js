let apiato = require('apiato')
let ms = new apiato()

let productsModel = require('../models/products.model')


//APIATO CONFIGURE
let validationObject = {}
let populationObject = false
let options = {}
let aggregate_pipeline_dt = []
let aggregate_pipeline = []


module.exports = {
    createOne: ms.createOne(productsModel, validationObject, populationObject, options),
    createMany: ms.createMany(productsModel, validationObject, populationObject, options),

    getOneWhere: ms.getOneWhere(productsModel, populationObject, options),
    getOneById: ms.getOneById(productsModel, populationObject, options),
    getMany: ms.getMany(productsModel, populationObject, options),

    findUpdateOrCreate: ms.findUpdateOrCreate(productsModel, validationObject, populationObject, options),
    findUpdate: ms.findUpdate(productsModel, validationObject, populationObject, options),
    updateById: ms.updateById(productsModel, validationObject, populationObject, options),

    findIdAndDelete: ms.findIdAndDelete(productsModel, options),

    datatable_aggregate: ms.datatable_aggregate(productsModel, aggregate_pipeline_dt, ''),
    aggregate: ms.aggregate(productsModel, aggregate_pipeline, options),
}
