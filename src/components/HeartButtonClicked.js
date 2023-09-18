import React ,{Component} from 'react';
import Icon from "react-native-vector-icons/Ionicons";
import {TouchableOpacity,SafeAreaView, View, Text ,Button,StatusBar,StyleSheet,FlatList,Image,ListView} from "react-native";

class HeartButton extends Component{
       constructor(props){
        super(props);
        this.userID = "" // constructor 정의 시 반드시 필요!
        this.state = { // state의 초기값 설정 부분
            ButtonClicked: false,
        };
    }
//찜하면 callAddWishAPI 호출하여 userID와 상품ID를 GET 방식으로 서버로 보낸다.
    async callAddWishAPI(){
        let manager=new WebServiceManager(Constant.serviceURL+"/AddWishList?user_id="+this.id+"&goods_id="+this.item.id);
        let response=await manager.start();
        if(response.ok)
            return response.json();
    }
//찜 삭제하는 경우
    async callRemoveWishAPI(){

        axios.use('http://43.201.36.107:3001/api/user/${userID}/like/${ItemID}/update')
        let response = await manager.start();
        if(response.ok){
            return response.json();
        }
    }
    render(){
        ButtonClicked=()=>{
            if (this.state.ButtonClicked == true) {
                this.callRemoveWishAPI().then((response)=>{
                    console.log(response);
                })
                console.log("찜목록 삭제");
                this.setState({ButtonClicked: true });
            }
        }
        return( 
            <TouchableOpacity onPress ={this.ButtonClicked}>
        
           <Icon name={this.state.ButtonClicked ? "heart-outline" : "heart"} color = '#FCA6C5' size={35}></Icon>
       </TouchableOpacity>)}
    
}
export default HeartButton;