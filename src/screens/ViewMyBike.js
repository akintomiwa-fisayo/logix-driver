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
  Alert,
} from 'react-native';
import * as firebase from 'firebase';
//import { Colors } from 'react-native/Libraries/NewAppScreen';
import languageJSON from '../common/language';
import { colors } from '../common/theme';
import { getRelativeTime } from '../common/functions';
import { MapComponent } from '../components';

const { width, height } = Dimensions.get('window');

export default class ManageBikes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rider: this.props.navigation.getParam('rider'),
    };

    console.log('the rider is : ', this.state.rider);
    this.deleteRider = this.deleteRider.bind(this);
  }

  deleteRider() {
    Alert.alert(
      'Delete Rider',
      'Are you sure you want to delete this rider',
      [
        {
          text: 'Cancel',
          // onPress: () => console.log('Cancel Pressed'),
          // style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            firebase.database().ref(`users/${this.state.rider.id}`).remove().then(() => {
              this.props.navigation.goBack();
            });
          },
        },
      ],
    );
  }

  render() {
    const { rider } = this.state;
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
          centerComponent={<Text style={styles.headerTitleStyle}>{rider.firstName} {rider.lastName}</Text>}
          containerStyle={styles.headerStyle}
          innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
        />

        <View>
          <ScrollView style={{ height, position: 'relative' }}>
            <TouchableOpacity style={styles.userDisplay}>
              <Image
                style={styles.userDisplayImage}
                  // source={userPhoto == null?require('../../assets/images/profilePic.png'):{uri:userPhoto}}
                source={{ uri: rider.profile_image || rider.licenseImage ? rider.profile_image || rider.licenseImage : require('../../assets/images/profilePic.png') }}
              />
            </TouchableOpacity>
            <View style={styles.info}>
              <Text style={styles.infoLabel}>First Name : </Text>
              <Text style={styles.infoValue}>{rider.firstName}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoLabel}>Last Name : </Text>
              <Text style={styles.infoValue}>{rider.lastName}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoLabel}>Email : </Text>
              <Text style={styles.infoValue}>{rider.email}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoLabel}>Mobile : </Text>
              <Text style={styles.infoValue}>{rider.mobile}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoLabel}>Vehicle Name : </Text>
              <Text style={styles.infoValue}>{rider.vehicleModel}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoLabel}>Vehicle Number : </Text>
              <Text style={styles.infoValue}>{rider.vehicleNumber}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoLabel}>Is Approved : </Text>
              <Text style={styles.infoValue}>{rider.approved ? 'Yes' : 'No'}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoLabel}>Is Active : </Text>
              <Text style={styles.infoValue}>{rider.driverActiveStatus ? 'Yes' : 'No'}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoLabel}>Created : </Text>
              <Text style={{ ...styles.infoValue, textTransform: 'capitalize' }}>{getRelativeTime(rider.createdAt)}</Text>
            </View>

            {/* <MapComponent
              mapStyle={styles.map}
              mapRegion={this.state.region}
              markerCord={this.state.region}
            /> */}

            <View style={{ padding: 10, marginTop: 20 }}>
              <Button
                onPress={() => { this.deleteRider(); }}
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
