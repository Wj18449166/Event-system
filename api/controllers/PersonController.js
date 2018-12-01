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
        //console.log("event: " + event);
        var person = await Person.findOne({ personname: req.session.username });
        //console.log("person: " + person);
        if (event.quote == 0 || event.quote < 0) {
            if (req.wantsJSON) {
                return res.json({ results: "No Quote" });
            }
            else {
                return res.ok("No Quote");
            }
        }
         //查询该项目注册的学生，regisstermodel是学生的队列
         var registermodel = await Event.findOne(req.params.id).populate('isregisted');
         var length = registermodel.isregisted.length;

        for (var i = 0; i < length; i++) {
            //当前项目注册的学生中有当前的用户，证明该用户已经注册过这个项目
            if (registermodel.isregisted[i].personname == req.session.username) {
                if (req.wantsJSON) {
                    return res.json({ results: "You have registered!" });
                }
            }
        }

        await Event.update(req.params.id).set({
            quote: event.quote - 1
        })

        await Person.addToCollection(person.id, 'registerFor').members(event.id);

        //var model = await Person.findOne(person.id).populate('registerFor');
        if (req.wantsJSON) {
            return res.json({ results: "OK" });
        }
        else {
        return res.redirect('/person/myevent');
        }

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

        //显示event
        if (req.wantsJSON) {
            return res.json(model.registerFor);
        } else {
            return res.view('person/myevent', { event: model.registerFor });
        }
    },


};

