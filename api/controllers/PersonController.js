/**
 * PersonController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    //添加student和event的关联
    addEvent: async function (req, res) {


        var event = await Event.findOne(req.params.id);
        console.log("event: " + event);
        var person = await Person.findOne({ personname: req.session.username });
        console.log("person: " + person);
        if (event.quote == 0 || event.quote < 0) {
            return res.ok("No Quote");
        }
        //console.log("33333333333");
        await Event.update(req.params.id).set({
            quote: event.quote - 1
        })
        //console.log("444444444444");
        await Person.addToCollection(person.id, 'registerFor').members(event.id);
        //console.log("111111111111");
        //var model = await Person.findOne(person.id).populate('registerFor');
        return res.redirect('/person/myevent');

    },
    deleteEvent: async function (req, res) {
        var event = await Event.findOne(req.params.id);
        var person = await Person.findOne({ personname: req.session.username });
        if (event.quote < 0) {
            return res.ok("No Quote");
        }
        await Event.update(req.params.id).set({
            quote: event.quote + 1
        })
        await Person.removeFromCollection(person.id, 'registerFor').members(event.id);
        //var model = await Person.findOne(person.id).populate('registerFor');
        return res.redirect('/person/myevent');
    },

    //显示用户的注册的event，针对student的用户
    myEvent: async function (req, res) {

        //根据当前用户的id查找用户注册的event
        var model = await Person.findOne({ personname: req.session.username }).populate('registerFor');
        //console.log("~~~~~~~~~~~~~~~~~~~~~");
        //console.log(model);

        //显示event
        return res.view('person/myevent', { event: model.registerFor });
    },


};

