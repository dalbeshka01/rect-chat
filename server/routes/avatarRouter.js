const Router = require('express')
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router()
const avatarController = require('../controllers/avatarController')
const multer  = require('multer');
const upload = multer({ dest: `${__dirname}/client/static/avatars`});

router.post('/uploadAvatar:userId',upload.single('file'), avatarController.uploadAvatar)

module.exports = router