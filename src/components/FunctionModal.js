import React, {useState, useContext} from "react";
import {
    SafeAreaView, ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    Text,
    Pressable,
    View,
    Image,
    Button,
    Modal, Alert
} from "react-native";

import CheckBox from '@react-native-community/checkbox';

import colors from '../pages/colors/colors';
import fonts from '../pages/fonts/fonts';
import axios from 'axios';
import stylelist from '../style';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { containsKey, getData, removeData, storeData } from "../pages/AsyncService";
import { storeUserData } from '../pages/UserData';

const FunctionModal = (props) => {
    const {modalVisible, setModalVisible} = props;
    const [functionUpdate, setFunctionUpdate] = useState({
        vita: false, bio: false, diet: false, vagina: false
    })

    const changeCheck = (key, value) => {
        setFunctionUpdate(prevState => ({
             ...prevState,
             [key]: value,
        }));
    };

    // port 전송 코드
    const onFuncUpdatePressed = async () => {
            try{
                const userID = JSON.parse(await AsyncStorage.getItem("userID"));
                console.log("func_userid: ", userID);
                axios.post('http://54.180.142.26:3001/api/user/'+userID+'/mypage/edit/function',
                    {'vita': functionUpdate.vita, 'bio': functionUpdate.bio, 'diet': functionUpdate.diet, 'vagina': functionUpdate.vagina })
                .then((response)=> {
                    if  (response.data.status == 'update_func_success'){
                        if (response.data.data.updateFunction == ''){
                            Alert.alert('유의사항', '기능을 선택하지 않으셨다면 "상관없음"으로 변경됩니다.')
                        }

                        storeUserData();
                        setModalVisible(!modalVisible)
                    }
                })
                .catch(error => {
                    console.log(err);
                });
            } catch (err){
                console.log(err)
            };
    };

    // Function 수정사항 저장 Btn
    const FuncUpdateButton = ({ onPress, text }) => {
        return (
            <Pressable
                style={styles.modalButton}
                onPress={onFuncUpdatePressed}
            >
                <Text style={styles.modalText}>
                    {text}
                </Text>
            </Pressable>
        );
    }

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={modalVisible}
            onRequestClose={()=>{
                Alert.alert('변경사항이 저장되지 않습니다.');
                setModalVisible(!modalVisible);
        }}>

            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={{flexDirection:'row'}}>
                        <CheckBox
                            value={functionUpdate.vita}
                            onValueChange={(status) => {changeCheck('vita', status)}}
                         />
                        <Text style={styles.modalText}>피로회복</Text>
                        <CheckBox
                            value={functionUpdate.bio}
                            onValueChange={(status) => {changeCheck('bio', status)}}
                         />
                        <Text style={styles.modalText}>장건강</Text>
                        <CheckBox
                            value={functionUpdate.diet}
                            onValueChange={(status) => {changeCheck('diet', status)}}
                         />
                        <Text style={styles.modalText}>다이어트</Text>
                        <CheckBox
                            value={functionUpdate.vagina}
                            onValueChange={(status) => {changeCheck('vagina', status)}}
                         />
                        <Text style={styles.modalText}>질건강</Text>
                    </View>
                    <FuncUpdateButton
                        text="저장하기"
                    />
                </View>
            </View>
        </Modal>
  );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 22,
    },

    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    modalText: {
        alignSelf: 'center'
    },

    modalButton: {
        justifyContent: 'flex-end'
    }
});

export default FunctionModal;