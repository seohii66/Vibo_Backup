import React,{useState,useEffect, useRef,useMemo ,useCallback} from "react";
import { View, Text, StyleSheet,TouchableOpacity,Image,FlatList,ScrollView,Modal,Pressable,} from "react-native";
import stylelist from '../style';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation ,NavigationContainer} from "@react-navigation/native";
import axios from 'axios';
import Icon from "react-native-vector-icons/Ionicons";
import Slider from '@react-native-community/slider';
import {imagePath} from '../components/imagePath.js'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeUserData } from '../pages/UserData';

import TestModal from '../components/TestModal';
import Loading from './Loading.js';

function Detail({route}) {
  
  const [ready, setReady] = useState(true);

  const navigation = useNavigation();
  const [likeState, setState] = useState(false);
  const[clicked,setclick] = useState(false);
  const[myscore,setScore] = useState();
  const[userID,setUserID] = useState();
  const[averscore,setAverScore] =useState(0);
  const[scores, setMyScore] = useState(myscore);
  const[IBCFitemlist, setIBCFitems] = useState();

  const itemid = route.params.item.ItemID;
  
  const [testModalVisible, setTestModalVisible] = useState(false);

useEffect(() => { 
  async function temp(){
    const user = JSON.parse(await AsyncStorage.getItem("userID"));
    setUserID(user)
    console.log("userID 1: ", user);
   
      try{
      async function fetchScore(){ 
      
        await axios.get('http://43.201.36.107:3001/api/user/'+ user +'/ratings/'+itemid).then((response)=>
        { 
          console.log(response.data);
         console.log("0: ", response.data[0]);
         console.log("1: ", response.data[1]);
         try
         {
          setTimeout(()=>{
            setAverScore(Math.round(response.data[0]*10)/10);
            setScore(response.data[1]);
            setReady(false)            
          }, 100)

          // setAverScore(Math.round(response.data[0]*10)/10);
          // setScore(response.data[1]);
        }
          catch(err){
            console.log(err)
          }        //  console.log('response.data[1]',response.data[1])
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
        })
        // , [itemid]
      }

      async function Likeornot(){
        await axios.get('http://43.201.36.107:3001/api/user/'+user+'/like/'+itemid).then((response)=>{
        try{setState(response.data);
        console.log(response.data)}
      catch(err){console.log(err)}}).catch((error)=>{console.error(error);}),[itemid]
        }

          Likeornot(),
          fetchScore(),
          setMyScore(0)
          setclick(false)
        } catch (err){
            console.log("detail.js) err: ", err);
        };
  
      }
  
  temp();


  },[itemid]
  ); 
  console.log('userid: ', userID)

function Stars(rating){
    
        if(0.3<= rating && rating <=0.7){
            return(
            <Image style={styles.stars} source={require("./images/stars/0.5.png")}/> 
            )}
        else if( 0.8<= rating && rating <=1.2){
            return(
                  <Image style={styles.stars} source={require("./images/stars/1.png")}/> 
            )}
        else if (1.3<= rating  && rating <=1.7)
{            return(
                  <Image  style={styles.stars} source={require("./images/stars/1.5.png")}/> 
            )
}        else if(1.8<= rating && rating <=2.2)
{            return(
                  <Image  style={styles.stars} source={require("./images/stars/2.png")}/> 
            )}
        else if  (2.3<= rating && rating <=2.7)
{            return(
                <Image  style={styles.stars} source={require("./images/stars/2.5.png")}/> 
                
            )
}        else if ( 2.8<= rating && rating<=3.2)
{            return(
                  <Image  style={styles.stars} source={require("./images/stars/3.png")}/> 
            )}
        else if (3.3<= rating && rating<=3.7)
{            return(
                  <Image style={styles.stars} source={require("./images/stars/3.5.png")}/> 
            )}
        else if (3.8<= rating && rating<=4.2)
{            return(
                  <Image style={styles.stars} source={require("./images/stars/4.png")}/> 
            )}
            else if (4.3<= rating && rating<=4.7)
            {            
            return(
          <Image style={styles.stars} source={require("./images/stars/4.5.png")}/> 
                        )}
            else if (4.8<= rating )
{            return(
                <Image style={styles.stars} source={require("./images/stars/5.png")}/> 
            )}
          else {
              return(
                  <Image style={styles.stars} source={require("./images/stars/0.png")}/> 
            )}
            
    }
  
  const youtube=()=>{
    if   (route.params.item.youtube == 1){
      return <Text style={styles.text2}>youtube</Text>
    }
  }
  const instagram=()=>{
    if   (route.params.item.insta == 1){
      return <Text style={styles.text2}>instagram</Text>
    }
  }


  //좋아요 버튼 누를 시 서버 전송
  const ButtonClicked=(itemid)=>{
   
    //likedb의 좋아요 state 업데이트
    async function updatelike()
    {await axios.post('http://43.201.36.107:3001/api/user/'+userID+'/like/'+ itemid +'/update').then((response)=>
      {try{
        console.log(response);
        if(response.ok){
          return response.json();     
        }}
        catch(err){console.log(err)}}),[likeState]}
    
  //   // 좋아요 클릭시 해당 제품과 비슷한 속성의 아이템 추천해주는 IBCF 알고리즘 백에서 실행
  //   async function IBCFList(){
  //     await axios.get('http://43.201.36.107:3001/api/user/IBCF/'+itemid).then((response)=>{
        
  //       try{console.log('IBCFLIST',response.data);
  //       setIBCFitems(response.data); 
  //       //console.log('flatlistdata',IBCFitemlist)
  //       }catch(err){
  //       console.log(err)
  //     }}
  //     ),[]
  //  }
  
    updatelike()
    //IBCFList()
    setclick(!clicked)
   
   
  };

  function showModal(){
    console.log(likeState)
    if (likeState == true){
      console.log("hi");
      setTestModalVisible(true);
    }}

// function showflatlist(){
//   if (clicked == true){
//   if (likeState == true){
//     console.log(IBCFitemlist)
//     return    (
//     <FlatList data={IBCFitemlist}
//     keyExtractor={(item) => item.ItemID}
//     horizontal = {true}
//     renderItem= {({ item })=>(
        
//         <TouchableOpacity onPress={()=>[navigation.navigate('DrawerNavigationRoutes',{screen:"DetailPage",params:{item}}), setclick(false)]}>
//         <View style={styles.flatlistcontainer}>
//         <View >
//           <Image source={imagePath[item.ItemID]['src']} style = {styles.image}/>
          
//         </View>
//           <View style={styles.flatlisttext}>
//             <Text style={[stylelist.Text_Medium,paddingTop=15, marginTop =10]} key={item.ItemID}>{item.item}</Text>
//           </View>
//         </View>
//       </TouchableOpacity>)}/>)}}}

//사용자의 상품에 대한 평점 업데이트
const RatingUpdated=([scores])=>{
  try{ 
    axios.post('http://43.201.36.107:3001/api/user/'+userID+'/ratings/'+ itemid +'/update/'+scores).then((response)=>
    {console.log(response);
    if(response.ok){
      return response.json();}
   },[itemid])} catch(err){console.log(err)}
    console.log('score updated')  }
  
  return  ready ? <Loading/> : (    
    <SafeAreaView style={{flex:1, backgroundColor:'#ffffff'}}>

      <TestModal
          modalVisible={testModalVisible}
          //setModalVisible={setTestModalVisible}
          itemID={itemid}
          clicked={clicked}
          //setclick={setclick}
          likeState={likeState}
          IBCFitemlist={IBCFitemlist}
          //setIBCFitems={setIBCFitems}
          />


      <ScrollView>    
    <View style={styles.backcontainer}> 
        <TouchableOpacity onPress={()=>navigation.pop()} style={styles.button}>
          <Text style={[stylelist.Gray3,stylelist.Semi_Regular]}>목록으로</Text>
          </TouchableOpacity>
    </View>
    <View style={styles.container}> 
        <Text style={[stylelist.Title_Bold,stylelist.black,stylelist.line]} >About</Text>
        <View style={styles.imagecontainer}>
          <Image source={imagePath[itemid]['src']} style = {styles.image}/></View>
        <View style={styles.itemcontainer}>
          <Text style={[stylelist.Title_SemiBold,stylelist.black,styles.text ]}>{route.params.item.item}</Text>

              <TouchableOpacity onPress ={()=>[ButtonClicked(route.params.item.ItemID),setState(!likeState),setclick(true)]} >
                <Icon name={likeState == true ? "heart" : "heart-outline" } color = '#FCA6C5' size={35} style={styles.heart} ></Icon>
              </TouchableOpacity>

        </View>
        <View style={styles.itemcontainer1}>
          <Text style={styles.text2}>{route.params.item.기능.split("\n").join("  |  ")}</Text>
          {youtube}
          {instagram}
        </View>
   
          <View style = {styles.ratingscontainer}>
          <Text style={[stylelist.Semi_Bold,stylelist.black,styles.text1]} >전체 평점</Text>
              {Stars(averscore)}
          <Text style= {[stylelist.Semi_Bold,stylelist.Green]}>{averscore}</Text>
          </View>
          <View style = {[styles.ratingscontainer]}>
          <Text style = {[stylelist.Semi_Bold,stylelist.black]}>평가하기</Text>
          {/* 여기가 이제 스크롤하면 변하도록 */}
         
          {Stars(scores)}
          <Slider
                style={styles.slider}
                value={scores} // == this.state.value
                onValueChange={(value) => [setMyScore(value),RatingUpdated([value])]} // 슬라이더를 움질일때 출력값 변환
                minimumValue={0} // 최소값 설정
                maximumValue={6} // 최대값 설정
                maximumTrackTintColor="#FCD53F"
                minimumTrackTintColor='#FCD53F' 
                thumbTintColor='#FCD53F'
                step={0.5}
                 // 0.5단위로 값이 변경 
            />
          </View>
              </View>
              {/* {showflatlist()}       */}
        </ScrollView>

              
    </SafeAreaView>

)}

