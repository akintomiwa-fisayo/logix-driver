import React from 'react';
import AppContainer from './src/navigation/AppNavigator';
import {Asset} from 'expo-asset';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import * as firebase from 'firebase'

var firebaseConfig = {
  apiKey: "AIzaSyBZruXB3WCRfV-W5dRqKKC1tWNQ6EUZrtk",
  authDomain: "gixtic.firebaseapp.com",
  databaseURL: "https://gixtic.firebaseio.com",
  projectId: "gixtic",
  storageBucket: "gixtic.appspot.com",
  messagingSenderId: "663980683493",
  appId: "1:663980683493:web:f96adcebdfe127ded0e40c",
  measurementId: "G-D2RQNJ3YW9"
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
        'ProductSans-Bold': require('./assets/fonts/ProductSans-Bold.ttf'),
        'ProductSans-Regular': require('./assets/fonts/ProductSans-Regular.ttf'),
        'ProductSans-Medium': require('./assets/fonts/ProductSans-Medium.ttf'),
        'Product-Sans-Light-300': require('./assets/fonts/Product-Sans-Light-300.ttf'),
<<<<<<< HEAD
=======
          
>>>>>>> caaa4786db3edc90c9735bf40ca83481b4da6d83
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