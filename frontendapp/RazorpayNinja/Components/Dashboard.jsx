import React from 'react';
import { SafeAreaView,  FlatList, Text, View , TouchableWithoutFeedback as OnlyTouch} from 'react-native';
import Constants from 'expo-constants'
import {LinearGradient} from 'expo-linear-gradient';
import StyleSheet from 'react-native-extended-stylesheet'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppLoading from 'expo-app-loading';



import {
    useFonts,
    Sora_100Thin,
    Sora_200ExtraLight,
    Sora_300Light,
    Sora_400Regular,
    Sora_500Medium,
    Sora_600SemiBold,
    Sora_700Bold,
} from '@expo-google-fonts/sora';
import {
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
  } from '@expo-google-fonts/roboto';


const Card = (props) => {
    return (
        <View style={classes.card} >
            <OnlyTouch onPress={()=>{props.nav.navigate(props.page)}}>
            <View style={classes.cardBody}>
                <View style={classes.iconContainer}>
                    {props.icon}
                </View>
                <View style={classes.textBox}>
                    <Text
                    
                        style={{
                            fontFamily : 'Roboto_500Medium',
                            fontSize : 15,
                            marginBottom : 3, 
                        }}
                    >
                        {props.header}
                    </Text>
                    <Text
                     style={{
                        fontFamily : 'Sora_200ExtraLight',
                        fontSize : 10,
                        textAlign : 'justify',
                    }}
                    >
                        {props.description}
                    </Text>
                </View>
            </View>
            </OnlyTouch>
        </View>
    );

}


export default function Dashboard(props){
    let [fontsLoaded] = useFonts({
        Sora_100Thin,
        Sora_200ExtraLight,
        Sora_300Light,
        Sora_400Regular,
        Sora_500Medium,
        Sora_600SemiBold,
        Sora_700Bold,
        Sora_800ExtraBold,
        Roboto_100Thin,
        Roboto_100Thin_Italic,
        Roboto_300Light,
        Roboto_300Light_Italic,
        Roboto_400Regular,
        Roboto_400Regular_Italic,
        Roboto_500Medium,
        Roboto_500Medium_Italic,
        Roboto_700Bold,
        Roboto_700Bold_Italic,
        Roboto_900Black,
        Roboto_900Black_Italic,
      });


    const renderItem = ({item}) => (
        <Card
            icon={item.icon}
            header={item.header}
            description={item.description}
            nav = {props.navigation}
            page= {item.page}
        ></Card>
    )     
    

    
    
    if (!fontsLoaded) {
        return <AppLoading />;
    }  
    return(
        <>
        <SafeAreaView style={classes.container}>
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#020024', '#102461', '#2649b6']}
                style={classes.section1}
            >
                <Text style={{
                    color : 'white',
                    fontSize : 30,
                    paddingLeft : 20,
                    paddingBottom : 0,
                    
                    // fontWeight : 'bold',
                    fontFamily : 'Roboto_500Medium',
                    
                }}>
                    Hello
                </Text>
                <Text style={{
                    color : 'white',
                    fontSize : 15,
                    fontWeight : '100',
                    paddingLeft : 20,
                    paddingBottom :40,
                    paddingRight : 50,
                    fontFamily : 'Sora_100Thin'
                }}
                
                >
                    Manage your employees, customers, keep track of payments. Organise your business and witness it flourish.
                </Text>
                <Ionicons name="search-outline" style={classes.searchIcon}></Ionicons>
            </LinearGradient>    
            <View style={classes.section2}>
                    <FlatList
                        data={pageInfo}
                        renderItem={renderItem}
                        keyExtractor={item => item.header}
                        style={classes.cardContainer}
                    />
            </View>

        </SafeAreaView>
        </>
    )
}

const classes = StyleSheet.create({
    container : {
        flex : 1,
        position : 'relative',
        paddingTop : Constants.statusBarHeight,
        justifyContent : "center",
        width : '100%',
    },
    section1 : {
        flex : 1,
        justifyContent : "flex-end",
        // backgroundColor : 'linear-gradient(166deg, rgba(2,0,36,1) 0%, rgba(16,36,97,1) 28%, rgba(58,106,255,1) 100%)'
        zIndex : 0,
        elevation : 0,
    },
    section2 : {
        flex : 2,
        // paddingLeft : 20,
        // paddingRight : 20,
        alignItems : "center",
        backgroundColor : '#7d96e333',
        paddingTop : 10,
        paddingLeft : 20,
        paddingRight : 20
        // zIndex : 5,
        // elevation : 5
    },
    cardContainer : {
        position : 'absolute',
        top : -20,
        height : "100%"
    },
    searchIcon : {
        
        color : 'white',
        fontSize : 20,
        position : 'absolute',
        top : 30,
        right : 30,
        
    },
    card : {
        flex : 1,
        width : '100%',
        borderWidth : 0,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 0.3,
        elevation: 0,
        backgroundColor : 'white',
        marginBottom : 10,
        zIndex : 5,
        elevation : 1,
        // paddingLeft : 40,
        paddingRight : "5rem",
        paddingBottom : "0.5rem",
        borderTopLeftRadius : 2,
        borderTopRightRadius : 2,
        borderBottomLeftRadius : 2,
        borderBottomRightRadius : 2,
    },
    cardBody : {
        width : "100%",
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between',
        // paddingRight : 20,
        // paddingLeft : 20
    },
    icon : {
        fontSize : 32,
        padding : 20,
        color : '#2649b6'
    },
    
});


const pageInfo = [
    {
        icon : <Ionicons style={{fontSize : 32,
            padding : 20,
            color : '#2649b6'}} name="cart-outline" style={classes.icon}></Ionicons>,
        header : 'Manage your shop',
        description : 'Manage different aspects your shop, such as products, customers, orders and much more.',
        page : 'Manage',
       

    },
    {
        icon : <Ionicons style={{fontSize : 32,
            padding : 20,
            color : '#2649b6'}} name="people-outline" style={classes.icon}></Ionicons>,
        header : 'Manage your employees',
        description : 'Manage your employees, keep track of their attendance, and much more.',
        page : 'Employee',
        
    },
    {
        icon : <Ionicons style={{fontSize : 32,
            padding : 20,
            color : '#2649b6'}} name="cash-outline" style={classes.icon}></Ionicons>,
        header : 'Manage your customers',
        description : 'Manage your customers, their orders, and their payments and keep track of their purchases',
        page : 'Customer',
        
    },
    
    
]
  