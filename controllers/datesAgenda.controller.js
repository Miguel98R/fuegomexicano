let ms = require('../helpers/apiato.helper')

let calendarDatesModel = require('../models/calendarDates.model')
let agendaModel = require('../models/datesAgenda.model')


//APIATO CONFIGURE
let validationObject = {}
let populationObject = false
let options = {}
let aggregate_pipeline_dt = []
let aggregate_pipeline = []

let populatio_agenda_eventes = {
    path: 'events', ref: agendaModel
}

module.exports = {
    createOne: async (req, res) => {

        let {body} = req.body
        try {

            let location = body.location
            let date = body.date

            let newAgenda = await agendaModel.create({
                location,
                date
            })

            let searchMonth = await calendarDatesModel.findById(body.id_month)
            searchMonth.events.push(newAgenda._id)
            await searchMonth.save()

            res.status(200).json({
                success: true,

            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                success: false,
                error: e
            })
        }

    },
    createMany: ms.createMany(agendaModel, validationObject, populationObject, options),

    getOneWhere: ms.getOneWhere(agendaModel, populationObject, options),
    getOneById: ms.getOneById(agendaModel, populationObject, options),
    getMany: ms.getMany(agendaModel, populatio_agenda_eventes, options),

    findUpdateOrCreate: ms.findUpdateOrCreate(agendaModel, validationObject, populationObject, options),
    findUpdate: ms.findUpdate(agendaModel, validationObject, populationObject, options),
    updateById: ms.updateById(agendaModel, validationObject, populationObject, options),

    findIdAndDelete: ms.findIdAndDelete(agendaModel, options),

    datatable_aggregate: ms.datatable_aggregate(agendaModel, aggregate_pipeline_dt, ''),
    aggregate: ms.aggregate(agendaModel, aggregate_pipeline, options),

}
