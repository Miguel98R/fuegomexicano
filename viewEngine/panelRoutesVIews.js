const express = require('express')
const router = express.Router()

const validateSession = require('./../middleware/validateSession')

let url_js_files = "/public/js/jsPanel"

///------------------------- RUTAS PARA CONTROLPANEL----------------------- ///

//LOGIN PAGE C.PANEL
router.get("/fgPanel", (req, res) => {


    let message_error = ''
    if(req?.query?.message_error){
        message_error = req?.query?.message_error
    }


    if (req?.session?.user) {
        let menu = req?.session?.menu
        res.render("panel/index", {
            title: 'Fuego Mexicano | Control Panel',
            url_js_files,


        });
    } else {
        res.render("panel/login", {
            title: 'Fuego Mexicano | Control Panel',
            url_js_files,
            message_error

        })
    }

});

router.get("/register", (req, res) => {


    res.render("panel/register", {
        title: 'Fuego Mexicano | Control Panel',
        url_js_files,

    })


});

router.get("/panel", validateSession, (req, res) => {


    let menu = req?.session?.menu

    res.render("panel/index", {
        title: 'Fuego Mexicano | Control Panel',
        url_js_files,
        menu

    });

});


module.exports = router