const paymentModel = require("../models/payments.model")
const {template, sendMail} = require("../helpers/mail.helper");
const usersModel = require("../models/users.model");
const usersShoppingModel = require("../models/userShipping.model");
const usersAddresModel = require("../models/userAddress.model");
const productModel = require("../models/products.model");
const salesDetailsModel = require("../models/salesDetails.model");
const salesModel = require("../models/sales.model");
const confModel = require("../models/configurations.model");

const {MercadoPagoConfig, Payment, Preference} = require("mercadopago")
const Stripe = require('stripe')
let uuid = require('uuid')
const moment = require('moment')
const axios = require("axios");

const getConfMercadoPago = async () => {
    let searchConf

    if (eval(process.env.MERCADO_PAGO_PROD)) {
        searchConf = await confModel.findOne({description: 'private_Key_mp'})
    } else {
        searchConf = await confModel.findOne({description: 'private_Key_mp_sandbox'})
    }
    return searchConf.value
}

const getConfStripe = async () => {
    let searchConf
    if (eval(process.env.STRIPE_PROD)) {
        searchConf = await confModel.findOne({description: 'private_Key_stripe'})
    } else {
        searchConf = await confModel.findOne({description: 'private_Key_stripe_sandbox'})
    }
    return searchConf.value
}



const makeid = async (length) => {
    length = length || 33
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
module.exports = {
    createOrder: async (req, res) => {
        const urlHost = req.protocol + '://' + req.get('host');

        let body = req.body

        try {

            const unique_id = uuid.v4()

            const PRIVATE_KEY = await getConfMercadoPago()

            const client = new MercadoPagoConfig({
                accessToken: PRIVATE_KEY,
                options: {timeout: 5000, idempotencyKey: unique_id}
            });

            const preference = new Preference(client);


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
                    talla: item.selectedTalla

                })


                produc_obj.title = 'Fuego Mexicano';
                produc_obj.quantity = Number(item.quantity);
                produc_obj.unit_price = Number(item.price);
                produc_obj.currency_id = "MXN"


                products.push(produc_obj)
                array_products_details.push(newDetalle._id)

                searchProduct.count_sale = searchProduct.count_sale + Number(item.quantity)

                let stock_new = newStock <= 0 ? 0 : newStock
                searchProduct.stock = stock_new


                await searchProduct.save()
            }


            let email_user = data_user.email

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

            const fechaActual = moment();
            const fechaActualFormateada = fechaActual.format('YYYY-MM-DDTHH:mm:ss.SSSZ');

            const fechaVencimiento = fechaActual.add(5, 'days');
            const fechaFormateada = fechaVencimiento.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
//---------------------------------------- CREATE SALE MERCADO PAGO
            let result = await preference.create({
                body: {
                    metadata: {unique_id,email_user},
                    payer,
                    items: [
                        {
                            title: 'MERCH FUEGO MEXICANO',
                            description: 'Fuego Mexicano',
                            quantity: 1,
                            unit_price: total_sale,
                            //unit_price: 10,
                            currency_id: "MXN"
                        }
                    ],
                    back_urls: {
                        success: urlHost + "/",
                        failure: urlHost + "/",
                        pending: urlHost + "/",

                    },
                    //notification_url:urlHost+"/api/payments/webhook"
                    notification_url: "https://wwww.fuegomexicano.com/api/payments/webhook",
                    auto_return: "approved",
                    expiration_date_from: fechaActualFormateada,
                    expiration_date_to: fechaFormateada,
                    expires: true
                }
            })

            let URI = result.init_point

            let response = result


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
                full_JSON: response,

            })

            await newPayment.save()

            let newSale = await salesModel.create({
                statusSale,
                type_payout:"mercadoPago",
                payment_status:"EN ESPERA DE SER ACREDITADO",
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


            let emailNotificationConfig = await confModel.findOne({ description: 'email_notification' }).select('value');
            let URI_panel = urlHost + '/fgPanel'

            let emailNotification = await template.generic(
                image_banner,
                'Nueva compra',
                'Notificación de compra',
                `Hola. Se ha generado una nueva compra realizada por el usuario ${fullName}. Haz clic en el siguiente botón para acceder al panel y gestionar la venta.`,
                URI_panel,
                'Ir al Panel de Ventas'
            );

            await sendMail(
                '"Fuego Mexicano - Héctor Andrade" <noreply@fuegomexicano.com>',
                emailNotificationConfig.value,
                'Notificación de nueva compra',
                emailNotification
            );


        } catch (e) {
            console.error(e)
            res.status(500).json({
                success: false,
                error: e

            })
        }
    },
    createOrderStripe:async (req,res)=>{

        const urlHost = req.protocol + '://' + req.get('host');

        let body = req.body
        let tag = await makeid(17)
        let PRIVATE_KEY = await getConfStripe()
        let response
        const unique_id = uuid.v4()

        try{

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
                    talla: item.selectedTalla

                })


                produc_obj.title = 'Fuego Mexicano';
                produc_obj.quantity = Number(item.quantity);
                produc_obj.unit_price = Number(item.price);
                produc_obj.currency_id = "MXN"


                products.push(produc_obj)
                array_products_details.push(newDetalle._id)

                searchProduct.count_sale = searchProduct.count_sale + Number(item.quantity)

                let stock_new = newStock <= 0 ? 0 : newStock
                searchProduct.stock = stock_new


                await searchProduct.save()
            }

            let email_user = data_user.email

