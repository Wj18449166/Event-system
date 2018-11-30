/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function (done) {


  if (await Event.count() > 0) {
    return done();
  }

  await Event.createEach([
    //{ name: "Martin Choy", age: 23 },
    //{ name: "Kenny Cheng", age: 22 }
    // etc.
    { name: "activity01", shortDes: "岳岳", fullDes: "岳岳，7月11日出生于北京市,中国内地男歌手，男子偶像组合ONER成员。", imgURL:"https://wx4.sinaimg.cn/mw690/0077x9VPly1fvgf3xldckj32il3yub2c.jpg", organizer: "ACB", eventDate: new Date('1992/07/11'), time: "12", venue: "WLB", quote: 2, highlighted: true },
    { name: "activity011", shortDes: "木子洋", fullDes: "木子洋，1994年4月21日出生，中国内地男歌手、模特，男子组合ONER成员。", imgURL:"https://wx3.sinaimg.cn/mw690/0077x9VPly1fvgf48qxwxj32753wpkjr.jpg", organizer: "ACB", eventDate: new Date('1994/04/21'), time: "12", venue: "POD", quote: 4, highlighted: true },
    { name: "activity02", shortDes: "灵超", fullDes: "灵超，2001年1月9日出生于中国河北省，中国内地男歌手，男子偶像组合ONER成员。", imgURL:"https://wx4.sinaimg.cn/mw690/0077x9VPly1fvgf4oau8lj31nr2y7hdt.jpg", organizer: "ACB", eventDate: new Date('2001/01/01'), time: "12", venue: "SWT501", quote: 12, highlighted: true },
    { name: "activity03", shortDes: "卜凡", fullDes: "卜凡，4月13日出生于中国山东省，中国内地男歌手，男子偶像组合ONER成员。", imgURL:"https://wx1.sinaimg.cn/mw690/0077x9VPly1fvgf4k9u7hj32dc47pb2b.jpg", organizer: "ABC", eventDate: new Date('1996/04/13'), time: "12", venue: "LW", quote: 1, highlighted: true },
    { name: "activity04", shortDes: "oner", fullDes: "坤音四子ONER，中国内地男子偶像组合，由岳岳、木子洋、卜凡、灵超组成", imgURL:"https://wx4.sinaimg.cn/mw690/0077x9VPly1fwn9he7lwwj31400qon99.jpg", organizer: "ACB", eventDate: new Date('2018/08/31'), time: "12", venue: "LIP", quote: 3, highlighted: false },
    
  ]);

  await User.createEach([
    { "username": "admin" },
    { "username": "student" },
    { "username": "everyone" }
    // etc.
  ]);

  await Person.createEach([
    { "personname": "aUser01", "password": "123456" },
    { "personname": "aUser02", "password": "123456" },
    { "personname": "sUser01", "password": "123456" },
    { "personname": "sUser02", "password": "123456" },
    { "personname": "eUser01", "password": "123456" },
    { "personname": "eUser02", "password": "123456" }
    // etc.
  ]);

  const aUser01 = await Person.findOne({ personname: "aUser01" });
  const aUser02 = await Person.findOne({ personname: "aUser02" });
  const sUser01 = await Person.findOne({ personname: "sUser01" });
  const sUser02 = await Person.findOne({ personname: "sUser02" });
  const eUser01 = await Person.findOne({ personname: "eUser01" });
  const eUser02 = await Person.findOne({ personname: "eUser02" });
  const admin = await User.findOne({ username: "admin" });
  const student = await User.findOne({ username: "student" });
  const everyone = await User.findOne({ username: "student" });
  
  await User.addToCollection(admin.id, 'supervises').members([aUser01.id,aUser02.id]);
  await User.addToCollection(student.id, 'supervises').members([sUser01.id,sUser02.id]);
  await User.addToCollection(everyone.id, 'supervises').members([eUser01.id,eUser02.id]);

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return done();
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};
