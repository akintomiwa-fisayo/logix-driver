import React from 'react';
import {
  View, Text, Dimensions, ScrollView, KeyboardAvoidingView, Image, TouchableWithoutFeedback, LayoutAnimation, Platform,
} from 'react-native';
import {
  Icon, Button, Header, Input,
} from 'react-native-elements';
import * as firebase from 'firebase';
import axios from 'axios';
import Background from './Background';
import { colors } from '../common/theme';
import languageJSON from '../common/language';
import { PAYSTACK_SECRET_KEY } from '../../assets/env';

const { height } = Dimensions.get('window');
export default class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: '',
      lname: '',
      email: '',
      mobile: '',
      bank: '',
      accountNumber: '',
      fnameValid: true,
      lnameValid: true,
      mobileValid: true,
      emailValid: true,
      passwordValid: true,
      cnfPwdValid: true,
      bankValid: true,
      accountNumberValid: true,
      pwdErrorMsg: '',

      bankList: false,
      showBankList: false,

      submitting: false,
    };
  }

  async componentWillMount() {
    const curuser = firebase.auth().currentUser.uid;
    const userData = firebase.database().ref(`users/${curuser}`);
    userData.once('value', (userData) => {
      console.log(userData.val());
      this.setState({
        fname: userData.val().firstName,
        lname: userData.val().lastName,
        email: userData.val().email,
        mobile: userData.val().mobile,
        bank: userData.val().bank,
        accountNumber: userData.val().bank.accountNumber || '',
      });
    });

    axios({
      url: 'https://api.paystack.co/bank',

    }).then((response) => {
      // console.log('PAYSTACK ABNKS', response.data.data);
      this.setState({
        bankList: response.data.data,
      });
    }).catch((error) => {
      // console.log('PAYSTACK BANKS ERROR ah', error);
    });
    console.log('ENVIRONMNENT', process.env);
  }

  selectbank(bank) {
    this.setState({
      bank,
      bankValid: true,
    });
  }

  // first name validation
  validateFirstName() {
    const { fname } = this.state;
    const fnameValid = fname.length > 0;
    LayoutAnimation.easeInEaseOut();
    this.setState({ fnameValid });
    fnameValid || this.fnameInput.shake();
    return fnameValid;
  }

  // last name validation
  validateLastname() {
    const { lname } = this.state;
    const lnameValid = lname.length > 0;
    LayoutAnimation.easeInEaseOut();
    this.setState({ lnameValid });
    lnameValid || this.lnameInput.shake();
    return lnameValid;
  }

  // mobile number validation
  validateMobile() {
    const { mobile } = this.state;
    const mobileValid = (mobile.length == 11);
    LayoutAnimation.easeInEaseOut();
    this.setState({ mobileValid });
    mobileValid || this.mobileInput.shake();
    return mobileValid;
  }

  // email validation
  validateEmail() {
    const { email } = this.state;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailValid = re.test(email);
    LayoutAnimation.easeInEaseOut();
    this.setState({ emailValid });
    emailValid || this.emailInput.shake();
    return emailValid;
  }

  // register button press for validation
  onPressRegister() {
    const { onPressRegister } = this.props;
    const { bank, accountNumber } = this.state;
    LayoutAnimation.easeInEaseOut();

    const validateForm = () => new Promise((resolve) => {
      const fnameValid = this.validateFirstName();
      const lnameValid = this.validateLastname();
      const mobileValid = this.validateMobile();
      const emailValid = this.validateEmail();

      // valide bank and account number
      axios({
        url: `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bank.code}`,
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }).then((response) => {
        console.log('PAYSTACK VALIDATE ACCOUNT', response.data.data);
        this.setState({
          accountNumberValid: true,
          bankValid: true,
        });
        resolve(fnameValid && lnameValid && mobileValid && emailValid);
      }).catch((error) => {
        const { status } = error.response;
        console.log('PAYSTACK VALIDATE ERROR ah', error.response.status);
        if (status === 400 || status === 422) {
          this.setState({
            accountNumberValid: false,
            bankValid: false,
          });
        }
        resolve(false);
      });
    });

    validateForm().then((isValid) => {
      if (isValid) {
        this.setState({ submitting: true });
        // register function of smart component
        console.log('EVERYTHIONG VALID AND STATE IS : ', this.state);
        onPressRegister(this.state.fname, this.state.lname, this.state.mobile, this.state.email, {
          type: bank.type,
          code: bank.code,
          longcode: bank.longcode,
          currency: bank.currency,
          name: bank.name,
          accountNumber,
        });
        this.setState({
          fname: '', lname: '', mobile: '', email: '', bank: '', accountNumber: '',
        });
      } else {
        console.log('ok something  fucking');
      }
    });
  }

  render() {
    const { onPressBack } = this.props;
    const { state } = this;
    const { bankList, showBankList, submitting } = state;
    return (
      <View style={styles.main}>
        <Header
          backgroundColor={colors.TRANSPARENT}
          leftComponent={{
            icon: 'md-close', type: 'ionicon', color: colors.BLACK, size: 35, component: TouchableWithoutFeedback, onPress: onPressBack,
          }}
          containerStyle={styles.headerContainerStyle}
          innerContainerStyles={styles.headerInnerContainer}
        />
        <ScrollView style={styles.scrollViewStyle}>
          <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'padding'} style={styles.form}>
            <View style={styles.containerStyle}>
              <Text style={styles.headerStyle}>{languageJSON.update_profile}</Text>

              <View style={styles.textInputContainerStyle}>
                <Icon
                  name="user"
                  type="font-awesome"
                  color={colors.GREY.secondary}
                  size={30}
                  containerStyle={styles.iconContainer}
                />
                <Input
                  ref={(input) => (this.fnameInput = input)}
                  editable
                  underlineColorAndroid={colors.TRANSPARENT}
                  placeholder={languageJSON.first_name}
                  placeholderTextColor={colors.GREY.secondary}
                  value={this.state.fname}
                  keyboardType="email-address"
                  inputStyle={styles.inputTextStyle}
                  onChangeText={(text) => { this.setState({ fname: text }); }}
                  errorMessage={this.state.fnameValid ? null : languageJSON.first_name_error}
                  secureTextEntry={false}
                  blurOnSubmit
                  onSubmitEditing={() => { this.validateFirstName(); this.lnameInput.focus(); }}
                  errorStyle={styles.errorMessageStyle}
                  inputContainerStyle={styles.inputContainerStyle}
                  containerStyle={styles.textInputStyle}
                />
              </View>

              <View style={styles.textInputContainerStyle}>
                <Icon
                  name="user"
                  type="font-awesome"
                  color={colors.GREY.secondary}
                  size={30}
                  containerStyle={styles.iconContainer}
                />
                <Input
                  ref={(input) => (this.lnameInput = input)}
                  editable
                  underlineColorAndroid={colors.TRANSPARENT}
                  placeholder={languageJSON.last_name}
                  placeholderTextColor={colors.GREY.secondary}
                  value={this.state.lname}
                  keyboardType="email-address"
                  inputStyle={styles.inputTextStyle}
                  onChangeText={(text) => { this.setState({ lname: text }); }}
                  errorMessage={this.state.lnameValid ? null : languageJSON.last_name_error}
                  secureTextEntry={false}
                  blurOnSubmit
                  onSubmitEditing={() => { this.validateLastname(); this.mobileInput.focus(); }}
                  errorStyle={styles.errorMessageStyle}
                  inputContainerStyle={styles.inputContainerStyle}
                  containerStyle={styles.textInputStyle}
                />
              </View>

              <View style={styles.textInputContainerStyle}>
                <Icon
                  name="mobile-envelop"
                  type="font-awesome"
                  color={colors.GREY.secondary}
                  size={40}
                  containerStyle={styles.iconContainer}
                />
                <Input
                  ref={(input) => (this.emailInput = input)}
                  editable
                  underlineColorAndroid={colors.TRANSPARENT}
                  placeholder={languageJSON.email}
                  placeholderTextColor={colors.GREY.secondary}
                  value={this.state.email}
                  keyboardType="number-pad"
                  inputStyle={styles.inputTextStyle}
                  onChangeText={(text) => { this.setState({ email: text }); }}
                  errorMessage={this.state.emailValid ? null : languageJSON.email_blank_error}
                  secureTextEntry={false}
                  blurOnSubmit
                  onSubmitEditing={() => { this.validateEmail(); }}
                  errorStyle={styles.errorMessageStyle}
                  inputContainerStyle={styles.inputContainerStyle}
                  containerStyle={styles.textInputStyle}
                />
              </View>

              <View style={styles.textInputContainerStyle}>
                <Icon
                  name="mobile-phone"
                  type="font-awesome"
                  color={colors.GREY.secondary}
                  size={40}
                  containerStyle={styles.iconContainer}
                />
                <Input
                  ref={(input) => (this.mobileInput = input)}
                  editable
                  underlineColorAndroid={colors.TRANSPARENT}
                  placeholder={languageJSON.mobile}
                  placeholderTextColor={colors.GREY.secondary}
                  value={this.state.mobile}
                  keyboardType="number-pad"
                  inputStyle={styles.inputTextStyle}
                  onChangeText={(text) => { this.setState({ mobile: text }); }}
                  errorMessage={this.state.mobileValid ? null : languageJSON.valid_mobile_number}
                  secureTextEntry={false}
                  blurOnSubmit
                  onSubmitEditing={() => { this.validateMobile(); }}
                  errorStyle={styles.errorMessageStyle}
                  inputContainerStyle={styles.inputContainerStyle}
                  containerStyle={styles.textInputStyle}
                />
              </View>

              <View style={styles.textInputContainerStyle}>
                <Icon
                  name="mobile-phone"
                  type="font-awesome"
                  color={colors.GREY.secondary}
                  size={40}
                  containerStyle={styles.iconContainer}
                />
                <View style={{ ...styles.textInputStyle, width: '100%', position: 'relative' }}>
                  <Input
                    ref={(input) => (this.bankInput = input)}
                    // editable={false}
                    underlineColorAndroid={colors.TRANSPARENT}
                    placeholder={languageJSON.bank}
                    placeholderTextColor={colors.GREY.secondary}
                    value={this.state.bank.name || ''}
                    keyboardType="number-pad"
                    inputStyle={styles.inputTextStyle}
                    // onChangeText={(text) => { this.setState({ bank: text }); }}
                    errorMessage={this.state.bankValid ? null : languageJSON.valid_bank_number}
                    secureTextEntry={false}
                    onFocus={() => {
                      this.setState({
                        showBankList: true,
                      });
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        this.setState({
                          showBankList: false,
                        });
                      }, 1000);
                    }}
                    // onSubmitEditing={() => { this.validateMobile(); }}
                    errorStyle={styles.errorMessageStyle}
                    inputContainerStyle={styles.inputContainerStyle}
                  // containerStyle={styles.textInputStyle}
                  />
                  <View style={{ display: showBankList ? 'flex' : 'none' }}>
                    <ScrollView style={{
                      maxHeight: 200,
                      width: '100%',
                      backgroundColor: 'white',
                      position: 'absolute',
                      shadowColor: 'black',
                      shadowOpacity: 1,
                      shadowRadius: 2,
                      shadowOffset: 1,
                      borderColor: colors.GREY.secondary,
                      borderRadius: 3,
                      borderWidth: 1,
                      top: '100%',
                      left: 0,
                      zIndex: 9999999,
                      overflow: 'hidden',
                      shadowOffset: { width: 10, height: 10 },
                      shadowRadius: 10,
                      shadowOpacity: 1,
                    // padding: 10
                    }}
                    >
                      {
                      bankList && (bankList.map((bank) => (
                        <Text
                          onPress={() => {
                            this.selectbank(bank);
                          }}
                          style={styles.bankItem}
                        >{bank.name}
                        </Text>
                      ))) || <Text>loading...</Text>
                    }
                    </ScrollView>
                  </View>
                </View>
              </View>

              <View style={styles.textInputContainerStyle}>
                <Icon
                  name="mobile-phone"
                  type="font-awesome"
                  color={colors.GREY.secondary}
                  size={40}
                  containerStyle={styles.iconContainer}
                />
                <Input
                  ref={(input) => (this.accountNumber = input)}
                  editable
                  underlineColorAndroid={colors.TRANSPARENT}
                  placeholder={languageJSON.account_number}
                  placeholderTextColor={colors.GREY.secondary}
                  value={this.state.accountNumber}
                  keyboardType="number-pad"
                  inputStyle={styles.inputTextStyle}
                  onChangeText={(text) => { this.setState({ accountNumber: text, accountNumberValid: true }); }}
                  errorMessage={this.state.accountNumberValid ? null : languageJSON.valid_account_number}
                  secureTextEntry={false}
                  blurOnSubmit
                  onSubmitEditing={() => { this.validateMobile(); }}
                  errorStyle={styles.errorMessageStyle}
                  inputContainerStyle={styles.inputContainerStyle}
                  containerStyle={styles.textInputStyle}
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  onPress={() => { this.onPressRegister(); }}
                  title={languageJSON.update_now}
                  titleStyle={styles.buttonTitle}
                  buttonStyle={{ ...styles.registerButton, opacity: submitting ? 0.4 : 1 }}
                />
              </View>
              <View style={styles.gapView} />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

