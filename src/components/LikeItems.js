import React ,{Component} from "react";
import {SafeAreaView, View, Text ,Button,StatusBar,StyleSheet,FlatList,Image,ListView} from "react-native";
import stylelist from '../style';
import HeartButton  from "./HeartButton";

const styles = StyleSheet.create({
    LikeItem  : {
        flexDirection: "row",
        borderBottomWidth:2,
        padding : 5,
        height: 150
    },
    cover:{
        flex:1,
        height : 150,
        resizeMode:"contain"
    },

    heart:{
        height:80
    }
});

class LikeItem extends Component {
    render(){
        return(
        <View style = {styles.LikeItem}>
            <Image style = {styles.cover} source = {{uri:this.props.coverURL}}/>
            <View style = {styles.info}>
            <Text style= {[stylelist.Semi_Medium,stylelist.black]}>{this.props.product}</Text>
            <HeartButton />
        </View></View>
   ) }
}
export default LikeItem;