// ------------------------------------------CREACION DE PAGO EN STRIPE
            const stripe = new Stripe(PRIVATE_KEY)
            const result = await stripe.checkout.sessions.create({
                line_items: [{
                    price_data: {
                        product_data: {
                            name: 'MERCH FUEGO MEXICANO',
                            description: 'FUEGO MEXICANO',
                        },
                        currency: 'MXN',
                        unit_amount: 1000
                        //unit_amount: Number(Number(total_sale) * 100)
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: `${urlHost}/`,
                cancel_url: `${urlHost}/`,

            })

            response = result
            let URI = response.url

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
                full_JSON: response,

            })

            await newPayment.save()

            let newSale = await salesModel.create({
                statusSale,
                type_payout:"stripe",
                payment_status:"EN ESPERA DE SER ACREDITADO",
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


            let emailNotificationConfig = await confModel.findOne({ description: 'email_notification' }).select('value');
            let URI_panel = urlHost + '/fgPanel'

            let emailNotification = await template.generic(
                image_banner,
                'Nueva compra',
                'Notificación de compra',
                `Hola. Se ha generado una nueva compra realizada por el usuario ${fullName}. Haz clic en el siguiente botón para acceder al panel y gestionar la venta.`,
                URI_panel,
                'Ir al Panel de Ventas'
            );

            await sendMail(
                '"Fuego Mexicano - Héctor Andrade" <noreply@fuegomexicano.com>',
                emailNotificationConfig.value,
                'Notificación de nueva compra',
                emailNotification
            );


        }catch (e) {
            console.error(e)
            res.status(500).json({
                success: false,
                error: e

            })
        }
    },
    receiveWebhook: async (req, res) => {
        try {

            let MERCADOPAGO_API_KEY = await getConfMercadoPago()

            const client = new MercadoPagoConfig({accessToken: MERCADOPAGO_API_KEY});
            const payment = new Payment(client);

            const payment_ = req.query;

            if (payment_.type === "payment") {
                const data = await payment.get({
                    id: payment_['data.id'],
                })

                /* const capture = await payment.capture({
                      id: payment_['data.id'],
                  })*/

                let searchPayment = await paymentModel.findOne({unique_id: data.metadata.unique_id})


                searchPayment.full_JSON_hook = data
                searchPayment.status_order = 'completed'
                searchPayment.total = data?.transaction_amount
                await searchPayment.save()


                let sale = await salesModel.findOne({paymentInfo: searchPayment._id})
                sale.statusSale = 'OR_sale'
                sale.payment_status="ACREDITADO"
                sale.date_payment = moment().format()
                await sale.save()

                res.sendStatus(204);



                let url_update_preference = `https://api.mercadopago.com/checkout/preferences/${searchPayment.full_JSON.id}`

                const fechaActual = moment();
                const fechaActualFormateada = fechaActual.format('YYYY-MM-DDTHH:mm:ss.SSSZ');

                const updatePreferenceRequest = {expiration_date_to: fechaActualFormateada}

                await axios.put(url_update_preference, updatePreferenceRequest, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${MERCADOPAGO_API_KEY}`,
                    }
                });




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
    },
    webhookStripe: async (req, res) => {
        try {
            const PRIVATE_KEY = await getConfStripe();
            const stripe = new Stripe(PRIVATE_KEY);
            let body = req.rawBody;
            let userData;
            let product;
            let payout_info;
            let searchConf;

            if (eval(process.env.STRIPE_PROD)) {
                searchConf = await confModel.findOne({ description: 'webhook_secret_stripe' });
            } else {
                searchConf = await confModel.findOne({ description: 'webhook_secret_stripe_sandbox' });
            }

            const WEBHOOK_KEY = searchConf.value;
            const HEADER_STRIPE = req.headers['stripe-signature'];

            console.log("");

            let event;
            try {
                event = await stripe.webhooks.constructEvent(body, HEADER_STRIPE, WEBHOOK_KEY);
            } catch (err) {
                console.error('Error al validar la firma del webhook:', err);
                return res.status(400).send(`Webhook Error: ${err.message}`);
            }

            switch (event.type) {
                case 'checkout.session.completed':
                    const dataComplete = event.data.object;

                    payout_info = await paymentModel.findOne({ id_payment: dataComplete.id });

                    if (payout_info) {
                        payout_info.full_JSON_hook = dataComplete;
                        payout_info.status_order = 'completed';
                        payout_info.total = dataComplete?.amount_total;
                        await payout_info.save();

                        let sale = await salesModel.findOne({ paymentInfo: payout_info._id });
                        sale.statusSale = 'OR_sale';
                        sale.payment_status = "ACREDITADO";
                        sale.date_payment = moment().format();
                        await sale.save();

                        userData = await usersShoppingModel.findById(sale.user_data);
                        userData = await usersModel.findById(userData.userConf);

                        let image_banner = 'https://www.fuegomexicano.com/public/images/fuego/logo_.png';
                        let URI = 'https://fuegomexicano.com';

                        const mail = await template.generic(
                            image_banner,
                            'Compra realizada',
                            '¡Felicidades!',
                            `Hola, hemos recibido tu pago a través de Stripe. Nuestro equipo revisará que todo esté en orden y procederemos a enviarte tu pedido. Agradecemos tu compra. Haz clic en el siguiente botón para visitar nuestra página:`,
                            URI,
                            'Ir a la Página'
                        );

                        await sendMail('"Fuego Mexicano - Héctor Andrade" <noreply@fuegomexicano.com>', userData.email, 'Compra realizada.', mail);

                        return res.sendStatus(204);  // Aseguramos que no se ejecute código después de enviar la respuesta
                    }

                    break;
                default:
                    console.log(`Evento no manejado: ${event.type}`);
            }

            // Solo llegamos aquí si no hemos enviado ninguna respuesta anteriormente
            res.status(200).json({
                success: true
            });
        } catch (e) {
            console.error("error----", e);
            res.status(500).json({
                success: false
            });
        }
    },

}
