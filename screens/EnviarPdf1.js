import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, Alert, ActivityIndicator, View, Platform } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as Sharing from 'expo-sharing';
import EnviarPdf2 from './EnviarPdf2';

const EnviarPdf1 = ({ photo1, photo2 }) => {
  const [interstitial, setInterstitial] = useState(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para el loader

  useEffect(() => {
    const adUnitId =
      Platform.OS === 'ios'
        ? 'ca-app-pub-4622872693950947/5558112307' // Reemplaza con tu ID de iOS
        : 'ca-app-pub-4622872693950947/1752128031'; // Reemplaza con tu ID de Android
  
    const interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
      keywords: ['fashion', 'clothing'],
    });
  
    const onAdLoaded = () => {
      setIsAdLoaded(true);
    };
    const onAdClosed = () => {
      generatePDF();
    };
  
    interstitialAd.addAdEventListener(AdEventType.LOADED, onAdLoaded);
    interstitialAd.addAdEventListener(AdEventType.CLOSED, onAdClosed);
    interstitialAd.load();
  
    setInterstitial(interstitialAd);
  
    return () => {
      interstitialAd.removeAllListeners();
    };
  }, []);
  

  const showInterstitialAd = () => {
    if (!photo1 || !photo2) {
      Alert.alert("Error", "Asegúrate de tomar ambas fotos antes de generar el PDF.");
      return;
    }
    if (isAdLoaded && interstitial) {
      interstitial.show();
      setIsAdLoaded(false);
      interstitial.load(); // Pre-carga otro anuncio
    } else {
      generatePDF();
    }
  };

  const generatePDF = async () => {
    if (!photo1 || !photo2) {
      Alert.alert("Error", "Corregimos el error, intentalo de nuevo, ya deberia funcionar");
      return;
    }
    setIsLoading(true); // Activa el loader
    try {
      const htmlContent = `
      <html>
      <head>
        <style>
          .container {
            text-align: center;
            padding: 20px;
          }
          .title {
            font-size: 18px;
            margin-bottom: 20px;
          }
          .image-container {
            display: flex;
            justify-content: center;
            gap: 30px;
            padding: 10px 50px 20px;
            margin-top: -20px;
          }
          .image-wrapper {
            width: auto;
          }
          .imagen {
            border-radius: 10px;
            width: 300px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          
          <div class="image-container">
            <div class="image-wrapper">
              <img class="imagen" src="${photo1}" alt="Licencia 1">
            </div>
            <div class="image-wrapper">
              <img class="imagen" src="${photo2}" alt="Licencia 2">
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
      const options = {
        html: htmlContent,
        fileName: 'document_photos',
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.filePath);
      } else {
        Alert.alert('PDF generado', `El PDF se ha guardado en: ${file.filePath}`);
      }
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    } finally {
      setIsLoading(false); // Desactiva el loader
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#1462fc" /> // Muestra un spinner mientras carga
      ) : (
        <>
        {Platform.OS === 'ios' ? (
        <TouchableOpacity style={styles.button} onPress={showInterstitialAd}>
          <EvilIcons name="share-apple" size={22} color="#FFFFFF"/>
          <Text style={styles.text}>Enviar PDF</Text>
        </TouchableOpacity>
  ) : (
    <EnviarPdf2
      photo1={photo1}
      photo2={photo2}
      />)}
         
         
         </> 

      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft:35
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: "#1462fc",
    paddingHorizontal: 17,
    borderRadius: 10,
    height: 40,
  },
  text: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default EnviarPdf1;
