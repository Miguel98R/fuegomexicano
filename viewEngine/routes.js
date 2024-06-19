const express = require('express')
const router = express.Router()

let salesModel = require('../models/sales.model')
let salesDetailsModel = require('../models/salesDetails.model')

//--------------------------------------------------------------------------------------------------------------------//
//                                               ROUTES OF CONTROL-PANEL                                              //
//--------------------------------------------------------------------------------------------------------------------//

//GET THE ROUTES OF CONTROL PANEL
router.use(require('./panelRoutesVIews'))

//--------------------------------------------------------------------------------------------------------------------//
//                                                  ROUTES OF FRONTEND                                                //
//--------------------------------------------------------------------------------------------------------------------//

router.get("/", (req, res) => {


    let images = ['/public/images/fuego/fuego_1.jpg', '/public/images/fuego/fuego_2.jpg', '/public/images/fuego/fuego_3.jpg', '/public/images/fuego/fuego_4.jpg']

    res.render("index", {
        title: 'Fuego Mexicano | Home',
        images
    });
});

router.get("/blog", (req, res) => {
    res.render("blog", {
        title: 'Fuego Mexicano | Blog',

    });
});

router.get("/invitaciones", (req, res) => {
    res.render("invitaciones", {
        title: 'Fuego Mexicano | Invitaciones',

    });
});

router.get("/products", (req, res) => {
    res.render("products", {
        title: 'Fuego Mexicano | Merch',

    });
});

router.get("/checkout", (req, res) => {
    res.render("checkout", {
        title: 'Fuego Mexicano | Checkout',

    });
});

router.get("/checkout-payments/:id", async (req, res) => {

    let {id} = req.params

    let validatePreSale = await salesModel.findById(id)
    if (validatePreSale.statusSale == 'PRV_sale') {
        res.render("checkout_payments", {
            title: 'Fuego Mexicano | Checkout payments',
            id

        });
    } else {
        res.render("404");
    }


});

router.get("/ddlv", (req, res) => {
    res.render("ddlv", {
        title: 'Fuego Mexicano | DDLV 2024',

    });
});

//RENDER IF DOES NOT EXIST THE PAGE
router.get("/:page", async (req, res) => {

    res.render("404");
});

////-------------------------------------------------------------------------------------


router.get("/product-detail", (req, res) => {
    res.render("db_images-detail");
});

router.get("/sign-in", (req, res) => {
    res.render("sign-in");
});
router.get("/sign-up", (req, res) => {
    res.render("sign-up");
});


module.exports = router
