
import React, { Component } from 'react';
import { 
  StyleSheet, 
  PermissionsAndroid, 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  BackHandler, 
  Dimensions, 
  StatusBar } from 'react-native';
import { RNCamera } from 'react-native-camera';
import CameraRoll from "@react-native-community/cameraroll";
import VideoList from './src/components/VideoList';
import moment from 'moment';
import VideoPlayer from 'react-native-video-player';


class App extends Component {
  state = {
    isCameraVisible: false,
    isFront: false,
    selectedVideo: '',
    videos: [],
    isVideoOn: false, 
    orientation: 'potrait'
  }
  getOrientation = () =>
  {
    if( this.refs.rootView )
    {
        if( Dimensions.get('window').width < Dimensions.get('window').height )
        {
          this.setState({ orientation: 'portrait' });
          console.log(this.state.orientation);
        }
        else
        {
          this.setState({ orientation: 'landscape' });
          console.log(this.state.orientation);
        }
    }
  }

  componentDidMount()
  {
    this.getOrientation();
    
    Dimensions.addEventListener( 'change', () =>
    {
      this.getOrientation();
    });
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      Alert.alert("Hold on!", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    });
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
    await CameraRoll.save(data.uri);
    Alert.alert(
      "Video Save Success",
      `Your video was successfully saved to DCIM folder. Data URI: ${data.uri}`,
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
    const newVideo = {
      uri: data.uri,
      key: Math.random(),
      name: `VID-${(moment().format()).substr(0,moment().format().length - 6)}`
    }
    this.setState({
      videos: [...this.state.videos, newVideo]
    });
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
    await CameraRoll.save(data.uri); 
  }

  changeCamera = () => {
    this.setState({isFront: !this.state.isFront});
  }

  backAction2 = () => {
    this.setState({
      isVideoOn: false,

    })
    return true;
  };

  backAction1 = () => {
    this.setState({
      isCameraVisible: false,

    })
    return true;
  }

  handleVideo = uri => {
    this.setState({
      isVideoOn: true,
      selectedVideo: uri,
 
     });
    const backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction2);
  }

  render() { 
    if(!this.state.isVideoOn){
        return (  
          <View style={styles.container} ref = "rootView">
            <StatusBar backgroundColor='#3ea6ff' />
            {
              !this.state.isCameraVisible && 
              <View style={styles.firstPage}>
                <Text style={styles.title}>
                  Sign Language Converter
                </Text>

                {
                  this.state.videos.length === 0 && 
                  <View style={{width: '100%', height: 600, flex: 1, justifyContent: 'center'}}>
                    <Text style={{fontSize: 25, textAlign: 'center', color: 'white'}}>Scan List is Empty</Text>
                    <Text style={{textAlign: 'center', color: 'white'}}>Start scanning to make a list</Text>
                  </View>
                }
                {
                  this.state.videos.length > 0 && 
                  <View style={{width: '100%', marginTop: 5}}>
                    <VideoList videos={this.state.videos} handleVideo={this.handleVideo}/>
                  </View>
                }
                <TouchableOpacity 
                  onPress={() => {
                    this.setState({isCameraVisible: true, });
                    const backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction1);
                  }}
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
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <TouchableOpacity onPressIn={this.takeVideo.bind(this)} onPressOut = {this.stopVideo.bind(this)} style={styles.video}>
                    <Text style={{ fontSize: 25 }}>🎥</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
                    <Text style={{ fontSize: 25 }}>📷</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPressIn={this.changeCamera} style={styles.changeCamera}>
                    <Text style={{ fontSize: 25 }}>🔁</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {this.setState({
                      isCameraVisible: false
                    })}} style={styles.backButton}
                  >
                  <Text style={{ fontSize: 25  }}>⬅️</Text>
                </TouchableOpacity>
                </View>
              </RNCamera>  
            }
          </View>
      )
    }else if(this.state.isVideoOn){
      return (
        <View ref = "rootView">
            <VideoPlayer
              video={{ uri: this.state.selectedVideo }}
              videoWidth={this.state.orientation === 'portrait' ? 1000 : 2340}
              videoHeight={this.state.orientation === 'portrait' ? 2000: 1050}
            />
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#181818'
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
    backgroundColor: "#3ea6ff",
    textAlign: 'center'
  },
  scanButton: {
    flex: 0,
    width: 80,
    height: 80,
    marginBottom: 8,
    padding: 22,
    backgroundColor: '#3ea6ff',
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
    backgroundColor: '#fe7401',
    borderRadius: 30,
    paddingTop: 10,
    paddingLeft: 15,
    alignSelf: 'center',
    margin: 20,
  },
  backButton: {
    flex: 0,
    width: 60,
    height: 60,
    backgroundColor: '#059def',
    borderRadius: 30,
    paddingTop: 10,
    paddingLeft: 15,
    alignSelf: 'center',
    margin: 20,
  }
})

export default App;