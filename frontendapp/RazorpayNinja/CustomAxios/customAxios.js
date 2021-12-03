import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';


export const axiosRequestAuthInstance = axios.create({
    baseURL : `https://api.razorpay.ninja`,
    headers : {
        "Content-Type" : "application/json",
    } 
})

export const axiosAuthorizedInstance = axios.create({
    baseURL : `https://api.razorpay.ninja`,
    headers : {
        "Content-Type" : "application/json",
    } 
})

axiosAuthorizedInstance.interceptors.request.use(
    async config => {
    const value = await AsyncStorage.getItem('key')
      if (value) {
        console.log(value)
        config.headers.Authorization = "Token "+ value
      }
      return config
      
    },
    error => {
      throw error
    }
);