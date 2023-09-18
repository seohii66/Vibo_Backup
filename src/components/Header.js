import React from "react";
import {SafeAreaView, View, Text ,Button,StatusBar,StyleSheet} from "react-native";
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import recoveryScreen from '../pages/Home/Recovery';
import gut from "../pages/Home/Gut";
import vagina from "../pages/Home/Vagina";
import diet from "../pages/Home/Diet";


const TopTab = createMaterialTopTabNavigator();
const Header=() => {
    return(
    <TopTab.Navigator initialRouteName="recovery" >
        <TopTab.Screen name = "recovery"component = {recoveryScreen} options = {{title:'피로회복' ,headerShown:false}}/>
        <TopTab.Screen name = "gut"  component = {gut} options = {{title: '장 건강',headerShown:false}}/>
        <TopTab.Screen name = "vagina"       component = {vagina}      options = {{title: '질 건강',headerShown:false   }} />
        <TopTab.Screen name = "diet"     component = {diet}        options = {{title: '다이어트'}}/>

    </TopTab.Navigator>
    );
};


export default Header;