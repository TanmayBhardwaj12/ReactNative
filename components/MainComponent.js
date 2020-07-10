import React, { Component } from 'react';
import Menu from './MenuComponent';
import Home from './HomeComponent';
import Dishdetail from './DishdetailComponent';
import Contact from './ContactComponent';
import AboutUs from './AboutComponent';
import { View, Platform } from 'react-native';
import { createStackNavigator  } from 'react-navigation-stack';
import { NavigationContainer} from '@react-navigation/native';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Icon } from 'react-native-elements';
import { Constants } from 'expo-constants';
import ContactUs from './ContactComponent';

const AboutNavigator = createStackNavigator({
    Home: { screen: AboutUs }
  }, {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
          backgroundColor: "#512DA8"
      },
      headerTitleStyle: {
          color: "#fff"            
      },
      headerTintColor: "#fff"  
    })
});

const AboutScreen = createAppContainer(AboutNavigator);

const ContactNavigator = createStackNavigator({
    Home: { screen: ContactUs }
  }, {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
          backgroundColor: "#512DA8"
      },
      headerTitleStyle: {
          color: "#fff"            
      },
      headerTintColor: "#fff"  
    })
});

const ContactScreen = createAppContainer(ContactNavigator);

const MenuNavigator = createStackNavigator({
    Menu: { screen: Menu },
    Dishdetail: { screen: Dishdetail }
},
{
    initialRouteName: 'Menu',
    navigationOptions: {
        headerStyle: {
            backgroundColor: "#512DA8"
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            color: "#fff"            
        }
    }
}
);

const MenuScreen = createAppContainer(MenuNavigator);

const HomeNavigator = createStackNavigator({
    Home: { screen: Home }
  }, {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
          backgroundColor: "#512DA8"
      },
      headerTitleStyle: {
          color: "#fff"            
      },
      headerTintColor: "#fff"  
    })
});

const HomeScreen = createAppContainer(HomeNavigator);

const Drawer = createDrawerNavigator();

class Main extends Component {

  render() {
 
    return (
        <NavigationContainer>
            <View style={{ flex: 1 }}>
            <Drawer.Navigator initialRouteName="Home" drawerStyle={{backgroundColor: '#D1C4E9'}}>
                <Drawer.Screen name="Home" component={()=><HomeScreen/>} />
                <Drawer.Screen name="About Us" component={()=><AboutScreen/>} />
                <Drawer.Screen name="Menu" component={()=><MenuScreen/>} />
                <Drawer.Screen name="Contact Us" component={()=><ContactScreen/>} />
            </Drawer.Navigator>
            </View>
        </NavigationContainer>
    );
  }
}
  
export default Main;