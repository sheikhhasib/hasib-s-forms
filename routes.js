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
Router.post("/forms/step/create", FormController.createFormStep);
Router.post("/forms/item/options/create", FormController.itemOptionsCreate);
Router.post("/forms/item/positionKey/update", FormController.itemPositionKeyUpdateBulk);
Router.get("/forms/load/:formToken/:stepToken", FormController.formLoad);

module.exports = Router