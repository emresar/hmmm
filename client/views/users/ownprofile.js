Router.map(function () {
	this.route('profile', {
		path: 'profile',
		waitOn: function () {
			return [ 
				Meteor.subscribe('currentUser'),
				Meteor.subscribe('coursesFind', 'all', false, { userInvolved: Meteor.userId() })
			];
		},
		data: function () {
			var user = Meteor.user()
			if(user) {
				var userdata = {
					_id: user._id,
					name: user.profile.name
				}
				if(user.emails) {
					userdata.email = user.emails[0].address
					if(user.emails[0].verified){
						userdata.verifiedEmail = 'verified'
						userdata.veryfiedEmailTrue = '1'
					}
					else userdata.verifiedEmail = 'not verified'
				}
				
				return { 
					user: userdata,
					courses: coursesFind('all', false, { userInvolved: user._id })
				};
			}
		},
		onAfterAction: function() {
			var user = Meteor.users.findOne()
			if (!user) return;
			document.title = webpagename + 'My Profile_Settings - ' + user.profile.name;
		}
	})
})


Template.profile.helpers({
	isEditing: function () {
		return Session.get("isEditing");
	}
});

Template.profile.events({
	'click input.edit': function () {
		// gehe in den edit-mode, siehe html
		Session.set("isEditing", true);
	},
	'click input.save': function () {
		// wenn im edit-mode abgespeichert wird, update db und verlasse den edit-mode
		//alert(document.getElementById('editform_username').value);
		Meteor.call('update_userdata', document.getElementById('editform_username').value,document.getElementById('editform_email').value); //kann nur auf server ausgeführt werden (file:server/main.js)
		if(document.getElementById('editform_newpassword').value!="") {
			Meteor.call('update_userpassword', document.getElementById('editform_newpassword').value);
		}
		Session.set("isEditing", false);
	}
});

Template.profile.events({
	'click input.verify': function () {
		Meteor.call('sendVerificationEmail')
	}
})
