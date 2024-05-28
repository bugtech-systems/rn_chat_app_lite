/* eslint-disable prettier/prettier */
import React, {useEffect, useState, useRef} from 'react';
import {
    NativeEventEmitter,
    NativeModules,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Button,
    Image,
    Text,
    View,
    Alert,
    Platform,
    PermissionsAndroid,
    TouchableOpacity,
    TextInput
} from "react-native";

// -------------------------------------------
// RawBT API
// -------------------------------------------
import RawbtApi,
{
    RawBTPrintJob,
    AttributesString,
    AttributesBarcode,
    AttributesQRcode,
    AttributesImage,
    CommandBarcode,
    FONT_C,
    FONT_A,
    FONT_B,
    FONT_TRUE_TYPE,
    ALIGNMENT_LEFT,
    ALIGNMENT_CENTER,
    ALIGNMENT_RIGHT,
    HRI_ABOVE,
    HRI_BELOW,
    HRI_BOTH,
    BARCODE_UPC_A,
    BARCODE_UPC_E,
    BARCODE_EAN13,
    BARCODE_JAN13,
    BARCODE_EAN8,
    BARCODE_JAN8,
    BARCODE_CODE39,
    BARCODE_ITF,
    BARCODE_CODABAR,
    BARCODE_CODE93,
    BARCODE_CODE128,
    BARCODE_GS1_128,
    BARCODE_GS1_DATABAR_OMNIDIRECTIONAL,
    BARCODE_GS1_DATABAR_TRUNCATED,
    BARCODE_GS1_DATABAR_LIMITED,
    BARCODE_GS1_DATABAR_EXPANDED,
} from 'react-native-rawbt-api';
import PrinterProgress from '../components/PrintProgress';

import { WebView } from 'react-native-webview';
import ViewShot from 'react-native-view-shot';


import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone'


// import { readFileSync } from 'fs';
import {html2canvas} from 'html2canvas';
import RNFS, { setReadable } from 'react-native-fs';
import base64 from 'react-native-base64';
import img from '../assets/images/index.html'
import { COLORS, icons } from '../constants';

import { Dirs, FileSystem } from 'react-native-file-access';
import {checkMultiple, PERMISSIONS, requestMultiple} from 'react-native-permissions';
import images from '../constants/images';

const {ReactNativeLoading} = NativeModules;

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Sample HTML</title>
</head>
<body style="padding: 30px">
<img src="../assets/images/bwlogo.jpg" alt="Flowers in Chania" width="460%" height="345">
<table style="width: 100%">
<tr>
<td style="font-size: 350%;"><b>OFFICIAL RECEIPT</b></td>
</tr>
<tr>
    <td style="color: #333232; font-size: 250%">TICKET #: 'n/a'}</td>
</tr>
<tr>
    <td style="color: black; font-size: 250%"><b>${moment(moment().toDate()).format('MMMM DD, YYYY hh:mmA')}</b></td>
</tr>
</table>


<table style="width: 100%">
<tr>
    <td style="text-align: left; font-size: 250%;">Game: <b>3DL</b></td>
    <td style="text-align: left; font-size: 250%;">Date: <b>${moment(moment().toDate()).format('MMMM DD, YYYY')}</b></td>
</tr>
<tr>
<br/>
<br/>
    <td style="text-align: left; font-size: 250%;">Draw: <b>2PM</b></td>
    <td style="text-align: left; font-size: 250%;">Agent: <b>JESSICA</b></td>
</tr>
</table>

<table style="width: 100%; border: 1px solid black">
<br/>
<tr style="text-align: center;">
<td style="width: 25%; border-bottom: 1px solid black; border-right: 1px solid black; font-size: 250%;">COMBI</td>
<td style="width: 25%; border-bottom: 1px solid black; border-right: 1px solid black; font-size: 250%;">S</td>
<td style="width: 25%; border-bottom: 1px solid black; border-right: 1px solid black; font-size: 250%;">R</td>
<td style="width: 25%; border-bottom: 1px solid black; font-size: 250%;">STAT</td>
</tr>
<tr style="text-align: center;">
<td style="width: 25%; border-right: 1px solid black; font-size: 250%;">2-1-7</td>
<td style="width: 25%; border-right: 1px solid black; font-size: 250%;">10</td>
<td style="width: 25%; border-right: 1px solid black; font-size: 250%;">10</td>
<td style="width: 25%; font-size: 250%;">OK</td>
</tr>
</table>

