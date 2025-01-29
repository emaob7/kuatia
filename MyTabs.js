import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Vehiculo1 from './screens/Vehiculo1';
import Vehiculo2 from './screens/Vehiculo2';
import Vehiculo3 from './screens/Vehiculo3';
import Vehiculo4 from './screens/Vehiculo4';
import Perfil from './screens/Perfil';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let iconColor = focused ? '#FF5733' : '#808080'; // Rojo si está seleccionado, gris si no

            if (route.name === 'Vehiculo1') {
              iconName = 'numeric-1-circle';
              iconColor = focused ? '#1462fc' : '#808080';
            } else if (route.name === 'Vehiculo2') {
              iconName = 'numeric-2-circle';
              iconColor = focused ? '#FF605C' : '#808080'; // Verde si está seleccionado, gris si no
            } else if (route.name === 'Vehiculo3') {
              iconName = 'numeric-3-circle';
              iconColor = focused ? 'orange' : '#808080'; // Azul si está seleccionado, gris si no
            } else if (route.name === 'Vehiculo4') {
              iconName = 'numeric-4-circle';
              iconColor = focused ? 'green' : '#808080'; // Rosa si está seleccionado, gris si no
            } else if (route.name === 'Cuenta') {
              iconName = 'circle-user';
              iconColor = focused ? '#FFA833' : '#808080'; // Naranja si está seleccionado, gris si no
            }

            // Selecciona el tipo de ícono en función de la ruta
            if (route.name === 'Cuenta') {
              return <FontAwesome6 name={iconName} size={24} color={color} />;
            } else {
              return <MaterialCommunityIcons name={iconName} size={30} color={iconColor} />;
            }
          },
        })}
       ScreenOption={{
          activeTintColor: '#000000',
          inactiveTintColor: '#808080',
        }}
      >
        <Tab.Screen name="Vehiculo1" component={Vehiculo1} options={{ headerShown: false }} />
        <Tab.Screen name="Vehiculo2" component={Vehiculo2} options={{ headerShown: false }} />
        <Tab.Screen name="Vehiculo3" component={Vehiculo3} options={{ headerShown: false }} />
        <Tab.Screen name="Vehiculo4" component={Vehiculo4} options={{ headerShown: false }} />
        <Tab.Screen name="Cuenta" component={Perfil} options={{ headerShown: false }} />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  perfil: {
    fontSize: 25,
  },
});
