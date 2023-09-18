import AsyncStorage from "@react-native-async-storage/async-storage";

// 데이터 저장
export const storeData = async (key, value) => {
  try {
    const stringValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
  } catch (error) {
    console.log(error);
  }
};

// 데이터 받기
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      const data = JSON.parse(value);
      return data;
    }
  } catch (error) {
        console.log(error);
  }
};

// 데이터 삭제
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};

// 해당 key가 AsyncStorage 안에 있는지 없는지 확인
export const containsKey = async (key) => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys.includes(key);
  } catch (error) {
    console.log(error);
  }
};