'use strict';
import React, { Component } from 'react';
import { AppRegistry, Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { dirPictures } from './dirStorage';


const RNFS = require('react-native-fs');
const moment = require('moment');


//move the attachment to app folder
const moveAttachment = async (filePath, newFilepath) => {
  return new Promise((resolve, reject) => {
    RNFS.mkdir(dirPictures)
      .then(() => {
        RNFS.moveFile(filePath, newFilepath)
          .then(() => {
            console.log('FILE MOVED', filePath, newFilepath);
            resolve(true);
          })
          .catch(error => {
            console.log('moveFile error', error);
            reject(error);
          });
      }) 
      .catch(err => {
        console.log('mkdir error', err);
        reject(err);
      });
  });
};

class Camera extends Component {
  state = {}
  render() {
    const { imageUri } = this.state;
    const { correctedImage } = this.state;
    if (correctedImage) {
      return (
        <View style={{transform: [{ rotate: "90deg" }]}}>
          <Image source={{uri: `data:image/jpg;base64,${correctedImage}`}} style={{width: Dimensions.get('window').height, height: Dimensions.get('window').width}}/>
        </View>
      )
    }
    if (imageUri) {
      console.log(this.state.qr)
      Vibration.vibrate();
      return (
        <Image source={{uri: imageUri}} style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}/>
      )
    }
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onBarCodeRead={this.takePicture.bind(this)
          }
        />
      </View>
    );
  }

  processImage = async () => {
    try {
      let response = await fetch(
        "https://us-central1-bridge-urops.cloudfunctions.net/anything-is-fine",
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(this.state)
        }
      );
      if (response.status >= 200 && response.status < 300){
        const message = await response.json();
        this.setState({correctedImage: message.corrected_image})
      }
    } catch (errors) {
      alert(errors);
    }
  }

  saveImage = async filePath => {
    try {
      // set new image name and filepath
      const newImageName = `${moment().format('DDMMYY_HHmmSSS')}.jpg`;
      const newFilepath = `${dirPictures}/${newImageName}`;
      // move and save image to new filepath
      const imageMoved = await moveAttachment(filePath, newFilepath);
      console.log('image moved', imageMoved);
      this.setState({ imageUri: 'file://' + newFilepath });
    } catch (error) {
      console.log(error);
    }
  };
  
  takePicture = async qrcode => {
    try{
      if (this.camera && qrcode.type == "QR_CODE") {
        const options = { quality: 0.5, base64: true };
        const data = await this.camera.takePictureAsync(options);
        this.setState({image: data.base64});
        this.setState({qr : qrcode});
        this.processImage();
        this.saveImage(data.uri);
      }
    } catch (error) {
      console.log(error);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default Camera;