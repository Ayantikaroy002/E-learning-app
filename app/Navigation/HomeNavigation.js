import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Home from '../pages/Home.jsx'
import CourseDetail from '../pages/CourseDetail.jsx'
import ChapterDetail from '../pages/ChapterDetail.jsx'

const Stack = createStackNavigator();
export default function HomeNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}} >
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='course-detail' component={CourseDetail} />
        <Stack.Screen name='chapter' component={ChapterDetail} />
    </Stack.Navigator>
  )
}