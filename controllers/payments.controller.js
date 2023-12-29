const paymentModel = require("../models/payments.model")
const {MercadoPagoConfig, Payment, Preference} = require("mercadopago")
const {template, sendMail} = require("../helpers/mail.helper");
const usersModel = require("../models/users.model");
const usersShoppingModel = require("../models/userShipping.model");
const usersAddresModel = require("../models/userAddress.model");
const productModel = require("../models/products.model");
const salesDetailsModel = require("../models/salesDetails.model");
const salesModel = require("../models/sales.model");

const client = new MercadoPagoConfig({accessToken: process.env.MERCADOPAGO_API_KEY,});
const payment = new Payment(client);
const preference = new Preference(client);
let uuid = require('uuid')
const moment = require('moment')

module.exports = {
    createOrder: async (req, res) => {
        const urlHost = req.protocol + '://' + req.get('host');

        let body = req.body

        try {

            let data_user = body.storedUser

            let conf_sale = body.storedConfSale
            let cart = body.storedCart
            let statusSale = body.statusSale
            let payment_img = body.img_payment

            let type_payout = conf_sale.type_payout
            let cant_products = conf_sale.no_products
            let total_sale = conf_sale.total_Sale
            let total_envio = conf_sale.total_envio || 0
            let subtotal_sale = conf_sale.subtotal_sale || total_sale

//-----------------------------------------------------------CREATE USER

            let searchUser = await usersModel.findOne({email: data_user.email})
            if (!searchUser) {
                const username = data_user.email.split('@')[0];

                searchUser = await usersModel.create({
                    user_name: username,
                    email: data_user.email,
                    name: data_user.name + ' ' + data_user.lastName,
                    usersTypes: 'user',
                    active: false

                })
            }

            let searchShopping = await usersShoppingModel.findOne({userConf: searchUser._id})
            let searchAddress



            if (!searchShopping) {

                searchAddress = await usersAddresModel.create({
                    noExt: data_user.noExt,
                    noInt: data_user.noInt,
                    address: data_user.address,
                    neighborhood: data_user.neighborhood,
                    zip: data_user.zip,
                    city: data_user.city,
                    state: data_user.state,
                    country: data_user.country,
                    reference: data_user.reference,
                })


                searchShopping = await usersShoppingModel.create({
                    name: data_user.name,
                    lastName: data_user.lastName,
                    gender: data_user.gender,
                    cellphone: data_user.phone,
                    userConf: searchUser._id,
                    userAddress: searchAddress._id,
                    count_sale: 1,


                })
            } else {

                searchAddress = await usersAddresModel.findById(searchShopping.userAddress)

                searchAddress.noExt = data_user.noExt
                searchAddress.noInt = data_user.noInt
                searchAddress.address = data_user.address
                searchAddress.neighborhood = data_user.neighborhood
                searchAddress.zip = data_user.zip
                searchAddress.city = data_user.city
                searchAddress.state = data_user.state
                searchAddress.country = data_user.country
                searchAddress.reference = data_user.reference

                await searchAddress.save()


                searchShopping.cellphone = data_user.cellphone
                searchShopping.count_sale = Number(searchShopping.count_sale) + 1
                await searchShopping.save()

            }


            let payer = {
                name: data_user.name,
                surname: data_user.lastName,
                email: data_user.email,
                phone: {
                    area_code: "+52",
                    number:  data_user.cellphone
                },

                address: {
                    street_name: data_user.address,
                    street_number: data_user.noInt,
                    zip_code: data_user.zip
                }
            }

//-----------------------------------------------------------CREATE SALE

            let array_products_details = []
            let products = []
            let produc_obj = {}

            for (let item of cart) {
                produc_obj = {}
                let searchProduct = await productModel.findById(item.id_product)

                let stockActual = Number(searchProduct.stock)

                let newStock = stockActual - Number(item.quantity)

                if (newStock <= 0) {
                    searchProduct.active = false
                }

                let newDetalle = await salesDetailsModel.create({

                    product: searchProduct._id,
                    stockAlMomento: stockActual,
                    cant: Number(item.quantity),
                    priceProduct: Number(item.price),
                    total_detalle: Number(item.price) * Number(item.quantity),

                })


                produc_obj.title = 'Fuego Mexicano';
                produc_obj.quantity = Number(item.quantity);
                produc_obj.unit_price = Number(item.price);
                produc_obj.currency_id = "MX"


                products.push(produc_obj)
                array_products_details.push(newDetalle._id)

                searchProduct.count_sale = searchProduct.count_sale + Number(item.quantity)

                let stock_new = newStock <= 0 ? 0 : newStock
                searchProduct.stock = stock_new


                await searchProduct.save()
            }


            let unique_id = uuid.v4()
            let email_user = data_user.email
//---------------------------------------- CREATE SALE MERCADO PAGO
            let result = await preference.create({
                body: {
                    metadata: {unique_id,email_user},
                    payer,
                    items: [
                        {
                            title: 'Fuego Mexicano',
                            description: 'Fuego Mexicano',
                            quantity: 1,
                            unit_price: total_sale,
                            currency_id: "MX"
                        }
                    ],
                    back_urls: {
                        success: urlHost + "/",
                        failure: urlHost + "/",
                        pending: urlHost + "/",

                    },
                    //notification_url:urlHost+"/api/payments/webhook"
                    notification_url: "https://fc63-187-187-206-3.ngrok-free.app/api/payments/webhook"
                }
            })

            let URI = result.init_point


            res.status(200).json({
                success: true,
                result,
                URI

            })


            let newPayment = new paymentModel({
                unique_id,
                client_id: result.client_id,
                collector_id: result.collector_id,
                id_payment: result.id,
                operation_type: result.operation_type,
                total: total_sale,
                url_payment: URI,
                status_order: 'create',
                status_detail: 'create',

            })

            await newPayment.save()

            let newSale = await salesModel.create({
                statusSale,
                type_payout:"mercadoPago",
                mercado_pago_status:"EN ESPERA DE SER ACREDITADO",
                paymentInfo: newPayment._id,
                user_data: searchShopping._id,
                details_sale: array_products_details,
                payment_img,
                cant_products,
                subtotal_sale,
                total_envio,
                total_sale

            })


            let fullName = searchShopping.name + ' ' + searchShopping.lastName + ' '

            let image_banner = 'https://www.fuegomexicano.com/public/images/fuego/logo_.png'

            let mail = await template.generic(image_banner, 'Notificación de pago', 'Finaliza tu pago', `Hola ${fullName}  es un recordatorio para finalizar tu compra por la cantidad de $ ${total_sale}, dale click al siguiente boton para finalizarla`, URI, 'Click Aqui')

            await sendMail('"Fuego Mexicano - Héctor Andrade" <noreply@fuegomexicano.com>', data_user.email, 'Finaliza tu pago.', mail)


        } catch (e) {
            console.error(e)
            res.status(500).json({
                success: false,
                error: e

            })
        }
    },
    receiveWebhook: async (req, res) => {
        try {
            const payment_ = req.query;

            if (payment_.type === "payment") {
                const data = await payment.get({
                    id: payment_['data.id'],
                })

                /* const capture = await payment.capture({
                      id: payment_['data.id'],
                  })*/

                let searchPayment = await paymentModel.findOne({unique_id: data.metadata.unique_id})

                searchPayment.status_order = data?.status
                searchPayment.status_detail = data?.status_detail
                searchPayment.total = data?.transaction_amount
                await searchPayment.save()


                let sale = await salesModel.findOne({paymentInfo: searchPayment._id})
                sale.statusSale = 'OR_sale'
                sale.mercado_pago_status="ACREDITADO",
                sale.date_payment = moment().format()
                await sale.save()

                res.sendStatus(204);

                let image_banner = 'https://www.fuegomexicano.com/public/images/fuego/logo_.png'

                let URI = 'https://fuegomexicano.com'

                const mail = await template.generic(
                    image_banner,
                    'Compra realizada',
                    '¡Felicidades!',
                    `Hola, hemos recibido tu pago a través de Mercado Pago. Nuestro equipo revisará que todo esté en orden y procederemos a enviarte tu pedido. Agradecemos tu compra. Haz clic en el siguiente botón para visitar nuestra página:`,
                    URI,
                    'Ir a la Página'
                );

                await sendMail('"Fuego Mexicano - Héctor Andrade" <noreply@fuegomexicano.com>', data.metadata.email_user, 'Compra realizada.', mail)

            }


        } catch (error) {
            console.error(error);
            return res.status(500).json({message: "Something goes wrong"});
        }
    }
}
