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

        await Event.create(req.body.Event);

        return res.ok("Successfully created!");
    },

    index: async function (req, res) {

        //var hName = "Hightlighted" || req.query.name;
        //console.log(hName);
        var models = await Event.find({
            limit: 4,
            where: { highlighted: true },
            sort: 'name'
        })
        //console.log("try = " + await Event.count());
        return res.view('event/index', { events: models });
    },

    detail: async function (req, res) {

        var message = Event.getInvalidIdMsg(req.params);
        // console.log(message);
        if (message) return res.badRequest(message);
        var model = await Event.findOne(req.params.id);
        if (!model) return res.notFound();
        return res.view('event/detail', { event: model });

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
            if (typeof req.body.Event === "undefined")
                return res.badRequest("Form-data not received.");

            var models = await Event.update(req.params.id).set({
                name: req.body.Event.name,
                shortDes: req.body.Event.shortDes,
                fullDes: req.body.Event.fullDes,
                imgURL: req.body.Event.imgURL,
                organizer: req.body.Event.organizer,
                eventDate: req.body.Event.eventDate,
                time: req.body.Event.time,
                venue: req.body.Event.venue,
                quote: req.body.Event.quote,
                highlighted: req.body.Event.highlighted || false,

                //    age: req.body.Event.age
            }).fetch();

            if (models.length == 0) return res.notFound();
            return res.ok("Record updated");

        }
    },

    // action - delete 
    delete: async function (req, res) {

        if (req.method == "GET") return res.forbidden();
        var message = Event.getInvalidIdMsg(req.params);
        if (message) return res.badRequest(message);
        var models = await Event.destroy(req.params.id).fetch();
        if (models.length == 0) return res.notFound();

        return res.ok("Event Deleted.");

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
    //显示用户的注册信息，针对student的用户
    mrevent: async function (req, res) {

        var models = await Event.find({
            limit: 3,
            where: { highlighted: true },
            sort: 'name'
        })

        return res.view('event/index', { events: models });
    },

    //添加student和event的关联
    addEvent: async function (req, res) {

        console.log("111111111111");
        var event = await Event.findOne(req.params.id);
        console.log("event: " + event);
        var person = await Person.findOne({ personname: req.session.username });
        console.log("person: " + person);
        if (event.quote == 0 || event.quote < 0) {
            return res.ok("No Quote");
        }
        console.log("33333333333");
        await Event.update(req.params.id).set({
            quote: event.quote - 1
        })
        console.log("444444444444");
        await Person.addToCollection(person.id, 'registerFor').members(event.id);
        console.log("111111111111");
        var model = await Person.findOne(person.id).populate('registerFor');

        
        return res.ok('Operation completed.');

    },





};

