const { authenticate, makeToken, inputTypes } = require("../helpers/utils");
const FormItemModel = require("../models/formItem");
const FormsModels = require("../models/forms");
const FormStepModel = require("../models/formstep");

module.exports = {
  createForms: async (req, res) => {
    try {
      const { title, details } = req.body;
      const { usertoken, sessiontoken } = req.headers;
      let proceed = true;
      if (authenticate(usertoken, sessiontoken) === false) {
        proceed = false;
        res.send({
          type: "error",
          data: {
            message: "Oops! Session Token Mismatched",
          },
        });
      }
      if (proceed) {
        const newForms = await FormsModels.create({
          token: makeToken({ label: "forms" }),
          title: title,
          details: details,
          status: "Active",
          createdBy: usertoken,
          sessionToken: sessiontoken,
        });
        await FormStepModel.create({
          token: makeToken({ label: "formStep" }),
          formToken: newForms.token,
          title: "",
          details: "",
          status: "Active",
          previousStepToken: "",
          nextStepToken: "",
          createdBy : usertoken,
          existence: 1,
        });

        res.send({
          type: "success",
          data: {
            message: "From Created Successfully",
          },
        });
      }
    } catch (error) {
      res.send({
        type: "error",
        data: error,
      });
    }
  },
  createFormItem: async (req, res) => {
    try {
      const { formToken, stepToken, image, title, inputType, required } =
        req.body;
      const { usertoken, sessiontoken } = req.headers;
      let proceed = true;
      if (authenticate(usertoken, sessiontoken) === false) {
        proceed = false;
        res.send({
          type: "error",
          data: {
            message: "Oops! Session Token Mismatched",
          },
        });
      }
      if(inputTypes.includes(inputType) === false){
        proceed = false;
        res.send({
          type: "error",
          data: {
            message: "Oops! Please Select Existing Input Type",
          },
        });
      }
      const checkFromStep = await FormStepModel.find({token : stepToken ,formToken : formToken, createdBy : usertoken});
      if(checkFromStep.length !== 1){
        proceed = false;
        res.send({
          type: "error",
          data: {
            message: "Oops! Invalid Input",
          },
        });
      }
      if(proceed){
        const newFormItem = await FormItemModel.create({
          token : makeToken({label : "formItem"}),
          formToken : formToken,
          stepToken : stepToken,
          image : image,
          title : title,
          inputType : inputType,
          required : required,
          status : 'Active',
          createdBy : usertoken,
          sessionToken : sessiontoken,
          existence : 1
        });
        res.send({
          type: "success",
          data: {
            message: "From Item Created Successfully",
          },
        })
      }
    } catch (error) {
      console.log(error);
      res.send({
        type: "error",
        data: error,
      });
    }
  },
};
