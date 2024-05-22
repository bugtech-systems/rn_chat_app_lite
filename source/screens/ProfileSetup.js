/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS, icons } from '../constants';

import PhoneInput from "react-native-phone-number-input";
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment-timezone';
// import { useDispatch, useSelector } from 'react-redux';

import { StackActions } from '@react-navigation/native';
// Realm related Imports
import { realmContext } from '../RealmContext';
import {BSON} from 'realm';
import { useApp, useUser } from '@realm/react';
import { Profile, users } from '../Models';

const { useRealm, useQuery, useObject } = realmContext;
const itemSubscriptionName = 'items';
const ownItemsSubscriptionName = 'ownItems';
const ProfileSetup = ({ navigation }) => {
	// const dispatch = useDispatch()
	const [values, setValues] = useState({
		first_name: '',
		last_name: '',
		phone: '',
		date_of_birth: '',
		gender: '',
		address: ''
	});

	const phoneInput = useRef(null);
	const [formattedValue, setFormattedValue] = useState("");

	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(null);
	const [items, setItems] = useState([
		{ label: 'Female', value: 'female' },
		{ label: 'Male', value: 'male' }
	]);


	const [date, setDate] = useState(new Date(1598051730000));
	const [mode, setMode] = useState('date');
	const [show, setShow] = useState(false);

	
	
	const realm = useRealm();
	const realmUser = useUser();
	const app = useApp();
	
	
	
	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate;
		setShow(false);
		setDate(currentDate);
		setValues({ ...values, date_of_birth: currentDate })
	};

	const showMode = (currentMode) => {
		setShow(true);
		setMode(currentMode);
	};

	const showDatepicker = () => {
		showMode('date');
	};
	

	const handleSubmit = async () => {
		console.log(values, "VALUES HERE!")
	}
	const userObj = useQuery(users).filtered('email == $0', app.currentUser?.customData.email);

		// const userObj = realm.useQuery()
		// console.log(realmUser.customData, "REALM")
	const handleRealmObjects = async () => {
		const userId = realmUser.customData._id;
		
		if (!userId) {
			const user = realm.write(() => {
				const createProfile = realm.create(Profile, {
					_id: new BSON.ObjectId(),
					email: realmUser.customData.email,
					first_name: values.first_name,
					last_name: values.last_name,
					date_of_birth: values.date_of_birth,
					phone: values.phone,
					gender: values.gender,
					address: values.address
				})
				
				console.log(createProfile, "CREATE PROFILE!")
			})
			
			console.log(user, "USER CREATE")
			
			
			console.log(userObj, "OBJECT NI USER")
			if (userObj) {
				/* realm.write(() => {
					userObj.status = 'completed'
				}) */
				navigation.dispatch(
					StackActions.replace('Chats', { params: values } )
				);
			} else {
				return Alert.alert('Error padin')
			}
		
		}
		// console.log(user, "USER BA?")
		
	}
	

	console.log(userObj, "REALM USER")
	
	useEffect(() => {
		let data1 = realm.objects(Profile).filtered('email == $0', realmUser?.customData?.email);
		let data2 = realm.objects(users).filtered('email == $0 && status == $1', realmUser.customData?.email, 'pending');

		realm.subscriptions.update(mutableSubs => {
			mutableSubs.removeByName(itemSubscriptionName);
			mutableSubs.add(data1, { name: ownItemsSubscriptionName });
		  });
	
		realm.subscriptions.update(mutableSubs => {
			mutableSubs.removeByName('ownItem2');
			mutableSubs.add(data2, { name: 'items2' });
		});1
	});
	
	console.log(userObj, "USER OBJ")
	
	return (
		<>
			<ScrollView style={{ flex: 1, backgroundColor: COLORS.white2 }}>
				{/* <ScrollView
				scrollEnabled={true}
				style={{ margin: 10, flex: 1}}
				containerStyle={{ alignItems: 'center', justifyContent: 'center', padding: 10}}
			> */}
				<View style={{ ...styles.subContainer, }}>
					<View style={{ ...styles.inputGroup, alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1 }}>
						<Text>
							Personal Details
						</Text>
						<Text style={styles.inputLabel}>
							<Text style={{ color: COLORS.red }}>* </Text>
							First name
						</Text>
						<TextInput
							placeholder='First name'
							placeholderTextColor={COLORS.gray900}
							value={values.first_name}
							onChangeText={(e) => setValues({ ...values, first_name: e })}
							style={styles.fullWidthInput}
						/>
						<Text style={styles.inputLabel}>
							<Text style={{ color: COLORS.red }}>* </Text>
							Last name
						</Text>
						<TextInput
							placeholder='Last name'
							placeholderTextColor={COLORS.gray900}
							value={values.last_name}
							onChangeText={(e) => setValues({ ...values, last_name: e })}
							style={styles.fullWidthInput}
						/>
						<View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
							<Text style={{ ...styles.inputLabel, width: '50%', }}>
								<Text style={{ color: COLORS.red }}>* </Text>
								Gender
							</Text>
							<Text style={{ ...styles.inputLabel, width: '50%', }}>
								<Text style={{ color: COLORS.red }}>* </Text>
								Date of Birth
							</Text>
						</View>
						<View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', }}>
							<DropDownPicker
								style={{ borderWidth: 0, backgroundColor: COLORS.gray200 }}
								containerStyle={{ ...styles.halfWidth, height: 50, }}
								dropDownContainerStyle={{ width: '110%', borderWidth: 0, backgroundColor: COLORS.white2 }}
								textStyle={styles.inputTextStyle}
								listItemLabelStyle={{ color: COLORS.black700, fontWeight: '400' }}
								open={open}
								placeholder='Gender'
								placeholderStyle={{ color: COLORS.gray900 }}
								value={value}
								onChangeValue={(e) => setValues({...values, gender: e})}
								items={items}
								setOpen={setOpen}
								/* renderListItem={(items) => (
										  <View>
											  <Text>
												  {items?.label}
											  </Text>
										  </View>
								)} */
								setValue={setValue}
								setItems={setItems}
							/>
							<TouchableOpacity
								onPress={showDatepicker}
								style={{ width: 175, borderWidth: .5, backgroundColor: COLORS.gray200, elevation: 5, height: 50, borderRadius: 8, borderColor: COLORS.gray500, alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}
							>
								<Text style={{ ...styles.inputTextStyle, color: values.date_of_birth === '' ? COLORS.gray900 : COLORS.black900 }}>
									{values.date_of_birth === '' ? '-- / -- / --' : moment(values.date_of_birth).format('MM/DD/YY')}
								</Text>
								<Image source={icons.calendar} resizeMode='contain' style={{ height: 25, width: 25, tintColor: COLORS.primary }} />
							</TouchableOpacity>
							{show && (
								<DateTimePicker
									testID="dateTimePicker"
									value={date}
									mode={mode}
									is24Hour={true}
									onChange={onChange}
								/>
							)}
						</View>
						<View style={{ marginTop: 70, }}>

							<Text>
								Contact and Address
							</Text>
							<Text style={styles.inputLabel}>
								<Text style={{ color: COLORS.red }}>* </Text>
								Mobile
							</Text>
							{/* <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',}}> */}
							<PhoneInput
								ref={phoneInput}
								defaultValue={value}
								defaultCode="PH"
								layout="first"
								onChangeText={(text) => {
									setValues({ ...values, phone: text });
								}}
								onChangeFormattedText={(text) => {
									setFormattedValue(text);
								}}

								containerStyle={{ ...styles.fullWidthInput, borderWidth: .5, borderColor: COLORS.gray600, height: 45, alignItems: 'center', justifyContent: 'center', elevation: 5 }}
								textInputStyle={{ ...styles.inputTextStyle, color: values.phone === '' ? COLORS.gray900 : COLORS.black900, height: 45, width: '100%', borderColor: COLORS.black900 }}
								codeTextStyle={{ height: 20, fontSize: 14, alignItems: 'center', justifyContent: 'center', color: COLORS.gray900, right: 10, marginRight: -5 }}
								textContainerStyle={{ height: 45, borderTopWidth: .5, borderBottomWidth: .5, backgroundColor: COLORS.gray200, borderColor: COLORS.gray900 }}
								flagButtonStyle={{ width: '15%' }}
								withDarkTheme
								withShadow
								autoFocus
							/>

						</View>
						{/* <View style={{ paddingHorizontal: 10, width: '100%'}}> */}
						<Text style={styles.inputLabel}>
							<Text style={{ color: COLORS.red }}>* </Text>
							Email Address
						</Text>
						<TextInput
							placeholder='buymecoffee@gmail.com'
							placeholderTextColor={COLORS.gray900}
							// value={}
							// onChangeText={(e) => setValues({ ...values, phone: e })}
							style={styles.fullWidthInput}
						/>
						
						<Text style={styles.inputLabel}>
							{'Country (optional)'}
						</Text>
						<TextInput
							placeholder='Select Country'
							placeholderTextColor={COLORS.gray900}
							value={values.address}
							onChangeText={(e) => setValues({ ...values, address: e })}
							style={styles.fullWidthInput}
						/>



						{/* </View> */}
						{/* </View> */}

					</View>
				</View>
				{/* </ScrollView> */}
			</ScrollView>
			<View style={{ width: '100%', alignItems: 'center', padding: 10, backgroundColor: "rgba(255, 255, 255, .1)" }}>
				<TouchableOpacity
					onPress={handleRealmObjects}
					style={{ backgroundColor: COLORS.primary, alignItems: 'center', width: 250, padding: 10, borderRadius: 8, elevation: 5 }}>
					<Text style={{ fontWeight: 'bold', fontSize: 16, color: COLORS.white }}>SUBMIT</Text>
				</TouchableOpacity>
			</View>
		</>
	);
};

