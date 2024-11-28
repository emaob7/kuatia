import { Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function SignInScreen({ promptAsync, checked }) {

  const aceptarTerminos = () => {
    
      alert("Debes aceptar los términos de servicio para continuar.");
      return;
    
  }

  return (
    <>
{checked ? (
      <TouchableOpacity
        style={{
          backgroundColor: "#4285F4",
          width: "93%",
          padding: 10,
          borderRadius: 15,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 15,
          marginTop: 77,
          marginBottom: 17,
          marginLeft: -20
        }}
        onPress={() => promptAsync()}
      >
        <AntDesign name="google" size={30} color="#FFFFFF" />
        <Text style={{ fontWeight: "bold", color: "#FFFFFF", fontSize: 17 }}>
          Iniciar con Google
        </Text>
      </TouchableOpacity>
):(
  
   <TouchableOpacity
        style={{
          backgroundColor: "#4285F4",
          width: "93%",
          padding: 10,
          borderRadius: 15,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 15,
          marginTop: 77,
          marginBottom: 17,
          marginLeft: -20
        }}
        onPress={aceptarTerminos}
      >
        <AntDesign name="google" size={30} color="#FFFFFF" />
        <Text style={{ fontWeight: "bold", color: "#FFFFFF", fontSize: 17 }}>
          Iniciar con Google
        </Text>
      </TouchableOpacity>
  
  )}

    </>
  );
}