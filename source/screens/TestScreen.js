/* eslint-disable prettier/prettier */
import React, {useEffect, useState, useRef, useCallback} from 'react';
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
    PermissionsAndroid
} from "react-native";

import QRCodeStyled from 'react-native-qrcode-styled';
import QRCode from 'react-native-qrcode-svg';

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
import ViewShot, { captureRef } from 'react-native-view-shot';

import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone'


// import { readFileSync } from 'fs';
import {html2canvas} from 'html2canvas';
import RNFS, { setReadable } from 'react-native-fs';
import base64 from 'react-native-base64';
import img from '../assets/images/index.html'
import LOGO from './bwlogo.webp'
import images from '../constants/images';
import { useFocusEffect } from '@react-navigation/native';
import Share from 'react-native-share';
import { COLORS } from '../constants';
import RNQRGenerator from 'rn-qr-generator';

const {ReactNativeLoading} = NativeModules;

// --------------------------------
// RawBT events listener
// --------------------------------
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

// -------------------------
// First demo
// --------------------------
const printHello = async () => {
    let job = new RawBTPrintJob();

    job.println("Hello,World!");

    RawbtApi.printJob(job.GSON()).catch((err) => showError(err.message));
};


export default function TestScreen() {
    const [imageBase64, setImageBase64] = useState('');
    const [qrCode, setQrUri] = useState('')
    const viewShotRef = useRef();
    const qrCodeRef = useRef();
    const svgRef = useRef();
    const [initializer, setInitializer] = useState(0);
    const [printData, setPrintData] = useState({
        variableTicket: '',
    });
    
    let imgHdr = Image.resolveAssetSource(LOGO).uri;
    // let qrHdr = Image.resolveAssetSource(require(qrCode)).uri;
    

    
    let numb = '12353123'
    
    const htmlContent = `
        <!DOCTYPE html>
        <html>

        <head>
        <title>Sample HTML</title>
        </head>
        <body style="padding: 30px">
        <img src="${imgHdr}" alt='' width="100%" height="250">
        <div style="width: 100%; display: flex; flex-direction: row; justify-content: space-between; padding: 10px;">
        <div style="width: 80%;">
        <p style="height: 10px; padding: 10px; font-size: 500%;"><b>OFFICIAL RECEIPT</b></p>
        <p style="height: 10px; padding: 10px; color: #333232; font-size: 400%">TICKET #: ${printData.variableTicket !== '' ? printData.variableTicket : 'n/a'}</p>
        <p style="height: 10px; padding: 10px; color: black; font-size: 400%"><b>${moment(moment().toDate()).format('MMMM DD, YYYY hh:mmA')}</b></p>

        </div>
        <div style="display: flex; width: 20%; align-items: center; justify-content: center">
        <img 
        src=${qrCode}
        width="200" 
        height="200"
        >
        </div>
        </div>
        

        <div style="width: 100%; display: flex; flex-direction: row; justify-content: space-between; padding: 10px;">
        <div>
            <p style="text-align: left; height: 20px; font-size: 400%;">Game: <b>3D</b></p>
            <p style=" text-align: left; height: 20px; font-size: 400%;">Draw: <b>2PM</b></p>
        </div>
        
        <div>
            <p style=" text-align: left; font-size: 400%; height: 20px;">Date: <b>${moment(moment().toDate()).format('MMMM DD, YYYY')}</b></p>
            <p style=" text-align: left; font-size: 400%; height: 20px;">Agent: <b>JESSICA</b></p>
        </div>
        
        </div>
    
        <table style="width: 100%; border: 2px solid black">
        <br/>1
      <tr>
        <td style="text-align: center; padding: 10px; width: 20%; border-right: 2px solid black;  border-bottom: 2px solid black; font-size: 400%;">COMBI</td>
        <td style="border-right: 2px solid black; text-align: center; padding: 10px; width: 20%; border-bottom: 2px solid black; font-size: 400%;">S</td>
        <td style="border-left: 2px solid black; text-align: center; padding: 10px; width: 20%; border-bottom: 2px solid black; font-size: 400%;">R</td>
        <td style="border-left: 2px solid black;  text-align: center; padding: 10px; width: 20%; border-bottom: 2px solid black; font-size: 400%;">STAT</td>
      </tr>
      <tr>
        <td style="text-align: center; padding: 10px; width: 25%; border-right: 2px solid black; font-size: 400%;">2-1-7</td>
        <td style="text-align: center; padding: 10px; width: 25%; border-right: 2px solid black; font-size: 400%;">10</td>
        <td style="text-align: center; padding: 10px; width: 25%; border-left: 2px solid black; font-size: 400%;">10</td>
        <td style="text-align: center; padding: 10px; width: 25%; font-size: 400%; border-left: 2px solid black; ">OK</td>
      </tr>
    </table>
    
    <table style="width: 100%">
    <br/>
    <br/>
    <br/>
    <br/>
    
        <tr style="text-align: center;">
            <td style="border-bottom: 2px solid black; padding-bottom: 40px; font-size: 400%">Total Amount Paid:  <b>₱20.00</b></td>
        </tr>
        </table>
    
        <table style="width: 100%">
        <br/>
        
        <tr style="text-align: center;">
        <td style="font-size: 400%;"><b>REF #: 97867861</b></td>
        </tr>
    </table>
        </body>
        </html>
      `;

    const captureAndSaveImage = async () => {
        let x = Math.random();
        setInitializer(x);
        let job = new RawBTPrintJob();
        
        // const qrCodeUri = await captureRef(qrCodeRef, {
        //     format: 'png',
        //     quality: 0.8,
        //   });


        try {
        // let img = Image.resolveAssetSource(require('../assets/images/bwlogo.webp')).uri;
        // let headerBase64String = await RawbtApi.getImageBase64String(img)
    
        let base64String = await RawbtApi.getImageBase64String(imageBase64);
// let QRbase64String = await RawbtApi.getImageBase64String(qrCode);
    // console.log(base64String, "base64String")

    // job.println("Hello,World!");
    
        job.image(base64String);
        RawbtApi.printJob(job.GSON()).catch((err) => showError(err.message));
            
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save the image');
        }
    };
    
    
    
    /* useEffect(() => {
        const fetchImageBase64 = async () => {
            // const imagePath = '/source/assets/images/index.html';  // Replace with the actual path
            // console.log(RNFS.DocumentDirectoryPath, "CONSOLE")
            // const imagePath = 'C:/Users/jaybe/Downloads/index.html';
            // const imagePath = RNFS.DocumentDirectoryPath + '/Documents/001.jpg'; // Change this to your image's path
            // console.log(imagePath, "WEW")
            // const img = await RNFS.readFile('file://' + img)
            // let imageUri = Image.resolveAssetSource(require("../assets/images/image.png"));
            // let base64String = await RawbtApi.getImageBase64String(htmlContent);
            // const base64String = await getImageBase64String(img);
            setImageBase64(base64String);
        };

        fetchImageBase64();
    }, []); */
    
    useEffect(() => {
        // on mount
        viewShotRef.current.capture().then(uri => {
            setImageBase64(uri);
          console.log("do something with ", uri);
        });
        // qrCodeRef.current.capture().then(uriData => {
        //     console.log(uriData, "uriData")
        //     setQrUri(uriData)
        // })
    //     svgRef.current.toDataURL((data) => {
    //         const filePath = `${RNFS.DocumentDirectoryPath}/qrcode.png`;
    //         RNFS.writeFile(filePath, data, 'base64')
    //           .then(() => {
    //             console.log('QR code saved to', filePath);
    //             RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    //             .then((result) => {
    //               console.log('GOT RESULT', result);
    //               console.log(result[1].path, "PATH")
                  
                  
    // // let qrHdr = Image.resolveAssetSource(require(result[0].path)).uri;
    //               setQrUri(result[1].path)
                  
    //               // stat the first file
    //             //   return Promise.all([RNFS.stat(result[0].path), result[0].path]);
    //             })
    //           })
    //           .catch((err) => {
    //             console.error(err);
    //           });
    //         })
    RNQRGenerator.generate({
        value: 'PATAYA',
        type: 'QR Code',
        height: 200,
        width: 200,
      })
        .then( async (response) => {
          const { uri, width, height, base64 } = response;
          console.log(response, 'response')
          const base64Strings = await RNFS.readFile(uri, 'base64');
          console.log(base64Strings, "base64String")
          const dataUrl = `data:image/png;base64,${base64Strings}`;
          setQrUri(dataUrl);
        })
        .catch(error => console.log('Cannot create QR code', error));
      }, [])
      console.log(imageBase64, "imageBase64")

    // const getImageBase64String = async (imageBase64) => {
    //     try {
    //         console.log(imageBase64, 'IMG PATH')
    //         // const encoded = base64.encode(imagePath)

    //         const base64String = await RNFS.readFile(imageBase64, 'base64');
    //         return base64String;
    //     } catch (error) {
    //         console.error('Error converting image to base64:', error);
    //         return null;
    //     }
    // };

    // const printReceipt = async () => {
    //     const htmlContent = `
    //     <!DOCTYPE html>
    //     <html>
    //     <head>
    //       <title>Sample HTML</title>
    //     </head>
    //     <body style="padding: 30px">
    //     <img src="../assets/images/bwlogo.jpg" alt="Flowers in Chania" width="460%" height="345">
    //     <table style="width: 100%">
    //     <tr>
    //     <td style="font-size: 350%;"><b>OFFICIAL RECEIPT</b></td>
    //     </tr>
    //     <tr>
    //         <td style="color: #333232; font-size: 250%">TICKET #: ${printData.variableTicket !== '' ? printData.variableTicket : 'n/a'}</td>
    //     </tr>
    //     <tr>
    //         <td style="color: black; font-size: 250%"><b>${moment(moment().toDate()).format('MMMM DD, YYYY hh:mmA')}</b></td>
    //     </tr>
    //     </table>
        
        
    //     <table style="width: 100%">
    //     <tr>
    //         <td style="text-align: left; font-size: 250%;">Game: <b>3DL</b></td>
    //         <td style="text-align: left; font-size: 250%;">Date: <b>${moment(moment().toDate()).format('MMMM DD, YYYY')}</b></td>
    //     </tr>
    //     <tr>
    //     <br/>
    //     <br/>
    //         <td style="text-align: left; font-size: 250%;">Draw: <b>2PM</b></td>
    //         <td style="text-align: left; font-size: 250%;">Agent: <b>JESSICA</b></td>
    //     </tr>
    //     </table>
    
    //     <table style="width: 100%; border: 1px solid black">
    //     <br/>
    //   <tr style="text-align: center;">
    //     <td style="width: 25%; border-bottom: 1px solid black; border-right: 1px solid black; font-size: 250%;">COMBI</td>
    //     <td style="width: 25%; border-bottom: 1px solid black; border-right: 1px solid black; font-size: 250%;">S</td>
    //     <td style="width: 25%; border-bottom: 1px solid black; border-right: 1px solid black; font-size: 250%;">R</td>
    //     <td style="width: 25%; border-bottom: 1px solid black; font-size: 250%;">STAT</td>
    //   </tr>
    //   <tr style="text-align: center;">
    //     <td style="width: 25%; border-right: 1px solid black; font-size: 250%;">2-1-7</td>
    //     <td style="width: 25%; border-right: 1px solid black; font-size: 250%;">10</td>
    //     <td style="width: 25%; border-right: 1px solid black; font-size: 250%;">10</td>
    //     <td style="width: 25%; font-size: 250%;">OK</td>
    //   </tr>
    // </table>
    
    // <table style="width: 100%">
    // <br/>
    // <br/>
    // <br/>
    // <br/>
    
    //     <tr style="text-align: center;">
    //         <td style="border-bottom: 1px solid black; padding-bottom: 40px; font-size: 250%">Total Amount Paid:  <b>₱20.00</b></td>
    //     </tr>
    //     </table>
    
    //     <table style="width: 100%">
    //     <br/>
        
    //     <tr style="text-align: center;">
    //     <td style="font-size: 250%;"><b>REF #: 97867861</b></td>
    //     </tr>
    // </table>
    //     </body>
    //     </html>
    //   `;
    //     try {
    //         let job = new RawBTPrintJob();
    //         let attrStrTitle2 = new AttributesString()
    //         .setAlignment(ALIGNMENT_CENTER)
    //         .setDoubleHeight(true)
    //         .setDoubleWidth(true);
            
    //     // job.println(imageBase64, attrStrTitle2);
    //         job.image(imageBase64, new AttributesImage(ALIGNMENT_CENTER, 20));
    //         // await getImageBase64String()
    //         // Image.resolveAssetSource(require("./assets/bwlogo.webp")).uri;
    //         // const response = await job.printHtml(htmlContent);
    //         // console.log('Print response:', response);
    //         job.getImageBase64String(imageBase64)
    //         RawbtApi.printJob(job.GSON()).catch((err) => showError(err.message));
    //     } catch (error) {
    //         console.error('Print error:', error);
    //     }
    // };
    
    const printReceipt = async () => {
        
        requestPermission()
        
        // let imageUri = Image.resolveAssetSource(require('../assets/images/bwlogos.jpg')).uri;
        let base64String = await RawbtApi.getImageBase64String(htmlContent);
        
        let job = new RawBTPrintJob();

        job.image(base64String);
        
        RawbtApi.printJob(job.GSON()).catch((err) => showError(err.message));
        


        return;
    };



    const requestPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'File Access Permission',
                message:
                    'Allow to access photos ' +
                    'and media on your device?',

                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Deny',
                buttonPositive: 'Allow',
            },
            );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('You can use the camera');
                } else {
                    console.log('Camera permission denied');
                }
        } catch (err) {
            console.warn(err);
        }
        };

    useEffect(() => {
        requestPermission()
        RawbtApi.init();
    }, []);
    
    console.log(qrCode, "CODE ")

    return (
            <>
        <SafeAreaView style={styles.container}>
            <ScrollView>
            <View style={{ flex: 1, minHeight: 700, zIndex: 2, backgroundColor: COLORS.white}}>
            <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
        <WebView
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={{ minHeight: 650 }}
        />
        
      </ViewShot>

                {/* <Image source={require("./assets/rawbt.png")} style={styles.imgMain}/> */}
                {/* <View ref={qrCodeRef} style={{ position: 'absolute', bottom: 20, right: 20 }}> */}
        {/* </View> */}
                    
                        

                    
                    
                </View>
            </ScrollView>
            <View style={{ flex: 1, flexDirection: 'column',  justifyContent: 'flex-end',}}>
                <View style={{ margin: 5, height: 40}}>
            <Button title="CAPTURE" onPress={captureAndSaveImage}/>
                </View>
            {/* <StatusBar style="auto"/> */}
            </View>
            <PrinterProgress height={4} color='blue' />
        </SafeAreaView>
            </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? 25 : 0,
    },
    mainpart: {
        padding: 16,
    },
    imgMain: {
        flex: 1,
        width: 300,
        height: 300,
        left: "50%",
        marginLeft: -150,
        resizeMode: "contain",
    },
    p: {
        fontSize: 14,
        marginBottom: 8,
        marginTop: 8,
    },
    large: {
        marginTop: 32,
        marginBottom: 8,
        fontSize: 22,
    },
});