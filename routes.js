const express = require('express');
const FormController = require('./controllers/FormController');
const UserController = require('./controllers/UserController');
const Router = express.Router();

//user section 
Router.post("/account/create", UserController.createUser);
Router.post("/account/login", UserController.loginUser);
Router.post("/account/logout", UserController.logout);

//forms section
Router.post("/forms/create", FormController.createForms);
Router.post("/forms/item/new", FormController.createFormItem);

module.exports = Router