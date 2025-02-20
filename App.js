import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
//import { TouchableOpacity } from 'react-native';
//import { Ionicons } from '@expo/vector-icons'; // Iconos de Expo
import MyTabs from './MyTabs';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
// index.js
import { LogBox } from 'react-native';
import Inicio from './Inicio';
import Vehiculo1 from './screens/Vehiculo1';
import Vehiculo2 from './screens/Vehiculo2';
import Vehiculo3 from './screens/Vehiculo3';
import Vehiculo4 from './screens/Vehiculo4';
import Perfil from './screens/Perfil';
import Carnet from './screens/Carnet';
import DocumentScreen from './screens/cedula/DocumentScreen';


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
        <Stack.Screen 
          name="Inicio" 
          component={Inicio} 
          options={{ headerShown: false }}
        />
        
        <Stack.Screen name="Vehiculo1" component={Vehiculo1} options={{ title: '🚗 Vehiculo 1' }}/>
        <Stack.Screen name="Vehiculo2" component={Vehiculo2} options={{ title: '🏍️ Vehiculo 2' }}/>
        <Stack.Screen name="Vehiculo3" component={Vehiculo3} options={{ title: '🚗🏍️ Vehiculo 3' }}/>
        <Stack.Screen name="Vehiculo4" component={Vehiculo4} options={{ title: '🚗🏍️ Vehiculo 4' }}/>
        <Stack.Screen name="Carnet" component={Carnet} options={{ title: '📸 Foto tipo Carnet' }}/>
        <Stack.Screen name="DocumentScreen" component={DocumentScreen} options={{ title: '🪪 Copia de Cedulas' }}/>
        <Stack.Screen name="Cuenta" component={Perfil} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}