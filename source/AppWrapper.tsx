/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {AppProvider, UserProvider} from '@realm/react';
import {appId, baseUrl} from '../atlasConfig.json';
import { realmContext } from './RealmContext';



import {App} from './App';
import {WelcomeView} from './WelcomeView';

import {Item} from './ItemSchema';
import { users } from './Models';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const LoadingIndicator = () => {
  return (
    <View style={styles.activityContainer}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const ownItemsSubscriptionName = 'ownItems';
const itemSubscriptionName = 'items';
const { RealmProvider } = realmContext;

export const AppWrapper = () => {
  
  const realmFileBehavior = {
    type: 'downloadBeforeOpen',
    timeOut: 5000,
    timeOutBehavior: 'openLocalRealm',
  }
  
  return (
    <AppProvider id={appId} baseUrl={baseUrl}>
      <UserProvider fallback={WelcomeView}>
        <RealmProvider
          sync={{
            flexible: true,
            initialSubscriptions: {
              update: (mutableSubs, realm) => 
                mutableSubs.add(realm.objects(users), {name: ownItemsSubscriptionName})
            },
            newRealmFileBehavior: realmFileBehavior,
            existingRealmFileBehavior: realmFileBehavior,
            onError: (_session, error) => {
              // Show sync errors in the console
              console.error(error);
            },
          }}
          fallback={LoadingIndicator}>
          <SafeAreaProvider>
          <App />
          </SafeAreaProvider>
        </RealmProvider>
      </UserProvider>
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  activityContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
