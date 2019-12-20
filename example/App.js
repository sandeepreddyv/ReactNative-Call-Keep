// import React, { useState, useEffect } from 'react';
// import { Platform, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
// import uuid from 'uuid';
// import RNCallKeep from 'react-native-callkeep';
// import BackgroundTimer from 'react-native-background-timer';
// import DeviceInfo from 'react-native-device-info';

// BackgroundTimer.start();

// const hitSlop = { top: 10, left: 10, right: 10, bottom: 10};
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: 20,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   button: {
//     marginTop: 20,
//     marginBottom: 20,
//   },
//   callButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 30,
//     width: '100%',
//   },
//   logContainer: {
//     flex: 3,
//     width: '100%',
//     backgroundColor: '#D9D9D9',
//   },
//   log: {
//     fontSize: 10,
//   }
// });

// RNCallKeep.setup({
//   ios: {
//     appName: 'CallKeepDemo',
//   },
//   android: {
//      alertTitle: 'Permissions required',
//     alertDescription: 'This application needs to access your phone accounts',
//     cancelButton: 'Cancel',
//     okButton: 'ok',
//   },
// });

// const getNewUuid = () => uuid.v4().toLowerCase();

// const format = uuid => uuid.split('-')[0];

// const getRandomNumber = () => String(Math.floor(Math.random() * 100000));

// const isIOS = Platform.OS === 'ios';

// export default function App() {
//   const [logText, setLog] = useState('');
//   const [heldCalls, setHeldCalls] = useState({}); // callKeep uuid: held
//   const [mutedCalls, setMutedCalls] = useState({}); // callKeep uuid: muted
//   const [calls, setCalls] = useState({}); // callKeep uuid: number

//   const log = (text) => {
//     console.info(text);
//     setLog(logText + "\n" + text);
//   };

//   const addCall = (callUUID, number) => {
//     setHeldCalls({ ...heldCalls, [callUUID]: false });
//     setCalls({ ...calls, [callUUID]: number });
//   };

//   const removeCall = (callUUID) => {
//     const { [callUUID]: _, ...updated } = calls;
//     const { [callUUID]: __, ...updatedHeldCalls } = heldCalls;

//     setCalls(updated);
//     setCalls(updatedHeldCalls);
//   };

//   const setCallHeld = (callUUID, held) => {
//     setHeldCalls({ ...heldCalls, [callUUID]: held });
//   };

//   const setCallMuted = (callUUID, muted) => {
//     setMutedCalls({ ...mutedCalls, [callUUID]: muted });
//   };

//   const displayIncomingCall = (number) => {
//     const callUUID = getNewUuid();
//     addCall(callUUID, number);

//     log(`[displayIncomingCall] ${format(callUUID)}, number: ${number}`);

//     RNCallKeep.displayIncomingCall(callUUID, number, number, 'number', false);
//   };

//   const displayIncomingCallNow = () => {
//     displayIncomingCall(getRandomNumber());
//   };

//   const displayIncomingCallDelayed = () => {
//     BackgroundTimer.setTimeout(() => {
//       displayIncomingCall(getRandomNumber());
//     }, 3000);
//   };

//   const answerCall = ({ callUUID }) => {
//     console.log("call is answered.........")
//     const number = calls[callUUID];
//     log(`[answerCall] ${format(callUUID)}, number: ${number}`);

//     RNCallKeep.startCall(callUUID, number, number);

//     BackgroundTimer.setTimeout(() => {
//       log(`[setCurrentCallActive] ${format(callUUID)}, number: ${number}`);
//       RNCallKeep.setCurrentCallActive(callUUID);
//     }, 1000);
//   };

//   const didPerformDTMFAction = ({ callUUID, digits }) => {
//     const number = calls[callUUID];
//     log(`[didPerformDTMFAction] ${format(callUUID)}, number: ${number} (${digits})`);
//   };

//   const didReceiveStartCallAction = ({ handle }) => {
//     if (!handle) {
//       // @TODO: sometime we receive `didReceiveStartCallAction` with handle` undefined`
//       return;
//     }
//     const callUUID = getNewUuid();
//     addCall(callUUID, handle);

//     log(`[didReceiveStartCallAction] ${callUUID}, number: ${handle}`);

//     RNCallKeep.startCall(callUUID, handle, handle);

//     BackgroundTimer.setTimeout(() => {
//       log(`[setCurrentCallActive] ${format(callUUID)}, number: ${handle}`);
//       RNCallKeep.setCurrentCallActive(callUUID);
//     }, 1000);
//   };

//   const didPerformSetMutedCallAction = ({ muted, callUUID }) => {
//     const number = calls[callUUID];
//     log(`[didPerformSetMutedCallAction] ${format(callUUID)}, number: ${number} (${muted})`);

//     setCallMuted(callUUID, muted);
//   };

//   const didToggleHoldCallAction = ({ hold, callUUID }) => {
//     const number = calls[callUUID];
//     log(`[didToggleHoldCallAction] ${format(callUUID)}, number: ${number} (${hold})`);

//     setCallHeld(callUUID, hold);
//   };

//   const endCall = ({ callUUID }) => {
//     console.log("call ended....")
//     const handle = calls[callUUID];
//     log(`[endCall] ${format(callUUID)}, number: ${handle}`);

//     removeCall(callUUID);
//   };

//   const hangup = (callUUID) => {
//     console.log("call hangup....")

//     RNCallKeep.endCall(callUUID);
//     removeCall(callUUID);
//   };

//   const setOnHold = (callUUID, held) => {
//     const handle = calls[callUUID];
//     RNCallKeep.setOnHold(callUUID, held);
//     log(`[setOnHold: ${held}] ${format(callUUID)}, number: ${handle}`);

//     setCallHeld(callUUID, held);
//   };

//   const setOnMute = (callUUID, muted) => {
//     const handle = calls[callUUID];
//     RNCallKeep.setMutedCall(callUUID, muted);
//     log(`[setMutedCall: ${muted}] ${format(callUUID)}, number: ${handle}`);

//     setCallMuted(callUUID, muted);
//   };

//   const updateDisplay = (callUUID) => {
//     const number = calls[callUUID];
//     // Workaround because Android doesn't display well displayName, se we have to switch ...
//     if (isIOS) {
//       RNCallKeep.updateDisplay(callUUID, 'New Name', number);
//     } else {
//       RNCallKeep.updateDisplay(callUUID, number, 'New Name');
//     }

//     log(`[updateDisplay: ${number}] ${format(callUUID)}`);
//   };

//   useEffect(() => {
//     RNCallKeep.addEventListener('answerCall', answerCall);
//     RNCallKeep.addEventListener('didPerformDTMFAction', didPerformDTMFAction);
//     RNCallKeep.addEventListener('didReceiveStartCallAction', didReceiveStartCallAction);
//     RNCallKeep.addEventListener('didPerformSetMutedCallAction', didPerformSetMutedCallAction);
//     RNCallKeep.addEventListener('didToggleHoldCallAction', didToggleHoldCallAction);
//     RNCallKeep.addEventListener('endCall', endCall);

//     return () => {
//       RNCallKeep.removeEventListener('answerCall', answerCall);
//       RNCallKeep.removeEventListener('didPerformDTMFAction', didPerformDTMFAction);
//       RNCallKeep.removeEventListener('didReceiveStartCallAction', didReceiveStartCallAction);
//       RNCallKeep.removeEventListener('didPerformSetMutedCallAction', didPerformSetMutedCallAction);
//       RNCallKeep.removeEventListener('didToggleHoldCallAction', didToggleHoldCallAction);
//       RNCallKeep.removeEventListener('endCall', endCall);
//     }
//   }, []);

//   if (isIOS && DeviceInfo.isEmulator()) {
//     return <Text style={styles.container}>CallKeep doesn't work on iOS emulator</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={displayIncomingCallNow} style={styles.button} hitSlop={hitSlop}>
//         <Text>Display incoming call now</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={displayIncomingCallDelayed} style={styles.button} hitSlop={hitSlop}>
//         <Text>Display incoming call now in 3s</Text>
//       </TouchableOpacity>

//       {Object.keys(calls).map(callUUID => (
//         <View key={callUUID} style={styles.callButtons}>
//           <TouchableOpacity
//             onPress={() => setOnHold(callUUID, !heldCalls[callUUID])}
//             style={styles.button}
//             hitSlop={hitSlop}
//           >
//             <Text>{heldCalls[callUUID] ? 'Unhold' : 'Hold'} {calls[callUUID]}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => updateDisplay(callUUID)}
//             style={styles.button}
//             hitSlop={hitSlop}
//           >
//             <Text>Update display</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => setOnMute(callUUID, !mutedCalls[callUUID])}
//             style={styles.button}
//             hitSlop={hitSlop}
//           >
//             <Text>{mutedCalls[callUUID] ? 'Unmute' : 'Mute'} {calls[callUUID]}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => hangup(callUUID)} style={styles.button} hitSlop={hitSlop}>
//             <Text>Hangup {calls[callUUID]}</Text>
//           </TouchableOpacity>
//         </View>
//       ))}

//       <ScrollView style={styles.logContainer}>
//         <Text style={styles.log}>
//           {logText}
//         </Text>
//       </ScrollView>
//     </View>
//   );
// }

// 'use strict';




// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   TouchableHighlight,
//   View,
//   TextInput,
//   ListView,
//   Platform,
// } from 'react-native';

// import io from 'socket.io-client';

// const socket = io.connect('ws://127.0.0.1:9090', {transports: ['websocket']});

// import {
//   RTCPeerConnection,
//   RTCMediaStream,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   RTCView,
//   MediaStreamTrack,
//   getUserMedia,
// } from 'react-native-webrtc';

// const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};

// const pcPeers = {};
// let localStream;

// function getLocalStream(isFront, callback) {

//   let videoSourceId;

//   // on android, you don't have to specify sourceId manually, just use facingMode
//   // uncomment it if you want to specify
//   if (Platform.OS === 'ios') {
//     MediaStreamTrack.getSources(sourceInfos => {
//       console.log("sourceInfos: ", sourceInfos);

//       for (const i = 0; i < sourceInfos.length; i++) {
//         const sourceInfo = sourceInfos[i];
//         if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
//           videoSourceId = sourceInfo.id;
//         }
//       }
//     });
//   }
//   getUserMedia({
//     audio: true,
//     video: {
//       mandatory: {
//         minWidth: 640, // Provide your own width, height and frame rate here
//         minHeight: 360,
//         minFrameRate: 30,
//       },
//       facingMode: (isFront ? "user" : "environment"),
//       optional: (videoSourceId ? [{sourceId: videoSourceId}] : []),
//     }
//   }, function (stream) {
//     console.log('getUserMedia success', stream);
//     callback(stream);
//   }, logError);
// }

// function join(roomID) {
//   socket.emit('join', roomID, function(socketIds){
//     console.log('join', socketIds);
//     for (const i in socketIds) {
//       const socketId = socketIds[i];
//       createPC(socketId, true);
//     }
//   });
// }

// function createPC(socketId, isOffer) {
//   const pc = new RTCPeerConnection(configuration);
//   pcPeers[socketId] = pc;

//   pc.onicecandidate = function (event) {
//     console.log('onicecandidate', event.candidate);
//     if (event.candidate) {
//       socket.emit('exchange', {'to': socketId, 'candidate': event.candidate });
//     }
//   };

//   function createOffer() {
//     pc.createOffer(function(desc) {
//       console.log('createOffer', desc);
//       pc.setLocalDescription(desc, function () {
//         console.log('setLocalDescription', pc.localDescription);
//         socket.emit('exchange', {'to': socketId, 'sdp': pc.localDescription });
//       }, logError);
//     }, logError);
//   }

//   pc.onnegotiationneeded = function () {
//     console.log('onnegotiationneeded');
//     if (isOffer) {
//       createOffer();
//     }
//   }

//   pc.oniceconnectionstatechange = function(event) {
//     console.log('oniceconnectionstatechange', event.target.iceConnectionState);
//     if (event.target.iceConnectionState === 'completed') {
//       setTimeout(() => {
//         getStats();
//       }, 1000);
//     }
//     if (event.target.iceConnectionState === 'connected') {
//       createDataChannel();
//     }
//   };
//   pc.onsignalingstatechange = function(event) {
//     console.log('onsignalingstatechange', event.target.signalingState);
//   };

//   pc.onaddstream = function (event) {
//     console.log('onaddstream', event.stream);
//     container.setState({info: 'One peer join!'});

//     const remoteList = container.state.remoteList;
//     remoteList[socketId] = event.stream.toURL();
//     container.setState({ remoteList: remoteList });
//   };
//   pc.onremovestream = function (event) {
//     console.log('onremovestream', event.stream);
//   };

//   pc.addStream(localStream);
//   function createDataChannel() {
//     if (pc.textDataChannel) {
//       return;
//     }
//     const dataChannel = pc.createDataChannel("text");

//     dataChannel.onerror = function (error) {
//       console.log("dataChannel.onerror", error);
//     };

//     dataChannel.onmessage = function (event) {
//       console.log("dataChannel.onmessage:", event.data);
//       container.receiveTextData({user: socketId, message: event.data});
//     };

//     dataChannel.onopen = function () {
//       console.log('dataChannel.onopen');
//       container.setState({textRoomConnected: true});
//     };

//     dataChannel.onclose = function () {
//       console.log("dataChannel.onclose");
//     };

//     pc.textDataChannel = dataChannel;
//   }
//   return pc;
// }

// function exchange(data) {
//   const fromId = data.from;
//   let pc;
//   if (fromId in pcPeers) {
//     pc = pcPeers[fromId];
//   } else {
//     pc = createPC(fromId, false);
//   }

//   if (data.sdp) {
//     console.log('exchange sdp', data);
//     pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
//       if (pc.remoteDescription.type == "offer")
//         pc.createAnswer(function(desc) {
//           console.log('createAnswer', desc);
//           pc.setLocalDescription(desc, function () {
//             console.log('setLocalDescription', pc.localDescription);
//             socket.emit('exchange', {'to': fromId, 'sdp': pc.localDescription });
//           }, logError);
//         }, logError);
//     }, logError);
//   } else {
//     console.log('exchange candidate', data);
//     pc.addIceCandidate(new RTCIceCandidate(data.candidate));
//   }
// }

// function leave(socketId) {
//   console.log('leave', socketId);
//   const pc = pcPeers[socketId];
//   const viewIndex = pc.viewIndex;
//   pc.close();
//   delete pcPeers[socketId];

//   const remoteList = container.state.remoteList;
//   delete remoteList[socketId]
//   container.setState({ remoteList: remoteList });
//   container.setState({info: 'One peer leave!'});
// }

// socket.on('exchange', function(data){
//   exchange(data);
// });
// socket.on('leave', function(socketId){
//   leave(socketId);
// });

// socket.on('connect', function(data) {
//   console.log('connect');
//   getLocalStream(true, function(stream) {
//     localStream = stream;
//     container.setState({selfViewSrc: stream.toURL()});
//     container.setState({status: 'ready', info: 'Please enter or create room ID'});
//   });
// });

// function logError(error) {
//   console.log("logError", error);
// }

// function mapHash(hash, func) {
//   const array = [];
//   for (const key in hash) {
//     const obj = hash[key];
//     array.push(func(obj, key));
//   }
//   return array;
// }

// function getStats() {
//   const pc = pcPeers[Object.keys(pcPeers)[0]];
//   if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
//     const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
//     console.log('track', track);
//     pc.getStats(track, function(report) {
//       console.log('getStats report', report);
//     }, logError);
//   }
// }

// let container;

// const CallKeepDemo = React.createClass({
//   getInitialState: function() {
//     this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
//     return {
//       info: 'Initializing',
//       status: 'init',
//       roomID: '',
//       isFront: true,
//       selfViewSrc: null,
//       remoteList: {},
//       textRoomConnected: false,
//       textRoomData: [],
//       textRoomValue: '',
//     };
//   },
//   componentDidMount: function() {
//     container = this;
//   },
//   _press(event) {
//     this.refs.roomID.blur();
//     this.setState({status: 'connect', info: 'Connecting'});
//     join(this.state.roomID);
//   },
//   _switchVideoType() {
//     const isFront = !this.state.isFront;
//     this.setState({isFront});
//     getLocalStream(isFront, function(stream) {
//       if (localStream) {
//         for (const id in pcPeers) {
//           const pc = pcPeers[id];
//           pc && pc.removeStream(localStream);
//         }
//         localStream.release();
//       }
//       localStream = stream;
//       container.setState({selfViewSrc: stream.toURL()});

//       for (const id in pcPeers) {
//         const pc = pcPeers[id];
//         pc && pc.addStream(localStream);
//       }
//     });
//   },
//   receiveTextData(data) {
//     const textRoomData = this.state.textRoomData.slice();
//     textRoomData.push(data);
//     this.setState({textRoomData, textRoomValue: ''});
//   },
//   _textRoomPress() {
//     if (!this.state.textRoomValue) {
//       return
//     }
//     const textRoomData = this.state.textRoomData.slice();
//     textRoomData.push({user: 'Me', message: this.state.textRoomValue});
//     for (const key in pcPeers) {
//       const pc = pcPeers[key];
//       pc.textDataChannel.send(this.state.textRoomValue);
//     }
//     this.setState({textRoomData, textRoomValue: ''});
//   },
//   _renderTextRoom() {
//     return (
//       <View style={styles.listViewContainer}>
//         <ListView
//           dataSource={this.ds.cloneWithRows(this.state.textRoomData)}
//           renderRow={rowData => <Text>{`${rowData.user}: ${rowData.message}`}</Text>}
//           />
//         <TextInput
//           style={{width: 200, height: 30, borderColor: 'gray', borderWidth: 1}}
//           onChangeText={value => this.setState({textRoomValue: value})}
//           value={this.state.textRoomValue}
//         />
//         <TouchableHighlight
//           onPress={this._textRoomPress}>
//           <Text>Send</Text>
//         </TouchableHighlight>
//       </View>
//     );
//   },
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>
//           {this.state.info}
//         </Text>
//         {this.state.textRoomConnected && this._renderTextRoom()}
//         <View style={{flexDirection: 'row'}}>
//           <Text>
//             {this.state.isFront ? "Use front camera" : "Use back camera"}
//           </Text>
//           <TouchableHighlight
//             style={{borderWidth: 1, borderColor: 'black'}}
//             onPress={this._switchVideoType}>
//             <Text>Switch camera</Text>
//           </TouchableHighlight>
//         </View>
//         { this.state.status == 'ready' ?
//           (<View>
//             <TextInput
//               ref='roomID'
//               autoCorrect={false}
//               style={{width: 200, height: 40, borderColor: 'gray', borderWidth: 1}}
//               onChangeText={(text) => this.setState({roomID: text})}
//               value={this.state.roomID}
//             />
//             <TouchableHighlight
//               onPress={this._press}>
//               <Text>Enter room</Text>
//             </TouchableHighlight>
//           </View>) : null
//         }
//         <RTCView streamURL={this.state.selfViewSrc} style={styles.selfView}/>
//         {
//           mapHash(this.state.remoteList, function(remote, index) {
//             return <RTCView key={index} streamURL={remote} style={styles.remoteView}/>
//           })
//         }
//       </View>
//     );
//   }
// });

// const styles = StyleSheet.create({
//   selfView: {
//     width: 200,
//     height: 150,
//   },
//   remoteView: {
//     width: 200,
//     height: 150,
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   listViewContainer: {
//     height: 150,
//   },
// });

// AppRegistry.registerComponent('CallKeepDemo', () => CallKeepDemo);



/**
 * @format
 * @flow
 */

import React from 'react';
import {View, Button, StyleSheet} from 'react-native';

import {RTCPeerConnection, RTCView, mediaDevices} from 'react-native-webrtc';

export default function App() {
  const [localStream, setLocalStream] = React.useState();
  const [remoteStream, setRemoteStream] = React.useState();
  const [cachedLocalPC, setCachedLocalPC] = React.useState();
  const [cachedRemotePC, setCachedRemotePC] = React.useState();

  const startLocalStream = async () => {
    const isFront = true;
    const devices = await mediaDevices.enumerateDevices();

    const facing = isFront ? 'front' : 'back';
    const videoSourceId = devices.find(device => device.kind === 'videoinput' && device.facing === facing);
    const facingMode = isFront ? 'user' : 'environment';
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 500, // Provide your own width, height and frame rate here
          minHeight: 300,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
      },
    };
    const newStream = await mediaDevices.getUserMedia(constraints);
    setLocalStream(newStream);
  };

  const startCall = async () => {
    const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
    const localPC = new RTCPeerConnection(configuration);
    const remotePC = new RTCPeerConnection(configuration);

    // could also use "addEventListener" for these callbacks, but you'd need to handle removing them as well
    localPC.onicecandidate = e => {
      try {
        console.log('localPC icecandidate:', e.candidate);
        if (e.candidate) {
          remotePC.addIceCandidate(e.candidate);
        }
      } catch (err) {
        console.error(`Error adding remotePC iceCandidate: ${err}`);
      }
    };
    remotePC.onicecandidate = e => {
      try {
        console.log('remotePC icecandidate:', e.candidate);
        if (e.candidate) {
          localPC.addIceCandidate(e.candidate);
        }
      } catch (err) {
        console.error(`Error adding localPC iceCandidate: ${err}`);
      }
    };
    remotePC.onaddstream = e => {
      console.log('remotePC tracking with ', e);
      if (e.stream && remoteStream !== e.stream) {
        console.log('RemotePC received the stream', e.stream);
        setRemoteStream(e.stream);
      }
    };

    // AddTrack not supported yet, so have to use old school addStream instead
    // newStream.getTracks().forEach(track => localPC.addTrack(track, newStream));
    localPC.addStream(localStream);
    try {
      const offer = await localPC.createOffer();
      console.log('Offer from localPC, setLocalDescription');
      await localPC.setLocalDescription(offer);
      console.log('remotePC, setRemoteDescription');
      await remotePC.setRemoteDescription(localPC.localDescription);
      console.log('RemotePC, createAnswer');
      const answer = await remotePC.createAnswer();
      console.log(`Answer from remotePC: ${answer.sdp}`);
      console.log('remotePC, setLocalDescription');
      await remotePC.setLocalDescription(answer);
      console.log('localPC, setRemoteDescription');
      await localPC.setRemoteDescription(remotePC.localDescription);
    } catch (err) {
      console.error(err);
    }
    setCachedLocalPC(localPC);
    setCachedRemotePC(remotePC);
  };

  const closeStreams = () => {
    if (cachedLocalPC) {
      cachedLocalPC.removeStream(localStream);
      cachedLocalPC.close();
    }
    if (cachedRemotePC) {
      cachedRemotePC.removeStream(remoteStream);
      cachedRemotePC.close();
    }
    setLocalStream();
    setRemoteStream();
    setCachedRemotePC();
    setCachedLocalPC();
  };

  return (
    <View style={styles.container}>
      {!localStream && <Button title="Click to start stream" onPress={startLocalStream} />}
      {localStream && <Button title="Click to start call" onPress={startCall} disabled={!!remoteStream} />}

      <View style={styles.rtcview}>
        {localStream && <RTCView style={styles.rtc} streamURL={localStream.toURL()} />}
      </View>
      <View style={styles.rtcview}>
        {remoteStream && <RTCView style={styles.rtc} streamURL={remoteStream.toURL()} />}
      </View>
      <Button title="Click to stop call" onPress={closeStreams} disabled={!remoteStream} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#313131',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  text: {
    fontSize: 30,
  },
  rtcview: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '40%',
    width: '80%',
    backgroundColor: 'black',
  },
  rtc: {
    width: '80%',
    height: '100%',
  },
});
