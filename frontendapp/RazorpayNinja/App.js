import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dashboard from './Components/Dashboard'
import GAuth from './Components/GoogleAuth'
import EStyleSheet from 'react-native-extended-stylesheet';
import {createStackNavigator} from '@react-navigation/stack'
import 'react-native-gesture-handler';
import OnBoarding1 from './Components/OnBoarding1'
import OnBoarding2 from './Components/OnBoarding2'
import OnBoarding3 from './Components/OnBoarding3'




EStyleSheet.build()


function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();

export  function Main() {
  return (
    
      <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'ios-list' : 'ios-list';
            }
            else if (route.name === 'Dashboard'){
              iconName = focused ? 'book-outline' : 'book-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          headerShown : false
        })
        }
        
        >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Dashboard" component={Dashboard}/>
        <Tab.Screen name="Settings" component={SettingsScreen} />

      </Tab.Navigator>
    
  );
}


export default function App(){
  return(
  <NavigationContainer 
    
  >
    <Stack.Navigator screenOptions={{ headerShown: false}}>
      

      <Stack.Screen name="Signup" component={GAuth}/>
      <Stack.Screen name="OnBoarding1" component={OnBoarding1} />

      <Stack.Screen name="OnBoarding2" component={OnBoarding2} />
      <Stack.Screen name="OnBoarding3" component={OnBoarding3} />

      <Stack.Screen name="Main" component={Main}/>
    </Stack.Navigator>
  </NavigationContainer>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
