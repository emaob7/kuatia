import { StyleSheet, Platform } from 'react-native';

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  agregar: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#ebf1ff",
    width: Platform.OS === 'android' ? 345 : 395,
    height: Platform.OS === 'android' ? 504 : 594,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: "#000000",
    borderRadius: 24,
  },
  camera: {
    width: 349,
    height: 552,
    marginTop: -50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  circleButton: {
    width: Platform.OS === 'android' ? 70 : 110,
    height: Platform.OS === 'android' ? 70 : 110,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: Platform.OS === 'android' ? 65 : 100,
    height: Platform.OS === 'android' ? 65 : 100,
    borderRadius: 50,
    backgroundColor: '#1462fc',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '90deg' }],
  },
});
