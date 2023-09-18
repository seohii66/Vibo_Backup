import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  Title_Bold: {
    fontWeight:'bold',
    fontFamily: 'inter',
    fontSize: 30,
    
  },
  Title_SemiBold: {
    fontWeight: '700',
    fontFamily: 'inter',
    fontSize: 25,
  },
  Title_Medium: {
    fontWeight: '500',
    fontFamily: 'inter',
    fontSize: 30,
  },
  Title_Regular: {
    fontWeight: '400',
    fontFamily: 'inter',
    fontSize: 30,
  },
  Semi_Bold: {
    fontWeight: '600',
    fontFamily: 'inter',
    fontSize: 20,
  },
  Semi_Medium: {
    fontWeight: 500,
    fontFamily: 'inter',
    fontSize: 16,
  },
  Semi_Regular: {
    fontWeight: 400,
    fontFamily: 'inter',
    fontSize: 16,
  },
  Text_Bold: {
    fontWeight: '600',
    fontFamily: 'inter',
    fontSize: 14,
  },
  Text_Medium: {
    fontWeight: 500,
    fontFamily: 'inter',
    fontSize: 14,
  },
  Text_Regular: {
    fontWeight:'400' ,
    fontFamily: 'inter',
    fontSize: 14,
  },
  p_Regular: {
    fontWeight: '500',
    fontFamily: 'inter',
    fontSize: '10',
  },
  // Details페이지의 제품 상세정보
  pp_Regular: {
    fontWeight: '400',
    fontFamily: 'inter',
    fontSize: '8',
  },
  black: {
    color: '#000000' ,
  },
  white: {
    color: '#ffffff',
  },
  Gray1: {
    color: '#F6F6F6',
  },
  Gray2: {
    color: '#E8E8E8',
  },
  Gray3: {
    color: '#BDBDBD',
  },
  Gray4: {
    color: '#666666',
  },
  Green: {
    color: '#99A799',
  },
  Blue: {
    color: '#D3E0F7',
  },
  titlecontainer:{
    marginTop:52,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:25
  },
  line:{
    borderColor: '#D3E0F7',
    textAlign:'center',
    justifyContent:'center',
    width:'60%',
    paddingBottom:15,
    borderWidth: 3,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
  },
});
export default styles;