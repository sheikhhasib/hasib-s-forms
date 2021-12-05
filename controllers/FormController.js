const { authenticate, makeToken, inputTypes } = require("../helpers/utils");
const FormItemModel = require("../models/formItem");
const FormsModels = require("../models/forms");
const FormStepModel = require("../models/formstep");
const ItemOptionModel = require("../models/itemOption");

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
          createdBy: usertoken,
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
      if (inputTypes.includes(inputType) === false) {
        proceed = false;
        res.send({
          type: "error",
          data: {
            message: "Oops! Please Select Existing Input Type",
          },
        });
      }
      const checkFromStep = await FormStepModel.find({
        token: stepToken,
        formToken: formToken,
        createdBy: usertoken,
      });
      if (checkFromStep.length !== 1) {
        proceed = false;
        res.send({
          type: "error",
          data: {
            message: "Oops! Invalid Input",
          },
        });
      }
      if (proceed) {
        let totalCount = await FormItemModel.find({
          formToken: formToken,
          stepToken: stepToken,
        });

        const newFormItem = await FormItemModel.create({
          token: makeToken({ label: "formItem" }),
          formToken: formToken,
          stepToken: stepToken,
          image: image,
          title: title,
          inputType: inputType,
          required: required,
          positionKey: totalCount.length + 1,
          status: "Active",
          createdBy: usertoken,
          sessionToken: sessiontoken,
          existence: 1,
        });
        res.send({
          type: "success",
          data: {
            message: "From Item Created Successfully",
          },
        });
      }
    } catch (error) {
      console.log(error);
      res.send({
        type: "error",
        data: error,
      });
    }
  },
  createFormStep: async (req, res) => {
    try {
      const { usertoken, sessiontoken } = req.headers;
      const { formToken, previousStepToken, title, details } = req.body;
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
      const checkFromStep = await FormStepModel.find({
        token: previousStepToken,
        formToken: formToken,
        createdBy: usertoken,
        nextStepToken: "",
      })
        .sort({ createdAt: "desc" })
        .limit(1)
        .exec();
      if (checkFromStep.length === 1) {
        let nextStepToken = makeToken({ label: "formStep" });
        const newUpdatedStep = await FormStepModel.findOneAndUpdate(
          { token: previousStepToken },
          {
            $set: {
              title: title,
              details: details,
              nextStepToken: nextStepToken,
            },
          },
          { new: true }
        );
        await FormStepModel.create({
          token: nextStepToken,
          formToken: formToken,
          title: "",
          details: "",
          status: "Active",
          previousStepToken: previousStepToken,
          nextStepToken: "",
          createdBy: usertoken,
          existence: 1,
        });
        res.send({
          type: "success",
          data: {
            message: "Step Updated Successfully and Create New Step",
          },
        });
      } else {
        res.send({
          type: "error",
          data: {
            message: "Previous Step Not Found",
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
  itemOptionsCreate: async (req, res) => {
    try {
      const { usertoken, sessiontoken } = req.headers;
      const { formToken, stepToken, itemToken, itemType, data } = req.body;
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
      const checkItem = await FormItemModel.find({
        token: itemToken,
        formToken: formToken,
        stepToken: stepToken,
      });
      if (checkItem.length !== 1) {
        proceed = false;
        res.send({
          type: "error",
          data: {
            message: "Oops! Your form item is not exits",
          },
        });
      }
      if (inputTypes.includes(itemType) === false) {
        proceed = false;
        res.send({
          type: "error",
          data: {
            message: "Oops! Please Select Existing Input Type",
          },
        });
      }
      let TitleTypeLength = [];
      for (let i = 0; i < data.length - 1; i++) {
        if (data[i].titleType === "other") {
          TitleTypeLength.push(data[i]);
        }
      }
      if (TitleTypeLength.length > 0) {
        proceed = false;
        res.send({
          type: "error",
          data: {
            message: "Your can't select Multiple other option",
          },
        });
      }
      if (proceed) {
        for (let i = 0; i < data.length; i++) {
          createNewOption = await ItemOptionModel.create({
            token: makeToken({ label: "itemOption" }),
            formToken: formToken,
            stepToken: stepToken,
            itemToken: itemToken,
            itemType: itemType,
            title: data[i].title,
            titleType: data[i].titleType,
            status: "Active",
            createdBy: usertoken,
            sessionToken: sessiontoken,
            existence: 1,
          });
        }
        res.send({
          type: "success",
          data: {
            message: "Row Created Successfully",
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
  itemPositionKeyUpdateBulk: async (req, res) => {
    try {
      const { usertoken, sessiontoken } = req.headers;
      const { formToken, stepToken, data } = req.body;
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
      const checkItem = await FormItemModel.find({
        formToken: formToken,
        stepToken: stepToken,
      });
      if (checkItem.length  === 0) {
        proceed = false;
        res.send({
          type: "error",
          data: {
            message: "Oops! Your form item is not exits",
          },
        });
      }
      if (proceed) {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          await FormItemModel.findOneAndUpdate(
            {
              formToken: formToken,
              stepToken: stepToken,
              createdBy: usertoken,
              token: data[i].itemToken,
            },
            { $set: { positionKey: data[i].positionKey } },
            { new: true }
          );
        }
        res.send({
          type: "success",
          data: {
            message: "PositionKey Updated Successfully",
          },
        });
      }
    } catch (error) {
      console.log(error)
      res.send({
        type: "error",
        data: error,
      });
    }
  },
  formLoad : async(req,res) => {
    try {
      const {formToken,stepToken} = req.params;
      const {usertoken,sessiontoken} = req.headers;

      let proceed = true;
      
      if(proceed){
        let stepDetails = await FormStepModel.find({token: stepToken})
        let allItems = await FormItemModel.find({formToken : formToken, stepToken : stepToken}).sort({positionKey : 1})
        let results = [];
        for(let i = 0; i < allItems.length;i++){
          let newObject = {};
          if(allItems[i].inputType === inputTypes[3] || allItems[i].inputType === inputTypes[4]){
            let itemOption = await ItemOptionModel.find({formToken : formToken,stepToken : stepToken,itemToken : allItems[i].token})
            newObject.item = allItems[i];
            newObject.options = itemOption;
          }else{
            newObject.item = allItems[i];
            newObject.options = [];
          }
          results.push(newObject);
          
        }
        res.send({
          type: "success",
          data: {
            step : stepDetails[0],
            items : results,
            message: "Data Loaded Successfully",
          },
        });
      }
      
    } catch (error) {
      res.send({
        type: "error",
        data: error,
      });
    }
  }
};
