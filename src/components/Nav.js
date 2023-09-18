import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
//페이지 불러오기
import HomePage from "../pages/Home";
import MyPage from "../pages/MyPage";
import LikePage from "../pages/Like";
import RecommendPage from "../pages/Recommend";
import Icon from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();
const Nav=() => {
    return(
    <Tab.Navigator screenOptions= {({route}) => ({
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
               iconName = focused? 'home' : 'home-outline';
           } else if (route.name === 'Recommend') {
               iconName = focused? 'planet' : 'planet-outline';
           } else if(route.name ==='Like'){
               iconName = focused? 'heart' : 'heart-outline';
           } else if(route.name ==='MyPage'){
               iconName =focused?'person':'person-outline';
           }

            return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#1C140D',
            tabBarInactiveTintColor: '#1C140D'

    })}>

    <Tab.Screen name = "Home"       component = {HomePage}      options = {{title:'홈' ,headerShown:false}}/>
    <Tab.Screen name = "Recommend"  component = {RecommendPage} options = {{title: '추천',headerShown:false}}/>
    <Tab.Screen name = "Like"       component = {LikePage}      options = {{title: '찜',headerShown:false   }} />

    <Tab.Screen name = "MyPage"     component = {MyPage}        options = {{title: 'MY', headerShown:false}}/>

    </Tab.Navigator>
    );
};


export default Nav;