let ms = require('../helpers/apiato.helper')

let invitacionesModel = require('../models/invitaciones.model')
const {template, sendMail} = require("../helpers/mail.helper");
const confModel = require("../models/configurations.model");


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
    datatable_aggregate: async (req, res) => {


        try {

            let dataI = await invitacionesModel.find()
            res.status(200).json({
                success: true,
                data: dataI
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                success: false,
                error: e
            })
        }
    },
    create_invitation: async (req, res) => {

        let body = req.body
        let fullUrl = req.protocol + '://' + req.get('host')
        try {

            let email_notification_invitation = await confModel.findOne({description: 'email_notification_invitation'}).select('value');

            let name_people = body.nombre
            let name_event = body.nombre_evento
            let email = body.email

            let image_banner = 'https://www.fuegomexicano.com/public/images/fuego/logo_.png'

            let mail = await template.invitation_repsonse(image_banner, name_people, name_event)

            await sendMail('"Fuego Mexicano - Héctor Andrade" <noreply@fuegomexicano.com>', email, 'Recibimos tu invitación.', mail)


            let URI_panel = fullUrl + '/conf_invitations';

            let emailNotification = await template.generic(
                image_banner,
                'Nueva invitación',
                'Notificación de invitación',
                `Hola, Se ha recibido una nueva invitación para nuestro Pastor Héctor Andrade. Haz clic en el siguiente botón para acceder al panel y gestionar la invitación.`,
                URI_panel,
                'Ir al Panel de Invitaciones'
            );

            await sendMail(
                '"Fuego Mexicano - Héctor Andrade" <noreply@fuegomexicano.com>',
                email_notification_invitation.value,
                'Notificación de nueva invitación',
                emailNotification
            );


            await invitacionesModel.create(body)

            res.status(200).json({
                success: true,
                message: "Invitación enviada"
            })

        } catch (e) {
            res.status(500).json({
                success: false,
                error: e
            })
        }


    },

    aggregate: ms.aggregate(invitacionesModel, aggregate_pipeline, options),
}
