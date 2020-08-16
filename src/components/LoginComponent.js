import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  LayoutAnimation,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { colors, styles as Styles, pagePaddingLeft } from '../common/theme';
import language from '../common/language';
import languageJSON from '../common/language';

const { width, height } = Dimensions.get('window');

export default class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailValid: true,
      passwordValid: true,
      pwdErrorMsg: '',
    };
  }

  // validation for email
  validateEmail() {
    const { email } = this.state;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailValid = re.test(email);
    LayoutAnimation.easeInEaseOut();
    this.setState({ emailValid });
    emailValid || this.emailInput.shake();
    return emailValid;
  }

  // validation for password
  validatePassword() {
    const { complexity } = this.props;
    const { password } = this.state;
    const regx1 = /^([a-zA-Z0-9@*#]{8,15})$/;
    const regx2 = /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/;
    if (complexity == 'any') {
      var passwordValid = password.length >= 1;
      this.setState({ pwdErrorMsg: languageJSON.password_blank_error });
    } else if (complexity == 'alphanumeric') {
      var passwordValid = regx1.test(password);
      this.setState({ pwdErrorMsg: languageJSON.password_complexity_alphabet });
    } else if (complexity == 'complex') {
      var passwordValid = regx2.test(password);
      this.setState({ pwdErrorMsg: languageJSON.password_complexity_complex });
    }
    LayoutAnimation.easeInEaseOut();
    this.setState({ passwordValid });
    passwordValid || this.passwordInput.shake();
    return passwordValid;
  }

  // login press for validation check
  onPressLogin() {
    const { onPressLogin } = this.props;
    LayoutAnimation.easeInEaseOut();
    const emailValid = this.validateEmail();
    const passwordValid = this.validatePassword();

    if (emailValid && passwordValid) {
      // login function of smart component
      onPressLogin(this.state.email, this.state.password);
      this.setState({ email: '', password: '' });
    }
  }

  render() {
    const { onPressRegister, onPressForgotPassword, loading } = this.props;

    return (
      <View>
        <View style={{ ...styles.inputContainer }}>
          <Input
            ref={(input) => (this.emailInput = input)}
            editable
            underlineColorAndroid={colors.TRANSPARENT}
            placeholder={languageJSON.email}
            placeholderTextColor={colors.BLACK}
            value={this.state.email}
            keyboardType="email-address"
            inputStyle={Styles.inputStyle}
            onChangeText={(text) => { this.setState({ email: text }); }}
            errorMessage={this.state.emailValid ? null : languageJSON.email_blank_error}
            secureTextEntry={false}
            blurOnSubmit
            onSubmitEditing={() => { this.validateEmail(); this.passwordInput.focus(); }}
            errorStyle={Styles.errorStyle}
            inputContainerStyle={Styles.inputContainerStyle}
            containerStyle={Styles.containerStyle}
          />
          <Input
            ref={(input) => (this.passwordInput = input)}
            editable
            blurOnSubmit
            underlineColorAndroid={colors.TRANSPARENT}
            placeholder={languageJSON.password}
            placeholderTextColor={colors.BLACK}
            value={this.state.password}
            inputStyle={Styles.inputStyle}
            onChangeText={(text) => { this.setState({ password: text }); }}
            errorMessage={this.state.passwordValid ? null : this.state.pwdErrorMsg}
            secureTextEntry
            onSubmitEditing={() => { this.validatePassword(); }}
            errorStyle={Styles.errorStyle}
            inputContainerStyle={Styles.inputContainerStyle}
            containerStyle={Styles.containerStyle}
          />
        </View>

        <View style={{ ...styles.buttonContainer }}>
          <Button
            clear
            title={languageJSON.register_link}
            loading={false}
            loadingProps={{ size: 'large', color: colors.BLUE.default.primary }}
            titleStyle={styles.forgotTitleStyle}
            onPress={onPressRegister}
            buttonStyle={styles.buttonStyle}
            // containerStyle={{ flex: 1 }}
          />
          <View style={styles.verticalLineStyle} />
          <Button
            clear
            title={languageJSON.forgot_password_link}
            loading={false}
            onPress={onPressForgotPassword}
            loadingProps={{ size: 'large', color: colors.BLUE.default.primary }}
            titleStyle={styles.forgotTitleStyle}
            titleProps={{ numberOfLines: 2, ellipsizeMode: 'tail' }}
            buttonStyle={styles.buttonStyle}
            containerStyle={{}}
          />

        </View>
        <Button
          title={languageJSON.login}
          loading={false}
          loadingProps={{ size: 'large', color: colors.BLUE.default.primary }}
          titleStyle={styles.buttonTitleStyle}
          onPress={() => { this.onPressLogin(); }}
          buttonStyle={styles.loginButtonStyle}
          containerStyle={styles.loginButtonContainer}
        />

      </View>
    );
  }
}

// style for this component
const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-end',
    elevation: 20,
    justifyContent: 'flex-end',
    shadowColor: colors.BLACK,
    shadowRadius: 10,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 4 },
    paddingLeft: pagePaddingLeft,
    paddingRight: pagePaddingLeft,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 10,
    paddingRight: pagePaddingLeft,
    paddingLeft: pagePaddingLeft,
  },
  emailInputContainer: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingLeft: 10,
    backgroundColor: colors.WHITE,
    paddingRight: 10,
    paddingTop: 10,
    width: width - 80,
  },
  pwdInputContainer: {
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    paddingLeft: 10,
    backgroundColor: colors.WHITE,
    paddingRight: 10,
    paddingTop: 5,
    borderBottomColor: colors.WHITE,
    borderBottomWidth: 0,
    width: width - 80,
  },
  emailInputContainerStyle: {
    borderBottomColor: colors.BLACK,
    borderBottomWidth: 1,
    paddingBottom: 15,
  },
  errorMessageStyle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FD2323',
  },
  inputTextStyle: {
    color: colors.BLACK,
    fontSize: 13,
  },
  pwdInputContainerStyle: {
    paddingBottom: 15,
  },
  verticalLineStyle: {
    height: '100%',
    width: 2,
    top: 0,
    backgroundColor: '#e7731f',
  },
  forgotTitleStyle: {
    fontWeight: '700',
    fontSize: 12,
    width: '50%',
    margin: 0,
    color: 'green',
    paddingTop: 10,
    paddingBottom: 10,
  },
  buttonStyle: {
    backgroundColor: colors.TRANSPARENT,
    padding: 0,
    marginBottom: 0,
    marginTop: 0,
    // height: 46,
  },
  buttonTitleStyle: {
    fontWeight: '700',
    width: '100%',
  },
  loginButtonStyle: {
    backgroundColor: '#e7731f',
    height: 45,
    borderRadius: 5,
    width: '100%',
    minHeight: 46,
    borderBottomLeftRadius: 5,
  },
  loginButtonContainer: {
    shadowColor: colors.BLACK,
    shadowRadius: 10,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 4 },
    paddingRight: pagePaddingLeft,
    paddingLeft: pagePaddingLeft,
  },
  buttonContainerStyle: {
    flex: 1,
  },
});
