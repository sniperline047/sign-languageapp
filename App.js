
import React, { Component } from 'react';
import { StyleSheet, PermissionsAndroid, View, Linking, Button, Text, TouchableOpacity, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import CameraRoll from "@react-native-community/cameraroll";

class App extends Component {
  state = {
    isCameraVisible: false,
    isFront: false
  }

  hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
  
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  takeVideo = async () => {
    const options = {};
    const data = await this.camera.recordAsync(options);
    if (!await (this.hasAndroidPermission())) {
      return;
    }
    CameraRoll.save(data.uri);
  }

  stopVideo = async () => {

      this.camera.stopRecording();
  }

  takePicture = async () => {
    const options = {};
    const data = await this.camera.takePictureAsync(options);
    if (!await (this.hasAndroidPermission())) {
      return;
    }
    CameraRoll.save(data.uri);
  }

  changeCamera = () => {
    this.setState({isFront: !this.state.isFront});
  }

  render() { 
    return (  
      <View style={styles.container}>
        {
          !this.state.isCameraVisible && 
          <View style={styles.firstPage}>
            <Text style={styles.title}>
              Sign Language Converter
            </Text>
            <Image 
              source={{uri: 'https://i.ibb.co/ZfrY85t/Capture.png'}}
              style={{width: 300, height: 100, marginTop: 250}}
            />
            <Text style={{fontSize: 25}}>Scan List is Empty</Text>
            <Text>Start scanning to make a list</Text>
            <TouchableOpacity 
              onPress={() => {this.setState({isCameraVisible: true})}}
              style={styles.scanButton}
            >
                <Text style={{ fontSize: 16, marginTop: 5 }}>Scan</Text>
            </TouchableOpacity>
          </View>
        }
        {
          this.state.isCameraVisible && 
            <RNCamera
            style={styles.scanner}
            ref={ref => {
              this.camera = ref
            }}
            type={this.state.isFront ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
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
          >
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity onPressIn={this.takeVideo.bind(this)} onPressOut = {this.stopVideo.bind(this)} style={styles.video}>
                <Text style={{ fontSize: 25 }}>🎥</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
                <Text style={{ fontSize: 25 }}>📷</Text>
              </TouchableOpacity>
              <TouchableOpacity onPressIn={this.changeCamera} style={styles.changeCamera}>
                <Text style={{ fontSize: 25 }}>🔁</Text>
              </TouchableOpacity>
            </View>
          </RNCamera>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  firstPage: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  title: {
    width: '100%',
    height: 50,
    paddingVertical: 10,
    fontSize: 20,
    backgroundColor: "#61dafb",
    textAlign: 'center'
  },
  scanButton: {
    flex: 0,
    width: 80,
    height: 80,
    marginTop: 200,
    padding: 22,
    backgroundColor: '#61dafb',
    borderRadius: 40,
  },
  scanner: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  video: {
    flex: 0,
    width: 60,
    height: 60,
    backgroundColor: 'red',
    borderRadius: 30,
    paddingTop: 10,
    paddingLeft: 15,
    alignSelf: 'center',
    margin: 20,
  },
  capture: {
    flex: 0,
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 30,
    paddingTop: 10,
    paddingLeft: 15,
    alignSelf: 'center',
    margin: 20,
  },
  changeCamera: {
    flex: 0,
    width: 60,
    height: 60,
    backgroundColor: 'orange',
    borderRadius: 30,
    paddingTop: 10,
    paddingLeft: 15,
    alignSelf: 'center',
    margin: 20,
  }
})

export default App;