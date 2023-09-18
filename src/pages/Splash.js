import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import AsyncStorage from "@react-native-async-storage/async-storage";
import Video from 'react-native-video';

const Splash = ({navigation}) => {
  const [animating, setAnimating] = useState(true);


  useEffect(() => {
    
    setTimeout(() => {
      setAnimating(false);

      AsyncStorage.getItem('userID').then((value) =>
        navigation.replace(value === null ? 'Auth' : 'Tab'),
      );
    }, 1000);

  }, []);

  return (
    <View style={styles.container}>
      <Video source={require('./video/medicine.mp4')}
        style={styles.backgroundVideo}
        paused={false}
        resizeMode={"contain"} 
        onLoad={e => console.log(e)} 
        repeat={true} 
        onAnimatedValueUpdate={() => {}}
      />

      <Image source={require('./images/splash/title.png')} style={styles.backgroundImage}/>

    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 80,
  },
  backgroundVideo: {
    width: wp(50),
    position: "absolute",
    top: 0,
    left: 100,
    bottom: 0,
    right: 0,
  },
  backgroundImage: {
    width: wp(30),
    resizeMode: 'contain',
    position: "absolute",
    top: 250,
    left: 140,
    bottom: 0,
    right: 0,
  }

});