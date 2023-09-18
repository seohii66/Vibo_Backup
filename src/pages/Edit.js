import React, {useState, useEffect, useContext} from "react";
import {
    SafeAreaView, ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    Pressable,
    View,
    Image,
    Button,
    Modal, Alert
} from "react-native";

import CheckBox from '@react-native-community/checkbox';

import colors from './colors/colors';
import fonts from './fonts/fonts';
import axios from 'axios';
import stylelist from '../style';

import TasteModal from '../components/TasteModal';
import RepurchaseModal from '../components/RepurchaseModal';
import TextureModal from '../components/TextureModal';
import FunctionModal from '../components/FunctionModal';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { containsKey, getData, removeData, storeData } from "./AsyncService";
import { storeUserData, getUserData } from './UserData';


const Edit = ({route, navigation, props}) => {

    // modal 부분
    const [tasteModalVisible, setTasteModalVisible] = useState(false);
    const [textureModalVisible, setTextureModalVisible] = useState(false);
    const [repurchaseModalVisible, setRepurchaseModalVisible] = useState(false);
    const [functionModalVisible, setFunctionModalVisible] = useState(false);


   // edit 닉네임, 프로필
    const [editInputs, setEditInputs] = useState({
       username: '',
       profile: 0
    });

    const [firstImgSrc, setFirstImgSrc] = useState(require('./images/vibo_profile.png'))
    const [secondImgSrc, setSecondImgSrc] = useState('./images/babo_profile.png')

    const handleInputChange=(key, value)=>{
        setEditInputs(prevState => ({
            ...prevState,
            [key]:value,
        }));
    };

    // 프로필 버튼 이벤트
    const onFirstProfilePressed = () => {
        //console.warn("onFirstProfilePressed");
        handleInputChange('profile', 1);
        Alert.alert('프로필 이미지', '프로필 이미지를 변경하였습니다.', [
          {text: '확인', onPress: () => console.log('OK Pressed')},
        ]);
        // 클릭 시 테두리 생성하기
    };

    const onSecondProfilePressed = () => {
        //console.warn("onSecondProfilePressed");
        handleInputChange('profile', 2);
        Alert.alert('프로필 이미지', '프로필 이미지를 변경하였습니다.', [
          {text: '확인', onPress: () => console.log('OK Pressed')},
        ]);
        // 클릭 시 테두리 생성하기
    };

    // port 전송 코드
    const onUpdatePressed = async() => {
        try{
            const userID = JSON.parse(await AsyncStorage.getItem("userID"));    // 로컬 id 가져오기
            console.log("edit_userid: ", userID);

            const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));   //로컬 userInfo 가져오기
            const editProfile = userInfo.user.userProfile;              // 로컬 profile
            const editModalTaste = userInfo.user.userTasteDetail;       // 로컬 taste
            const editModalTexture = userInfo.user.userTexture;         // 로컬 texture
            const editModalRepurchase = userInfo.user.userRebuy;       // 로컬 repurchase
            const editModalFunction = userInfo.user.userFunction;       // 로컬 function

            console.log("editProfile: ", editProfile);
            console.log("editModalTaste: ", editModalTaste);
            console.log("editModalTexture: ", editModalTexture);
            console.log("editModalRepurchase: ", editModalRepurchase);
            console.log("editModalFunction: ", editModalFunction);


            if (editInputs.username && editInputs.profile!=0){   //사용자가 username에 입력함 & 프로필 선택함
                axios.post('http://43.201.36.107:3001/api/user/'+userID+'/mypage/edit/username',
                    {'username': editInputs.username})
                .then((response)=> {
                    if  (response.data.status == 'update_username_success'){
                        console.log("update_username_success");

                        navigation.navigate('MyPage', {eName: editInputs.username, eProfile: editInputs.profile, eTaste: editModalTaste, eTexture: editModalTexture, eRepurchase: editModalRepurchase, eFunction: editModalFunction});
                    }
                })
                .catch(error => {
                    console.log("edit: ", err);
                });

            }
            else if (editInputs.username && editInputs.profile==0){ //사용자가 username에 입력함 & 프로필 선택 안 함
                axios.post('http://43.201.36.107:3001/api/user/'+userID+'/mypage/edit/username',
                    {'username': editInputs.username})
                .then((response)=> {
                    if  (response.data.status == 'update_username_success'){
                        console.log("update_username_success");

                        navigation.navigate('MyPage', {eName: editInputs.username, eProfile: editProfile, eTaste: editModalTaste, eTexture: editModalTexture, eRepurchase: editModalRepurchase, eFunction: editModalFunction});
                    }
                })
                .catch(error => {
                    console.log("edit: ", err);
                });
            }
            else if (editInputs.username=='' && editInputs.profile!=0){ //사용자가 username에 입력 안 함 & 프로필 선택함
                navigation.navigate('MyPage', {eName: userInfo.user.userName, eProfile: editInputs.profile, eTaste: editModalTaste, eTexture: editModalTexture, eRepurchase: editModalRepurchase, eFunction: editModalFunction});
            }
            else{navigation.navigate('MyPage', {eName: userInfo.user.userName, eProfile: editProfile, eTaste: editModalTaste, eTexture: editModalTexture, eRepurchase: editModalRepurchase, eFunction: editModalFunction})};

        } catch (err){
            console.log("edit: ", err);
        };
    };

    // 닉네임, 프로필 저장 버튼
    const CustomButton = ({ onPress, text }) => {
    	return (
        	<Pressable
            	onPress={onPress}
                style={styles.customBtnContainer}>
            	<Text style={styles.customBtnText}>
                	{text}
                </Text>
            </Pressable>
        );
    }
    // 세부사항 저장 버튼
    const ChangeInfoButton = ({ onPress, text }) => {
    	return (
        	<Pressable
            	onPress={onPress}
            >
            	<Text style={styles.infoText}>
                	{text}
                </Text>
            </Pressable>
        );
    }


    return (
        <SafeAreaView style={{flex:1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex:1}}>
            <TasteModal
                modalVisible={tasteModalVisible}
                setModalVisible={setTasteModalVisible}
            />
            <RepurchaseModal
                modalVisible={repurchaseModalVisible}
                setModalVisible={setRepurchaseModalVisible}
            />
            <TextureModal
                modalVisible={textureModalVisible}
                setModalVisible={setTextureModalVisible}
            />
            <FunctionModal
                modalVisible={functionModalVisible}
                setModalVisible={setFunctionModalVisible}
            />


            <View style={styles.editTopContainer}>
                <Text style={styles.joinText}> Edit </Text>
                <Pressable onPress={() => navigation.goBack()}>
                    <Text style={styles.logoutBtnText}>Back</Text>
                </Pressable>
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.profileContainer}>
                    <Pressable onPress={onFirstProfilePressed}>
                        <Image
                              style={styles.profile}
                              source={require('./images/vibo_profile.png')} />
                    </Pressable>
                    <Pressable onPress={onSecondProfilePressed}>
                        <Image
                              style={styles.profile}
                              source={require('./images/babo_profile.png')} />
                    </Pressable>
                </View>

                <View style={styles.infoTextContainer}>
                    <View style={{flexDirection: "row", justifyContent: 'flex-end', marginRight: '5%', marginBottom: 20}}>
                        <Text style={{alignSelf: 'center'}}> 닉네임 </Text>
                        <TextInput
                            style={styles.customInput}
                            value={editInputs.username}
                            onChangeText={(text) => {handleInputChange('username', text)}}
                            placeholder={'변경하시려면 원하는 닉네임을 입력하세요.'}

                        />
                    </View>
                    <ChangeInfoButton
                        onPress={()=> setTasteModalVisible(true)}
                        text='맛' />
                    <ChangeInfoButton
                        onPress={()=> setTextureModalVisible(true)}
                        text='목넘김' />
                    <ChangeInfoButton
                        onPress={()=> setRepurchaseModalVisible(true)}
                        text='재구매 의사' />
                    <ChangeInfoButton
                        onPress={()=> setFunctionModalVisible(true)}
                        text='기능' />
                </View>


                <View style={{flexDirection: "row", alignSelf: 'flex-end'}}>
                    <Image
                        style={styles.icon}
                        source={require('./images/paw.png')} />
                    <CustomButton
                        onPress={onUpdatePressed}
                        text="저장"
                    />
                </View>

            </View>

        </View>
        </TouchableWithoutFeedback>
        </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    editTopContainer: {
        flex: 1,
        backgroundColor: colors.Blue,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    joinText: {
        marginRight: '30%',
        alignSelf: 'center',
        fontFamily: 'inter',
        fontSize: 25,
        fontWeight: '700',
        color: colors.Black,
        lineHeight: 29.3,
    },
    logoutBtnText: {
        color: colors.White
    },
    infoContainer: {
        flex: 5,
        backgroundColor: colors.White
    },
    profileContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'center'
    },
    profile: {
        width: 110, height: 110,
    },
    infoTextContainer: {

    },
    infoText: {
        width: '80%',
        padding: 5,
        borderWidth: 1.5,
        borderRadius: 10,
        borderColor: colors.Gray3,
        marginBottom: 10,
        fontSize: 18,
        fontWeight: '700',
        color: colors.Black,
        alignSelf: 'center'
    },


    customInput: {
        backgroundColor: colors.Gray2,
        width: '78%',
        height: 48,
        paddingLeft: 15,
        borderRadius: 5,
        marginBottom: 5,
        marginRight: '5%',
        alignSelf: 'flex-end'
    },
    customInput2: {
        backgroundColor: colors.White,
        width: '47%',
        height: 48,
        paddingLeft: 15,
        borderRadius: 5,
        marginBottom: 5,
        alignSelf: 'flex-end'
    },
    customInput3: {
        backgroundColor: colors.White,
        width: '10%',
        height: 48,
        paddingLeft: 15,
        borderRadius: 5,
        marginBottom: 5,
        alignSelf: 'flex-end'
    },
    icon: {
        width: 55, height: 55,
        position: 'relative',
        left: 30,
        bottom: -5,
        zIndex: 1
    },
    customBtnContainer: {
        width: '50%',
        height: 50,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 11,
        marginRight: '5%',
        borderRadius: 50,
        backgroundColor: colors.Gray2,
        alignSelf: 'flex-end',
        justifyContent: 'center'
    },
    customBtnText: {
        color: colors.Black,
        fontWeight: '700',
        fontSize: 15
    },
});

export default Edit;