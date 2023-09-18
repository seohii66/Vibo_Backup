import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// import AsyncStorage from "@react-native-async-storage/async-storage";
import Video from 'react-native-video';

const Loading = ({navigation}) => {
  const [animating, setAnimating] = useState(true);


  useEffect(() => {
    
    setTimeout(() => {
      setAnimating(false);

    //   AsyncStorage.getItem('userID').then((value) =>
    //     navigation.replace(value === null ? 'Auth' : 'Tab'),
    //   );
    }, 1000);

  }, []);

  return (
    <View style={styles.container}>
      <Video source={require('./video/vitamin.mp4')}
        style={styles.backgroundVideo}
        paused={false}
        resizeMode={"contain"} 
        onLoad={e => console.log(e)} 
        repeat={true} 
        onAnimatedValueUpdate={() => {}}
      />
    </View>
  );
};

export default Loading;

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
    aspectRatio: 1,
    width: wp(30),
  }

});