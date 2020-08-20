import React from 'react';
import {
  Header,
  Button,
  Icon,
} from 'react-native-elements';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as firebase from 'firebase';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import languageJSON from '../common/language';
import { colors } from '../common/theme';
import { getRelativeTime } from '../common/functions';
import { MapComponent } from '../components';

const { width, height } = Dimensions.get('window');

export default class ManageBikes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      referees: [],
    };
  }

  componentDidMount() {
    let currentUserData = {};
    const currentUser = firebase.auth().currentUser.uid;
    const currentUserLink = firebase.database().ref(`users/${currentUser}`);
    currentUserLink.on('value', (data) => {
      currentUserData = data.val();
    });

    const users = firebase.database().ref('users/');
    users.on('value', (usersData) => {
      const referees = [];
      usersData.forEach((user) => {
        const userData = user.val();
        if (userData && userData.signupViaReferral && userData.referarDetails.refferalId === currentUserData.refferalId) {
          referees.push(userData);
        }
      });

      this.setState({ referees });
    });
    console.log('users data', currentUserData);
  }

  render() {
    const { state } = this;
    const referee = {};
    return (

      <View style={styles.mainView}>
        <Header
          backgroundColor={colors.GREY.default}
          leftComponent={{
            icon: 'ios-arrow-back',
            type: 'ionicon',
            color: colors.WHITE,
            size: 30,
            component: TouchableWithoutFeedback,
            onPress: () => { this.props.navigation.goBack(); },
          }}
          centerComponent={<Text style={styles.headerTitleStyle}>firstName lastName</Text>}
          containerStyle={styles.headerStyle}
          innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
        />

        <View>
          <ScrollView style={{ height, position: 'relative' }}>
            <TouchableOpacity style={styles.userDisplay}>
              <Image
                style={styles.userDisplayImage}
                  // source={userPhoto == null?require('../../assets/images/profilePic.png'):{uri:userPhoto}}
                source={referee.profile_image || referee.licenseImage ? referee.profile_image || referee.licenseImage : require('../../assets/images/profilePic.png')}
              />
            </TouchableOpacity>
            <View style={styles.info}>
              <Text style={styles.infoLabel}>label : </Text>
              <Text style={styles.infoValue}>firstName lastName</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoLabel}>label : </Text>
              <Text style={styles.infoValue}>firstName lastName</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoLabel}>label : </Text>
              <Text style={styles.infoValue}>firstName lastName</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoLabel}>label : </Text>
              <Text style={styles.infoValue}>firstName lastName</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoLabel}>label : </Text>
              <Text style={styles.infoValue}>firstName lastName</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoLabel}>label : </Text>
              <Text style={styles.infoValue}>firstName lastName</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoLabel}>label : </Text>
              <Text style={styles.infoValue}>firstName lastName</Text>
            </View>

            {/* <MapComponent
              mapStyle={styles.map}
              mapRegion={this.state.region}
              markerCord={this.state.region}
            /> */}

            <View style={{ padding: 10, marginTop: 20 }}>
              <Button
                onPress={() => { this.onPressRegister(); }}
                title={languageJSON.delete}
                buttonStyle={{ backgroundColor: '#ff3b3b' }}
              />
            </View>

          </ScrollView>
        </View>
      </View>

    );
  }
}

// const thumbWidth =  width * 0.15
const thumbWidth = 120;
const styles = StyleSheet.create({
  map: {
    flex: 1,
    borderRadius: 10,
    ...StyleSheet.absoluteFillObject,
  },
  mainView: {
    flex: 1,
    backgroundColor: colors.WHITE,
    color: 'red',
    // marginTop: StatusBar.currentHeight,
  },
  headerStyle: {
    backgroundColor: colors.GREY.default,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily: 'ProductSans-Bold',
    fontSize: 20,
    textTransform: 'capitalize',
  },
  userDisplay: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },

  userDisplayImage: {
    width: thumbWidth,
    height: thumbWidth,
    borderRadius: 99999,
    overflow: 'hidden',
    margin: 'auto',
  },

  info: {
    flexDirection: 'row',
    padding: 10,
  },

  infoLabel: {
    marginRight: 10,
    fontWeight: '700',
  },
});
