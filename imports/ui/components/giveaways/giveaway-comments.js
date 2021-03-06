import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { Scrollbars } from 'react-custom-scrollbars';
import Store from '../../../startup/client/redux-store';

import { pluralizer } from '../../../util/helper';
import * as GiveawaysHelper from '../../../util/giveaways';
import * as UsersHelper from '../../../util/users';
import * as RolesHelper from '../../../util/roles';
import * as LayoutHelper from '../../../util/layout';
import * as Colors from 'material-ui/styles/colors';

import { editComment, removeComment, flagComment, unflagComment, removeFlaggedComment } from '../../../api/giveaway-comments/methods';

const middot = <span>&nbsp;&middot;&nbsp;</span>;

const CommentsList = (self, comments, owner) => (
  <Scrollbars
    autoHide
    autoHeight
    autoHeightMin={1}
    autoHeightMax={500}>
    { comments.map(CommentRow(self, owner)) }
  </Scrollbars>
);

const CommentRow = (self, owner) => (comment, index) => {
  const isFlaggedAndMod = RolesHelper.modsOrAdmins(Meteor.user()) && GiveawaysHelper.countTotalFlags(comment) > 0;
  const isRemovedAndMod = RolesHelper.modsOrAdmins(Meteor.user()) && comment.isRemoved === true;

  return (
    <div
      className={`comment-row ${ isRemovedAndMod ? 'comment-removed' : isFlaggedAndMod ? 'comment-flagged' : '' }`}
      key={index}>
      { self.state.currentlyEditing && self.state.currentlyEditing == comment._id ?
        CommentRowEditing(self, comment, owner) :
        CommentRowDisplay(self, comment, owner)
      }
    </div>
  );
};

const CommentRowDisplay = (self, comment, owner) => {
  const { _id, content, user, createdAt, updatedAt } = comment;

  return LayoutHelper.twoColumns(
    UsersHelper.getAvatar(user, 40, { margin: "0 auto", display: "block" }),
    <div className="comment-body">
      <h5 className="comment-username">{ UsersHelper.getUserLink(user, UsersHelper.getFullNameWithLabelIfEqual(user, owner, "Author")) }</h5>
      { GiveawaysHelper.commentBody(content) }

      { comment.isRemoved !== true ? CommentActions(self, comment) : null }

      { RolesHelper.modsOrAdmins(Meteor.userId()) ? CommentActionsMod(self, comment) : null }
    </div>,
    40
  );
};

const CommentActions = (self, comment) => {
  const { _id, content, user, createdAt, updatedAt } = comment;
  return (
    <p className="timestamp small-text">
      { updatedAt ? "updated " + moment(updatedAt).fromNow() : moment(createdAt).fromNow() }

      { self.props.showActions && Meteor.userId() ?
        user && user._id === Meteor.userId() ? CommentActionsOwner(self, comment) : CommentActionsNonOwner(self, comment) :
        null
      }
    </p>
  );
};

const CommentActionsOwner = (self, comment) => (
  <span>
    { middot }
    <a role="button" onTouchTap={ event => self.setState({ currentlyEditing: comment._id, editCommentValue: comment.content }) }>Edit</a>
    { middot }
    <a role="button" onTouchTap={ event => handleAction(removeComment, comment._id, 'Comment removed.') }>Remove</a>
  </span>
);

const CommentActionsNonOwner = (self, comment) => (
  <span>
    { middot }
    { !GiveawaysHelper.userHasFlaggedComment(comment, Meteor.userId()) ?
      <a role="button" onTouchTap={ event => handleAction(flagComment, comment._id, 'Thanks for flagging, we will be reviewing this shortly.') }>Flag</a> :
      "Flagged"
    }
  </span>
);

const CommentActionsMod = (self, comment) => {
  const isRemoved = comment.isRemoved === true;
  const flagCount = GiveawaysHelper.countTotalFlags(comment);

  if (isRemoved)
    return (
      <p className="timestamp small-text">
        deleted by { UsersHelper.getUserLink(comment.removeUserId) } { moment(comment.updatedAt).fromNow() }
      </p>
    );
  else if (flagCount > 0)
    return (
      <p className="timestamp small-text">
        flagged { flagCount } { pluralizer(flagCount, 'time', 'times') }
        { middot }
        <a role="button" onTouchTap={ event => handleAction(unflagComment, comment._id, 'Successfully removed all flags.') }>Unflag</a>
        { middot }
        <a role="button" onTouchTap={ event => handleAction(removeFlaggedComment, comment._id, 'Successfully removed flagged comment.') } style={{ color: Colors.red700 }}>Delete comment</a>
      </p>
    );
  else
    return null;
};

const CommentRowEditing = (self, { _id, content, user, createdAt, updatedAt }, owner) => LayoutHelper.twoColumns(
  UsersHelper.getAvatar(user, 40, { margin: "0 auto", display: "block" }),
  <div className="comment-body">
    <h5 className="comment-username">{ UsersHelper.getFullNameWithLabelIfEqual(user, owner, "Author") }</h5>
    <TextField
      id="edit-comment-field"
      name="edit-comment"
      value={ self.state.editCommentValue }
      onChange={ event => self.setState({ editCommentValue: event.target.value }) }
      multiLine={true}
      fullWidth={true}
      hintText="Add a comment..."
      hintStyle={{ fontSize: 14 }}
      textareaStyle={{ fontSize: 14 }} />
    <p className="small-text">
      <a role="button" onTouchTap={ self.handleEditComment.bind(self) }>Save</a>
      { middot }
      <a role="button" onTouchTap={ event => self.setState({ currentlyEditing: null }) }>Cancel</a>
    </p>
  </div>,
  40
);

const NoComments = () => (
  <p>
    <em>
      <span>No comments yet. </span>
      { Meteor.user() ?
        "Add yours?" :
        <span>
          <a href="javascript:void(0);" onTouchTap={ () => Store.dispatch({ type: 'OPEN_LOGIN_DIALOG', message: "Login to leave a comment!" }) }>Login</a> to comment!
        </span>
      }
    </em>
  </p>
);

const handleAction = (action, _id, notification) => {
  const userId = Meteor.userId();

  if (!_id)
    return false;

  action.call({ _id, userId }, (error) => {
    if (error) {
      console.log(error);
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert(notification, 'success');
    }
  });
};

export class GiveawayComments extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentlyEditing: null,
      editCommentValue: "",
    };
  }

  handleEditComment(event) {
    const content = this.state.editCommentValue;
    const _id = this.state.currentlyEditing;
    const userId = Meteor.userId();

    if (!content.length || !userId)
      return false;

    this.setState({ editCommentValue: "", currentlyEditing: null });

    editComment.call({ _id, content, userId }, (error) => {
      if (error) {
        console.log(error);
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Comment updated.', 'success');
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.currentlyEditing && !!this.state.currentlyEditing)
      $("#edit-comment-field").focus();
  }

  render() {
    return (
      <div className="giveaway comments-list">
        { this.props.comments.length ? CommentsList(this, this.props.comments, this.props.owner) : NoComments() }
      </div>
    );
  }
}
