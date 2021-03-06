import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { Scrollbars } from 'react-custom-scrollbars';

import UserGiveaways from '../../containers/giveaways/user-giveaways';

import * as IconsHelper from '../../../util/icons';

export default class MapUserBox extends React.Component {
  formatDate(date) {
    return moment(date).format("ddd, D MMM YYYY");
  };

  componentDidMount() {
    const self = this;

    $(".expand-button-nearbybox").click(event => {
      event.stopPropagation();

      if (self.props.boxState == 0)
        self.props.setBoxState(2);
      else
        self.props.setBoxState(0);
    });
  }

  render() {
    return (
      <div id="map-nearby-box" className={ "map-sidebar hidden-xs hidden-sm col-md-3 col-lg-3 state-" + this.props.boxState }>
        <Scrollbars autoHide style={{ height: "100%" }}>
          <UserGiveaways
          gaIdRoute={ this.props.gaIdRoute }
          mapBounds={ this.props.mapBounds }
          nearbyOnClick={ this.props.nearbyOnClick }
          userUntilDate={ this.props.userUntilDate }
          handleUserUntilDate={ this.props.handleUserUntilDate }
          userFromDate={ this.props.userFromDate }
          handleUserFromDate={ this.props.handleUserFromDate }
          handleAllUserGiveaways= { this.props.handleAllUserGiveaways }
          formatDate={ this.formatDate.bind(this) }
          editGa={ this.props.editGa }
          showDateRange={ this.props.showDateRange }
          />
        </Scrollbars>

        <div className="expand-button-nearbybox hidden-xs hidden-sm">
          <FloatingActionButton mini={true} backgroundColor="#647577" zDepth={ 0 }>
            { IconsHelper.materialIcon(this.props.boxState == 0 ? "keyboard_arrow_left" : "keyboard_arrow_right") }
          </FloatingActionButton>
        </div>
      </div>
    );
  }
}
