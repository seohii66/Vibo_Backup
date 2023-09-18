import React ,{Component,useState,useEffect} from "react";
import {SafeAreaView,TouchableOpacity, View, Text ,StatusBar,StyleSheet,FlatList,Image, Alert} from "react-native";
import stylelist from '../style';
import HeartButton from "../components/HeartButtonClicked";
import axios from 'axios'
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {imagePath} from '../components/imagePath.js'

//자신의 user_Id 에 해당하는 찜 아이템 목록 값들 불러오기
 
const All=()=>{
  const [useritems, setItems] = useState([]);
  const [likeState, setState] = useState([true]);
  const[userID,setUserID] = useState();

  useEffect(() => { 
    async function temp(){
      const user = JSON.parse(await AsyncStorage.getItem("userID"));
      //console.log("userID 1: ", userID);
      setUserID(user)
      
        try{
        axios.get('http://54.180.142.26:3001/api/user/'+user+'/like').then((response)=>{
          setItems(response.data);
    //  console.log('likeitems',useritems)
    })
    .catch((error)=>{console.log(error);}); }catch(err){    console.log("like.js) err: ", err);}}
    
    temp()
    
, [likeState,useritems]}); // 로그인된 사용자 ID가 변경될 때마다 실행

  const ButtonClicked=(itemid)=>{
    if ( likeState == true){
      setState(false);
    }
    else{
      setState(true);
    }
    
    axios.post('http://54.180.142.26:3001/api/user/'+userID+'/like/'+ itemid +'/update').then((response)=>
    {    
      //console.log(response);
        if(response.ok){
          return response.json();  
             
      };   
    },[likeState])   
}
  
  const renderLikeItems = ({item})=>{
    //if(!likeState) return;
    
    return (
          <View style={styles_home.item_container} >
          <View > 
            <Image source={imagePath[item.itemID]['src']} style = {styles_home.image} ></Image>
          </View>
          <View >
            <Text style={styles_home.item}  key={item.id}> {item.title} </Text>
          </View>
          <View>
          
      <TouchableOpacity onPress ={()=>[ButtonClicked(item.itemID)]} >    
    <Icon name={"heart" } color = '#FCA6C5' size={35} key = {item.itemId} ></Icon>
    </TouchableOpacity>
          </View>
          </View>
    )}
  //const [columnIndices, setColumnIndices] = useState([]);
 // const [userId, setUserId] = useState('john'); // 로그인된 사용자 ID를 상태로 관리
 if (useritems.length ==0){
  return(
    <View>
      <Text>마음에 드는 상품을 찜해보세요!</Text>
    </View>
  )
 } else{
  return (
  <View >
  <FlatList data={ useritems} // 필수 Props
        keyExtractor={(item) => item.item}
        renderItem= {renderLikeItems}
  />
   
  </View>
  );
  }}
const Like = ()=>{

  // state = {ButtonClicked:true};
  // onClick = () =>{ 
  //   this.setState({ButtonClicked:false});
  // };
  
    return(  
    <SafeAreaView style={stylelist.container}>
      <View style={stylelist.titlecontainer}>
      <Text style = {[stylelist.title,stylelist.Title_Bold,stylelist.black,stylelist.line]}> LIKE </Text>
      </View>
      <View style={stylelist.container}>
      <All/>
      </View>
      </SafeAreaView>
    )
  };
const styles_home = StyleSheet.create({
  image:{
 
    width:50,
    resizeMode:'contain'
  }
  ,
item_container:{
  height:90,
  alignItems:'center',
  justifyContent:"space-between",
  width:'90%',
  marginLeft:'5%',
  flexDirection:'row',
  //backgroundColor: 'yellow',
},

heart:{
  marginRight:50,
 // backgroundColor:'pink',
},
item: {
  
  display:'flex',
//backgroundColor:'green',
borderWidth:1,
borderTopWidth:0,
borderColor:'#E8E8E8',
borderLeftWidth:0,
borderRightWidth:0,
fontSize: 20,
width:250,
height:25,
flexWrap:'wrap',

}
});
export default Like;