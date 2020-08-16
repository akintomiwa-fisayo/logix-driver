import React from 'react';
import { Text, View, Dimensions, StyleSheet, FlatList, Image, Linking, TouchableOpacity, AsyncStorage } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import SideMenuHeader from './SideMenuHeader';

import { NavigationActions } from 'react-navigation';
import { colors } from '../common/theme';
import * as firebase from 'firebase'
import languageJSON from '../common/language';

var { height, width } = Dimensions.get('window');

<<<<<<< HEAD
export default class SideMenu extends React.Component {
  constructor(props) {
    super(props);
=======
export default class SideMenu extends React.Component{
    constructor(props){
        super(props);
     
        this.state = {
            heightIphoneSix : false,
            heightIphoneFive: false,
            heightIphoneX :false,
            heightIphoneXsMax :false,
            sideMenuList: [
                {key: 1, name: languageJSON.booking_request, navigationName: 'DriverTripAccept', icon: 'location-arrow', type: 'font-awesome', child: 'firstChild'},
                {key: 2, name: languageJSON.profile_settings, navigationName: 'Profile', icon: 'ios-person-add', type: 'ionicon', child: 'secondChild'},
                {key: 4, name: languageJSON.incomeText, navigationName: 'MyEarning', icon: 'ios-wallet', type: 'ionicon', child: 'ninethChild'},
                {key: 3, name: languageJSON.my_bookings, navigationName: 'RideList', icon: 'motorcycle', type: 'font-awesome', child: 'thirdChild'},
                {key: 5, name: languageJSON.my_commisions, navigationName: 'MyCommissions', icon: 'md-wallet', type: 'ionicon', child: 'thirdChild'},
                {key: 6, name: languageJSON.my_ref, navigationName: 'RideList', icon: 'md-pulse', type: 'ionicon', child: 'thirdChild'},
                //{key: 9, name: languageJSON.about_us, navigationName: Linking.canOpenURL('https://api.whatsapp.com/send?phone=2348022231913&amp;text=Hello%20Linkinda%21'), icon: 'md-chatbubbles', type: 'ionicon', child: 'ninethChild'},
                {key: 10, name: languageJSON.sign_out, icon: 'sign-out', type: 'font-awesome', child: 'lastChild'}
            ],
            profile_image:null
        }
        
    }
>>>>>>> caaa4786db3edc90c9735bf40ca83481b4da6d83

    this.state = {
      heightIphoneSix: false,
      heightIphoneFive: false,
      heightIphoneX: false,
      heightIphoneXsMax: false,
      sideMenuList: [
        { key: 1, name: languageJSON.booking_request, navigationName: 'DriverTripAccept', icon: 'location-arrow', type: 'font-awesome', child: 'firstChild' },
        { key: 2, name: languageJSON.profile_settings, navigationName: 'Profile', icon: 'ios-person-add', type: 'ionicon', child: 'secondChild' },
        { key: 4, name: languageJSON.incomeText, navigationName: 'MyEarning', icon: 'ios-wallet', type: 'ionicon', child: 'ninethChild' },
        { key: 3, name: languageJSON.my_bookings, navigationName: 'RideList', icon: 'motorcycle', type: 'font-awesome', child: 'thirdChild' },
        { key: 5, name: languageJSON.my_commisions, navigationName: 'MyCommissions', icon: 'md-wallet', type: 'ionicon', child: 'thirdChild' },
        { key: 6, name: languageJSON.my_ref, navigationName: 'RideList', icon: 'md-pulse', type: 'ionicon', child: 'thirdChild' },
        //{key: 9, name: languageJSON.about_us, navigationName: Linking.canOpenURL('https://api.whatsapp.com/send?phone=2348022231913&amp;text=Hello%20Linkinda%21'), icon: 'md-chatbubbles', type: 'ionicon', child: 'ninethChild'},
        { key: 10, name: languageJSON.sign_out, icon: 'sign-out', type: 'font-awesome', child: 'lastChild' }
      ],
      profile_image: null
    }

  }

  componentDidMount() {
    this.heightReponsive();
    var curuser = firebase.auth().currentUser.uid;
    const userData = firebase.database().ref('users/' + curuser);
    userData.on('value', currentUserData => {
      if (currentUserData.val()) {
        this.setState(currentUserData.val(), (res) => {
          if (currentUserData.val().driverActiveStatus == undefined) {
            userData.update({
              driverActiveStatus: true
            })
          }
        });
      }
    })
  }

  //check for device height(specially iPhones)
  heightReponsive() {
    if (height == 667 && width == 375) {
      this.setState({ heightIphoneSix: true })
    }
    else if (height == 568 && width == 320) {
      this.setState({ heightIphoneFive: true })
    }
    else if (height == 375 && width == 812) {
      this.setState({ heightIphoneX: true })
    }
    else if (height == 414 && width == 896) {
      this.setState({ heightIphoneXsMax: true })
    }
  }

  //navigation to screens from side menu
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  //sign out and clear all async storage
  async signOut() {
    firebase.auth().signOut();
  }

  render() {
    return (
      <View style={styles.mainViewStyle}>
        <SideMenuHeader onPress={this.navigateToScreen("Profile")} headerStyle={styles.myHeader} userPhoto={this.state.profile_image} userEmail={this.state.email} userName={this.state.firstName + ' ' + this.state.lastName}></SideMenuHeader>

        <View style={styles.compViewStyle}>
          <View style={[styles.vertialLine, { height: (width <= 320) ? width / 1.53 : width / 1.68 }]}></View>
          <FlatList
            data={this.state.sideMenuList}
            keyExtractor={(item, index) => index.toString()}
            style={{ marginTop: 5 }}
            bounces={false}
            renderItem={({ item, index }) =>
              <TouchableOpacity
                onPress={
                  (item.name == languageJSON.sign_out) ? () => this.signOut() :
                    this.navigateToScreen(item.navigationName)
                }
                style={
                  [styles.menuItemView,
                  { marginTop: (index == this.state.sideMenuList.length - 1) ? width / 45 : 0 }
                  ]
                }>
                <View style={styles.viewIcon}>
                  <Icon
                    name={item.icon}
                    type={item.type}
                    color={colors.ICONC}
                    size={25}
                    containerStyle={styles.iconStyle}
                  />
                </View>
                <Text style={styles.menuName}>{item.name}</Text>
              </TouchableOpacity>

            } />
        </View>
        <View >


          <TouchableOpacity
            style={styles.floatButtonStyle}
            onPress={() => Linking.openURL('https://api.whatsapp.com/send?phone=2348022231913&amp;text=Hello%20Gixtic%21')}
          >
            <Icon
              name="logo-whatsapp"
              type="ionicon"
              // icon: 'chat', color: '#fff',
              size={30}
              color={colors.ICONC}
            />
            <Text style={styles.supportName}>Support</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => {
              this.props.navigation.navigate('MyBikes')
            }}
            title="Manage Bikes"
            // loading={loading}
            titleStyle={styles.buttonTitle}
            buttonStyle={styles.registerButton}
          />
        </View>
      </View>
    )
  }
}
//style for this component
const styles = StyleSheet.create({
  myHeader: {
    marginTop: 0,
  },
  vertialLine: {
    width: 1,
    backgroundColor: colors.WHITE,
    position: 'absolute',
    left: 22,
    top: 24,

  },
  menuItemView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 18,
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  floatButtonStyle: {
    borderWidth: 1,
    borderColor: colors.GREY.default,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    position: "absolute",
    bottom: 10,
    left: 10,
    height: 60,
    backgroundColor: colors.GREY.default,
    borderRadius: 30
  },
  CallfloatButtonStyle: {
    borderWidth: 1,
    borderColor: colors.GREY.default,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    position: "absolute",
    bottom: 80,
    left: 10,
    height: 60,
    backgroundColor: colors.GREY.default,
    borderRadius: 30
  },
  viewIcon: {
    width: 35,
    height: 24,
    backgroundColor: colors.TRANSPARENT,
    justifyContent: 'center',
    alignItems: 'center',
    left: 1,

  },
  menuName: {
    color: colors.BLACK,
    fontWeight: 'normal',
    marginLeft: 8,
    width: "100%"
  },
  supportName: {
    color: colors.BLACK,
    fontWeight: 'normal',
    marginLeft: 15,
    top: 25,
    width: 200,
    position: "absolute",
    left: 50
  },
  mainViewStyle: {
    backgroundColor: colors.TRANSPARENT,
    height: '100%'
  },
  compViewStyle: {
    position: 'relative',
    flex: 3
  },
  iconStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.TRANSPARENT,
  },
  registerButton: {
    backgroundColor: colors.GREY.default,
    height: 50,
    borderColor: colors.TRANSPARENT,
    borderWidth: 0,
    borderRadius: 0,
  }
})