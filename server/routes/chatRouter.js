const Router = require('express')
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router()
const chatController = require('../controllers/chatController')
const multer  = require('multer');
const upload = multer({ dest: `${__dirname}/client/static/img`});

// Contacts routes
router.post('/getContacts',chatController.getContacts);
router.post('/addContacts', chatController.addContact);

router.post('/searchUsers', chatController.searchUsers);

// Messages routes
router.post('/getMessages/:contactId', chatController.getMessages);
router.post('/messages',upload.single('file'), chatController.sendMessage);

module.exports = router