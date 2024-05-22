/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, Linking, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { dataExplorerLink } from '../atlasConfig.json';
import { LogoutButton } from './LogoutButton';
import { ItemListView } from './ItemListView';
import { OfflineModeButton } from './OfflineModeButton';
import ProfileSetup from './screens/ProfileSetup';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Image } from 'react-native';
import { COLORS, icons } from './constants';
import ChatListScreen from './screens/ChatList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import { WelcomeView } from './WelcomeView';

import { realmContext } from './RealmContext';

import { useUser, useApp } from '@realm/react';
import { users } from './Models';
import { BSON } from 'realm';
import Conversation from './screens/Conversation';

const { useRealm, useQuery } = realmContext;
// If you're getting this app code by cloning the repository at
// https://github.com/mongodb/ template-app-react-native-todo,
// it does not contain the data explorer link. Download the
// app template from the Atlas UI to view a link to your data
const dataExplorerMessage = `View your data in MongoDB Atlas: ${dataExplorerLink}.`;

console.log(dataExplorerMessage);

const Stack = createStackNavigator();

const headerRight = () => {
  return <OfflineModeButton />;
};

const headerLeft = () => {
  return <LogoutButton />;
};

const itemSubscriptionName = 'items';
const ownItemsSubscriptionName = 'ownItems';

export const App = ({ navigation }) => {
  const [auth, setAuth] = useState(false);
  const [status, setStatus] = useState('');
  const app = useApp()
  const realm = useRealm();
  const querryUser = useQuery(users).filtered('email == $0', app.currentUser?.customData.email);
  console.log(querryUser, 'user?')
  console.log(app.currentUser?.customData, 'useApp in APP ')
  // console.log(realmUser.objectForPrimaryKey(users, BSON.ObjectId()), "REALM USER AT APP")
  
  
  
  const handleAuth = async () => {
    console.log('Hello World!')
    let storedUser = await AsyncStorage.getItem('user');
    console.log(storedUser, "STORED?")
    storedUser = JSON.parse(storedUser)
    if (storedUser) {
      console.log(storedUser, "SOTRQ?")
      let userStatus = storedUser.status;
      console.log(userStatus, "STATUS HERE!")
      setAuth(true)
      setStatus(userStatus)
    } else {
      setAuth(false)
    }
    return
  }
  
  useEffect(() => {
    const data = realm.objects(users).filtered('isDeleted == $0', false)
    
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.removeByName(itemSubscriptionName);
      mutableSubs.add(data, { name: ownItemsSubscriptionName });
    });
  
  }, [])
  
  
  useEffect(() => {
    handleAuth()
    
  },[])
  
  
  // console.log(querryUser, "MAYDA USER DDI?")
  
  
  return (
    <>
      {/* All screens nested in RealmProvider have access
            to the configured realm's hooks. */}
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {/* <Stack.Screen
              name="Your To-Do List"
              component={ItemListView}
              options={{
                headerTitleAlign: 'center',
                headerLeft,
                headerRight,
              }}
            /> */}

              <Stack.Screen
              name="Chats"
              component={ChatListScreen}
              options={{
                headerTitleAlign: 'center',
                headerLeft: () => (
                  <TouchableOpacity
                    style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                    <Image
                      source={icons.goBack}
                      resizeMode='contain'
                      style={{
                        height: 25,
                        width: 25,
                        tintColor: COLORS.primary,
                      }} />
                  </TouchableOpacity>
                ),
                headerRight: () => (
                  <LogoutButton />
                ),
              }}
            />
            
            <Stack.Screen
              name="Profile Setup"
              component={ProfileSetup}
              options={{
                headerTitleAlign: 'center',
                headerLeft: () => (
                  <TouchableOpacity
                    style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                    <Image
                      source={icons.goBack}
                      resizeMode='contain'
                      style={{
                        height: 25,
                        width: 25,
                        tintColor: COLORS.primary,
                      }} />
                  </TouchableOpacity>
                ),
                // headerRight,
              }}
            />  
            
            <Stack.Screen
              name="Conversation"
              component={Conversation}
              options={({ navigation }) => ({
                headerShadowVisible: false,
                headerTitle: '',
                headerLeft: () => (
      
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }}
                  >
                    <Image
                      source={icons.goBack}
                      resizeMode='contain'
                      style={{
                        height: 25,
                        width: 25,
                        tintColor: COLORS.primary,
                      }} />
                  </TouchableOpacity>),
                // headerRight
              })}
            />
              
            
          </Stack.Navigator>
        </NavigationContainer>

        {/* <View style={styles.footer}>
          <Text style={styles.footerText}>
            Log in with the same account on another device or simulator to see
            your list sync in real time.
          </Text>

          {dataExplorerLink && (
            <View>
              <Text style={styles.footerText}>
                You can view your data in MongoDB Atlas:
              </Text>
              <Text
                style={[styles.footerText, styles.hyperlink]}
                onPress={() => Linking.openURL(dataExplorerLink)}>
                {dataExplorerLink}.
              </Text>
            </View>
          )}
        </View> */}
      </SafeAreaProvider>
    </>
  );
};

const styles = StyleSheet.create({
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 4,
  },
  hyperlink: {
    color: 'blue',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
});
