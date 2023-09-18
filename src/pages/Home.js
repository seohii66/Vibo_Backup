import React ,{useEffect} from "react";
import {SafeAreaView, View, Text ,Button,StatusBar,StyleSheet,FlatList} from "react-native";
import stylelist from '../style';
import header from '../components/Header'
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();
import NavBar from '../components/Nav';

import RecoveryPage from './Home/Recovery'
//페이지 불러오기


    
function Home() {
  return (     
    <SafeAreaView style={{flex:1}}   >    
     <Stack.Navigator initialRouteName="header" >
     <Stack.Screen name ="header" component={header}options={{headerShown: false}} />  
      
     </Stack.Navigator>
       <StatusBar style='auto' />
    </SafeAreaView> 
    
  )
  };
const styles_home = StyleSheet.create({
  title:{
    width:'100%',
    alignItems: 'left',
    marginLeft:10,
    marginBottom:5,
    marginTop:5,
  
  },
  container: {
    borderBottomWidth: 1,
    height: 100,
  },
  text: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 50,
  },  
  item: {
    marginTop:24,
    padding:30,
    backgroundColor:'pink',
    fontSize: 24,
    marginHorizontal:10,
    marginTop:24,
  }
});

export default Home;