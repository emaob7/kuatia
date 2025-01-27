
//iosClientId: "157595455454-gth7mn2i3kthbpojhvbe7uc184963l1a.apps.googleusercontent.com",
//androidClientId: "157595455454-pjiq01tls3a8hjgg6g00m1fnhcieubk4.apps.googleusercontent.com",

import React, { useState, useEffect } from 'react';
import {Button, StyleSheet, Modal, ScrollView, View,Text, Image,Pressable } from 'react-native';
//import { StyleSheet, View, TextInput,Text,TouchableOpacity, Image,Pressable } from 'react-native';
//import { signInWithEmailAndPassword } from "firebase/auth";
import {getAuth} from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import SignInScreen from "./screens/SignInScreen";





export default function Login() {
//  const [email, setEmail] = useState('');
//  const [password, setPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [checked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  //const [userInfo, setUserInfo] = React.useState();
 // const [loading, setLoading] = React.useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "632865725104-n237v30hh3vhp3c0psfkt1ivl39g4hff.apps.googleusercontent.com",
    androidClientId: "632865725104-hm2tb0okcnvg73bmj8h6kt7v7tchu7v4.apps.googleusercontent.com",
  });




  const auth = getAuth()
  const navigation = useNavigation();







  WebBrowser.maybeCompleteAuthSession();

  async function autoLogin() {
    // Obtener datos del usuario guardados en AsyncStorage
   // try {
      const uid = await AsyncStorage.getItem('user');
      if (uid !== null) { 
      // console.log("User logged in memory!", userData);
        navigation.replace( "Home",{uid})
      } else {
       // console.error('Error al obtener datos del usuario de AsyncStorage:');
       setShowLoginForm(true);

       const unsub = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
         await AsyncStorage.setItem("user",(uid));
         
         navigation.replace( "Home",{uid})
        } else {
          console.log("user not authenticated");
        }
      });
      return () => unsub();

       
      }
 //   } catch (e) {
 //     console.error('Error al obtener datos del usuario de AsyncStorage:', e);
 //   }
  }
  




 useEffect(() => {
 
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

 useEffect(() => {
    autoLogin();
    
  }, []);

/*
  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth,email, password);
      const user = auth.currentUser;
      const uid = user.uid;
      await AsyncStorage.setItem('user', uid);
      navigation.navigate("Home",{uid})
    } catch (error) {
      console.error("Failed to log in:", error);
    }
  };
*/
 
  return (
    <View style={styles.container}>
      {showLoginForm ? (
        <>
        
        <View style={styles.titlesContent}>
          <Image
           source={require('./assets/favicon1.png')} // Asegúrate de proporcionar la ruta correcta
           style={{ width: 200, height: 200, marginTop:-25, marginLeft: -20 }} // Establece el estilo de la imagen según tus necesidades
          
          />
        <Text style={styles.super}>Bienvenido a Cardpy</Text>
        <Text style={{ marginTop:5, marginLeft: -20 }}>👋 Hola! Nos alegra verte por aqui </Text>
        

        <SignInScreen 
        promptAsync={promptAsync}
        checked={checked}
         />
        
        <View style={styles.checkboxContainer}>
        <Pressable
      style={[styles.checkboxBase, checked && styles.checkboxChecked]}
      onPress={() => setChecked(!checked)}>
    </Pressable>
    <Text style={styles.label}>
      Acepto los <Text style={styles.link} onPress={() => setModalVisible(true)}>Términos de Servicio</Text>
    </Text>
    
    </View>
    <Text style={styles.link} onPress={() => setModalVisible2(true)}>Declaración de privacidad</Text>
      
        </View>
       


        {/** 
<View style={{ flexDirection: "row" }}>

<View style={{ borderTopWidth: 1, borderColor: "#424242", width: "31%", marginTop:17 }} />
        <Text 
         style={{
          alignItems:"center",
          alignContent:"center",
          justifyContent:"center",
          width: "30%",
          padding: 10,
          color: "#424242"
        }}>O ingresa con</Text>
        <View style={{ borderTopWidth: 1, borderColor: "#424242", width: "31%", marginTop:17 }} />


</View>
       
        
          <Text style={styles.text}>Correo:</Text>
          <View style={styles.inputContainer}>
          <TextInput
          style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Ingrese su correo"
          />
          </View>
          
          <Text style={styles.text}>Contraseña:</Text>
          <View style={styles.inputContainer}>
          <TextInput
          style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Ingrese su contraseña"
            secureTextEntry
          />
          </View>
          

<View style={styles.buttonContent}>
       <TouchableOpacity style={styles.button} onPress={() => signIn(email, password)}>
    <Text style={styles.textButton} >INICIAR</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.buttonC} onPress={() => navigation.navigate("RegisterScreen")}>
    <Text>¿Aún no tienes una cuenta?</Text><Text style={styles.textButtonC} >Crea una cuenta</Text>
    </TouchableOpacity>
</View>
*/}
    

       

    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <ScrollView>
              <Text style={styles.modalTitle}>Términos de Servicio</Text>
              <Text style={styles.modalText}>
                {/* Aquí puedes copiar y pegar los términos de servicio que redactaste anteriormente */}
                Bienvenido a Cardpy. Al utilizar nuestra aplicación, aceptas cumplir con los siguientes términos de servicio. Si no estás de acuerdo con estos términos, no debes utilizar la aplicación.
                {'\n\n'}1. Aceptación de los términos
                Al crear una cuenta y utilizar Cardpy, aceptas estos términos de servicio en su totalidad.
                {'\n\n'}2. Descripción del servicio
                Cardpy permite a los usuarios crear currículums y tarjetas de identificación en formato PDF. Los servicios proporcionados pueden actualizarse o cambiar a discreción de la empresa.
                {'\n\n'}3. Uso permitido
                Eres responsable de cualquier actividad que ocurra a través de tu cuenta. Debes proporcionar información veraz y precisa y mantener la confidencialidad de tus credenciales de inicio de sesión.
                {'\n\n'}4. Derechos y responsabilidades del usuario
                - No debes usar la aplicación para actividades ilegales o no autorizadas.
                - No debes modificar, adaptar, hackear, o hacer ingeniería inversa de la aplicación.
                - No debes cargar contenido que sea ofensivo, abusivo, difamatorio, o que infrinja los derechos de terceros.
                {'\n\n'}5. Privacidad y manejo de datos
                Cardpy se compromete a proteger tu privacidad. Consulta nuestra Política de Privacidad para obtener más detalles sobre cómo manejamos tu información personal.
                {'\n\n'}6. Propiedad intelectual
                Todos los contenidos, marcas registradas, logotipos y gráficos proporcionados por Cardpy son propiedad de Cardpy y están protegidos por leyes de propiedad intelectual.
                {'\n\n'}7. Limitación de responsabilidad
                Cardpy no será responsable de ningún daño directo, indirecto, incidental, especial, o consecuente que resulte del uso o la incapacidad de usar la aplicación. Además, Cardpy no será responsable si la información de tu cuenta es hackeada o comprometida de alguna manera. Los usuarios son responsables de tomar las medidas necesarias para proteger sus cuentas.
                {'\n\n'}8. Modificaciones de los términos
                Nos reservamos el derecho de modificar estos términos de servicio en cualquier momento. Notificaremos a los usuarios sobre cualquier cambio significativo. El uso continuo de la aplicación después de la notificación de cambios constituye tu aceptación de los nuevos términos.
                {'\n\n'}9. Contacto
                Si tienes alguna pregunta sobre estos términos, por favor contacta con nosotros a cardpy7@gmail.com .
              </Text>
            </ScrollView>
            <Button
              title="Cerrar"
              onPress={() => setModalVisible(!modalVisible)}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          setModalVisible2(!modalVisible2);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <ScrollView>
              <Text style={styles.modalTitle}>Declaración de Privacidad</Text>
              <Text style={styles.modalTitle}>Última actualización: 10 de julio, 2024</Text>
              <Text style={styles.modalText}>
                {/* Aquí puedes copiar y pegar los términos de servicio que redactaste anteriormente */}
                En Cardpy, respetamos tu privacidad y nos comprometemos a proteger tu información personal. Esta declaración de privacidad explica cómo recopilamos, usamos y compartimos tu información.
                {'\n\n'}1. Información que recolectamos
                {'\n'}- Información personal: Cuando creas una cuenta en Cardpy, podemos recopilar información como tu nombre, dirección de correo electrónico y otros datos necesarios para el funcionamiento de la aplicación.
                {'\n'}- Información no personal: También recopilamos información no personal, como datos del dispositivo, información de uso y datos analíticos.
                {'\n\n'}2. Uso de la información
                {'\n'}- Utilizamos la información recopilada para mejorar y personalizar tu experiencia en Cardpy.
                {'\n'}- Para comunicarte actualizaciones, promociones y otra información relacionada con el servicio.
                {'\n'}- Para asegurar y mantener la integridad de nuestros servicios.
                {'\n\n'}3. Compartir información
                {'\n'}- No compartimos tu información personal con terceros, excepto cuando sea necesario para proporcionar los servicios de Cardpy, cumplir con la ley, o proteger nuestros derechos.
                {'\n'}- Podemos compartir información no personal con socios y proveedores de servicios para análisis y mejoras.
                {'\n\n'}4. Seguridad de los datos
                {'\n'}Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra el acceso, alteración, divulgación o destrucción no autorizada.
                {'\n\n'}5. Derechos del usuario
                {'\n'}Tienes derecho a acceder, corregir, o eliminar tu información personal en cualquier momento. Para ejercer estos derechos, por favor contacta con nosotros a cardpy7@gmail.com .
                {'\n\n'}6. Cambios en la política de privacidad
                {'\n'}Nos reservamos el derecho de modificar esta declaración de privacidad en cualquier momento. Notificaremos a los usuarios sobre cualquier cambio significativo a través de la aplicación o por correo electrónico.
                {'\n\n'}7. Contacto
                {'\n'}Si tienes alguna pregunta o preocupación sobre nuestra política de privacidad, por favor contacta con nosotros a cardpy7@gmail.com .
              </Text>
            </ScrollView>
            <Button
              title="Cerrar"
              onPress={() => setModalVisible2(!modalVisible2)}
            />
          </View>
        </View>
      </Modal>
       
        </>
      ):(null)}
    </View>
  );



 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: 100,
    paddingLeft: 20
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 22,
    borderColor:'#E0E0E0',
    borderWidth: 1,
    marginTop:4,
    height:40,
    width: "93%"
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  text:{
    fontWeight: 'bold',
    color: "#424242"
  },
  textButtonC:{
    fontWeight: 'bold',
    color: "#0D7AFF",
    fontSize: 15,

  },
  textButton:{
    fontWeight: 'bold',
    color: "#FFFFFF"
  },
   super: {
    fontSize: 27,
    marginTop:-28,
    fontWeight: 'bold',
    marginLeft: -20
    
  },
  subtitulo: {
    fontSize: 24,
      
  },
  titlesContent:{
    alignItems:"center",
    marginBottom:38,
    marginTop:5,
  },
  button: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: "#0D7AFF",
    paddingHorizontal: 17,
    marginTop:20,
    borderRadius:20,
    height:40,
    width:150,
    marginLeft: -20
  },
  buttonC: {
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop:30,
    height:40,
    width:250,
    marginLeft: -20
  },
  buttonContent:{
    alignItems:"center",
    marginBottom:38,
  },
  checkboxBase: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'coral',
    backgroundColor: 'transparent',

    
  },
  checkboxChecked: {
    backgroundColor: 'coral',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop:15,
    marginLeft: -20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginLeft:10,
  },
  link: {
    color: 'blue',
   // textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    paddingTop:90,
    paddingBottom:60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
  },

});