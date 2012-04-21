//
//  Copyright (C) 2012 Xavier Antoviaque <xavier@antoviaque.org>
//
//  This software's license gives you freedom; you can copy, convey,
//  propagate, redistribute and/or modify this program under the terms of
//  the GNU Affero General Public License (AGPL) as published by the Free
//  Software Foundation (FSF), either version 3 of the License, or (at your
//  option) any later version of the AGPL published by the FSF.
//
//  This program is distributed in the hope that it will be useful, but
//  WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero
//  General Public License for more details.
//
//  You should have received a copy of the GNU Affero General Public License
//  along with this program in a file in the toplevel directory called
//  "AGPLv3".  If not, see <http://www.gnu.org/licenses/>.
//


// DB Collections ////////////////////////////////////////////////////////

Meetings = new Meteor.Collection("meetings");
Meteor.subscribe('meetings');

Users = new Meteor.Collection("users");
Meteor.subscribe('users');


// Session variables /////////////////////////////////////////////////////

// Timezone
Session.set('timezone', jstz.determine_timezone());


// Utils /////////////////////////////////////////////////////////////////

// Gets a user object, creating it if necessary
function get_user_by_email(email) {
    var user = Users.findOne({email: email});
    if(!user) {
        var user_id = Users.insert({email: email});
        user = Users.findOne(user_id);
    }
    return user;
}


// Templates /////////////////////////////////////////////////////////////

Template.new_meeting.timezone_name = function() {
    var tz_name = Session.get('timezone').name();
    tz_name = tz_name.replace('/', ', ').replace('_', ' ');
    return tz_name;
};

Template.new_meeting.timezone_offset = function() {
    return Session.get('timezone').offset();
};

Template.my_meetings.meetings = function() {
    return Meetings.find({});;
};


// Events ////////////////////////////////////////////////////////////////

Template.new_meeting.events = {
    'click button.new-meeting' : function (evt) {
        evt.preventDefault();
        var form = $(evt.target).closest('form');

        // Availabilities
        var availabilities = []
        _.each($('.availability', form), function(el) {
            var avail = {}
            avail.date = $('.dateinput', el).val();
            avail.time_begin = $('.time-begin', el).val();
            avail.time_end = $('.time-end', el).val();
            availabilities.push(avail);
        });

        // Participants
        var participants_ids = [];
        _.each($('.participants-emails', form).val().split(','), function(email) {
            participants_ids.push(get_user_by_email(email)._id);
        });

        // Organizer
        var organizer = get_user_by_email($('.organizer-email', form).val());
        Users.update(organizer._id, { $set: {
            name: $('.organizer-name', form).val(),
            timezone: {
                offset: Session.get('timezone').offset(),
                name: Session.get('timezone').name(),
            },
        }});

        meeting_id = Meetings.insert({ 
            duration: {
                hours: $('.duration-hours', form).val(),
                minutes: $('.duration-minutes', form).val(),
            },
            availabilities: availabilities,
            topic: $('.topic', form).val(),
            participants: participants_ids,
            organizer: organizer._id,
        });

        Meteor.call('process_meeting', meeting_id);
    }
};


// Startup ///////////////////////////////////////////////////////////////

Meteor.startup(function() {
    $('.dateinput').datepicker();
});


