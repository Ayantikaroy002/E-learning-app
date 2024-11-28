import { View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Header from './Header.jsx'
import CourseList from './CourseList.jsx'
import { useUser } from '@clerk/clerk-expo';

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');

  return isLoaded && (
    <ScrollView style={{}}>
      <Header setSearchQuery={setSearchQuery} />
      
      <View style={{paddingTop:25,backgroundColor:'#C9C9C9', marginTop:-30, borderTopLeftRadius:25, borderTopRightRadius:25}}>
        <CourseList level={'basic'} searchQuery={searchQuery} />
        <CourseList level={'intermediate'} searchQuery={searchQuery} />
        <CourseList level={'advanced'} searchQuery={searchQuery} />
      </View>
    </ScrollView>
  );
}
