import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeNavigation from './HomeNavigation.js';
import LeaderBoard from '../pages/LeaderBoard';
import MyCourse from '../pages/MyCourse.jsx';
import Profile from '../pages/Profile.jsx';
import { Ionicons } from '@expo/vector-icons'; // Ensure @expo/vector-icons is installed

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
   <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'home') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'library') {
        iconName = focused ? 'library' : 'library-outline';
      } else if (route.name === 'my-course') {
        iconName = focused ? 'book' : 'book-outline';
      } else if (route.name === 'profile') {
        iconName = focused ? 'person' : 'person-outline';
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#870941',
    tabBarInactiveTintColor: 'gray',
    headerShown: false, 
  })}
>
  <Tab.Screen name="home" component={HomeNavigation} />
  <Tab.Screen name="library" component={LeaderBoard} />
  <Tab.Screen name="my-course" component={MyCourse} />
  <Tab.Screen name="profile" component={Profile} />
</Tab.Navigator>

  );
}
