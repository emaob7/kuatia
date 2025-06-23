import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, Alert, ActivityIndicator, View } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import * as Print from 'expo-print';

const EnviarPdf2 = ({ photo1, photo2 }) => {
  const [interstitial, setInterstitial] = useState(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para el loader

  useEffect(() => {
    const interstitialAd = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
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
      Alert.alert("Error", "Asegúrate de tomar ambas fotos antes de generar el PDF.");
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
          .image-container {
           display: flex;
            justify-content: center;
            gap: 130px;
            padding: 10px 50px 20px;
            margin-top: 40px;
          }
          .imagen {
            border-radius: 10px;
            width: 340px;
            height: 180px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="image-container">
            <img class="imagen" src="${photo1}" alt="Imagen 1">
            <img class="imagen" src="${photo2}" alt="Imagen 2">
          </div>
        </div>
      </body>
      </html>
    `;

      await Print.printAsync({
        html: htmlContent,
      });

      Alert.alert("Éxito", "El contenido está listo para imprimir o guardar como PDF.");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    } finally {
      setIsLoading(false); // Desactiva el loader
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#1462fc" /> // Muestra un spinner mientras carga
      ) : (
        <TouchableOpacity style={styles.button} onPress={showInterstitialAd}>
          <EvilIcons name="share-apple" size={22} color="#FFFFFF" />
          <Text style={styles.text}>Enviar PDF</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 35,
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

export default EnviarPdf2;
