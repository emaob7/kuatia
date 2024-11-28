import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MyTabs from './MyTabs';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
// index.js
import { LogBox } from 'react-native';


LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.']);





//

const Stack = createStackNavigator();

export default function App() {

  

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} // Oculta el encabezado de la pantalla de login si no lo necesitas
        />
        <Stack.Screen 
          name="MyTabs" 
          component={MyTabs} 
          options={{ headerShown: false }} // Oculta el encabezado de las tabs si no lo necesitas
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}