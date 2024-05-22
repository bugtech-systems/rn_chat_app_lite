/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useRef } from 'react';

import {View, Text, FlatList,DrawerLayoutAndroid, StyleSheet, Button, TouchableOpacity, Image, ScrollView} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import { COLORS, icons, SIZES } from '../constants';

import { useApp, useUser } from '@realm/react';
import Realm from 'realm';
import { realmContext } from '../RealmContext';
import {BSON} from 'realm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { users } from '../Models';

const { useRealm, useQuery, useObject } = realmContext;



const ChatListItem = ({ name, chat, date, imgUrl, navigation }) => {
  
  return (
    <View 
    style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: imgUrl }} style={styles.avatar} />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.upperContainer}>
          {
            name ? 
            <Text style={styles.name}>{name}</Text>
            :
            null
          }
          <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={styles.chat}>{chat}</Text>
      </View>
    </View>
  );
};

const ChatListScreen = ({navigation, route}) => {
  const [showPopover, setShowPopover] = useState(false)
  let [visible, setVisible] = useState(false);
  const realm = useRealm();
  
  const realmUser = useUser();
  const app = useApp();
  
  const user = realm.objectForPrimaryKey(users, BSON.ObjectId(realmUser.customData._id));
  // let { email }= route.params
  console.log(route.params, "HAHHA")
  
  let email;
    
  const handlePopOver = async () => {
    
    setShowPopover(false)
    return
  }
  
  const dummyData = [
    { name: 'Mayda', chat: 'Hello there!', date: 'May 10', imgUrl: 'https://via.placeholder.com/50' },
    { name: 'Name', chat: 'Hi, how are you?', date: 'May 9', imgUrl: 'https://via.placeholder.com/50' },
    { name: 'Bob', chat: 'Good morning!', date: 'May 8', imgUrl: 'https://via.placeholder.com/50' },
    { name: 'Emily', chat: 'Hey, what\'s up?', date: 'May 7', imgUrl: 'https://via.placeholder.com/50' },
    { name: 'Michael', chat: 'Long time no see!', date: 'May 6', imgUrl: 'https://via.placeholder.com/50' },
    { name: 'Sarah', chat: 'How\'s your day going?', date: 'May 5', imgUrl: 'https://via.placeholder.com/50' },
    { name: 'David', chat: 'I\'m excited for the weekend!', date: 'May 4', imgUrl: 'https://via.placeholder.com/50' },
    { name: 'Emma', chat: 'What are your plans for tonight?', date: 'May 3', imgUrl: 'https://via.placeholder.com/50' },
    { name: 'Chris', chat: 'Let\'s catch up soon!', date: 'May 2', imgUrl: 'https://via.placeholder.com/50' },
    { name: 'Olivia', chat: 'I miss hanging out with you!', date: 'May 1', imgUrl: 'https://via.placeholder.com/50' },
    { name: 'Liam', chat: 'How was your weekend?', date: 'April 30', imgUrl: 'https://via.placeholder.com/50' },
    { name: 'Sophia', chat: 'Did you watch the game?', date: 'April 29', imgUrl: 'https://via.placeholder.com/50' },
    { name: 'Noah', chat: 'What are your plans for the holidays?', date: 'April 28', imgUrl: 'https://via.placeholder.com/50' },
    { name: 'Ava', chat: 'I have exciting news!', date: 'April 27', imgUrl: 'https://via.placeholder.com/50' },
    { name: 'Ethan', chat: 'Let\'s grab lunch together!', date: 'April 26', imgUrl: 'https://via.placeholder.com/50' },
    { name: 'Isabella', chat: 'How\'s the new project going?', date: 'April 25', imgUrl: 'https://via.placeholder.com/50' },
    { name: 'Mason', chat: 'Happy birthday!', date: 'April 24', imgUrl: 'https://via.placeholder.com/50' },
    // Add more dummy data here...
  ];
  
  
  function renderPopOver() {
    return (
      <Popover
        placement={PopoverPlacement.TOP}
        isVisible={showPopover}
        onCloseComplete={handlePopOver}
        onRequestClose={() => setShowPopover(false)}
        popoverStyle={{ backgroundColor: 'rgba(255,255,255, 0)', bottom: 60, alignItems: 'center', justifyContent: 'center' }} backgroundStyle={{ backgroundColor: 'transparent' }}
        from={(
          <TouchableOpacity 
            onPress={() => setShowPopover(true)}
          
            style={{ margin: 10, height: 50, width: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, borderRadius: 30, padding: 10, borderWidth: 1, borderColor: COLORS.success700}}>
            <Image
              source={icons.compose}
              style={{
                height: 60,
                width: 60,
                // tintColor: COLORS.success400
              }}
              resizeMode='contain'
            />
          </TouchableOpacity>
        )}
      >
        <View style={{ width: '100%', flex: 1, justifyContent: 'space-around', alignItems: 'center' }}>
          <View style={{ height: 60, width: 60, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => console.log('Touch')}
              style={{
                backgroundColor: COLORS.white,
                borderColor: COLORS.white,
                elevation: 3,
                borderRadius: 30,
                padding: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.info500
              }}>
          <Text>
            New
          </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 60, width: 60, alignItems: 'center', justifyContent: 'center', }}>
        <TouchableOpacity
              style={{ backgroundColor: COLORS.white, borderColor: COLORS.white, elevation: 3, borderRadius: 30, padding: 4, alignItems: 'center', justifyContent: 'center' }}>
          <Text>
            Icon 2
          </Text>
          </TouchableOpacity>
        </View>
        
        <View style={{ height: 60, width: 60, alignItems: 'center', justifyContent: 'center', }}>
        <TouchableOpacity onPress={() => console.log('Touch')}
              style={{
                backgroundColor: COLORS.white,
                borderColor: COLORS.white,
                elevation: 3,
                borderRadius: 30,
                padding: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.info500
              }}
              // onPress={() => { navi}}
              >
         <Text>
            Icon 3
          </Text>
          </TouchableOpacity>
        </View>
        </View>
      </Popover>
    )
  }
  
  
  useEffect(() => {

}, [])

  
  
