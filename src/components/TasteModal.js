import React, {useState, useContext} from "react";
import {
    SafeAreaView,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    Text,
    Pressable,
    View,
    Button,
    Modal, Alert
} from "react-native";

import CheckBox from '@react-native-community/checkbox';
import { RadioButton } from 'react-native-paper';

import colors from '../pages/colors/colors';
import fonts from '../pages/fonts/fonts';
import axios from 'axios';
import stylelist from '../style';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { containsKey, getData, removeData, storeData } from "../pages/AsyncService";
import { storeUserData } from '../pages/UserData';

const TasteModal = (props) => {
    const {modalVisible, setModalVisible} = props;
    const [tasteUpdate, setTasteUpdate] = useState({
        taste: 'no',
        sweet: false, sour: false, fruit: false, milk: false,
    })

    const changeCheck = (key, value) => {
        setTasteUpdate(prevState => ({
             ...prevState,
             [key]: value,
        }));
    };

    // port 전송 코드
    const onTasteUpdatePressed = async () => {
            try{
                const userID = JSON.parse(await AsyncStorage.getItem("userID"));
                console.log("taste_userid: ", userID);
                axios.post('http://43.201.36.107:3001/api/user/'+userID+'/mypage/edit/taste',
                    {'taste': tasteUpdate.taste,
                    'sweet': tasteUpdate.sweet, 'sour': tasteUpdate.sour, 'fruit': tasteUpdate.fruit, 'milk': tasteUpdate.milk })
                .then((response)=> {
                    if  (response.data.status == 'no_detail_pressed'){
                        Alert.alert ('맛을 하나 이상 선택해주세요.');
                    }
                    else if (response.data.status == 'update_taste_success'){
                        storeUserData();
                        setModalVisible(!modalVisible);
                    }
                })
                .catch(error => {
                    console.log(err);
                });
            } catch (err){
                console.log(err)
            };
    };

    // Taste 수정사항 저장 Btn
    const TasteUpdateButton = ({ onPress, text }) => {
        return (
            <Pressable
                style={styles.modalButton}
                onPress={onTasteUpdatePressed}
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
                    <View style={{flexDirection:'col'}}>
                        <View style={{flexDirection:'row'}}>
                            <RadioButton
                                value='yes'
                                status = {tasteUpdate.taste==='yes' ? 'checked' : 'unchecked'}
                                onPress={() => {changeCheck('taste', 'yes')}}
                            />
                            <Text style={styles.modalText}>맛 상관있음</Text>

                            <RadioButton
                                value='no'
                                status = {tasteUpdate.taste==='no' ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    changeCheck('taste', 'no')
                                    changeCheck('sweet', false)
                                    changeCheck('sour', false)
                                    changeCheck('fruit', false)
                                    changeCheck('milk', false)
                                    }}
                            />
                            <Text style={styles.modalText}>맛 상관없음</Text>

                        </View>

                        {tasteUpdate.taste==='yes' ? (
                            <View style={{flexDirection:'row'}}>
                                <CheckBox
                                    value={tasteUpdate.sweet}
                                    onValueChange={(status) => {changeCheck('sweet', status)}}
                                 />
                                <Text style={styles.modalText}>단맛</Text>
                                <CheckBox
                                    value={tasteUpdate.sour}
                                    onValueChange={(status) => {changeCheck('sour', status)}}
                                 />
                                <Text style={styles.modalText}>새콤한맛</Text>
                                <CheckBox
                                    value={tasteUpdate.fruit}
                                    onValueChange={(status) => {changeCheck('fruit', status)}}
                                 />
                                <Text style={styles.modalText}>과일맛</Text>
                                <CheckBox
                                    value={tasteUpdate.milk}
                                    onValueChange={(status) => {changeCheck('milk', status)}}
                                 />
                                <Text style={styles.modalText}>우유맛</Text>
                            </View>
                        ): null}
                        <TasteUpdateButton
                            text="저장하기"
                        />
                    </View>

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

export default TasteModal;