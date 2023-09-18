import React ,{useState,useEffect} from "react"
import {SafeAreaView, View, Image,Text ,TouchableOpacity,Button,StatusBar,StyleSheet,FlatList} from "react-native";
import stylelist from '../style';
import axios from 'axios'
import { useNavigation } from "@react-navigation/native";
import {imagePath} from '../components/imagePath.js'

import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from './Loading.js';

const All=()=>{
  const [ready, setReady] = useState(true);

  const [recitems, setItems] = useState([]);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => { 
    async function temp(){
      const userID = JSON.parse(await AsyncStorage.getItem("userID"));
      console.log("userID 1: ", userID);

        try{              // userinfo의 회원가입한 사람 수 받아오기
          axios.get('http://54.180.142.26:3001/api/user/'+userID+'/recommend/count').then((num_res)=>{
            console.log(num_res.data);
            // 15명 미만이면 contents-based - server: /userID/recommend
            // 15명 이상이면 ubcf - server: /userID/recommned/ubcf
            if (num_res.data.data < 15) {
              console.log("cold-start");
              // Cold Start : contents-based
              try{
                axios.get('http://54.180.142.26:3001/api/user/'+userID+'/recommend').then((response)=>{
                    console.log("Cold-Start: ", response.data);
                    setTimeout(()=>{
                      setItems(response.data);
                      setReady(false);
                    }, 1000)

                  console.log('response of recommend', recitems)
                  }).catch((error)=>{console.error("here:", error);});
              } catch (err){
                  console.log("recommend.js) err: ", err);
              };

            } else {
              console.log("post cold-start");
              try{
                axios.get('http://54.180.142.26:3001/api/user/'+userID+'/recommend/ubcf').then((response)=>{
                  console.log("UBCF: ", response.data);
                  setTimeout(()=>{
                    setItems(response.data);
                    setReady(false);
                  }, 1000)

                  
                }).catch((error)=>{console.error("here:", error);});
              } catch(err){
                console.log("recommend.js) err: ", err);
              };

            }

          }).catch((error)=>{console.error("here:", error);});
        } catch(err){
          console.log("recommend.js) err: ", err);
        };
      }
      temp();

  }, []); // 로그인된 사용자 ID가 변경될 때마다 실행

  return ready ? <Loading/> :(
  <View >
  <FlatList  data={recitems} // 필수 Props
  numColumns={2}   
  renderItem= {
    
    ({ item })=>(
      <TouchableOpacity onPress={()=>navigation.navigate('DrawerNavigationRoutes',{screen:"DetailPage",params:{item}})}>
      <View style={styles_home.container}>
    <View >
    <Image source={imagePath[item.ItemID]['src']} style = {styles_home.image}></Image>  
    </View>
    <View style={styles_home.text}>
    <Text style={stylelist.Text_Regular}>{item.item}</Text>
    </View>
  </View></TouchableOpacity>)}/>
  </View>
  );};


function Recommend(){
  return (
  <SafeAreaView  style={stylelist.container}>    
<View style={stylelist.titlecontainer}>
<Text style = {[stylelist.title,stylelist.Title_Bold,stylelist.black,stylelist.line]}>VIBO's Choice</Text>
</View>
<View style={stylelist.container}>
      <All/>
</View>
</SafeAreaView> 
  )
};



const styles_home = StyleSheet.create({
text:{
  
  display:'flex',
  width:'80%',
  height:'30%',
  flexWrap:"nowrap",
  paddingTop:10,
  paddingBottom:15,
  marginTop:15,
  marginLeft:30,
  marginRight:20,
  marginBottom:20,
},
container:{
    alignItems: 'center',
    alignContent:'center',
    width:180,
    margin:5,
    height:160,
    //backgroundColor: 'yellow',
  
    justifyContent:'space-around'
  },  
  image:{
    width:120,
    height:120,
    padding:30,
    backgroundColor:'#f6f6f6',
    resizeMode:'contain',
   
  },
});

export default Recommend;