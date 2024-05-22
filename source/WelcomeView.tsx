/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import Realm from 'realm';
import {useApp} from '@realm/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {TouchableOpacity, StyleSheet, Text, View, Alert, Image} from 'react-native';
import {Input, Button} from '@rneui/base';
import {colors} from './Colors';
import { COLORS, icons } from './constants';

export function WelcomeView(): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dislayName, setDisplayName] = useState('');

  const [keepAuth, setKeepAuth] = useState(false);

  // state values for toggable visibility of features in the UI
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [isInSignUpMode, setIsInSignUpMode] = useState(true);

  const app = useApp();

  // signIn() uses the emailPassword authentication provider to log in
  const signIn = useCallback(async () => {
    const creds = Realm.Credentials.emailPassword(email, password);
    await app.logIn(creds);
  }, [app, email, password]);

  // onPressSignIn() uses the emailPassword authentication provider to log in
  const onPressSignIn = useCallback(async () => {
    try {
      await signIn()
        .then(res => {
          console.log(res, "RES SIGN IN")
          
        })
        .catch(err => {
          console.log(err, "ERROR SIGN IN")
        });
    } catch (error: any) {
      Alert.alert(`Failed to sign in: ${error?.message}`);
    }
  }, [signIn]);

  // onPressSignUp() registers the user and then calls signIn to log the user in
  const onPressSignUp = useCallback(async () => {

    try {
      await app.emailPasswordAuth.registerUser({email, password});
      // console.log(app.currentUser, "Current User here")

      await signIn();
    } catch (error: any) {
      Alert.alert(`Failed to sign up: ${error?.message}`);
    }
  }, [signIn, app, email, password]);

  return (
    <SafeAreaProvider>
      <View style={styles.viewWrapper}>
      <Text style={styles.subtitle}>
          { isInSignUpMode ? 'Register with a Device Sync user account.' : 'Please log in with a Device Sync user account.'}
        </Text>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
      <View style={{ flexDirection: 'row', borderColor: COLORS.gray800, width: '100%', alignItems: 'center', justifyContent: 'space-around', borderTopWidth: .5, borderLeftWidth: .5, borderRightWidth: .5, paddingHorizontal: 10, paddingVertical: 20, borderTopLeftRadius: 12, borderTopRightRadius: 12,}}>
        <Text style={{...styles.title, color: !isInSignUpMode ? COLORS.black : COLORS.gray700, fontWeight: 'bold', fontSize: 16}}>Sign in</Text>
        <Text style={{...styles.title, color: isInSignUpMode ? COLORS.black : COLORS.gray700, fontWeight: 'bold', fontSize: 16}}>Sign up</Text>
      </View>

      <View style={{ width: '100%', borderColor: COLORS.gray800, borderLeftWidth: .5, borderRightWidth: .5, borderBottomWidth: .2, alignItems: 'center'}}>

        <Input
          placeholder="email"
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <Input
          placeholder="password"
          onChangeText={setPassword}
          secureTextEntry={passwordHidden}
          rightIcon={
            <TouchableOpacity
              onPress={() => {
                setPasswordHidden(!passwordHidden);
              }}
            >
              <Image
                source={passwordHidden === true ? icons.hide : passwordHidden === false ? icons.show : null}
                resizeMode="contain"
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  height: 25,
                  width: 25,
                }}
                />
            </TouchableOpacity>
          }
        />
          <View style={{ marginBottom: 20, padding: 10}}>
        
        {isInSignUpMode ? (
          <>
            <Button
              title="Create Account"
              buttonStyle={styles.mainButton}
              onPress={onPressSignUp}
            />
            <Button
              title="Already have an account? Log In"
              type="clear"
              titleStyle={styles.secondaryButton}
              onPress={() => setIsInSignUpMode(!isInSignUpMode)}
            />
          </>
        ) : (
          <>
            <Button
              title="Log In"
              buttonStyle={styles.mainButton}
              onPress={onPressSignIn}
            />
            <Button
              title="Don't have an account? Create Account"
              type="clear"
              titleStyle={styles.secondaryButton}
              onPress={() => setIsInSignUpMode(!isInSignUpMode)}
            />
          </>          
        )}
        </View>
      </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 14,
    padding: 10,
    color: 'gray',
    textAlign: 'center',
  },
  mainButton: {
    width: 320,
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    color: colors.primary,
  },
});
