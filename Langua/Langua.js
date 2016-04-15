Interpreterlist = new Mongo.Collection('interpreters');
Language = new Mongo.Collection('languages');

Router.route('/', function() {
  this.render('Home');
});

Router.route('/profile', {
  template: 'ProfileTemplate',
  data: function(){
    return Meteor.user();
  }
});

Router.route('/settings');

if (Meteor.isClient) {

	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
	});

	Template.ProfileTemplate.helpers({
		myProfile: function () {
			return Meteor.user() === Meteor.users.findOne({username: this.username});
		},

		languages: function () {
			return Language.find({language: this.language});
		}
	}); 

	Template.ProfileTemplate.events({
		"click #insert-lang": function (event) {
			//Prevent default browser form submit
			event.preventDefault();

			console.log('adding languages');

			var language = $('#language').val();

			Language.insert({
				language: languages
			});

			//clear form
			$('#language').val('');
			Router.go('/profile');
		}
	});


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
