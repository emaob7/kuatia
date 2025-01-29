import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function Inicio() {
  const navigation = useNavigation();

  return (
    <>
      {/* Barra superior personalizada */}
      <View style={styles.header}>
        {/* Logo y texto alineados a la izquierda */}
        <View style={styles.headerLeft}>
          <Image
            source={require('./assets/favicon.png')} // Reemplaza con la ruta de tu logo
            style={styles.logo}
          />
          <Text style={styles.headerText}>Kuatia</Text>
        </View>

        {/* Botón de perfil alineado a la derecha */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Cuenta')}
        >
          <FontAwesome5 name="user-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      <View style={styles.container}>
        <Text style={styles.title1}>Documentos</Text>
        <Text style={styles.title}>Elige el vehículo que estás usando</Text>

        {/* Botones de documentos */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Vehiculo1')}
        >
          <Text style={styles.emoji}>🚗</Text>
          <Text style={styles.cardText}>Vehículo 1</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Vehiculo2')}
        >
          <Text style={styles.emoji}>🏍️</Text>
          <Text style={styles.cardText}>Vehículo 2</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Vehiculo3')}
        >
          <Text style={styles.emoji}>🚗🏍️</Text>
          <Text style={styles.cardText}>Vehículo 3</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Vehiculo4')}
        >
          <Text style={styles.emoji}>🚗🏍️</Text>
          <Text style={styles.cardText}>Vehículo 4</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '12%',
    backgroundColor: '#1462fc',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Alinea los elementos a los extremos
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:-50
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    padding: 8,
    marginBottom:-50
  },
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    width: '100%',
  },
  title1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    width: '48%',
    aspectRatio: 1,
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  emoji: {
    fontSize: 40,
  },
});