const styles = StyleSheet.create({
  title:{
    width:'100%',
    alignItems: 'left',
    marginLeft:20,
    marginBottom:25,
    
  },
  
  backcontainer: {
    //flex:1,
    marginTop:30,
    paddingHorizontal:20,
    alignItems: 'left',
    backgroundColor: '#ffffff',
  },
  flatlistcontainer:{
    alignItems: 'center',
    //alignContent:'center',
    width:150,
    margin:5,
    height:200,
    backgroundColor:'#f6f6f6',
    paddingTop:10,
    marginBottom:30,
    marginTop:30,

    paddingBottom:10
  },
  flatlisttext:{
    width:'80%',
    flexWrap:"nowrap",
    height:50,
  },
  container: {
   // paddingTop:10,
    
    paddingHorizontal:10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  }
,
ratingscontainer: {
  marginTop:10,
    paddingTop:10,
    backgroundColor: '#ffffff',
    justifyContent:'space-around',
    alignItems:'center',
    width:'90%',
    height:70,
    flexDirection:'row'

},

  itemcontainer: {
    marginTop:20,
    paddingTop:10,
    backgroundColor: '#ffffff',
    justifyContent:'space-between',
    alignItems:'center',
    width:'90%',
    flexDirection:'row'

  },
  itemcontainer1: {
    paddingTop:15,
    backgroundColor: '#ffffff',
    justifyContent:'flex-start',
    width:'90%',
    flexDirection:'row'
  },

  stars:{
    resizeMode:'contain',
    width:'60%'
  
  },
  imagecontainer: {
    marginTop:20,
    width:'80%',
    backgroundColor: '#ffffff',
    alignItems:'center'
  },
button:{
  backgroundColor:'white',
},
text1:{
  display:'flex',
//  marginTop:40,
},

text2:{
  display:'flex',
  padding:10,
  borderRadius:15,
  backgroundColor:'#99A799',
  color:'#ffffff'
},
text:{
    width:'80%',
    flexWrap:"nowrap",
  },
  image:{
    width:250,
    height:150,
    resizeMode:'contain',
   
  },
  slider:{
    height: 20
     , width: 305 ,
      opacity:0,
      position:'absolute',
      left :110

  },
});
export default Detail;