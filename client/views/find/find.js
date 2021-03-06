Router.map(function () {
	this.route('find', {
		path: '/find/:search?',
		template: 'find',
		waitOn: function () {
			var region = Session.get('region')
			var filter = {}
			filter.hasUpcomingEvent = !!this.params.query.hasUpcomingEvent;
			return [
				Meteor.subscribe('coursesFind', region, this.params.search, filter),
				Meteor.subscribe('futureEvents'),
				Meteor.subscribe('eventsSearch', this.params.search, true, 10)
			];
		},
		data: function() {
			var region = Session.get('region')
			var filter = {};
			filter.hasUpcomingEvent = !!this.params.query.hasUpcomingEvent;
			return {
				hasUpcomingEvent: filter.hasUpcomingEvent,
				query: this.params.search,
				results: coursesFind(region, this.params.search, filter),
				eventResults: eventsSearch(this.params.search, true, 10)
			}
		},
		onAfterAction: function() {
			document.title = webpagename + 'Find ' + this.params.search
		}
	})
})

var submitForm = function(event) {
	options = {}
	if ($("#hasUpcomingEvent")[0].checked) {
		options.query = "hasUpcomingEvent";
	}

	Router.go('find', { search: $('#find').val().replace("/", " ")}, options )
	event.preventDefault();
	event.stopPropagation();
	return false; 
}

Template.find.events({
	'submit': submitForm,
	'change .search': submitForm,
	//TEMPORARY EVENTS FOR NACHHALTIGKEITSWOCHE HEADER
	'click button.nw_close': function() { 
		Session.set('showHeader', "hideIt");
	},
	
	'click button.readmore': function() {
		if (Session.get('showInfo') != true) {
			Session.set('showInfo', true);
		}
		else Session.set('showInfo', false);
	}
});

Template.find.helpers({
	'hasUpcomingEventsChecked': function() {
		if (this.hasUpcomingEvent) return "checked";
	},
	
	'newCourse': function() {
		return {
			name: this.query,
			region: Session.get('region')
		}
	},
});

Template.NHW_info.helpers({
	'showNW_Header': function() {
		return Session.get('showHeader')
	},

	'showNW_info': function() {
		return Session.get('showInfo');
	}
})
