const express = require('express')
const router = express.Router()

//--------------------------------------------------------------------------------------------------------------------//
//                                               ROUTES OF CONTROL-PANEL                                              //
//--------------------------------------------------------------------------------------------------------------------//

//GET THE ROUTES OF CONTROL PANEL
router.use(require('./panelRoutesVIews'))

//--------------------------------------------------------------------------------------------------------------------//
//                                                  ROUTES OF FRONTEND                                                //
//--------------------------------------------------------------------------------------------------------------------//

router.get("/", (req, res) => {
    let eventsByMonth = [
        {
            mes: "septiembre",
            events: [
                {date: '21 - 23', location: 'MTY - SLP'}
            ]
        },
        {
            mes: "octubre",
            events: [
                {date: '6 - 10', location: 'New York'},
                {date: '11-13', location: 'Sabinas Coah.'},
                {date: '13, 14', location: 'Cdmx'},
                {date: '21', location: 'Cdmx'},
                {date: '31', location: 'Uruapan'}
            ]
        },
        {
            mes: "noviembre",
            events: [
                {date: '1-2', location: 'Uruapan'},
                {date: '4', location: 'Almoya'},
                {date: '9-10', location: 'Muzquis'},
                {date: '11-12', location: 'Xalapa'},
                {date: '15-18', location: 'Chetumal'},
                {date: '18', location: 'Cdmx'},
                {date: '24,25', location: 'Pachuca'},
                {date: '27-29', location: 'Los Angeles'}
            ]
        }
    ]

    let images = ['/public/images/fuego/fuego_1.jpg', '/public/images/fuego/fuego_2.jpg', '/public/images/fuego/fuego_3.jpg', '/public/images/fuego/fuego_4.jpg']

    res.render("index", {
        title: 'Fuego Mexicano | Home',
        eventsByMonth,
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
    res.render("checkout");
});

//RENDER IF DOES NOT EXIST THE PAGE
router.get("/:page", async (req, res) => {

    res.render("404");
});

////-------------------------------------------------------------------------------------



router.get("/product-detail", (req, res) => {
    res.render("product-detail");
});

router.get("/sign-in", (req, res) => {
    res.render("sign-in");
});
router.get("/sign-up", (req, res) => {
    res.render("sign-up");
});


module.exports = router
