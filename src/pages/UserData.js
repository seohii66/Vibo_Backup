import React, {useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { containsKey, getData, removeData, storeData } from "./AsyncService";
import axios from 'axios';


export const storeUserData = async () => {
      try {
        const userID = JSON.parse( await AsyncStorage.getItem("userID"));

        if (userID) {
          console.log("userdata.js) userID: ", userID);
          try{
                axios.get('http://54.180.142.26:3001/api/onLogin/'+ userID +'/mypage')
                .then((response) => {
                    if  (response.data.status == 'found_userInfo'){
                        console.log("userdata.js) response.data: ", response.data);

                        const temp = {user:response.data.data};
                        console.log("userdata.js) temp: ", temp);
                        storeData('userInfo', temp);
                    }

                })
                .catch(error => { console.log("userdata: ", err); });

            } catch (err){
                console.log("userdata.js) err: ", err)
            };
        }

      } catch (error) {
        console.log("userdata.js) error: ", error);
      }
};

export const getUserData = async (): Promise => {
    const userInfo = await getData("userInfo");
    console.log("userdata.js) userInfo: ", userInfo);
    return userInfo;
};
