import React, {useEffect,useState} from "react";
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    Pressable,
    View,
    Image,
    Modal, Alert, FlatList
} from "react-native";

import axios from 'axios';
import stylelist from '../style';
import {imagePath} from '../components/imagePath.js'
import { useNavigation ,NavigationContainer} from "@react-navigation/native";

const TestModal = (props) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState();
    const[IBCFitemlist, setIBCFitems] = useState();

   
    const ID = props.itemID
    console.log("props: ", props);
    useEffect(() => { 
        async function IBCFList(){
            await axios.get('http://43.201.36.107:3001/api/user/IBCF/'+ID).then((response)=>{
              console.log('IBCFLIST', response.data);
              if(!response.data){
                setIBCFitems()
            }
              else{
              setIBCFitems(response.data); 
            }}
            )}
            IBCFList() 
            setModalVisible(props.likeState)    },[props.likeState])
        
      //   console.log(IBCFitemlist)
       

console.log('modalvisible',modalVisible)
      

    // port 전송 코드
    const onTextureUpdatePressed = () => {
            try{
                setModalVisible(!modalVisible)
            } catch (err){
                console.log(err)
            };
    };

    // Texture 수정사항 저장 Btn
    const TextureUpdateButton = ({ onPress, text }) => {
        return (
            <Pressable
                style={styles.modalButton}
                onPress={onTextureUpdatePressed}
            >
                <Text style={styles.modalText}>
                    {text}
                </Text>
            </Pressable>
        );
    }
if (props.clicked == true){
    if (props.likeState == true){
        if(IBCFitemlist)
{        return (
        <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        >

            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={{flexDirection:'row'}}>

                        <FlatList data={IBCFitemlist}
                        keyExtractor={(item) => item.ItemID}
                        horizontal = {true}
                        renderItem= {({ item })=>(
                            
                            <TouchableOpacity onPress={()=>[navigation.navigate('DrawerNavigationRoutes',{screen:"DetailPage",params:{item}})]}>
                            <View style={styles.flatlistcontainer}>
                            <View >
                                <Image source={imagePath[item.ItemID]['src']} style = {styles.image}/>
                                
                            </View>
                                <View style={styles.flatlisttext}>
                                <Text style={[stylelist.Text_Medium,styles.itemtext]} key={item.ItemID}>{item.item}</Text>
                                </View>
                            </View>
                            </TouchableOpacity>
                        )}/>

                        
                    </View>
                    <TextureUpdateButton
                        text="닫기"
                    />
                </View>
            </View>
        </Modal>            
    );
                        }
                        else{
                            return(
                                <Modal
                                animationType='slide'
                                transparent={true}
                                visible={modalVisible}
                                >
                        
                                    <View style={styles.nocenteredView}>
                                        <View style={styles.nomodalView}>
                                    <Text style = {[stylelist.Semi_Bold,styles.notext]}>표시할 항목이 존재하지 않습니다</Text>
                                    <TextureUpdateButton
                        text="닫기"
                    />
                    </View></View>
                                    
                                    </Modal>                            )
                        }}
}}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 22,
    }, 
    notext:{
        padding:20,
        margin :10
    },
   
    nocenteredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        //padding: 20
    },
    image:{
        width:150,
        height:100,
        resizeMode:'contain',
        marginBottom:20
       
      },
      
      itemtext:{
        marginTop:10,
        height:40},
  flatlistcontainer:{
    alignItems: 'center',
    alignContent:'center',
    width:120,
    margin:5,
    height:150,
    backgroundColor:'#f6f6f6',
    paddingTop:10,
    paddingRight:5,
    paddingLeft:5,
    marginBottom:50,
    marginTop:30,

    //paddingBottom:10
  },
    modalView: {
        margin: 15,
        backgroundColor: 'white',
        borderRadius: (0,0,10,10),
        paddingBottom: 15,
        alignItems: 'center',
        shadowColor: '#99A799',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    nomodalView: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: (0,0,10,10),
        paddingBottom: 15,
        alignItems: 'center',
        shadowColor: '#99A799',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    modalText: {
        width: 90,
        flexWrap:"nowrap",
        height:30,
         
         
    },

    modalButton: {
        justifyContent: 'center'
        ,alignContent:'center',
        width:30,
        height:10
        
    }
});

export default TestModal;