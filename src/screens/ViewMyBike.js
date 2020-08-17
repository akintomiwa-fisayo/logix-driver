import React from 'react';
import { Header, Icon } from 'react-native-elements';
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
            icon: 'md-menu',
            type: 'ionicon',
            color: colors.WHITE,
            size: 30,
            component: TouchableWithoutFeedback,
            onPress: () => { this.props.navigation.toggleDrawer(); },
          }}
          centerComponent={<Text style={styles.headerTitleStyle}>firstName lastName</Text>}
          containerStyle={styles.headerStyle}
          innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
        />

        <View>
          <ScrollView style={{ height, position: 'relative' }}>
            {/* {state.referees.map((referee)=> ( */}
            <View
              style={styles.referee}
              key={referee.email}
              onPress={() => {
                this.props.navigation.navigate('MyBikes');
              }}
            >
              <View style={styles.refereeThumb}>
                <Image
                  style={styles.refereeThumbImage}
                  // source={userPhoto == null?require('../../assets/images/profilePic.png'):{uri:userPhoto}}
                  source={referee.profile_image || referee.licenseImage ? referee.profile_image || referee.licenseImage : require('../../assets/images/profilePic.png')}

                />
              </View>
              <View style={styles.refereeInfo}>
                <Text style={styles.refereeInfoName}>firstName lastName</Text>
              </View>
              <View style={{ paddingLeft: 10 }}>
                <Text style={{
                  width: 15,
                  height: 15,
                  backgroundColor: colors.GREY.default,
                  borderWidth: 2,
                  borderColor: colors.GREY.default,
                  borderRadius: 9999,
                }}
                />
              </View>
            </View>
            {/* ))} */}
          </ScrollView>
          <TouchableOpacity
            style={styles.CallfloatButtonStyle}
            onPress={() => { this.props.navigation.navigate('AddBike'); }}
          >
            <Icon
              name="md-add"
              type="ionicon"
                // icon: 'chat', color: '#fff',
              size={30}
              color={colors.WHITE}
            />
          </TouchableOpacity>
        </View>
      </View>

    );
  }
}

// const thumbWidth =  width * 0.15
const thumbWidth = 60;
const styles = StyleSheet.create({
  CallfloatButtonStyle: {
    borderWidth: 1,
    borderColor: colors.BLACK,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    bottom: 100,
    right: 10,
    height: 60,
    backgroundColor: colors.BLACK,
    borderRadius: 30,
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
  },
  referee: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    flex: 1,
    padding: 10,
    borderBottomColor: colors.GREY.border,
    borderBottomWidth: 1,
  },
  refereeThumb: {
    width: thumbWidth,
    borderRadius: 99999,
    overflow: 'hidden',
  },
  refereeThumbImage: {
    width: '100%',
    height: thumbWidth,
  },
  refereeInfo: {
    flex: 1,
    padding: 0,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  refereeInfoName: {
    fontSize: 18,
    textTransform: 'capitalize',
  },
  refereeInfoAccType: {
    textTransform: 'capitalize',
  },
  refereeInfoDate: {
    color: colors.GREY.secondary,
    margin: 0,
  },
});
