import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import EStyleSheet from 'react-native-extended-stylesheet';
import {createStackNavigator} from '@react-navigation/stack'
import 'react-native-gesture-handler';
import Attendance from './Components/Attendance'
import CheckAttendance from './Components/CheckAttendance';
import Payroll from './Components/Payroll'
import Profile from './Components/Profile'
import GAuth from './Components/GAuth'
import axios from 'axios';


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


const AttendanceTracker = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}

    >
      <Stack.Screen name="AttendancePage" component={Attendance} />
      <Stack.Screen name="CheckAttendance" component={CheckAttendance} />
    </Stack.Navigator>
  )
}



export function MainScreens() {
  return (
      <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Payroll') {
              iconName = focused ? 'ios-list' : 'ios-list';
            }
            else if (route.name === 'Attendance'){
              iconName = focused ? 'book-outline' : 'book-outline';
            }
            else if (route.name === 'Profile'){
              iconName = focused ? 'person-outline' : 'person-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2649b6',
          tabBarInactiveTintColor: 'gray',
          headerShown : false
        })
        }
        
        >
        <Tab.Screen name="Profile" component={Profile}/>

        <Tab.Screen name="Attendance" component={AttendanceTracker}/>
        <Tab.Screen name="Payroll" component={Payroll}/>

      </Tab.Navigator>
  );
}


export default function App(){
  return (
    <NavigationContainer
      
    >
      <Stack.Navigator
        screenOptions={{headerShown : false}}
      >

        <Stack.Screen name="Auth" component={GAuth}/>
        <Stack.Screen name="Main" component={MainScreens}/>



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
