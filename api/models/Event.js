/**
 * Event.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    name: {
      type: "string"
    },
    shortDes: {
      type: "string"
    },
    fullDes: {
      type: "string"
    },

    imgURL: {
      type: "string"
    },
    organizer: {
      type: "string"
    },
    eventDate: {
      type: "string"
    },
    time: {
      type: "string"
    },
    venue: {
      type: "string"
    },
    quote: {
      type: "number"
    },
    hightlig: {
      type: "string"
    },




    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    

  },

  getInvalidIdMsg: function (opts) {
    // opts = req.params

    if (typeof opts.id === "undefined")
      return "try.";
    if (isNaN(parseInt(opts.id)))
      return "try1";
    return null;        // falsy

  },

};