console.log(user, 'THE USEER')

console.log(realmUser.customData, "MYREALM UYSER")

        const handleStoreUserData = async () => {
            const storaUserData = await AsyncStorage.setItem('user', JSON.stringify(user))
            if (storaUserData) {
                console.log(storaUserData, "MNAADA NA ASYNC?")
            }
            }



    
    useEffect(() => {
        handleStoreUserData()
    },[])
        return (
        <SafeAreaProvider style={{  flexGrow: 1, alignItems: 'center', justifyContent: 'flex-start', paddingVertical: 10,}}>
         
          <ScrollView

            scrollEnabled
            showsVerticalScrollIndicator={false}
            style={{height: '100%'}}
          >
      {dummyData.map((item, index) => (
      <TouchableOpacity key={index}
        onPress={() => navigation.navigate('Conversation', {item})}
      >
        <ChatListItem key={index} name={item.name} chat={item.chat} date={item.date} imgUrl={item.imgUrl} />
      </TouchableOpacity>
      ))}
    </ScrollView>
     <View
            style={{
              // position: 'absolute',
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              // right: '60%',
              // left: '40%',
              width: '90%',
              // marginBottom: 10,
              backgroundColor: 'rgba(255, 255, 255, 0)'
          }}>
            {renderPopOver()}
          </View>
    
        </SafeAreaProvider>
        );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // alignItems: 'flex-start',
    padding: 4,
    // justifyContent: 'flex-start',
    marginBottom: 10,
  },
  avatarContainer: {
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
  },
  textContainer: {
    flexDirection: 'column',
    // flex: 1,
    width: '80%',
    
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  upperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  name: {
    fontWeight: 'bold',
  },
  date: {
    color: '#555',
  },
  chat: {
    fontSize: 16,
  },
  });

export default ChatListScreen;