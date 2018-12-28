import DashboardAddons from 'hub-dashboard-addons';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import Select from '@jetbrains/ring-ui/components/select/select';
import Panel from '@jetbrains/ring-ui/components/panel/panel';
import Button from '@jetbrains/ring-ui/components/button/button';
import EmptyWidget, {EmptyWidgetFaces} from '@jetbrains/hub-widget-ui/dist/empty-widget';

import 'file-loader?name=[name].[ext]!../../manifest.json';
// eslint-disable-line import/no-unresolved
import styles from './app.css';

var LIST_OF_CAT_IDS = ["purr", "walk", "acrobat", "kittens",
                       "burp", "sleepy", "facepalm", "meal",
                       "banjo", "groom", "gift", "knead",
                       "love", "fly", "popcorn", "drink"];

var CAT_IDS = [
  {'label':'Purr', 'key':'purr'},
  {'label':'Walk', 'key':'walk'},

];

var DEFAULT_CAT_ID = "purr";
var DEFAULT_TITLE = "Cats";

//---------- WIDGET ----------

class Widget extends Component {
  static propTypes = {
    dashboardApi: PropTypes.object,
    registerWidgetApi: PropTypes.func
  };

  constructor(props) {
    super(props);
    const {registerWidgetApi, dashboardApi} = props;

    this.state = {
      isConfiguring: false
    };

    registerWidgetApi({
      onConfigure: () => this.setState({isConfiguring: true})
    });

    this.initialize(dashboardApi);
  }

  initialize(dashboardApi) {
    dashboardApi.readConfig().then(config => {
      if (!config) {
        this.setState({catId: DEFAULT_CAT_ID,
                       title: DEFAULT_TITLE})
        return;
      }
      this.setState({catId: config.catId || DEFAULT_CAT_ID,
                     title: config.title || DEFAULT_TITLE});
    });
  }

  saveConfig = async () => {
    const {catId, title} = this.state;
    await this.props.dashboardApi.storeConfig({catId, title});
    this.setState({isConfiguring: false});
  };

  cancelConfig = async () => {
    this.setState({isConfiguring: false});
    await this.props.dashboardApi.exitConfigMode();
    this.initialize(this.props.dashboardApi);
  };

  changeCatId = cat => {
    var catId = cat.key;
    this.setState({catId});
  }

  renderConfiguration() {
    const {isConfiguring, catId, title} = this.state;
    const cat = CAT_IDS[0];

    return (
      <div>
        <Select
          data={CAT_IDS}
          selected={cat}
          onChange={this.changeCatId}
          label="Choose cat!"
        />
        <Panel>
          <Button primary onClick={this.saveConfig}>{'Save'}</Button>
          <Button onClick={this.cancelConfig}>{'Cancel'}</Button>
        </Panel>
      </div>
    );
  }

  render() {
    const {isConfiguring, catId, title} = this.state;

    if (isConfiguring) {
      return this.renderConfiguration();
    }

    if (catId === 'random') {
      catId = LIST_OF_CAT_IDS[Math.floor(Math.random() * LIST_OF_CAT_IDS.length)];
    }

    const url = 'images\\' + catId + '.gif';

    return (
      <div className={styles['cat-image']}>
        <img className={styles['cat-image']} src={url}></img>
      </div>
    );
  }
}

DashboardAddons.registerWidget((dashboardApi, registerWidgetApi) =>
  render(
    <Widget
      dashboardApi={dashboardApi}
      registerWidgetApi={registerWidgetApi}
    />,
    document.getElementById('app-container')
  )
);
