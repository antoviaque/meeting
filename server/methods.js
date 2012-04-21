var require = __meteor_bootstrap__.require,
    nodemailer = require('nodemailer');

var mailer = nodemailer.createTransport("Sendmail", "/usr/sbin/sendmail");

Meteor.methods({
    process_meeting: function(meeting_id) {
        mailer.sendMail({
                to : "xavier@antoviaque.org",
                from : "xavier2@antoviaque.org",
                subject : "Test email",
                text: "Hello! This is a test of the node_mailer.",
            },
            function(err, result) {
                if(err) { 
                    console.log(err); 
                }
            });
    },
});
