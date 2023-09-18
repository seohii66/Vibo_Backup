import React ,{useEffect,useState} from "react";
import {SafeAreaView, View, Text ,Image,TouchableOpacity,Button,StatusBar,StyleSheet,FlatList} from "react-native";
import stylelist from '../../style';
import axios from 'axios'
import { useNavigation } from "@react-navigation/native";
import {imagePath} from '../../components/imagePath.js'




const Best=()=>{
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // 서버에서 데이터 가져오기
    axios.get('http://54.180.142.26:3001/api/data')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  var jsontext =JSON.parse(JSON.stringify(data))

  function makejson(){  
    var dataarray = []
      for (i = 0; i<= 806; i++){
        if(typeof(jsontext[i])!='undefined'){
            var string  = ' {"ItemID" :"'+ jsontext[i].ItemID + '","item": "'+jsontext[i].item +'","기능": "'+jsontext[i].기능+ '","insta": "'+jsontext[i].insta + '","youtube": "'+jsontext[i].youtube +'","src":"'+ imagePath[i]['src']+'"}'
            dataarray.push(string)
              }
        else{
          continue
        }}
        return dataarray;  
  
  }
  const dataarray = makejson()
if (dataarray){
  len =  dataarray.length -1;
 
  }
  function makedatajson(){
    var jsondata = []
    for (var i = 0; i<= len ;i++){
      try{
        jsondata.push(JSON.parse(dataarray[i]))
      }
      catch(err){
        console.log(err)

        // jsondata.push(JSON.parse(JSON.stringify({"ItemID":264,"item":"솔가B-100베지터블캡슐","기능":"피로회복","insta":0,"youtube":0,"src":require('../../components/images/264.jpg')})))
      }
    }
  
    return jsondata;  
  }
  const datajson = makedatajson();
  const Vaginadata = datajson.filter((item)=>item.기능.includes('질건강'));
  const bestVagina = Vaginadata.slice(0,5);

    return(
      <View style={styles_home.container}>
        <View style={styles_home.title }> 
          <Text style = {[stylelist.black, stylelist.Semi_Bold] }> Best 5 </Text>
        </View>
        <FlatList
        data={bestVagina} // 필수 Props
        renderItem= {({ item })=>(
          <TouchableOpacity onPress={()=>navigation.navigate('DrawerNavigationRoutes',{screen:"DetailPage",params:{item}})}>

        <View style={styles_home.item_container}>
          <View >
          <Image source={item.src ? item.src : require('../images/paw.png')} style = {styles_home.image}></Image>
          </View>
          <View style={styles_home.text}>
          <Text style={stylelist.Text_Regular} key={item.ItemID}>{item.item}</Text>
          </View>
        </View></TouchableOpacity>)} horizontal={true} // numColumns를 사용할 때 값을 false로 지정해줘야 한다.
        />
      </View>
    );
  };
const All=()=>{
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // 서버에서 데이터 가져오기
    axios.get('http://54.180.142.26:3001/api/data')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); var jsontext =JSON.parse(JSON.stringify(data))

  function makejson(){  
    var dataarray = []
      for (i = 0; i<= 806; i++){
        if(typeof(jsontext[i])!='undefined'){
            var string  = ' {"ItemID" :"'+ jsontext[i].ItemID + '","item": "'+jsontext[i].item +'","기능": "'+jsontext[i].기능+ '","insta": "'+jsontext[i].insta + '","youtube": "'+jsontext[i].youtube +'","src":"'+ imagePath[i]['src']+'"}'
            dataarray.push(string)
              }
        else{
          continue
        }}
        return dataarray;  
  
  }
  const dataarray = makejson()
if (dataarray){
  len =  dataarray.length -1;
 
  }
  function makedatajson(){
    var jsondata = []
    for (var i = 0; i<= len ;i++){
      try{
        jsondata.push(JSON.parse(dataarray[i]))
      }
      catch(err){
        jsondata.push(JSON.parse(JSON.stringify({"ItemID":264,"item":"솔가B-100베지터블캡슐","기능":"피로회복","insta":0,"youtube":0,"src":require('../../components/images/264.jpg')})))
      }
    }
  
    return jsondata;  
  }
  const datajson = makedatajson();
  const Vaginadata = datajson.filter((item)=>item.기능.includes('질건강'));
  const notbest = Vaginadata.slice(5,-1);

    return(
      <View style={styles_home.container}>
      <View style={styles_home.title }> 
        <Text style = {[stylelist.black, stylelist.Semi_Bold] }> ALL </Text>
      </View>
    <FlatList data={notbest} // 필수 Props  
      numColumns={2}
      keyExtractor={(item) => item.ItemID}
      renderItem= {({ item })=>(
        <TouchableOpacity onPress={()=>navigation.navigate('DrawerNavigationRoutes',{screen:"DetailPage",params:{item}})}>
        <View style={styles_home.item_container}>
        <View >
        <Image source={item.src ? item.src : require('../images/paw.png')} style = {styles_home.image}></Image>
        </View>
        <View style={styles_home.text}>
        <Text style={stylelist.Text_Regular} key={item.ItemID}>{item.item}</Text>
        </View>
      </View></TouchableOpacity>)} />
    </View>
    );};
  

function Vagina({navigation}) {
  return (      
    <SafeAreaView style={{flex:1}}   >    
    <Best/><All/> 
    <StatusBar style='auto' />
    </SafeAreaView> 
    
  )
  };
const styles_home = StyleSheet.create({
  title:{
    width:'100%',
    alignItems: 'left',
    marginLeft:20,
    marginBottom:25,
    
  },
  container: {
    paddingTop:20,
    paddingHorizontal:10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  item_container:{
      alignItems: 'center',
      //alignContent:'center',
      width:150,
      margin:5,
      height:185,
      backgroundColor:'#f6f6f6',
      paddingTop:10,
    },  
    text:{
      display:'flex',
      width:'80%',
      height:'20%',
      flexWrap:"nowrap",
      marginTop:10,
      marginLeft:30,
      marginRight:20,
    },
  image:{
    width:120,
    height:120,
    resizeMode:'contain',
   
  },
  
});
export default Vagina;