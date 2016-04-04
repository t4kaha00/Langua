Interpreterlist = new Mongo.Collection('interpreters');



if (Meteor.isClient) {
  Template.Home.helpers({
    'interpreter' : function(){
      return Interpreterlist.find()
    }
  });

  Template.Home.events({
    'click li': function(){

    }
  });
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
