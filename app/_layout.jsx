import React from 'react'; 
import { Stack } from "expo-router";
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      return item;
    } catch (error) {
      console.error('SecureStore get item error: ', error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error('Error saving token:', err);
    }
  },
};

export default function RootLayout() {
  return (
    <ClerkProvider 
      tokenCache={tokenCache} 
      publishableKey="pk_test_aW1wcm92ZWQtbWVlcmthdC0zNy5jbGVyay5hY2NvdW50cy5kZXYk"
    >
      {/* Do not wrap in NavigationContainer, as expo-router handles routing */}
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </ClerkProvider>
  );
}
