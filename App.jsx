import React, {useRef, useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Text,
  ImageBackground,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
// import TextRecognition from 'react-native-text-recognition';
import Tts from 'react-native-tts';

import axios from 'axios';

const App = () => {
  const unityRef = useRef(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [sendDisabled, setSendDisabled] = useState(false);
  const scrollViewRef = useRef();
  

  function removeSpecChar(str) {
    return str.replace(/\[\^\d+\^\]|\*\*/g, ' ');
  }

  function removeEmoji(text) {
    return text.replace(/[\u{1F600}-\u{1F64F}]/gu, '');
  }

  const sendMessage = async () => {
    setSendDisabled(true);

    if (!message) {
      return;
    } else if (
      message.toLowerCase().includes('hello') ||
      message.toLowerCase().includes('hi') ||
      message.toLowerCase().includes('hey')
    ) {
      

      const newChat = [...chatMessages, {message: message, sender: 'user'}];
      setChatMessages(newChat);
      setMessage('');
      scrollViewRef.current.scrollToEnd();

      await axios
        .post('http://192.168.185.143:8989/searchBing', {
          query: message,
        })
        .then(response => {
          console.log(response.data.response.text);
          setChatMessages([
            ...newChat,
            {
              message: removeSpecChar(response.data.response.text),
              sender: 'bot',
            },
          ]);
          scrollViewRef.current.scrollToEnd();

          Tts.speak(removeSpecChar(removeEmoji(response.data.response.text)), {
            androidParams: {
              KEY_PARAM_PITCH: 1.5,
              KEY_PARAM_VOLUME: 1.0,
              KEY_PARAM_SPEED: 1.0,
            },
            language: 'en-US',
          });
        });
    } else {
      const newChat = [...chatMessages, {message: message, sender: 'user'}];
      setChatMessages(newChat);
      setMessage('');
      scrollViewRef.current.scrollToEnd();

      await axios
        .post('http://192.168.185.143:8989/searchBing', {
          query: message,
        })
        .then(response => {
          console.log(response.data.response.text);
          setChatMessages([
            ...newChat,
            {
              message: removeSpecChar(response.data.response.text),
              sender: 'bot',
            },
          ]);
          scrollViewRef.current.scrollToEnd();

          Tts.speak(removeSpecChar(removeEmoji(response.data.response.text)), {
            androidParams: {
              KEY_PARAM_PITCH: 1.5,
              KEY_PARAM_VOLUME: 1.0,
              KEY_PARAM_SPEED: 1.0,
            },
            language: 'en-US',
          });
        });
    }

    setSendDisabled(false);
  };

  return (
    <ImageBackground source={require('./assets/bg.png')} style={styles.backgroundImage}>
    <KeyboardAvoidingView style={styles.container} >

        <Pressable
          style={styles.stopAudio}
          onPress={()=>{Tts.stop()}}>
            <ImageBackground source={require('./assets/mute.png')} style={styles.muteButton}>
          </ImageBackground>
          </Pressable>
   
   <ScrollView
          contentContainerStyle={styles.messageList}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd()}
          showsVerticalScrollIndicator={false}>
      <View style={styles.chatContainer}>
        
          {chatMessages.map((chatMessage, index) => {
            return (
              <View
                key={index}
                style={
                  chatMessage.sender === 'user'
                    ? styles.userMessageContainer
                    : styles.botMessageContainer
                }>
                <Text style={styles.messageText}>{chatMessage.message}</Text>
              </View>
            );
          })}
        
      </View>
      </ScrollView>

      
        <View style={[styles.inputContainer]}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={text => setMessage(text)}
            placeholder="Type your message here"
            placeholderTextColor="#8E8E8E"
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            enablesReturnKeyAutomatically
            disabled={sendDisabled}
          />

          <Pressable
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={sendDisabled}>
            <Text style={styles.sendButtonText}>Send</Text>
          </Pressable>

        </View>
      
    </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //backgroundColor: 'transparent',
    height: '100%',
    
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    position:'absolute',
    width: '100%',
    height: '100%',
  },
  chatContainer: {
    //flex: 1,
    padding: 10,
    width: '100%',
    
  },
  messageList: {
    flexGrow: 1,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    maxWidth: '70%',
    backgroundColor: '#DCF8C6',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    maxWidth: '70%',
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  messageText: {
    color: '#000',
    fontSize: 16,
  },

  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderWidth: 1,
    // width: '100%',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#0084ff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageButton: {
    alignItems: 'center',
    // backgroundColor: '#0084ff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20,
    marginLeft: 5,
  },

  muteButton: {
    marginLeft: 5,
    width: '90%',
    height: '90%',
    marginTop: 10
  },

  stopAudio:{
    alignSelf: 'flex-start',
    width: '10%',
    height: '5%',
    marginBottom: 6
  }
});

export default App;

