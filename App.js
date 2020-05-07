/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';

// TODO(you): import any additional firebase services that you require for your app, e.g for auth:
//    1) install the npm package: `yarn add @react-native-firebase/auth@alpha` - you do not need to
//       run linking commands - this happens automatically at build time now
//    2) rebuild your app via `yarn run run:android` or `yarn run run:ios`
//    3) import the package here in your JavaScript code: `import '@react-native-firebase/auth';`
//    4) The Firebase Auth service is now available to use here: `firebase.auth().currentUser`

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\nCmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\nShake or press menu button for dev menu'
});

const firebaseCredentials = Platform.select({
  ios: 'https://invertase.link/firebase-ios',
  android: 'https://invertase.link/firebase-android'
});

async function requestUserPermission() {
  const settings = await messaging().requestPermission();

  if (settings) {
    console.log('Permission settings:', settings);
  }
}

type Props = {};
const server = 'http://192.168.100.35:4412/app/';

export default function App(props: Props) {
  const [token, setToken] = React.useState(null);
  const [status, setStatus] = React.useState("Initialization");
  React.useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then(token => {
        setToken(token);
        setStatus("Token Ready");
        axios
          .get(server + token)
          .then(t => {
            setStatus("Token Registered");
          })
          .catch(e => {
            setStatus(e.toString());
          });
      });

    // Listen to whether the token changes
    return messaging().onTokenRefresh(token => {
      setToken(token);
      setStatus("Token Refreshed");
      axios
        .get(server + token)
        .then(t => {
          setStatus("Token Refreshed and Registered");
        })
        .catch(e => {
          setStatus(e.toString());
        });
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to Coffee Robot!</Text>
      <Text style={styles.instructions}>{status}</Text>
      <Text style={styles.instructions}>{token || "Token Not Ready"}</Text>
      <Text style={styles.instructions}>{instructions}</Text>
      {!firebase.apps.length && (
        <Text style={styles.instructions}>
          {`\nYou currently have no Firebase apps registered, this most likely means you've not downloaded your project credentials. Visit the link below to learn more. \n\n ${firebaseCredentials}`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
