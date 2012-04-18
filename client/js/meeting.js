
Session.set('timezone', jstz.determine_timezone());

Meteor.startup(function() {
    $('.dateinput').datepicker();
});

Template.new_meeting.timezone_name = function() {
    var tz_name = Session.get('timezone').name();
    tz_name = tz_name.replace('/', ', ').replace('_', ' ');
    return tz_name;
};

Template.new_meeting.timezone_offset = function() {
    return Session.get('timezone').offset();
};

/*Template.hello.events = {
    'click input' : function () {
        // template data, if any, is available in 'this'
        if (typeof console !== 'undefined') {
            console.log("You pressed the button");
        }
    }
};*/
