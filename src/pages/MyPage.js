import React, {useState, useEffect} from "react";
import {
    SafeAreaView, ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    Pressable,
    View, FlatList,
    Image,
    Button
} from "react-native";

import colors from './colors/colors';
import fonts from './fonts/fonts';
import stylelist from '../style';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { containsKey, getData, removeData, storeData } from "./AsyncService";
import { storeUserData, getUserData } from './UserData';


function MyPage({route, navigation}) {

    const [userData, setUserData] = useState([]);
    console.log(userData)
    
    useEffect(() => {
        async function getData() {
          const _persons = await getUserData();
          setUserData(_persons);
        }

        getData();

    },[]);
    

    const renderItem=({ item }) =>{
        //edit.js에서 넘겨받은 props
        const eData = route.params;
        console.log('eData: ', eData);
        if (typeof(eData) != 'undefined'){
                editName = route.params.eName;
                editProfile = route.params.eProfile;
                editTaste = route.params.eTaste;
                editTexture = route.params.eTexture;
                editRepurchase = route.params.eRepurchase;
                editFunction = route.params.eFunction;
                console.log("eName: ", editName, "eProfile: ", editProfile, "eTaste: ", editTaste, "eTexture: ", editTexture, "editRepurchase: ", editRepurchase, "eFunction: ", editFunction);

                userData[item].userProfile = editProfile;   //modal에서 변경되면 값 지정
                userData[item].userTasteDetail = editTaste;
                userData[item].userTexture = editTexture;
                userData[item].userRebuy = editRepurchase;
                userData[item].userFunction = editFunction;

        } else {editName = ''}

        // userDetail 전처리
        const searchRegExp1 = new RegExp('\\[', 'g');
        const searchRegExp2 = new RegExp('\\]', 'g');
        const searchRegExp3 = new RegExp('\\"', 'g');

        userData[item].userTasteDetail =  userData[item].userTasteDetail.replace(searchRegExp1, '');
        userData[item].userTasteDetail =  userData[item].userTasteDetail.replace(searchRegExp2, '');
        userData[item].userTasteDetail =  userData[item].userTasteDetail.replace(searchRegExp3, '');
        userData[item].userFunction =  userData[item].userFunction.replace(searchRegExp1, '');
        userData[item].userFunction =  userData[item].userFunction.replace(searchRegExp2, '');
        userData[item].userFunction =  userData[item].userFunction.replace(searchRegExp3, '');

        console.log("1: ", userData[item].userTexture);
        console.log("2: ", userData[item].userRebuy);
        if (userData[item].userTasteDetail == ''){userData[item].userTasteDetail = "상관없음"}
        if (userData[item].userTexture == '목넘김'){userData[item].userTexture = '중요함'} else {userData[item].userTexture = '상관없음'};
        if (userData[item].userRebuy == '재구매의사'){userData[item].userRebuy = '중요함'} else {userData[item].userRebuy = '상관없음'};
        if (userData[item].userFunction == ''){userData[item].userFunction = '상관없음'};

        if (editName){
            userData[item].userName = editName;
            storeUserData();}

        // userBirth, userSet 전처리
        // userSex: 1,2 - 1900년대
        // userSex: 3,4 - 2000년대
        var now = new Date();
        let todayYear = now.getFullYear();
        console.log('birth', userData[item])
        var birth = userData[item].userBirth;
   
        var strBirth = birth.substr(0, 2);
        if (userData[item].userSex==1 || userData[item].userSex==2){
            intBirth = Number('19'+strBirth);
            userAge = (Math.floor((todayYear-intBirth)/10))*10;
        } else{
            intBirth = Number('20'+strBirth);
            userAge = (Math.floor((todayYear-intBirth)/10))*10;
        }

        if (userAge>=100){userAge='(나이 알 수 없음)'} else{userAge = userAge + ' 대'};

        if (userData[item].userSex==1 || userData[item].userSex==3){setUserSex='남성'} else {setUserSex='여성'};

        // userProfile
        if (userData[item].userProfile==1){imageSource=require('./images/vibo_profile.png')} else {imageSource=require('./images/babo_profile.png')};


        return(
            <View>
                <View style={styles.infoSet}>
                    <View style={{flexDirection:'row'}}>
                        <Image
                            style={styles.profile}
                            source={imageSource} />
                        <View>
                            <Text style={styles.infoProfileNameText}>{userData[item].userName} 님</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={styles.infoProfileText}>{userAge}</Text>
                                <Text style={styles.infoText}> / </Text>
                                <Text style={styles.infoText}>{setUserSex}</Text>
                            </View>
                        </View>

                    </View>
                </View>
                <View style={styles.infoSet}>
                    <Text>추천 받고 싶은 제품의 맛은 무엇인가요?</Text>
                    <Text style={styles.infoText}>{userData[item].userTasteDetail}</Text>
                </View>
                <View style={styles.infoSet}>
                    <Text>제품의 목넘김 여부가 중요한가요?</Text>
                    <Text style={styles.infoText}>{userData[item].userTexture}</Text>
                </View>
                <View style={styles.infoSet}>
                    <Text>다른 사용자들의 재구매 의사가 중요한가요?</Text>
                    <Text style={styles.infoText}>{userData[item].userRebuy}</Text>
                </View>
                <View style={styles.infoSet}>
                    <Text>어떤 기능의 제품을 원하시나요?</Text>
                    <Text style={styles.infoText}>{userData[item].userFunction}</Text>
                </View>
            </View>
        )
    }

    const onLoginPressed = () => {
        try{
            AsyncStorage.clear();
            navigation.navigate('Auth');

        }catch (err){
            console.log(err)
        };
    }

    const LogoutButton = ({onPress, text}) => {
        return (
            <Pressable
                onPress={onLoginPressed}
            >
                <Text style={styles.logoutBtnText}>
                    {text}
                </Text>
            </Pressable>
        );
    };

    // Edit custom button
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
    };

    const goEditButton = ()=>{
        return (
            <View style={{flexDirection: "row", alignSelf: 'flex-end'}}>
            <Image
                style={styles.icon}
                source={require('./images/paw.png')} />
            <CustomButton
                onPress={()=>navigation.navigate('DrawerNavigationRoutes',{screen:"EditPage"})}
                text="상세정보 수정하기" />
            </View>
        );

    };


    return (
        <SafeAreaView style={{flex:1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex:1}}>
            <View style={styles.mypageTopContainer}>
                <Text style={styles.joinText}>My Page</Text>
                <LogoutButton
                    text="Logout"
                />
            </View>


            <View style={styles.infoContainer}>
                    <View style={styles.infoTextContainer}>
                          <FlatList
                            data={Object.keys(userData)}
                            renderItem= {renderItem}
                            ListFooterComponent ={goEditButton}
                            />
                    </View>
            </View>

        </View>
        </TouchableWithoutFeedback>
        </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    mypageTopContainer: {
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
        color: colors.White,
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
        marginLeft: "10%"
    },


    infoTextContainer: {
        marginTop: 30,
    },
    infoSet: {
        width: '90%',
        padding: 5,
        marginBottom: 15,
        borderWidth: 1.5,
        borderRadius: 10,
        borderColor: colors.Gray3,
        alignSelf: 'center',
    },
    infoText: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.Black,
        alignSelf: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    infoProfileText: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.Black,
        alignSelf: 'center',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 50,
    },
    infoProfileNameText: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.Black,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 5,
        marginLeft: 50,
    },


    customInput: {
        backgroundColor: colors.White,
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
        marginTop: 20,
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

export default MyPage;