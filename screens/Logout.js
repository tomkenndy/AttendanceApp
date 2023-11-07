import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Logout = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Perform your Logout logic here
    // If Logout is successful, you can navigate to the main app screen
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
     
      <TouchableOpacity onPress={handleLogout} style={styles.button}>
      <Ionicons name="log-out" size={20} color="#F9F9FF" />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  button: {
    backgroundColor: '#221995',
    padding: 10,
    borderRadius: 5,
    width: 200,
    flexDirection:'row',
    gap:5,
    alignItems: 'center',
    margin: 10,
    justifyContent:'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Logout;
