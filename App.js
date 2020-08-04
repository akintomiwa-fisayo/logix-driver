import React from 'react';
import AppContainer from './src/navigation/AppNavigator';
import {Asset} from 'expo-asset';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import * as firebase from 'firebase'

var firebaseConfig = {
  apiKey: "AIzaSyCgk2I3xIWYSd5LFa-bAR7651DlB_KUe08",
  authDomain: "logis-ef54f.firebaseapp.com",
  databaseURL: "https://logis-ef54f.firebaseio.com",
  projectId: "logis-ef54f",
  storageBucket: "logis-ef54f.appspot.com",
  messagingSenderId: "980070107115",
  appId: "1:980070107115:web:14d5eb8f9436fab67b7bae",
  measurementId: "G-KPM1YYDPL3"
};


firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {

  state = {
    assetsLoaded: false,
  };

  constructor(){
    super();
    console.disableYellowBox = true;
  }

//resource load at the time of app loading
  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/background.png'),
        require('./assets/images/logo.png'),
      ]),
      Font.loadAsync({
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
      }),
    ]);
  };
  
  render() {
    return (
        this.state.assetsLoaded ? 
          <AppContainer/>
          :         
          <AppLoading
            startAsync={this._loadResourcesAsync}
            onFinish={() => this.setState({ assetsLoaded: true })}
            onError={console.warn}
            autoHideSplash={true}
          />
    );
  }
}