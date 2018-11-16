// isAdmin.js
module.exports = async function (req, res, proceed) {

    //const aUser02 = await Person.findOne({ personname: "aUser02" });
    // var usernametry = req.session.username;

    //const message = sails.getInvalidIdMsg(req.params);
    //if (message) return res.badRequest(message); 
    var model = await Person.findOne({ personname: req.session.username }).populate('worksFor');

    
    // console.log("--------------------");
    // console.log(req.session.username);
    // console.log("~~~~~~~~~~~~~~~~~~~~~");
     console.log(model);
    // console.log("?????????????????????");
    // var models = model.worksFor;
    // console.log(models[0].username);
     

    if (model.worksFor[0].username == 'admin') {
        return proceed();   //proceed to the next policy,
    }

    //--•
    // Otherwise, this request did not come from a logged-in user.
    return res.forbidden();

};