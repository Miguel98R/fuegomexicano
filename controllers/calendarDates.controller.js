let ms = require('../helpers/apiato.helper')

let calendarModel = require('../models/calendarDates.model')


//APIATO CONFIGURE
let validationObject = {}
let populationObject = false
let options = {}
let aggregate_pipeline_dt = []
let aggregate_pipeline = []


module.exports = {
    createOne: ms.createOne(calendarModel, validationObject, populationObject, options),
    createMany: ms.createMany(calendarModel, validationObject, populationObject, options),

    getOneWhere: ms.getOneWhere(calendarModel, populationObject, options),
    getOneById: ms.getOneById(calendarModel, populationObject, options),
    getMany: ms.getMany(calendarModel, populationObject, options),

    findUpdateOrCreate: ms.findUpdateOrCreate(calendarModel, validationObject, populationObject, options),
    findUpdate: ms.findUpdate(calendarModel, validationObject, populationObject, options),
    updateById: ms.updateById(calendarModel, validationObject, populationObject, options),

    findIdAndDelete: ms.findIdAndDelete(calendarModel, options),

    datatable_aggregate: ms.datatable_aggregate(calendarModel, aggregate_pipeline_dt, ''),
    aggregate: ms.aggregate(calendarModel, aggregate_pipeline, options),
}
