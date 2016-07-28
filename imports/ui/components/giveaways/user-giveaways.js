import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import DatePicker from 'material-ui/DatePicker';
import Toggle from 'material-ui/Toggle';

import * as Helper from '../../../util/helper';
import * as AvatarHelper from '../../../util/avatar';
import * as GiveawaysHelper from '../../../util/giveaways';
import * as Colors from 'material-ui/styles/colors';
import * as IconsHelper from '../../../util/icons';

const giveawayRow = (touchTapHandler, editGa) => (ga) => (
  <ListItem
    key={ ga._id }
    primaryText={
      <span className="single-line" style={{ color: Colors.grey700 }}>{ ga.title }</span>
    }
    secondaryText={
      <p>
        <span className="location">Starting on: { moment(ga.startDateTime).format("ddd, Do MMM, h:mm a")}</span>
        <br />
        <span className="location">Ending on: { moment(ga.endDateTime).format("ddd, Do MMM, h:mm a")}</span>
      </p>
    }
    leftAvatar={
      ga.avatarId ? <Avatar src={ AvatarHelper.getUrl(ga.avatarId, 64) } />
                  : <Avatar icon={ GiveawaysHelper.getCategoryIcon(ga) } backgroundColor={ GiveawaysHelper.getStatusColor(ga) } />
    }
    secondaryTextLines={2}
    onTouchTap={ touchTapHandler(ga) }
    rightIconButton={
      <IconButton
        tooltip="Edit"
        style={{top: "9px",right: "12px"}}
        onTouchTap={editGa(ga)}>
        { IconsHelper.materialIcon("mode_edit", { color:"grey" }) }
      </IconButton>
    }
  />
);

export const UserGiveaways = (props) => (
  <List>
    <Subheader>
      <h3 style={{ margin:"20px 0px 10px" }}>Your Giveaways</h3>

      <div style={{ paddingRight: 15 }}>

        <Row>
          <Col xs={12}>
            <Toggle labelStyle= {{fontWeight:200}} label="Show all giveaways" toggled={ !props.showDateRange } onToggle={ props.handleAllUserGiveaways } />
          </Col>
        </Row>

        { props.showDateRange ?
        <div>
          <Row>
            <Col xs={12} md={2}>
              <span>From</span>
            </Col>
            <Col xs={12} md={2}>
              <DatePicker
                id="fromDate"
                value={ props.userFromDate }
                onChange={ props.handleUserFromDate }
                formatDate={ props.formatDate }
                textFieldStyle={{ width:"105px", fontSize:"14px" }} />
            </Col>
          </Row>

          <Row style={{paddingBottom:"10px"}}>
            <Col xs={12} md={2}>
              <span>Until</span>
            </Col>
            <Col xs={12} md={2}>
              <DatePicker
                id="toDate"
                value={ props.userUntilDate }
                onChange={ props.handleUserUntilDate }
                formatDate={ props.formatDate }
                textFieldStyle={{ width:"105px", fontSize:"14px" }} />
            </Col>
          </Row>
          </div>
          :
        <div />
        }

      <Row>
        <Col xs={12} md={6}>
        <Toggle
        labelStyle= {{fontWeight:200}}
        label="All giveaways"
        onToggle={ props.handleAllUserGiveaways }
        defaultToggled= { true }
        />
        </Col>
      </Row>

    </Subheader>
    { props.giveaways
      ? Helper.insertDividers(props.giveaways.map(giveawayRow(props.nearbyOnClick, props.editGa) ))
      : <div />
    }
  </List>
);
