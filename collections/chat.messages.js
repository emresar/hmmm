Messages = new Meteor.Collection("Messages");

Messages.allow({
	insert: function (parameter1, Parameter2) {
		return true;    // everybody's allowed to Chat
	},
	remove: function (userId, doc) {
		return userId && true;   // allow only if UserId is present
	}
});
