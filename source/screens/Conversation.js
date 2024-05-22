/* eslint-disable prettier/prettier */
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../constants'

const Conversation = ({ navigation, route }) => {

	console.log(route.params, 'PARAMS in Conversation!')
	
	return (
		<SafeAreaView style={styles.container}>
			<View>
				<Text>Conversation</Text>
			</View>
		</SafeAreaView>

	)
}

export default Conversation

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white2},
	
})