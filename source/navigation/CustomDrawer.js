/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const CustomDrawer = () => {
    return (
        <View style={{...styles.container, alignItems: 'center', justifyContent: 'center',}}>
            <Text>CustomDrawer</Text>
        </View>
    );
};

export default CustomDrawer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 10,
    },
});
