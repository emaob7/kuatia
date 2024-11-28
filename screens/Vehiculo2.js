import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Habi2 from './Habi2';
import Reg2 from './Reg2';
import Cedu1 from './Cedu1';
import CVerde2 from './CVerde2';

const Vehiculo2 = () => {
  const [activeScreen, setActiveScreen] = useState('1');
  const [showCamera, setShowCamera] = useState(false);

  const renderScreen = () => {
    switch (activeScreen) {
      case '1':
        return <Habi2 showCamera={showCamera} setShowCamera={setShowCamera} />;
      case '2':
        return <Reg2 showCamera={showCamera} setShowCamera={setShowCamera} />;
        case '3':
            return <Cedu1 showCamera={showCamera} setShowCamera={setShowCamera} />;
        case '4':
            return <CVerde2 showCamera={showCamera} setShowCamera={setShowCamera} />;
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
    paddingTop: 50,
    paddingHorizontal:15
  },
  button: {
    //width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: '#FF605C',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal:5,
    paddingHorizontal:10
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
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

export default Vehiculo2;
