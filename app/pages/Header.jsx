import { View, Image, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';

export default function Header({ setSearchQuery }) { 
    const { isLoaded, isSignedIn, user } = useUser();
  
    return isLoaded && (
      <View style={{backgroundColor:'#52011D', height:200, paddingTop:30,}}>
        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:25,}}>
          <View style={{display:'flex', flexDirection:'row', gap:10, alignItems:'center'}}>
            <Image 
              source={{ uri: user?.imageUrl }} 
              style={{ width: 50, height: 50, borderRadius: 25,  }} 
            />
            <View>
              <Text style={{color:'#C9C9C9', fontFamily:'ubuntuRegular'}}> Welcome,</Text>
              <Text style={{color:'#C9C9C9', fontSize:20, fontFamily:'ubuntuBold'}}>{user?.fullName}</Text>
            </View>
          </View>
          <View style={{display:'flex', flexDirection:'row', gap:10, alignItems:'center', paddingBottom:30,}}>
            <Ionicons style={{paddingRight:4}} name="settings-sharp" size={25} color="#C9C9C9"/> 
            <Ionicons style={{paddingRight:4}} name="information-circle-sharp" size={30} color="#C9C9C9"/> 
          </View>
        </View>
    
         <View style={{backgroundColor:'#A4A2A3', marginVertical:25, marginHorizontal:25, alignItems:'center', borderRadius:50, display:'flex', flexDirection:'row',justifyContent:'space-between' }}> 
           <TextInput 
             style={{fontSize:13, paddingLeft:18, width: '85%'}} 
             placeholder='Search Courses'
             onChangeText={setSearchQuery} 
           />
            <Ionicons style={{paddingRight:4}} name="search-circle" size={45} color="#52011D"/> 
        </View>
      </View>
    );
}
