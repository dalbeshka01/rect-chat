const { Messages, User, Contacts} = require('../models/models');
const ApiError = require("../error/ApiError");
const { Op } = require('sequelize');
const bcrypt = require("bcrypt");
const mv = require("mv");

class ChatController {
    async searchUsers(req, res, next) {
        let {searchTerm} = req.body;
        // searchTerm = searchTerm.trim();

        try {
            const users = await User.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${searchTerm}%` } },
                        { surname: { [Op.like]: `%${searchTerm}%` } }
                    ]
                }
            });

            res.json(users);
        } catch (error) {
            next(error);
        }
    }
    async addContact(req, res, next) {
        try {
            const { contactId, userId } = req.body;


            const existingContact = await Contacts.findOne({
                where: {
                    userId,
                    contact_id: contactId
                }
            });

            if (existingContact) {
                console.log("Contact already exists");
                return res.status(400).json({
                    message: 'Контакт уже добавлен!'
                });
            }

            const contactUser = await Contacts.create({ userId, contact_id: contactId });
            const contact = await Contacts.create({ userId: contactId , contact_id: userId });
            res.json({ contact });
        } catch (error) {
            next(error);
        }
    }
    async getContacts(req, res, next) {
        try {
            const { userId } = req.body; // получаем id текущего пользователя
            const contacts = await Contacts.findAll({
                where: { userId: userId },
                attributes: ['contact_id']
                // include: [{ model: User, as: 'contact', required: false }]
            });
            const contactIds = contacts.map(contact => contact.contact_id);
            const users = await User.findAll({
                where: { id: contactIds } // выбираем только тех пользователей, чьи id есть в массиве contactIds
            });
            console.log(users)
            res.json(users);
        } catch (error) {
            next(error);
        }
    }
    async sendMessage(req, res, next) {
        try {
            // получаем id текущего пользователя
            const { recipientId, content, userId } = req.query;
            if (!req.file) {
                console.log( recipientId, content, userId)
                const message = await Messages.create({ userId, recipient_id: recipientId, content });
                return  res.json({ message });
            }
            const file = req.file;
            if(!file) return res.json({error: 'Incorrect input name'})

            const newFileName = encodeURI(Date.now() + '-' + file.originalname);
            const filePath = `${__dirname}/../../client/public/static/chatImg/${newFileName}`
            mv(file.path, filePath, err => {
                if (err) {
                    console.log(err);
                    return res.status(500).send(err)
                }
                console.log('file was uploaded')
            })
            const message = await Messages.create({ userId, recipient_id: recipientId, content, img: newFileName});
            return  res.json({ message });
        } catch (error) {
            next(error);
        }
    }
    async getMessages(req, res, next) {
        try {
            const { id } = req.body; // получаем id текущего пользователя
            const { contactId } = req.params; // получаем id собеседника

            const messagesFromUser = await Messages.findAll({
                where: {userId: id, recipient_id: contactId}
            });
            const messagesToUser = await Messages.findAll({
                where: {userId: contactId, recipient_id: id}
            });
            const messages = [...messagesFromUser, ...messagesToUser].sort((a, b) => a.createdAt - b.createdAt);


            res.json(messages);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ChatController()