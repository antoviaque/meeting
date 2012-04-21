// Users
Users = new Meteor.Collection("users");
Meteor.publish('users', function() {
    return Users.find();
});

// Meetings
Meetings = new Meteor.Collection("meetings");
Meteor.publish('meetings', function() {
    return Meetings.find();
});


