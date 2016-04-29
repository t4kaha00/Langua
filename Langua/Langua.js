Language = new Mongo.Collection('languages');
Messages = new Mongo.Collection('messages');

Router.route('/', function() {
  this.render('Home');
});

Router.route('/profile', {
  template: 'ProfileTemplate',
  data: function(){
    return Meteor.user();
  }
});

Router.route('/profile/:_username', {	
	template: 'ProfileTemplate',
	data: function() {
		return Meteor.users.findOne({username: this.params._username});
	}
});

Router.route('/settings');

if (Meteor.isClient) {

	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
	});

	Template.Home.helpers({
		myname: function () {
			return Meteor.user().profile.name;	
		}
	});

	Template.interpreterTemplate.helpers({
		allinterpreters: function () {
			return Language.find({}, {language: this.language});
		}
	});

	Template.profileinterpreterTemplate.helpers({
		interpreters: function() {
			return Language.find({interpreterName: this.username}, {language: this.language});
		}
	});

	Template.ProfileTemplate.helpers({
		myProfile: function () {
			return Meteor.user() === Meteor.users.findOne({username: this.username}).Id;
		},

		name: function () {
			return Meteor.user().profile.name;
		},

		interpreterName: function(){
			return Language.find({interpreterName : this.username});
		},

		profilelanguages: function () {
			return Language.find({ name: this.username}).Id;
		}
	}); 

	Template.ProfileTemplate.events({
		"click #insert-lang": function (event) {
			//Prevent default browser form submit
			event.preventDefault();

			console.log('adding languages');

			var language = $('#language').val();

			if (language == "") {
				alert("please provide a language");
			} 
			else {
				Language.insert({
					interpreterId: Meteor.userId(),
					interpreterName: Meteor.user().username,
					language: language
					});
			}

			Language.update(
			{
				Id: this.Id
			},

			{
				$set: {
					language : language
				}
			})	

			//clear form
			$('#language').val('');
			Router.go('/profile');
		},

		'click .toggle-checked': function () {

			//event.preventDefault();

			console.log('checking');

			Language.update(
				{ Id: this.Id },
				{
					$set: {checked: ! this.checked },
				})	
		},

		'click #delete-lang': function() {

			event.preventDefault();

			console.log('deleting languages');

			Language.remove(this._id);
		},

		'click .msg': function () {
			Session.set('currentId', this.Id);
			var result = ChatRooms.findOne({chatIds: { $all: [ this.Id, Meteor.userId()]}});
			if (result) {
				Session.set("roomid", result.Id);
			} else {
				var newRoom = ChatRooms.insert({chatIds:[this.Id, Meteor.userId()], messages: []});
				Session.set('roomid', newRoom);
			}
		}
	});

	Template.MessageTemplate.helpers({

		messages: function(){
			return Messages.find({}, {sort: {time: 1}});
		}
	});

	Template.MessageTemplate.events({
		'keydown input#message' : function (event) {
			if (event.which == 13) {
				if (Meteor.user()) {
					var fname = Meteor.user().username;
				} else {
					var fname = 'Anonymous';
				}
				var message = document.getElementById('message');

				if (message.value != '') {
				// 	var de = ChatRooms.update({"Id": Session.get("currentRoomId")}, {$push: {messages:{
				// 		name: name,
				// 		text: message.value,
				// 		time: Date.now()
				// 	}}});

				// console.log(de);
				Messages.insert({
					name: fname,
					text: message.value,
					time: Date.now()
				});
				document.getElementById('message').value = '';
				message.value = '';
				}
			}
		}
	});

	Template.languageTemplate.helpers({
		languages: function () {
			return Language.find({});
		},
		name: function () {
			return Meteor.user().profile.name;
		}
	});

	Template.Settings.helpers({
		name: function() {
			return Meteor.user().profile.name;
		},
		email: function() {
			return Meteor.user().profile.email;
		},
		languages: function() {
			return Meteor.user().Language.find({});
		}
	});

	Template.Settings.events({
		"click #save-profile-btn": function() {
			//prevents default browser submit
			event.preventDefault();

			//get value from form element
			var name = $('#name').val(),
				email = $('#email').val();

			Meteor.users.update(
				{
					Id: Meteor.userId()
				},
				{
					$set: {
					"profile.name": name,
					"profile.email": email
					}
				}
			);

			//clear form
			$('#name').val('');
			$('#email').val('');
		}
	});


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

if(Meteor.isCordova){
	Meteor.startup()
}