import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Habi3 from './Habi3';
import Reg3 from './Reg3';
import Cedu1 from './Cedu1';
import CVerde3 from './CVerde3';

const Vehiculo3 = () => {
  const [activeScreen, setActiveScreen] = useState('1');
  const [showCamera, setShowCamera] = useState(false);

  const renderScreen = () => {
    switch (activeScreen) {
      case '1':
        return <Habi3 showCamera={showCamera} setShowCamera={setShowCamera} />;
      case '2':
        return <Reg3 showCamera={showCamera} setShowCamera={setShowCamera} />;
        case '3':
            return <Cedu1 showCamera={showCamera} setShowCamera={setShowCamera} />;
        case '4':
            return <CVerde3 showCamera={showCamera} setShowCamera={setShowCamera} />;
      default:
        return <Cedu1 showCamera={showCamera} setShowCamera={setShowCamera} />;
    }
  };

  return (
    <View style={styles.container}>
 {!showCamera ? (
  <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => setActiveScreen('3')}>
          <Text style={styles.buttonText}>Cedula</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setActiveScreen('1')}>
          <Text style={styles.buttonText}>Habilitacion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setActiveScreen('2')}>
          <Text style={styles.buttonText}>Licencia</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setActiveScreen('4')}>
          <Text style={styles.buttonText}>C.Verde</Text>
        </TouchableOpacity>
      </View>
  
) : (null)}

      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  tituloCont: {
    flexDirection: 'row',
    alignItems: 'center',
        justifyContent: 'space-between',
    //justifyContent: 'space-around',
    marginTop: 40,
    paddingHorizontal:15
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-arround',
    paddingVertical: Platform.OS === 'android' ? 20 :12,
    paddingHorizontal:15,
    marginTop:0,
    marginBottom:26,
  },
  button: {
    width: "auto",
    height: 30,
    borderRadius: 30,
    backgroundColor: '#0075ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal:5,
    paddingHorizontal:10
  },
  buttonText: {
    color: '#fff',
    fontSize: Platform.OS === 'android' ? 11 : 16,
    fontWeight: 'bold',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  super2:{
    fontSize: 29,
//marginTop:40,
marginBottom: -30,

  },
});

export default Vehiculo3;
