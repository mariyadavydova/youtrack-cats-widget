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
  {'label':'Random cat (animated)', 'key':'random-cat'},
  {'label':'Random dog',            'key':'random-dog'},
  {'label':'Cats (animated)', 'key':'cats', 'rgItemType':List.ListProps.Type.TITLE},
  {'label':'Purr',     'key':'cats\\purr.gif'},
  {'label':'Walk',     'key':'cats\\walk.gif'},
  {'label':'Acrobat',  'key':'cats\\acrobat.gif'},
  {'label':'Kittens',  'key':'cats\\kittens.gif'},
  {'label':'Burp',     'key':'cats\\burp.gif'},
  {'label':'Sleepy',   'key':'cats\\sleepy.gif'},
  {'label':'Facepalm', 'key':'cats\\facepalm.gif'},
  {'label':'Meal',     'key':'cats\\meal.gif'},
  {'label':'Banjo',    'key':'cats\\banjo.gif'},
  {'label':'Groom',    'key':'cats\\groom.gif'},
  {'label':'Gift',     'key':'cats\\gift.gif'},
  {'label':'Knead',    'key':'cats\\knead.gif'},
  {'label':'Love',     'key':'cats\\love.gif'},
  {'label':'Fly',      'key':'cats\\fly.gif'},
  {'label':'Popcorn',  'key':'cats\\popcorn.gif'},
  {'label':'Drink',    'key':'cats\\drink.gif'},
  {'label':'Dogs', 'key':'dogs','rgItemType':List.ListProps.Type.TITLE},
  {'label':'Ball',      'key': 'dogs\\ball.png'},
  {'label':'Barbell',   'key': 'dogs\\barbell.png'},
  {'label':'Bark',      'key': 'dogs\\bark.png'},
  {'label':'Birthday',  'key': 'dogs\\birthday.png'},
  {'label':'Bows',      'key': 'dogs\\bows.png'},
  {'label':'Boxer',     'key': 'dogs\\boxer.png'},
  {'label':'Chihuahua', 'key': 'dogs\\chihuahua_bone.png'},
  {'label':'Cocktail',  'key': 'dogs\\cocktail.png'},
  {'label':'Corgi',     'key': 'dogs\\corgi.png'},
  {'label':'Dachshund', 'key': 'dogs\\dachshund.png'},
  {'label':'Dalmatian', 'key': 'dogs\\dalmatian.png'},
  {'label':'Einstein',  'key': 'dogs\\einstein.png'},
  {'label':'Fitness',   'key': 'dogs\\fitness.png'},
  {'label':'Haski',     'key': 'dogs\\haski.png'},
  {'label':'Hulahoop',  'key': 'dogs\\hulahoop.png'},
  {'label':'Labrador',  'key': 'dogs\\labrador.png'},
  {'label':'Pilot',     'key': 'dogs\\pilot.png'},
  {'label':'Poodle',    'key': 'dogs\\poodle.png'},
  {'label':'Pug',       'key': 'dogs\\pug.png'},
  {'label':'Rich',      'key': 'dogs\\rich.png'},
  {'label':'Russel',    'key': 'dogs\\russel.png'},
  {'label':'Sharpei',   'key': 'dogs\\sharpei.png'},
  {'label':'Shepherd',  'key': 'dogs\\shepherd.png'},
  {'label':'Stbernard', 'key': 'dogs\\stbernard.png'}
];

var DEFAULT_PET_ID = 'cats\\purr.gif';
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
    // Smooth migration from version 1.0.0
    var random = 'none';
    var petId = config.petId || config.catId || DEFAULT_PET_ID;
    if (petId === 'random' || petId === 'random-cat') {
      random = 'random-cat';
      // cats are from 3 to 18
      petId = PET_IDS[Math.floor(Math.random() * 16) + 3].key;
    } else if (petId === 'random-dog') {
      random = 'random-dog';
      // cats are from 20 to 43
      petId = PET_IDS[Math.floor(Math.random() * 24) + 20].key;
    } else if (petId.indexOf('.') === -1) {
      petId = 'cats\\' + petId + '.gif';
    }
    var title = config.title || DEFAULT_TITLE;
    this.setState({petId, random, title});
  }

  saveConfig = async () => {
    const {petId, random, title} = this.state;
    var configPetId = petId;
    if (random === 'random-cat' || random === 'random-dog') {
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
        newId = PET_IDS[Math.floor(Math.random() * 16) + 3].key;
      }
      petId = newId
    } else if (random === 'random-dog') {
      var newId = petId;
      while (newId === petId) {
        newId = PET_IDS[Math.floor(Math.random() * 24) + 20].key;
      }
      petId = newId
    }
    this.setState({petId});
  }

  changePetId = pet => {
    var petId = pet.key;
    if (petId === 'random-cat' || petId === 'random-dog') {
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

    const url = 'images\\' + petId;

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