export default ProfileSetup;

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white2 },
	subContainer: { flex: 1, flexDirection: 'column', width: '100%', padding: 20, alignItems: 'center', justifyContent: 'center', },
	inputGroup: { width: '100%', alignItems: 'flex-start', flexDirection: 'column' },
	fullWidthInput: { fontWeight: '600', color: COLORS.black900, fontSize: 14, paddingHorizontal: 8, backgroundColor: COLORS.gray200, width: '100%', borderWidth: 0.5, borderColor: COLORS.gray300, elevation: 5, borderRadius: 4 },
	halfWidth: { fontWeight: '600', color: COLORS.black900, fontSize: 14, paddingHorizontal: 8, backgroundColor: COLORS.gray200, width: '45%', borderWidth: 0.5, borderColor: COLORS.gray300, elevation: 5, borderRadius: 4 },
	semiFullWidthInput: { fontSize: 14, paddingHorizontal: 8, backgroundColor: COLORS.gray200, width: '75%', borderWidth: 0.5, borderColor: COLORS.gray300, elevation: 5, borderRadius: 4 },
	shortWidthInput: { fontSize: 14, paddingHorizontal: 8, backgroundColor: COLORS.gray200, width: '20%', borderWidth: 0.5, borderColor: COLORS.gray300, elevation: 5, borderRadius: 4 },
	inputLabel: { paddingTop: 6, color: COLORS.black100, fontSize: 10 },
	inputTextStyle: { fontSize: 16, fontWeight: '600', color: COLORS.black900 }
});
