import { Meteor } from 'meteor/meteor';
import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { browserHistory } from 'react-router';

import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';

import { getHandleLogout } from '../../../modules/logout';
import * as IconsHelper from '../../../util/icons';

export class DrawerMenuItems extends React.Component {
  constructor(props) {
    super(props);
  }

  constructMenuItems() {
    this.menuItems = [
      { title: "Map", href: "/", icon: IconsHelper.icon("map") },
      { title: "Timeline", href: "/timeline", icon: IconsHelper.icon("timeline") },
      { title: "Communities", href: "/communities", icon: IconsHelper.icon("people") },
      { divider: true },
    ];

    if (this.props.hasUser) {
      this.menuItems.push({ title: "My Giveaways", href: "/my-giveaways", icon: IconsHelper.icon("folder_shared") });
      this.menuItems.push({ title: "My Communities", href: "/my-communities", icon: IconsHelper.icon("group") });
      this.menuItems.push({ divider: true });
      this.menuItems.push({ title: "Profile", href: "/profile", icon: IconsHelper.icon("person") });
      this.menuItems.push({ title: "Settings", href: "/settings", icon: IconsHelper.icon("settings") });
      this.menuItems.push({ title: "Log Out", onClick: getHandleLogout(), icon: IconsHelper.icon("exit_to_app") });
    } else {
      this.menuItems.push({ title: "Log In", onClick: this.props.openLogin.bind(this), icon: IconsHelper.icon("lock") });
    }
  }

  render() {
    this.constructMenuItems();

    return (
      <div id="drawer-menu-items">
        { this.menuItems.map((item, index) => {
          if (item.divider) {
            return <Divider key={ 'menudivider' + index } />;
          } else {
            const onClick = () => {
              if (item.onClick)
                item.onClick();
              this.props.closeDrawer();
            };

            const menuItem = (
              <MenuItem
                key={ 'menuitem'+index }
                onTouchTap={ onClick }
                primaryText={ item.title }
                leftIcon={ item.icon }
              />);

            if (!item.href)
              return menuItem;
            else
              return (
                <LinkContainer key={ 'menulink'+index } to={ item.href }>{ menuItem }</LinkContainer>
              );
          }
        }) }
      </div>
    );
  }
}

DrawerMenuItems.propTypes = {
  closeDrawer: React.PropTypes.func,
  hasUser: React.PropTypes.object,
}
