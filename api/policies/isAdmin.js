// isAdmin.js
module.exports = async function (req, res, proceed) {

    //const aUser02 = await Person.findOne({ personname: "aUser02" });
    // var usernametry = req.session.username;

    //const message = sails.getInvalidIdMsg(req.params);
    //if (message) return res.badRequest(message); 
    var model = await Person.findOne({ personname: "aUser02" }).populate('worksFor');


    console.log("--------------------");
    console.log(model);
    console.log("~~~~~~~~~~~~~~~~~~~~~");
    var models = model.worksFor;
    console.log(models.username);
     

    if (req.session.username == 'aUser01') {
        return proceed();   //proceed to the next policy,
    }

    //--•
    // Otherwise, this request did not come from a logged-in user.
    return res.forbidden();

};