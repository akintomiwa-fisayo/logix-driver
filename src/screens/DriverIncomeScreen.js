import React from 'react';
import { Header, Input, Button } from 'react-native-elements';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  LayoutAnimation,
} from 'react-native';

import * as firebase from 'firebase';
import Axios from 'axios';
import { paystack_secret_key,paystack_public_key } from '../common/key';
import { colors } from '../common/theme';
import languageJSON from '../common/language';
import { Currency } from '../common/CurrencySymbol';

const { width } = Dimensions.get('window');

export default class DriverIncomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bank: false,
      amount: '',
      amountError: false,
      submitting: false,
      showCashOutForm: false,
    };
  }

  componentDidMount() {
    const userUid = firebase.auth().currentUser.uid;
    firebase.database().ref(`users/${userUid}/`).once('value', (userData) => {
      this.setState({
        bank: userData.val().bank,
      });
    });

    const ref = firebase.database().ref('bookings/');
    ref.once('value', (allBookings) => {
      if (allBookings.val()) {
        const data = allBookings.val();
        const myBookingarr = [];
        for (const k in data) {
          if (data[k].driver == userUid) {
            data[k].bookingKey = k;
            myBookingarr.push(data[k]);
          }
        }

        if (myBookingarr) {
          this.setState({ myBooking: myBookingarr }, () => {
            this.eraningCalculation();
            // console.log('this.state.myBooking ==>',this.state.myBooking)
          });
        }
      }
    });
  }

  eraningCalculation() {
    if (this.state.myBooking) {
      const today = new Date();
      let tdTrans = 0;
      let mnTrans = 0;
      let totTrans = 0;
      for (let i = 0; i < this.state.myBooking.length; i++) {
        const { tripdate, driver_share } = this.state.myBooking[i];
        const tDate = new Date(tripdate);
        if (driver_share != undefined) {
          console.log(driver_share);
          if (tDate.getDate() === today.getDate() && tDate.getMonth() === today.getMonth()) {
            tdTrans += driver_share;
          }
          if (tDate.getMonth() === today.getMonth() && tDate.getFullYear() === today.getFullYear()) {
            mnTrans += driver_share;
          }

          totTrans += driver_share;
        }
      }
      this.setState({
        totalEarning: totTrans,
        today: tdTrans,
        thisMothh: mnTrans,
      });
      // console.log('today- '+tdTrans +' monthly- '+ mnTrans + ' Total-'+ totTrans);
    }
  }

  cashOutForm() {
    const { submitting, amount, bank } = this.state;

    return (
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'rgba(0, 0, 0, .8)',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            width: '80%',
            padding: 20,
          }}
        >
          <Text style={{ ...styles.text2 }}>The inputted amount wll be transferred to you bank account:</Text>
          <Text style={{ ...styles.text2 }}>Bank: {bank.name || ''}</Text>
          <Text style={{ ...styles.text2, marginBottom: 15 }}>Account Number: {bank.accountNumber || ''}</Text>

          <Input
            ref={(input) => (this.amountInput = input)}
            editable
            underlineColorAndroid={colors.TRANSPARENT}
            placeholder={languageJSON.amount}
            placeholderTextColor={colors.GREY.secondary}
            value={amount}
            keyboardType="number-pad"
            inputStyle={styles.inputTextStyle}
            onChangeText={(text) => { this.setState({ amount: text, amountError: false }); }}
            errorMessage={this.state.amountError || null}
            secureTextEntry={false}
            blurOnSubmit
            onSubmitEditing={() => { this.processPayment(); }}
            errorStyle={styles.errorMessageStyle}
            inputContainerStyle={{
              width: '100%',
              paddingLeft: 10,
              paddingRight: 10,
            }}
            containerStyle={{ paddingLeft: 0, paddingRight: 0 }}
          />

          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

            <Button
              onPress={() => {
                this.setState({
                  showCashOutForm: false,
                });
              }}
              title={languageJSON.cancel}
              buttonStyle={styles.cashoutButton}
            />
            <Button
              onPress={() => { this.processPayment(); }}
              title={languageJSON.process_payment}
              buttonStyle={{
                ...styles.cashoutButton,
                opacity: submitting ? 0.4 : 1,
                backgroundColor: colors.GREEN.default,
              }}
            />
          </View>
        </View>
      </View>

    );
  }

  processPayment() {
    const { amount, bank, submitting } = this.state;
    if (bank && !submitting) {
      LayoutAnimation.easeInEaseOut();
      if (amount.length > 0 && !isNaN(amount) && amount > 0) {
        const userUid = firebase.auth().currentUser.uid;
        const ref = firebase.database().ref(`users/${userUid}`);
        this.setState({
          submitting: true,
        });

        ref.once('value', (user) => {
          if (user.val().walletBalance < amount) {
            this.setState({
              submitting: false,
              amountError: 'Your wallet balance is less than the amount you want to transfer',
            });
            this.amountInput.shake();
          } else {
            this.setState({ amountError: false });
            // process the transfer
            // first validate the account details
            Axios({
              url: `https://api.paystack.co/bank/resolve?account_number=${bank.accountNumber}&bank_code=${bank.code}`,
              headers: {
                Authorization: `Bearer ${paystack_secret_key}`,
              },
            }).then((res) => {
            // Create transfer recipient
              console.log('PAYSTACK VALIDATE ACCOUNT', res.data.data);
              Axios({
                url: 'https://api.paystack.co/transferrecipient',
                method: 'POST',
                data: JSON.stringify({
                  type: bank.type,
                  name: 'test name',
                  account_number: bank.accountNumber,
                  bank_code: bank.code,
                // currency: 'NGN',
                }),
                headers: {
                  Authorization: `Bearer ${paystack_secret_key}`,
                  'Content-Type': 'application/json',
                },
              }).then((resp) => {
                console.log('CREATE TRANSFER recipient RES', resp.data.data);

                // Initiate  transfer
                Axios({
                  url: 'https://api.paystack.co/transfer',
                  method: 'POST',
                  data: JSON.stringify({
                    source: 'balance',
                    amount: parseInt(`${amount}00`, 10),
                    recipient: resp.data.data.recipient_code,
                    reason: 'Credit cashout',
                  }),
                  headers: {
                    Authorization: `Bearer ${paystack_secret_key}`,
                    'Content-Type': 'application/json',
                  },
                }).then((response) => {
                  console.log('TRANSFER DONE SUCCESSFUL', response);
                  // If all goes well
                  alert('Transfer successful');
                }).catch((error) => {
                  alert('Something went wrong, please try again');
                  console.log('TRANSFER NOT SUCCESSFUL', error);
                }).finally(() => {
                  this.setState({
                    submitting: false,
                  });
                });
              }).catch((error) => {
                console.log('CATCH AN ERROR OHHHHHHHHHHHHHHHHHHHHHHHHH', error);
              }).finally(() => {
                this.setState({
                  submitting: false,
                });
              });
            }).catch((error) => {
              const { status } = error.response;
              if (status === 400 || status === 422) {
                alert('Invalid account details ');
              } else {
                console.log('WEID ERROR', error);
              }
            }).finally(() => {
              this.setState({
                submitting: false,
              });
            });
          }
        });
      } else {
        this.setState({ amountError: 'Please input a valid amount' });
        this.amountInput.shake();
      }
    }
  }

  render() {
    const { showCashOutForm } = this.state;
    return (

      <View style={styles.mainView}>
        <Header
          backgroundColor={colors.GREY.default}
          leftComponent={{
            icon: 'md-menu', type: 'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback, onPress: () => { this.props.navigation.toggleDrawer(); },
          }}
          centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.incomeText}</Text>}
          containerStyle={styles.headerStyle}
          innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
        />
        <View style={styles.bodyContainer}>
          <View style={styles.todaysIncomeContainer}>
            <Text style={styles.todayEarningHeaderText}>{languageJSON.today}</Text>
            <Text style={styles.todayEarningMoneyText}>{Currency}{this.state.today ? parseFloat(this.state.today).toFixed(2) : '0'}</Text>
          </View>
          <View style={styles.listContainer}>
            <View style={styles.totalEarning}>
              <Text style={styles.todayEarningHeaderText2}>{languageJSON.thismonth}</Text>
              <Text style={styles.todayEarningMoneyText2}>{Currency}{this.state.thisMothh ? parseFloat(this.state.thisMothh).toFixed(2) : '0'}</Text>
            </View>
            <View style={styles.thismonthEarning}>
              <Text style={styles.todayEarningHeaderText2}>{languageJSON.totalearning}</Text>
              <Text style={styles.todayEarningMoneyText2}>{Currency}{this.state.totalEarning ? parseFloat(this.state.totalEarning).toFixed(2) : '0'}</Text>
            </View>
          </View>

          <Button
            onPress={() => { this.setState({ showCashOutForm: true }); }}
            title={languageJSON.cashout}
            titleStyle={styles.buttonTitle}
            buttonstyle={{
              ...styles.todayEarningHeaderText2,
              height: 50,
              backgroundColor: '#f09800',
              borderRadius: 6,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              // paddingTop: 45,
            }}
          />
        </View>
        { showCashOutForm && this.cashOutForm() }
      </View>

    );
  }
}
const styles = StyleSheet.create({
  cashoutButton: {
    backgroundColor: colors.GREY.secondary,
    borderColor: colors.TRANSPARENT,
    borderWidth: 0,
    marginTop: 20,
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 20,
    // width: '100%',
  },
  text2: {
    color: '#666',
  },
  mainView: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  headerStyle: {
    backgroundColor: colors.GREY.default,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: '#fdd352',
    flexDirection: 'column',
  },
  todaysIncomeContainer: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdfac6',
  },
  listContainer: {
    flex: 5,
    backgroundColor: '#fff',
    marginTop: 1,
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingVertical: 6,
    paddingBottom: 6,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  todayEarningHeaderText: {
    fontSize: 20,
    paddingBottom: 5,
    color: colors.GREEN.default,
  },
  todayEarningMoneyText: {
    fontSize: 55,
    fontWeight: 'bold',
    color: colors.GREEN.default,
  },
  totalEarning: {
    height: 90,
    width: '49%',
    backgroundColor: '#147700',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thismonthEarning: {
    height: 90,
    width: '49%',
    backgroundColor: '#f09800',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayEarningHeaderText2: {
    fontSize: 16,
    paddingBottom: 5,
    color: '#FFF',
  },
  todayEarningMoneyText2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
