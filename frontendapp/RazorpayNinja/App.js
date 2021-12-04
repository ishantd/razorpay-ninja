import React, { useEffect, useState } from 'react';
import AppLoading from 'expo-app-loading';
import 'react-native-gesture-handler';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dashboard from './Components/Dashboard'
import GAuth from './Components/GoogleAuth'
import EStyleSheet from 'react-native-extended-stylesheet';
import {createStackNavigator} from '@react-navigation/stack'
import 'react-native-gesture-handler';
import OnBoarding1 from './Components/OnBoarding1'
import OnBoarding2 from './Components/OnBoarding2'
import OnBoarding3 from './Components/OnBoarding3'
import EmployeeManagement from './Components/EmployeeManager'
import Customer from './Components/Customers'
import Manage from './Components/Manage'

import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginPage from './Components/LoginPage';
import ShopOnboarding from './Components/ShopOnboarding';

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();




const DashNav = () => {
  return (
    <Stack.Navigator
    screenOptions={{ headerShown: false}}
    >
        <Stack.Screen name="Dash" component={Dashboard}/>
        <Stack.Screen name="Customer" component={Customer}/>
        <Stack.Screen name="Employee" component={EmployeeManagement}/>
        <Stack.Screen name="Manage" component={Manage}/>

    </Stack.Navigator>
  )
}

export  function Main() {
  return (
    
      <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Settings') {
              iconName = focused ? 'ios-list' : 'ios-list';
            }
            else if (route.name === 'Dashboard'){
              iconName = focused ? 'book-outline' : 'book-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2649b6',
          tabBarInactiveTintColor: 'gray',
          headerShown : false
        })
        }
        
        >
        <Tab.Screen name="Dashboard" component={DashNav} />
        <Tab.Screen name="Settings" component={SettingsScreen} />

      </Tab.Navigator>
    
  );
}


export default function App(){
  return(
  <NavigationContainer 
    
  >
    <Stack.Navigator screenOptions={{ headerShown: false}}>
      <Stack.Screen name="Main" component={Main}/>
      
      <Stack.Screen name="Signup" component={GAuth}/>

      <Stack.Screen name="OnBoarding1" component={OnBoarding1} />
      <Stack.Screen name="OnBoarding2" component={OnBoarding2} />
      <Stack.Screen name="OnBoarding3" component={OnBoarding3} />      
    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default function App() {
	let [fontsLoaded] = useFonts({ Sora_600SemiBold, Roboto_400Regular });

  	const [loaded, setLoaded] = useState(false);
  	const [defaultScreen, setDefaultScreen] = useState('LoginScreen');

  	useEffect(() => {
    	async function fetchValue() {    
      		//const token = await AsyncStorage.getItem('key');
      		//if (token) { setDefaultScreen('AppScreens'); }

      		setLoaded(true);
    	}

    	fetchValue();
  	}, []);

  	if (!fontsLoaded || !loaded) {
    	return (
      		<AppLoading/>
    	);
  	}
	else {
		return (
			<NavigationContainer>
				<Stack.Navigator initialRouteName={defaultScreen}>
					<Stack.Group>
						<Stack.Screen name="LoginScreen" component={LoginPage} options={{ headerShown: false }}/>
					</Stack.Group>
					<Stack.Group>
						<Stack.Screen name="ShopOnboarding" component={ShopOnboarding} options={{ headerShown: false, headerLeft: () => null }}/>
						<Stack.Screen name="AppScreens" component={AppScreens} options={{ headerShown: false, headerLeft: () => null }}/>
					</Stack.Group>
      			</Stack.Navigator>
			</NavigationContainer>
		)
	}
}

const styles = StyleSheet.create({
  	container: {
    	flex: 1,
    	alignItems: 'center',
    	justifyContent: 'center',
  	},
});
