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
            return res.ok("No Quote");
        }
        //console.log("111111111111");
        // 查找当前项目中是否有当前人员已经注册,无法出现弹窗？？？？？
        // var register = await Event.findOne(req.params.id).populate('isregisted');
        // var number = register.isregisted.length;
        // console.log("number =" + number);
        // for (var i = 0; i < number; i++) {
        //     if (register.isregisted[i].personname == req.session.username) {
        //         return res.redirect('/person/myevent');
        //     }
        // }

        await Event.update(req.params.id).set({
            quote: event.quote - 1
        })

        await Person.addToCollection(person.id, 'registerFor').members(event.id);

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

        //显示event
        if (req.wantsJSON)  {
            return res.json(model.registerFor);
        } else {
        return res.view('person/myevent', { event: model.registerFor });
        }
    },


};

