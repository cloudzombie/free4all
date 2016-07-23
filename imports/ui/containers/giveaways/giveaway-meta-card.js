import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { GiveawayMetaCard } from '../../components/giveaways/giveaway-meta-card';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';
import { GiveawayComments } from '../../../api/giveaway-comments/giveaway-comments';

const composer = (props, onData) => {
  if (Meteor.subscribe('giveaway-by-id', props.gaId).ready()) {
    const ga = Giveaways.findOne(props.gaId);

    if (Meteor.subscribe('user-by-id', ga.userId).ready()) {
      const user = Meteor.users.findOne({ _id: ga.userId });

      if (Meteor.subscribe('giveaways-by-user', ga.userId).ready()) {
        const shareCount = Giveaways.find({ userId: ga.userId }).count();

        if (Meteor.subscribe('comments-for-giveaway', props.gaId).ready()) {
          const commentCount = GiveawayComments.find({ giveawayId: props.gaId, isRemoved: { $ne: true } }).count();

          onData(null, { ga, user, shareCount, commentCount });
        }
      }
    }
  }
};

export default composeWithTracker(composer, Loading)(GiveawayMetaCard);
