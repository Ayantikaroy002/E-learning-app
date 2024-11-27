import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import Login from './pages/Login.jsx';
import TabNavigation from './Navigation/TabNavigation.js';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { NavigationContainer } from '@react-navigation/native';
import { CompletedChapterContext } from './Context/CompletedChapter.js';
import { OngoingChapterContext } from './Context/OngoingChapter.js';
import { useFonts } from 'expo-font';

export default function Index() {
  const [fontsLoaded] = useFonts({
    'RowdiesBold': require('../assets/fonts/Rowdies/Rowdies-Bold.ttf'),
    'RowdiesLight': require('../assets/fonts/Rowdies/Rowdies-Light.ttf'),
    'RowdiesRegular': require('../assets/fonts/Rowdies/Rowdies-Regular.ttf'),
    'ubuntuBold': require('../assets/fonts/Ubuntu/Ubuntu-Bold.ttf'),
    'ubuntuRegular': require('../assets/fonts/Ubuntu/Ubuntu-Regular.ttf'),
    'ubuntuMedium': require('../assets/fonts/Ubuntu/Ubuntu-Medium.ttf'),
    'RubikMedium': require('../assets/fonts/Rubik-Medium.ttf'),
    'RubikBold': require('../assets/fonts/Rubik-Bold.ttf'),
    'RubikRegular': require('../assets/fonts/Rubik-Regular.ttf'),
  });

  const [isChapterCompleted, setIsChapterCompleted] = useState(false);
  const [isChapterOngoing, setIsChapterOngoing] = useState(false);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; 
  }

  return (
    <OngoingChapterContext.Provider value={{ isChapterOngoing, setIsChapterOngoing }}>
      <CompletedChapterContext.Provider value={{ isChapterCompleted, setIsChapterCompleted }}>
        <SafeAreaView style={styles.safeArea}>
          <SignedIn>
            <NavigationContainer>
              <TabNavigation />
            </NavigationContainer>
          </SignedIn>
          <SignedOut>
            <Login />
          </SignedOut>
        </SafeAreaView>
      </CompletedChapterContext.Provider>
    </OngoingChapterContext.Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#52011D',
  },
});
