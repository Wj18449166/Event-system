/**
 * EventController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var swhere = {};



module.exports = {

    // action - create
    create: async function (req, res) {

        if (req.method == "GET")
            return res.view('event/create');

        if (typeof req.body.Event === "undefined")
            return res.badRequest("Form-data not received.");

        //解决日期创建的时候更换格式
        //req.body.Event.startDate =  new Date (req.body.Event.startDate);



        await Event.create(req.body.Event);

        //return res.ok("Successfully created!");
        return res.redirect('/event/index');
    },

    index: async function (req, res) {

        //var hName = "Hightlighted" || req.query.name;
        //console.log(hName);
        var models = await Event.find({
            //limit: 4,
            where: { highlighted: true },
            sort: 'name'
        })
        //console.log("try = " + await Event.count());
        if (req.wantsJSON) {
            return res.json({ events: models });
        } else {
            return res.view('event/index', { events: models });
        }

    },

    detail: async function (req, res) {

        var message = Event.getInvalidIdMsg(req.params);
        // console.log(message);
        if (message) return res.badRequest(message);
        var model = await Event.findOne(req.params.id);
        if (!model) return res.notFound();

        //查询该项目注册的学生，regisstermodel是学生的队列
        var registermodel = await Event.findOne(req.params.id).populate('isregisted');
        //console.log(registermodel.isregisted);

        var isregister = 0;
        var length = registermodel.isregisted.length;

        //console.log(registermodel.isregisted.length);

        for (var i = 0; i < length; i++) {
            //当当前项目注册的学生中有当前的用户，证明该用户已经注册过这个项目
            //console.log(registermodel.isregisted[i].personname);
            //console.log(req.session.username);
            if (registermodel.isregisted[i].personname == req.session.username) {
                isregister = 1;
            }
        }
        if (req.wantsJSON) {
            return res.json({ event: model });
        } else {
            return res.view('event/detail', { event: model, register: registermodel.isregisted, isregister: isregister });
        }
        

    },

    // action - index
    admin: async function (req, res) {

        var modelss = await Event.find();
        return res.view('event/admin', { eventss: modelss });

    },

    // action - update
    update: async function (req, res) {

        var message = Event.getInvalidIdMsg(req.params);
        if (message) return res.badRequest(message);
        if (req.method == "GET") {
            var model = await Event.findOne(req.params.id);
            if (!model) return res.notFound();
            //console.log(model.organizer);
            return res.view('event/update', { event: model });
        } else {
            // if (typeof req.body.Event === "undefined")
            //     return res.badRequest("Form-data not received.");


            console.log("PUT");

            var models = await Event.update(req.params.id).set({
                name: req.body.name,
                shortDes: req.body.shortDes,
                fullDes: req.body.fullDes,
                imgURL: req.body.imgURL,
                organizer: req.body.organizer,
                eventDate: req.body.eventDate,
                time: req.body.time,
                venue: req.body.venue,
                quote: req.body.quote,
                highlighted: req.body.highlighted || false,
                //    age: req.body.Event.age
            }).fetch();

            console.log("~~~~~~~~~~~~");

            // if (models.length == 0) return res.notFound();
            if (req.wantsJSON)
                return res.redirect('/event/admin');

        }
    },

    // action - delete 
    delete: async function (req, res) {

        if (req.method == "GET") return res.forbidden();
        var message = Event.getInvalidIdMsg(req.params);
        if (message) return res.badRequest(message);
        var models = await Event.destroy(req.params.id).fetch();
        if (models.length == 0) return res.notFound();

        if (req.wantsJSON)
            return res.redirect('/event/admin');

    },
    search: async function (req, res) {
        const sName = req.query.name || "";
        const sOrganizer = req.query.organizer || "";
        const sStartDate = req.query.startDate || "";
        const sEndDate = req.query.endDate || "";
        const sVenue = req.query.venue || "";
        const qPage = Math.max(req.query.page - 1, 0) || 0;
        const numOfItemsPerPage = 2;
        swhere = {};

        if (sName != "") swhere['name'] = { contains: sName };
        if (sOrganizer != "") swhere['organizer'] = sOrganizer;
        if (sStartDate != '') swhere['date'] = { '>=': sStartDate };
        if (sEndDate != '') swhere['date'] = { '<=': sEndDate };
        if (sVenue != '') swhere['venue'] = sVenue;

        var models = await Event.find({
            where: swhere,
            sort: 'name',
            limit: numOfItemsPerPage,
            skip: numOfItemsPerPage * qPage
        });

        var number = await Event.count({
            where: swhere,
        });
        var numOfPage = Math.ceil(await number / numOfItemsPerPage);

        return res.view('event/search', { events: models, count: numOfPage });

    },
    searchResult: async function (req, res) {

        const qPage = Math.max(req.query.page - 1, 0) || 0;
        const numOfItemsPerPage = 2;
        var models = await Event.find({
            where: swhere,
            sort: 'name',
            limit: numOfItemsPerPage,
            skip: numOfItemsPerPage * qPage
        });

        var number = await Event.count({
            where: swhere,
        });
        //console.log("number result = " + number);
        var numOfPage = Math.ceil(await number / numOfItemsPerPage);

        return res.view('event/search', { events: models, count: numOfPage });
    },


};

