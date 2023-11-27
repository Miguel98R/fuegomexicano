let apiato = require('apiato')
let ms = new apiato()

let invitacionesModel = require('../models/invitaciones.model')


//APIATO CONFIGURE
let validationObject = {}
let populationObject = false
let options = {}
let aggregate_pipeline_dt = []
let aggregate_pipeline = []


module.exports = {
    createOne: ms.createOne(invitacionesModel, validationObject, populationObject, options),
    createMany: ms.createMany(invitacionesModel, validationObject, populationObject, options),

    getOneWhere: ms.getOneWhere(invitacionesModel, populationObject, options),
    getOneById: ms.getOneById(invitacionesModel, populationObject, options),
    getMany: ms.getMany(invitacionesModel, populationObject, options),

    findUpdateOrCreate: ms.findUpdateOrCreate(invitacionesModel, validationObject, populationObject, options),
    findUpdate: ms.findUpdate(invitacionesModel, validationObject, populationObject, options),
    updateById: ms.updateById(invitacionesModel, validationObject, populationObject, options),

    findIdAndDelete: ms.findIdAndDelete(invitacionesModel, options),

    datatable_aggregate: ms.datatable_aggregate(invitacionesModel, aggregate_pipeline_dt, ''),
    aggregate: ms.aggregate(invitacionesModel, aggregate_pipeline, options),
}
