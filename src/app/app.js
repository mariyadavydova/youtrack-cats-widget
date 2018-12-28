import DashboardAddons from 'hub-dashboard-addons';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import Text from '@jetbrains/ring-ui/components/text/text';
import Select from '@jetbrains/ring-ui/components/select/select';
import List from '@jetbrains/ring-ui/components/list/list';
import Panel from '@jetbrains/ring-ui/components/panel/panel';
import Button from '@jetbrains/ring-ui/components/button/button';
import EmptyWidget, {EmptyWidgetFaces} from '@jetbrains/hub-widget-ui/dist/empty-widget';

import 'file-loader?name=[name].[ext]!../../manifest.json';
// eslint-disable-line import/no-unresolved
import styles from './app.css';

var PET_IDS = [
  {'label':'Random cat', 'key':'random-cat'},
  {'label':'Cats',     'key':'cats',   'rgItemType':List.ListProps.Type.TITLE},
  {'label':'Purr',     'key':'purr'},
  {'label':'Walk',     'key':'walk'},
  {'label':'Acrobat',  'key':'acrobat'},
  {'label':'Kittens',  'key':'kittens'},
  {'label':'Burp',     'key':'burp'},
  {'label':'Sleepy',   'key':'sleepy'},
  {'label':'Facepalm', 'key':'facepalm'},
  {'label':'Meal',     'key':'meal'},
  {'label':'Banjo',    'key':'banjo'},
  {'label':'Groom',    'key':'groom'},
  {'label':'Gift',     'key':'gift'},
  {'label':'Knead',    'key':'knead'},
  {'label':'Love',     'key':'love'},
  {'label':'Fly',      'key':'fly'},
  {'label':'Popcorn',  'key':'popcorn'},
  {'label':'Drink',    'key':'drink'}
];

var DEFAULT_PET_ID = 'purr';
var DEFAULT_RANDOM = 'none'
var DEFAULT_TITLE  = 'Pets';

/****************************************
config: {
  petId: <one of keys from PET_IDS>,
  title: "Text"
}
state: {
  isConfiguring: true/false,
  petId: <one of image keys from PET_IDS>,
  random: 'random-cat'/'none',
  title: "Text"
}
****************************************/

class Widget extends Component {
  static propTypes = {
    dashboardApi: PropTypes.object,
    registerWidgetApi: PropTypes.func
  };

  constructor(props) {
    super(props);
    const {registerWidgetApi, dashboardApi} = props;

    this.state = {
      isConfiguring: false,
      petId:  DEFAULT_PET_ID,
      random: DEFAULT_RANDOM,
      title:  DEFAULT_TITLE
    };

    registerWidgetApi({
      onConfigure: () => this.setState({isConfiguring: true}),
      onRefresh: () => this.updateRandomPet()
    });

    this.initialize(dashboardApi);
  }

  initialize(dashboardApi) {
    dashboardApi.readConfig().then(config => {
      if (!config) {
        return;
      }
      this.loadConfig(config);
    });
  }

  loadConfig = config => {
    var random = 'none';
    var petId = config.petId || config.catId || DEFAULT_PET_ID;
    if (petId === 'random' || petId === 'random-cat') {
      random = 'random-cat';
      // cats are from 2 to 17
      petId = PET_IDS[Math.floor(Math.random() * 16) + 2].key;
    }
    var title = config.title || DEFAULT_TITLE;
    this.setState({petId, random, title});
  }

  saveConfig = async () => {
    const {petId, random, title} = this.state;
    var configPetId = petId;
    if (random === 'random-cat') {
      configPetId = random;
    }
    await this.props.dashboardApi.storeConfig({petId: configPetId, title});
    this.setState({isConfiguring: false});
    this.updateRandomPet();
  };

  cancelConfig = async () => {
    this.setState({isConfiguring: false});
    await this.props.dashboardApi.exitConfigMode();
    this.initialize(this.props.dashboardApi);
  };

  updateRandomPet = () => {
    var {petId, random} = this.state;
    if (random === 'random-cat') {
      var newId = petId;
      while (newId === petId) {
        newId = PET_IDS[Math.floor(Math.random() * 16) + 2].key;
      }
      petId = newId
    }
    this.setState({petId});
  }

  changePetId = pet => {
    var petId = pet.key;
    if (petId === 'random-cat') {
      var random = petId;
      this.setState({random})
      this.updateRandomPet()
    } else {
      var random = 'none'
      this.setState({petId, random});
    }
  }

  renderConfiguration() {
    const {isConfiguring, petId, random, title} = this.state;
    var pet = PET_IDS.find((id) => id.key === random) ||
        PET_IDS.find((id) => id.key === petId);

    return (
      <div>
        <Select
          data={PET_IDS}
          selected={pet}
          onChange={this.changePetId}
          label="Choose pet"
        />
        <Panel>
          <Button primary onClick={this.saveConfig}>{'Save'}</Button>
          <Button onClick={this.cancelConfig}>{'Cancel'}</Button>
        </Panel>
      </div>
    );
  }

  render() {
    const {isConfiguring, petId, title} = this.state;

    if (isConfiguring) {
      return this.renderConfiguration();
    }

    const url = 'images\\' + petId + '.gif';

    return (
      <div className={styles['pet-image']}>
        <img className={styles['pet-image']} src={url}></img>
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