// style for this component
const styles = {
  bankItem: {
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  main: {
    // backgroundColor: colors.BLACK,
  },
  headerContainerStyle: {
    backgroundColor: colors.TRANSPARENT,
    borderBottomWidth: 0,
  },
  headerInnerContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
  inputContainerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: colors.BLACK,
  },
  textInputStyle: {
    marginLeft: 10,
  },
  iconContainer: {
    paddingTop: 8,
  },
  gapView: {
    height: 40,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 40,
  },
  registerButton: {
    backgroundColor: colors.YELLOW.primary,
    width: 180,
    height: 45,
    borderColor: colors.TRANSPARENT,
    borderWidth: 0,
    marginTop: 30,
    borderRadius: 8,
    elevation: 0,
  },
  buttonTitle: {
    fontSize: 16,
  },
  inputTextStyle: {
    color: colors.BLACK,
    fontSize: 13,
    marginLeft: 0,
    height: 32,
  },
  errorMessageStyle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 0,
  },
  containerStyle: {
    flexDirection: 'column',
    marginTop: 20,
  },
  form: {
    flex: 1,
  },
  logo: {
    width: '90%',
    justifyContent: 'flex-start',
    marginTop: 10,
    alignItems: 'center',
  },
  scrollViewStyle: {
    height,
  },
  textInputContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    padding: 15,
  },
  headerStyle: {
    fontSize: 18,
    color: colors.BLACK,
    textAlign: 'center',
    flexDirection: 'row',
    marginTop: 0,
  },
};
