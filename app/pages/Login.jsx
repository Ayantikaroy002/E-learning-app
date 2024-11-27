import { View, Text, Image, TextInput, Button, TouchableOpacity } from 'react-native'
import React, { useCallback } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { Link } from 'expo-router'
import { useOAuth } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'

export const useWarmUpBrowser = () => {
    React.useEffect(() => {
      // Warm up the android browser to improve UX
      // https://docs.expo.dev/guides/authentication/#improving-user-experience
      void WebBrowser.warmUpAsync()
      return () => {
        void WebBrowser.coolDownAsync()
      }
    }, [])
  }
  
  WebBrowser.maybeCompleteAuthSession()
export default function login() {
    useWarmUpBrowser()
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

    const onPress =useCallback(async () => {
        try {
          const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
            redirectUrl: Linking.createURL('/home', { scheme: 'myapp' }),
          })
    
          if (createdSessionId) {
           
          } else {
            // Use signIn or signUp for next steps such as MFA
          }
        } catch (err) {
          console.error('OAuth error', err)
        }
      }, [])
    
  return (
    <View style={{paddingBottom:59, backgroundColor:'#1c000a', height:'100%', width:'100%'}}>
      <Image source={require('./../../assets/images/login.jpeg')} style={{height:180, width:356}}/>
     <Text style={{fontSize:25, textAlign:'center',fontWeight:'bold', marginTop:30, color:"#ffffff"}}>Login</Text>
      <View>
      <TouchableOpacity onPress={onPress} style={{ width:'80%', height: 40, backgroundColor:'#710128', borderRadius: 8, justifyContent:'center', alignItems:'center', marginStart:37, marginTop:25, shadowColor: '#FFA4C3', shadowRadius: 50, elevation:15}}> 
            <Text style={{color:"#ffffff", fontWeight:'bold'}}>LOGIN  With google</Text>
        </TouchableOpacity>

        <Text style={{fontSize:15,marginTop:20, alignSelf:'center', color:"#ffffff"}}> OR </Text>

        <Text style={{fontSize:15, fontWeight:'bold', marginTop:20, marginLeft:20, color:"#ffffff"}}> Username </Text>
        <TextInput style={{placeholder:"Email", keyboardType:"name", backgroundColor:"#430119", height:'8%',width:'85%',marginLeft:23, marginTop:5}}/> 
        <Text style={{fontSize:15, fontWeight:'bold', marginTop:10, marginLeft:20, color:"#ffffff"}}> Email </Text>
        <TextInput style={{placeholder:"Email", keyboardType:"Email", backgroundColor:"#430119",height:'8%', width:'85%',marginLeft:23, marginTop:5}}/> 
        <Text style={{fontSize:15, fontWeight:'bold', marginTop:10, marginLeft:20, color:"#ffffff"}}> Password </Text>
        <TextInput style={{placeholder:"Email", keyboardType:"Password", backgroundColor:"#430119",height:'8%', width:'85%',marginLeft:23, marginTop:5}}/> 
      
        <Text style={{fontSize:10, textAlign:'center', marginVertical:8, color:"#ffffff"}}> Forgot Your Password? </Text>
        <TouchableOpacity style={{ width:'80%', height: 40, backgroundColor:'#710128', borderRadius: 8, justifyContent:'center', alignItems:'center', marginStart:37, marginBottom: 8, shadowColor: '#FFA4C3', shadowRadius: 50, elevation:15}}> 
            <Text style={{color:"#ffffff", fontWeight:'bold'}}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity >
              <Text style={{textAlign:'center', color:"#ffffff"}}>Don't have an account? 
                <Text style={{color:'#1E90FF', color:"#ea0654"}}>Sign Up</Text>
              </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}