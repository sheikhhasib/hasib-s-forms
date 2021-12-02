const { authenticate, makeToken } = require("../helpers/utils");
const FormsModels = require("../models/forms");

module.exports = {
  createForms: async (req, res) => {
    try {
      const { title, details } = req.body;
      const { usertoken, sessiontoken } = req.headers;
        let proceed = true;
      if (authenticate(usertoken, sessiontoken) === false) {
          proceed = false;
          res.send({
              type : "error",
              data : {
                  message : "Oops! Session Token Mismatched"
              }
          })
      }
      if(proceed){
          const newForms = await FormsModels.create({
              token : makeToken({label : "forms"}),
              title : title,
              details : details,
              status : 'Active',
              createdBy : usertoken,
              sessionToken : sessiontoken 
          })

          res.send({
              type : "success",
              data : {
                  message : "From Created Successfully"
              }
          })
      }
    } catch (error) {
      res.send({
        type: "error",
        data: error,
      });
    }
  },
};
