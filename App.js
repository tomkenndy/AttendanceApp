import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';

import HomeScreen from './screens/Home';
import UnitsScreen from './screens/Units';
import MoreScreen from './screens/More';
import AccountScreen from './screens/Account';
import LogoutScreen from './screens/Logout';
import LoginScreen from './screens/Login';
import SignupScreen from './screens/Signup';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerTitle: '',
          headerTitleAlign: 'center',
          tabBarVisible: false,
         
        }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="MainApp"
          component={MainAppStack}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const MainAppStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'ios-home' : 'ios-home-outline';
          } else if (route.name === 'Units') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'More') {
            iconName = focused ? 'ios-options' : 'ios-options-outline';
          } else if (route.name === 'Logout') {
            iconName = focused ? 'log-out' : 'log-out-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F9F9FF',
        tabBarInactiveTintColor: '#F9F9FF',
        tabBarLabel: ({ focused, color }) => {
          if (focused) {
            return (
              <Text style={{ color }} className='text-[10px]'>
                {route.name}
              </Text>
            );
          }
          return null;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarStyle: {
            backgroundColor: '#221995',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderRadius: 12,
            width: '90%',
            marginLeft: '5%',
            marginBottom: 15,
            borderTopWidth: 0,
            position: 'absolute',
          },
        }}
      />
      <Tab.Screen
        name="Units"
        component={UnitsScreen}
        options={{
          tabBarStyle: {
            backgroundColor: '#221995',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderRadius: 12,
            width: '90%',
            marginLeft: '5%',
            marginBottom: 15,
            borderTopWidth: 0,
            position: 'absolute',
          },
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarStyle: {
            backgroundColor: '#221995',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderRadius: 12,
            width: '90%',
            marginLeft: '5%',
            marginBottom: 15,
            borderTopWidth: 0,
            position: 'absolute',
          },
        }}
      />
      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          tabBarStyle: {
            backgroundColor: '#221995',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderRadius: 12,
            width: '90%',
            marginLeft: '5%',
            marginBottom: 15,
            borderTopWidth: 0,
            position: 'absolute',
          },
        }}
      />
    </Tab.Navigator>
  );
}
