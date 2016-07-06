import { Meteor } from 'meteor/meteor';

const userPublicFields = {
  profile: true,
  roles: true,
  emails: true,
  'services.facebook.id': true,
  'services.google.picture': true,
};

Meteor.publish('user-data', function() {
  return Meteor.users.find(this.userId, {
    fields: userPublicFields,
  });
});

Meteor.publish('user-by-id', function(userId) {
  check(userId, Match._id);
  return Meteor.users.find(userId, {
    fields: userPublicFields,
  });
});
