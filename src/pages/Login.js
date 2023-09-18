import React, {useState, useEffect} from "react";
import {
    SafeAreaView,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    Pressable,
    View,
    Image,
    Button, Alert
} from "react-native";

import colors from './colors/colors';
import fonts from './fonts/fonts';

import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeUserData } from './UserData';

function Login({navigation, props}) {
    const [loginInputs, setLoginInputs] = useState({
        id: '',
        password: ''
    });

    const handleInputChange=(key, value)=>{
        setLoginInputs(prevState => ({
            ...prevState,
            [key]:value,
        }));
    };

    // SignIn custom button
    const CustomButton = ({ onPress, text }) => {
    	return (
        	<Pressable
            	onPress={onPress}
                style={styles.customBtnContainer}
            >
            	<Text style={styles.customBtnText}>
                	{text}
                </Text>
            </Pressable>
        );
    }

    const storeUserID = async (key, value) => {
      try {
        const stringValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, stringValue);
        console.log("local: ", stringValue);
      } catch (error) {
        console.log(error);
      }
    };

    // Sign In button_pressed
    const onSignInPressed = () => {
        console.log(loginInputs)
        try{
            axios.post('http://43.201.36.107:3001/api/login',
                {'id': loginInputs.id, 'password': loginInputs.password})
                .then(function (response) {
                    console.log(response.data);
                    if (response.data.status === 'success'){
                        console.log(response.data.data.id)      //2023052120

                        storeUserID('userID', response.data.data.id);   // 로컬저장소에 저장
                        storeUserData();            // 회원정보 로컬에 저장

                        navigation.replace('Tab');   // 해당 id의 home으로 접속해야 함 !!!!!
                        axios.post('http://43.201.36.107:3001/api/onLogin/' + loginInputs.id, {'userID':loginInputs.id})
                        .then((res) => {userID = res.data.data['userID']})
                        .catch()
                    } else{
                         Alert.alert('로그인 오류', '아이디와 비밀번호를 다시 확인해주세요.', [
                          {text: '확인', onPress: () => console.log('OK Pressed')},
                        ]);
                    }
                })
                .catch(error => {
                        if (error.response) {
                          // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
                          console.log('response')
                          console.log(error.response.data)
                          console.log(error.response.status)
                          console.log(error.response.headers)
                        } else if (error.request) {
                          // 요청이 이루어 졌으나 응답을 받지 못했습니다.
                          // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
                          // Node.js의 http.ClientRequest 인스턴스입니다.
                          console.log('request')
                          console.log(error.request)
                        } else {
                          // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
                          console.log('Error', error.message)
                        }
                        console.log(error.config)
                      });
        } catch (err){
            console.log(err)
        };
    };


    const onFindPasswordPressed = () => {
    	console.warn("onFindPasswordPressed");
    };

  return (
    <SafeAreaView style={{flex:1}}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex:1, backgroundColor: colors.Blue}}>
            <View style={styles.logInTextContainer}>
            	<Text style={styles.logInText}>안녕하세요,</Text>
                <Text style={styles.logInText}>VIBO입니다!</Text>
                <Text style={styles.logInTextS}>서비스 이용을 위해 로그인 해주세요.</Text>
            </View>
            <View style={styles.logInContainer}>
                <TextInput
                    style={styles.customInput}
                    value={loginInputs.id}
                    onChangeText={(text) => {handleInputChange('id', text)}}
                    placeholder="ID"
                />
                <TextInput
                    style={styles.customInput}
                    value={loginInputs.password}
                    onChangeText={(text) => {handleInputChange('password',text)}}
                    placeholder="Password"
                    secureTextEntry
                />
                <CustomButton
                    onPress={onSignInPressed}
                    text="Sign In"
                />
                <View style={styles.otherBtnContainer}>
                    <Pressable onPress={onFindPasswordPressed}>
                        <Text style={styles.otherBtnText}>비밀번호 찾기</Text>
                    </Pressable>
                    <Text> | </Text>
                    <Pressable onPress={() => navigation.navigate('JoinPage')}>
                        <Text style={styles.otherBtnText}>회원가입하기</Text>
                    </Pressable>
                </View>
            </View>


        </View>
    </TouchableWithoutFeedback>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
    logInTextContainer: {
        flex: 1,
        marginLeft: '9%',
        justifyContent: 'flex-end'
    },
    logInText: {
        fontFamily: 'inter',
        fontSize: 25,
        fontWeight: '700',
        color: colors.Black,
        lineHeight: 29.3,
    },
    logInTextS: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.Black,
        marginTop: 10,
    },
    logInContainer: {
        flex:3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    customInput: {
        backgroundColor: colors.White,
        width: '80%',
        height: 48,
        paddingLeft: 15,
        borderRadius: 5,
        marginBottom: 18,
        alignSelf: 'center',
        },
    customBtnContainer: {
        width: '80%',
        height: 50,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 11,
        borderRadius: 5,
        backgroundColor: colors.Green,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    customBtnText: {
        color: colors.Gray2,
        fontWeight: '700',
        fontSize: 15
    },
    otherBtnContainer: {
    	display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
    },
    otherBtnText: {
        fontWeight: '700',
        fontSize: 12,
        color: colors.Black
    }

});

export default Login;