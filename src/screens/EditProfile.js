import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import * as firebase from 'firebase';
import { EditUser } from '../components';
import languageJSON from '../common/language';

export default class EditProfilePage extends React.Component {
  constructor(props) {
    super(props);
  }

  // register button click after all validation
  async clickRegister(fname, lname, mobile, email, bank, password) {
    // do something with those parameters
    const regData = {
      firstName: fname,
      lastName: lname,
      mobile,
      email,
      bank,
    };

    const curuser = firebase.auth().currentUser.uid;
    const userData = firebase.database().ref(`users/${curuser}`).update(regData).then(() => {
      this.props.navigation.pop();
    });
  }

  render() {
    return (
      <View style={styles.containerView}>
        <EditUser
          complexity="complex"
          onPressRegister={(fname, lname, mobile, email, bank, password) => this.clickRegister(fname, lname, mobile, email, bank, password)}
          onPress={() => { this.clickRegister(); }}
          onPressBack={() => { this.props.navigation.goBack(); }}
        />
      </View>
    );
  }
}

// Screen Styling
const styles = StyleSheet.create({
  containerView: { flex: 1 },
  textContainer: { textAlign: 'center' },
});
