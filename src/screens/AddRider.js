import React from 'react';
import { Header, Icon } from 'react-native-elements';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as firebase from 'firebase';
import languageJSON from '../common/language';
import AddRider from '../components/AddRider';
import { colors } from '../common/theme';

export default class AddRiderToManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  // register button click after all validation
  async clickRegister(fname, lname, mobile, email, password, vehicleNum, vehicleName, image) {
    const regData = {
      firstName: fname,
      lastName: lname,
      mobile,
      email,
      vehicleNumber: vehicleNum,
      vehicleModel: vehicleName,
      licenseImage: image,
      usertype: 'driver',
      manager: firebase.auth().currentUser.uid,
      approved: false,
      queue: false,
      createdAt: new Date().toISOString(),
    };

    const firebaseConfig = {
      apiKey: 'AIzaSyBZruXB3WCRfV-W5dRqKKC1tWNQ6EUZrtk',
      authDomain: 'gixtic.firebaseapp.com',
      databaseURL: 'https://gixtic.firebaseio.com',
      projectId: 'gixtic',
      storageBucket: 'gixtic.appspot.com',
      messagingSenderId: '663980683493',
      appId: '1:663980683493:web:f96adcebdfe127ded0e40c',
      measurementId: 'G-D2RQNJ3YW9',
    };

    const secondApp = firebase.initializeApp(firebaseConfig, 'second');

    secondApp.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
      if (newUser) {
        secondApp.auth().currentUser.updateProfile({
          displayName: `${regData.firstName} ${regData.lastName}`,
        }).then(() => {
          secondApp.database().ref('users/').child(secondApp.auth().currentUser.uid).set(regData)
            .then(() => {
              secondApp.auth().signOut();
              this.props.navigation.goBack();
              alert(languageJSON.account_successful_done);
            });
        });
      }
    }).catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });

    this.setState({ loading: true }, () => {
      this.props.navigation.navigate('Login');
    });
  }

  // upload of picture
  async uploadmultimedia(fname, lname, mobile, email, password, vehicleNum, vehicleName, url) {
    console.log(url);
    this.setState({ loading: true });
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed')); // error occurred, rejecting
      };
      xhr.responseType = 'blob'; // use BlobModule's UriHandler
      xhr.open('GET', url, true); // fetch the blob from uri in async mode
      xhr.send(null); // no initial data
    });

    if ((blob.size / 1000000) > 2) {
      this.setState({ loading: false }, () => { alert(languageJSON.image_size_error); });
    } else {
      const timestamp = new Date().getTime();
      const imageRef = firebase.storage().ref().child(`users/driver_licenses/${timestamp}/`);
      return imageRef.put(blob).then(() => {
        blob.close();
        return imageRef.getDownloadURL();
      }).then((dwnldurl) => {
        console.log(dwnldurl);
        this.clickRegister(fname, lname, mobile, email, password, vehicleNum, vehicleName, dwnldurl);
      });
    }
  }

  render() {
    return (
      <View style={styles.mainView}>
        <Header
          backgroundColor={colors.GREY.default}
          leftComponent={{
            icon: 'md-menu',
            type: 'ionicon',
            color: colors.WHITE,
            size: 30,
            component: TouchableWithoutFeedback,
            onPress: () => { this.props.navigation.toggleDrawer(); },
          }}
          centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.add_bike_menu}</Text>}
          containerStyle={styles.headerStyle}
          innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
        />
        <AddRider
          complexity="complex"
          onPressRegister={(fname, lname, mobile, email, password, vehicleNum, vehicleName, image) => this.uploadmultimedia(fname, lname, mobile, email, password, vehicleNum, vehicleName, image)}
          onPressBack={() => { this.props.navigation.goBack(); }}
          loading={this.state.loading}
        />
      </View>
    );
  }
}

// Screen Styling
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.WHITE,
    color: 'red',
    // marginTop: StatusBar.currentHeight,
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily: 'ProductSans-Bold',
    fontSize: 20,
  },
  textContainer: { textAlign: 'center' },
});
