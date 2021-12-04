import React, { useEffect, useState } from 'react';
import AppLoading from 'expo-app-loading';
import 'react-native-gesture-handler';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Employees from './Components/Employees';
import EmployeeDetails from './Components/EmployeeDetailsPage';
import Customers from './Components/Customers';
import Shop from './Components/Shop';

import { useFonts } from 'expo-font';
import { Sora_600SemiBold } from '@expo-google-fonts/sora';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginPage from './Components/LoginPage';
import ShopOnboarding from './Components/ShopOnboarding';

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();

const EmployeeScreens = () => {
	return(
		<Stack.Navigator>
			<Stack.Screen name="Employee" component={Employees} options={{ title: 'Manage Employees' }}/>
			<Stack.Screen name="EmployeeDetails" component={EmployeeDetails} options={{ title: 'Employee Details' }}/>
      	</Stack.Navigator>
	)
}

const AppScreens = () => {
	return (
		<Tab.Navigator screenOptions={({ route }) => ({
			tabBarIcon: ({ focused, color, size }) => {
			  let iconName;
			  if (route.name === 'Employees') {
					iconName = focused ? 'person-circle' : 'person-circle-outline';
			  } else if (route.name === 'Customers') {
					iconName = focused ? 'body' : 'body-outline';
			  }
			  else if (route.name === 'Shop'){
					iconName = focused ? 'home' : 'home-outline';
			  }
			  return <Ionicons name={iconName} size={32} color={color} />;
			},
			tabBarActiveTintColor: '#0A6FEB',
			tabBarInactiveTintColor: '#000000',
			headerShown: true,
		  tabBarShowLabel: false,  
	  	})}>
			<Tab.Screen name="Shop" component={Shop}/>
		  	<Tab.Screen name="Employees" component={EmployeeScreens} options={{ headerShown: false }}/>
		  	<Tab.Screen name="Customers" component={Customers}/>
		</Tab.Navigator>
  	);
}

export default function App() {
	let [fontsLoaded] = useFonts({ Sora_600SemiBold, Roboto_400Regular });

  	const [loaded, setLoaded] = useState(false);
  	const [defaultScreen, setDefaultScreen] = useState('LoginScreen');

  	useEffect(() => {
    	async function fetchValue() {    
      		const token = await AsyncStorage.getItem('key');
			const shop = await AsyncStorage.getItem('shop');
      		if (token) { shop ? setDefaultScreen('AppScreens') : setDefaultScreen('ShopOnboarding') }

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
