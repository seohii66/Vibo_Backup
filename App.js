/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {
  StyleSheet,
} from 'react-native';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"


/*
npm install @react-navigation/native
npm install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
npm install @react-navigation/stack
 */
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//페이지 불러오기
import SplashPage from "./src/pages/Splash";
import HomePage from "./src/pages/Home";
import JoinPage from "./src/pages/Join";
import DetailPage from "./src/pages/Detail";
import EditPage from "./src/pages/Edit";
import MyPage from "./src/pages/MyPage";
import JoinCharPage from "./src/pages/JoinCharacter";
import LikePage from "./src/pages/Like";
import RecommendPage from "./src/pages/Recommend";
import LoginPage from "./src/pages/Login";
import Like from './src/pages/Like';
import NavBar from './src/components/Nav';
import style from './src/style'


// 로그인, 회원가입
const Auth = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LoginPage" component={LoginPage} options={{headerShown: false}}/>
      <Stack.Screen name="JoinPage" component={JoinPage} options={{headerShown: false}} />
      <Stack.Screen name="JoinCharPage" component={JoinCharPage} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};


//일단 기타 나머지들
const DrawerNavigationRoutes = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomePage" component={HomePage}/>
      <Stack.Screen name="DetailPage" component={DetailPage} options={{headerShown: false}}/>
      <Stack.Screen name="EditPage" component={EditPage} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

//Screen과 Navigator의 속성을 포함하는 객체를 반환하는 함수
function App(){
    
  return (
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash"     component={SplashPage}     options={{headerShown: false}}  />
        <Stack.Screen name="Auth"     component={Auth}     options={{headerShown: false}}  />
        <Stack.Screen name="Home" component={HomePage}  options={{headerShown: false}}   />
        <Stack.Screen name="DrawerNavigationRoutes" component={DrawerNavigationRoutes}
          options={{headerShown: false}} />
        <Stack.Screen name ="Tab" component={NavBar} options={{headerShown: false}}/>
    </Stack.Navigator>
   </NavigationContainer>

 );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
