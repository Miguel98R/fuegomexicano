const express = require('express')
const router = express.Router()

router.use("/users/", require("./users.router"))
router.use("/auth/", require("./auth.routes"))
router.use("/products/", require("./products.routes"))
router.use("/upload/", require("./upload.routes"))
router.use("/payments/", require("./payments.routes"))
router.use("/invitations/", require("./invitations.routes"))
router.use("/blogs/", require("./blogs.routes"))
module.exports = router