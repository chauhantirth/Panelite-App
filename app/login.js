import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import { router } from 'expo-router';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Eye, EyeActive } from "../assets";
import endpoints from "../constants/constants";

const Login = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState('');
  const [seePassword, setSeePassword] = useState(true);
  const [checkValidEmail, setCheckValidEmail] = useState(false);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(null);

  const handleCheckEmail = text => {
    let re = /\S+@\S+\.\S+/;
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    setEmail(text);
    if (re.test(text) || regex.test(text)) {
      setCheckValidEmail(false);
    } else {
      setCheckValidEmail(true);
    }
  };

  const checkPasswordValidity = value => {
    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(value)) {
      return 'Password must not contain Whitespaces.';
    }

    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(value)) {
      return 'Password must have at least one Uppercase Character.';
    }

    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(value)) {
      return 'Password must have at least one Lowercase Character.';
    }

    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(value)) {
      return 'Password must contain at least one Digit.';
    }

    const isValidLength = /^.{8,16}$/;
    if (!isValidLength.test(value)) {
      return 'Password must be 8-16 Characters Long.';
    }

    // const isContainsSymbol =
    //   /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    // if (!isContainsSymbol.test(value)) {
    //   return 'Password must contain at least one Special Symbol.';
    // }

    return null;
  };

  const handleLogin = async () => {
    setError(null);
    const checkPassowrd = checkPasswordValidity(password);
    if (!checkPassowrd) {

        // valid: https://rentry.co/h2cv2m8d/raw
        // new valid: https://rentry.co/9o3dxoqr/raw
        // invalid: https://rentry.co/9qg7k3pn/raw

        try {
          setIsLoading(true);
          setNetworkError(null);
          const response = await fetch(
              endpoints.local.login, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  }, 
                  body: JSON.stringify({
                    "data": {
                      "userEmail": email.toLocaleLowerCase(),
                      "userPassword": password,
                  }
                  })
          });
          setIsLoading(false);
  
          if (!response.ok) {
              setNetworkError('Something went wrong, please try again later.')
              // throw new Error('Failed to push data to Database.');
              return;
          }
  
          const resData = await response.json();
          if (resData) {
              if (resData.status === "success") {
                  AsyncStorage.setItem('userSession', JSON.stringify(resData.container));
                  console.log("Valid Email/Pass.");
                  router.replace('dashboard');
              } else {
                  console.log("Invalid Password");
                  setPassword('');
                  setError(resData.errorMsg);
              }
          } else {
              setNetworkError('An Error occured parsing the server response, Try again later.')
          }
      } catch (e) {
          setIsLoading(false);
          setNetworkError("Something went wrong, check your internet connection and try again.")
          console.log(e)
      }
    } else {
      alert(checkPassowrd);
    }
  };

  return (<>
    <View style={styles.container}>
      <Text style={styles.heading}>
        Login
      </Text>
      <Text style={styles.label}>Email</Text>
      <View style={styles.wrapperInput}>
        <TextInput
          style={styles.input}
          autoCapitalize='none'
          // keyboardType='email-address'
          autoCompleteType='email'
          placeholder="Email"
          value={email}
          onChangeText={text => handleCheckEmail(text)}
        />
      </View>
      {checkValidEmail && email != '' ? (
        <Text style={styles.textFailed}>Wrong format email</Text>
      ) : (
        <Text style={styles.textFailed}> </Text>
      )}
      <Text style={styles.label}>Password</Text>
      <View style={styles.wrapperInput}>
        <TextInput
          style={styles.input}
          autoCapitalize='none'
          placeholder="Password"
          value={password}
          secureTextEntry={seePassword}
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity
          style={styles.wrapperIcon}
          onPress={() => setSeePassword(!seePassword)}>
          <Image source={seePassword ? Eye : EyeActive} style={styles.icon} />
        </TouchableOpacity>
      </View>
      {email == '' || password == '' || checkValidEmail == true || isLoading == true ? (<>
            {error ? (
                <Text style={styles.textFailed}>{error}</Text>
            ) : (
                <Text style={styles.textFailed}> </Text>
            )}
            <TouchableOpacity
                disabled
                style={styles.buttonDisable}
                onPress={handleLogin}>
                    <Text style={styles.text}>Login</Text>
            </TouchableOpacity>
        </>) : (
        <>
            {error ? (
                <Text style={styles.textFailed}>{error}</Text>
            ) : (
                <Text style={styles.textFailed}> </Text>
            )}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.text}>Login</Text>
            </TouchableOpacity>
        </>
      )}
          {networkError ? (
      <View style={styles.networkErrorBox}>
          <Text style={styles.networkErrorText}>{networkError}
          </Text>
      </View>
      ) : (<></>)}
    </View>
    </>
  );
}
const styles = StyleSheet.create({
  networkErrorText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '300',
    color: 'red',
},  
networkErrorBox: {
    width: 'auto',
    marginTop: 40,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto'
}, 
  container: {
    flex: 1,
    marginTop: 260,
    // justifyContent: 'center',
    position: 'absolute',
    marginHorizontal: 20,
  },
  wrapperInput: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'grey',
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    padding: 10,
    width: '100%',
  },
  wrapperIcon: {
    position: 'absolute',
    right: 0,
    padding: 10,
  },
  icon: {
    width: 30,
    height: 24,
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    borderRadius: 5,
    marginTop: 25,
  },
  buttonDisable: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    borderRadius: 5,
    marginTop: 25,
  },
  heading: {
    alignSelf: 'center',
    color: 'black',
    fontWeight: '700',
    fontSize: '38',
    marginBottom: 30
  },
  label: {
    color: 'black',
    fontWeight: '700',
  },
  text: {
    color: 'white',
    fontWeight: '700',
  },
  textFailed: {
    alignSelf: 'flex-end',
    color: 'red',
  },
});

export default Login;