<table style="width: 100%">
<br/>
<br/>
<br/>
<br/>

<tr style="text-align: center;">
    <td style="border-bottom: 1px solid black; padding-bottom: 40px; font-size: 250%">Total Amount Paid:  <b>₱20.00</b></td>
</tr>
</table>

<table style="width: 100%">
<br/>

<tr style="text-align: center;">
<td style="font-size: 250%;"><b>REF #: 97867861</b></td>
</tr>
</table>
</body>
</html>
`;

let subscription;
if (subscription === undefined) {
    const loadingManagerEmitter = new NativeEventEmitter(ReactNativeLoading);
    subscription = loadingManagerEmitter.addListener("RawBT", ({status,progress,message}) => {
        console.log(status+" "+progress+" "+message);
        // your code if it needs more <PrinterProgress />
    });
}


const showError = (error:string) => {
    Alert.alert('Print error',error,[
        {
            text: 'Cancel',
            style: 'cancel',
        },
    ]);
}


const printHello = async () => {
    let job = new RawBTPrintJob();
    
    const filePath = await RNFS.readDir(RNFS.PicturesDirectoryPath);
    
    // console.log(filePath[0].path, "file with path")
    // const file = await base64.filePath[0].path;
    
    // console.log(file, "FILE")
    
    
    
    
    // let img = Image.resolveAssetSource(file).uri;
    
    let base64String = await RawbtApi.getImageBase64String(htmlContent);

    // console.log(base64String, "base64String")

    // job.println("Hello,World!");
    
    job.image(base64String);
    RawbtApi.printJob(job.GSON()).catch((err) => showError(err.message));
};


const captureAndSaveImage = async () => {
    const path = `${RNFS.MainBundlePath}/image.jpg`;
    try {
        let fileCreated = await RNFS.writeFile(path, htmlContent, 'base64');
        // console.log('Image saved successfully:', path, imageBase64);
        console.log(fileCreated, 'Created file here!');
        // printReceipt(path);
    } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to save the image');
    }
};

export default function TestScreen() {
    const [imageBase64, setImageBase64] = useState('');
    
    const fileName = 'myfile.pdf'; //whatever you want to call your file
    // const filePath = `${RNFS.PicturesDirectoryPath}/images.png`;
    const base64Data = 'V3JpdGluZyBhIGZpbGUgYW5kIG1ha2luZyBpdCB2aXNpYmxlIHRvIHVzZXJzIGluIFJlYWN0IE5hdGl2ZQ=='; //our base64 encode file;
    

    const [printData, setPrintData] = useState({
        type: '',
        date: '',
        combination: '',
        agent: '',
        ref: '',
        ticketNum: '',
    });
    const [permissionResult, setPermission] = useState();

    
    const permissionWriteExternalStorage = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        setPermission(granted)
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    };
    
    const handlePrinter = async () => {
        try {
            
            try {
                let job = new RawBTPrintJob();
                console.log( "WI")
                let imageUri = Image.resolveAssetSource('../assets/images/bwlogo.webp').uri;
                let base64String = await RawbtApi.getImageBase64String(imageUri);
        
                console.log(base64String, "WE")
        
                let attrStrTitle = new AttributesString()
                    .setAlignment(ALIGNMENT_CENTER)
                    .setDoubleHeight(true)
                    .setDoubleWidth(true);
                job.println("Images", attrStrTitle);
                job.println(
                    "The picture is scaled to the width of the printer as a fraction. 16/16 means full width.Values 1-16 allowed."
                );
        
                job.image(base64String);
        
                job.ln();
                job.println("Scale 16(default) - full width");
                job.ln();
        
                let im50center = new AttributesImage(ALIGNMENT_CENTER, 8);
        
                job.image(base64String, im50center);
                job.ln();
                job.println("Scale: 8(50%). Alignment: center");
                job.ln();
        
                let im75right = new AttributesImage(ALIGNMENT_RIGHT, 12);
        
                job.image(base64String, im75right);
                job.ln();
                job.println("Scale: 12(75%). Alignment: right");
                job.ln();
        
                let im25left = new AttributesImage()
                    .setScale(4)
                    .setAlignment(ALIGNMENT_LEFT);
                job.image(base64String, im25left);
                job.ln();
                job.println("Scale: 4(25%). Alignment: left");
                job.ln();
        
                let imRotated = new AttributesImage().setRotateImage(true);
                job.image(base64String, imRotated);
                job.ln();
                job.println("Rotate");
                job.ln(3);
        
                RawbtApi.printJob(job.GSON()).catch((err) => 
                // showError(err.message)
                console.log("Error", err)
                );
            } catch(err) {
                // showError(err.message);
            }
    
        } catch (err) {
            console.log('Error:', err);
        }
    
        return;
    };
    
    const requestPermissions = async () => {
        try {
            let requests = await requestMultiple([PERMISSIONS.ANDROID.READ_MEDIA_IMAGES, PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION]).then(
                (statuses) => {
                  console.log('Camera', statuses[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES]);
                  console.log('FaceID', statuses[PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION]);
                },
              );
            
            
        } catch (error) {
            console.log('Error:', error)
            return error
        }
    }

    const checkPermissions = async () => {

        try {
            let permission = await checkMultiple([PERMISSIONS.ANDROID.READ_MEDIA_IMAGES, PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION]).then(
                (statuses) => {
                  console.log('Write', statuses[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES]);
                  console.log('Read', statuses[PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION]);
                  
                //   console.log(statuses['android.permission.READ_EXTERNAL_STORAGE'], "HERE")
                if ( statuses['android.permission.ACCESS_MEDIA_LOCATION'] === 'denied') {
                    requestPermissions();
                }
                },
              );
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    function renderPrintOptions() {
        
        

        return (
            <View style={{ flex: 1, width: '100%', padding: 20 }}>
                    <View style={{ flex: 1, flexDirection: 'column', width: '100%', alignItems: 'flex-start', justifyContent: 'center',}}>
                            <TextInput
                                data={printData?.type}
                                onChangeText={(e) => console.log(e)}
                                placeholder='Date'
                            />
                            <TextInput
                                data={printData?.type}
                                onChangeText={(e) => console.log(e)}
                                placeholder='Type'
                            />
                            <TextInput
                                data={printData?.type}
                                onChangeText={(e) => console.log(e)}
                                placeholder='Combination'
                            />
                            <TextInput
                                data={printData?.type}
                                onChangeText={(e) => console.log(e)}
                                placeholder='Agent'
                            />
                            <TextInput
                                data={printData?.type}
                                onChangeText={(e) => console.log(e)}
                                placeholder='Ref'
                            />
                            <TextInput
                                data={printData?.type}
                                onChangeText={(e) => console.log(e)}
                                placeholder='Ticket Number'
                            />
                    </View>
                    <Image
                    source={images.template}
                        resizeMode='contain'
                        style={{ height: '60%', width: '100%',}}
                    />
                    <View style={{  flex: 1, justifyContent: 'flex-end'}}>
                        <View style={{ alignItems: 'center'}}>
                            <TouchableOpacity style={{ borderWidth: 1, width: '80%', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 12, backgroundColor: COLORS.secondary}}
                                onPress={() => printHello()}
                            >
                                <Text style={{ fontSize: 18, fontWeight: '600', color: COLORS.white }}>
                                    PRINT
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => captureAndSaveImage()}
                            >
                                <Text>
                                    Create
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            </View>
        );
    }

    const checkConsole = async () => {
        // const check = await RNFS.write(filePath, "wew")
    // console.log(check, "YAWA")
    
    return

    }
    
    useEffect(() => {
        // permissionWriteExternalStorage()
        // checkConsole()
        checkPermissions()
        RawbtApi.init();
    }, [])

    console.log(permissionResult, "RESULT HERE!")
    
    return (
    <SafeAreaView style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? 25 : 0,
    }}>
        {renderPrintOptions()}
    </SafeAreaView>
    )


}