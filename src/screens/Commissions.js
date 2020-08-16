import React from 'react';
import { Header } from 'react-native-elements';
import { colors } from '../common/theme';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  Image
} from 'react-native';
var { width } = Dimensions.get('window');
var { height } = Dimensions.get('window');
import * as firebase from 'firebase';
import languageJSON from '../common/language';
import { Colors } from 'react-native/Libraries/NewAppScreen'; 
import { getRelativeTime } from '../common/functions';
export default class CommissionsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      referees: []
    }

  }
  
  componentDidMount(){
    let currentUserData = {};
    const currentUser = firebase.auth().currentUser.uid;
    const currentUserLink=firebase.database().ref('users/'+currentUser);
    currentUserLink.on('value', data => {
      currentUserData = data.val()
    })
  
    const users = firebase.database().ref('users/');
    users.on('value', usersData => {
      const referees = [];
      usersData.forEach((user)=>{
        const userData = user.val();
        if(userData && userData.signupViaReferral && userData.referarDetails.refferalId === currentUserData.refferalId){
          referees.push(userData)
        }
      })
      
      
      this.setState({referees});
    })
    console.log("users data", currentUserData)
    
  }
  
  render() {
    const {state}=this;

    // return "Your In commisions page"

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
            onPress: () => { this.props.navigation.toggleDrawer(); }
          }}
          centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.my_commissions_menu}</Text>}
          containerStyle={styles.headerStyle}
          innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
        />

        <View>
          <ScrollView>
          {state.referees && state.referees.length > 0 ? state.referees.map((referee)=> (
            <View style={styles.referee} key={referee.email}>
              <View style={styles.refereeThumb}>
                <Image
                  style={styles.refereeThumbImage}
                  // source={userPhoto == null?require('../../assets/images/profilePic.png'):{uri:userPhoto}}
                  source={referee.profile_image || referee.licenseImage  ? referee.profile_image || referee.licenseImage : require('../../assets/images/profilePic.png')}

                />
              </View>
              <View style={styles.refereeInfo}>
                <Text style={styles.refereeInfoName}>{referee.firstName} {referee.lastName}</Text>
                <Text style={styles.refereeInfoAccType}>{referee.usertype}</Text>
                <Text style={styles.refereeInfoDate}>{getRelativeTime(referee.createdAt, false, "text")}</Text>
              </View>
            </View>
          )) : <View style={{flex:1, justifyContent:"center", alignItems:"center", height: height}}><Text style={styles.addressViewTextStyle}>{languageJSON.no_commission}</Text></View>}
          </ScrollView>
        </View>
      </View>

    );
  }

}

// const thumbWidth =  width * 0.15
const thumbWidth = 60
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.WHITE,
    //marginTop: StatusBar.currentHeight,
  },
  headerStyle: {
    backgroundColor: colors.GREY.default,
    borderBottomWidth: 0
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily: 'ProductSans-Bold',
    fontSize: 20
  },
  referee: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    flex: 1,
    padding: 10,
    borderBottomColor: colors.GREY.border,
    borderBottomWidth: 1,
  },
  refereeThumb: {
    width: thumbWidth,
    borderRadius: 99999,
    overflow: "hidden"
  },
  refereeThumbImage: {
    width: "100%",
    height: thumbWidth,
  },
  addressViewTextStyle: {
    color: colors.GREY.secondary,
    fontSize: 15,
    marginLeft:15, 
    lineHeight: 24
    ,flexWrap: "wrap",
},
  refereeInfo: {
    flex: 1,
    padding: 0,
    paddingLeft: 10,
    justifyContent: "center"
  },
  refereeInfoName: {
    fontSize: 18,
    textTransform: "capitalize"
  },
  refereeInfoAccType: {
    textTransform: "capitalize"
  },
  refereeInfoDate: { 
    color: colors.GREY.secondary, 
    margin: 0 
  }
})