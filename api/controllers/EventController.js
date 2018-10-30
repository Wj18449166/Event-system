/**
 * EventController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

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

        var hName = "Hightlighted" || req.query.name;
        console.log(hName);
        var models = await Event.find({
            where: { hightlig: { contains: hName } },
            sort: 'name'
        });
        //console.log(models[1]);
        //console.log(models[2]);

        return res.view('event/index', { events: models });
    },

    detail: async function (req, res) {

        var message = Event.getInvalidIdMsg(req.params);

        console.log(message);

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

            console.log(model.shortDes);;
            console.log(model.fullDes);
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
                hightlig: req.body.Event.hightlig,

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

        var hName = "Hightlighted" || req.query.name;
        const qPage = Math.max(req.query.page - 1, 0) || 0;
        const numOfItemsPerPage = 2;
       
       
        console.log(hName);
        var models = await Event.find({
            where: { hightlig: { contains: hName } },
            sort: 'name',
            limit: numOfItemsPerPage,
            skip: numOfItemsPerPage * qPage
        });

        var numOfPage = Math.ceil(await Event.count() / numOfItemsPerPage);

        return res.view('event/search', { events: models, count: numOfPage });
    },


};

