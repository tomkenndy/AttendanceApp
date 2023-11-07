import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    
    navigation.navigate('Signup');
  };
  const handleLogin = () => {
    // Perform your login logic here
    // If login is successful, you can navigate to the main app screen
    navigation.navigate('MainApp');
  };

  return (
    <View style={{ paddingVertical:100, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', padding: 10 }}>
      <Text style={{ fontSize: 30,fontWeight:700, marginBottom: 20, color: '#000' }}>Login</Text>
      

      <TextInput
        style={{ backgroundColor: 'transparent', width: '90%', padding: 10, borderRadius: 28,borderColor:'#221995',borderWidth:2, margin: 10  }}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={{ backgroundColor: 'transparent', width: '90%', padding: 10, borderRadius: 28,borderColor:'#221995',borderWidth:2, margin: 10  }}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      
      <TouchableOpacity
        onPress={handleLogin}
        style={{ backgroundColor: '#221995', padding: 10, borderRadius: 28, width: '90%', alignItems: 'center', margin: 10 }}
      >
        <Text style={{ color: '#fff', fontSize: 20 }}>Login</Text>
      </TouchableOpacity>
      <View style={{marginTop:50, width:'100%',justifyContent:'center',alignItems:'center'}}>
      <Text style={{ color: '#000', fontSize: 15 }}>Or Login with</Text>
      <TouchableOpacity
        onPress={handleLogin}
        style={{ backgroundColor: '#bbb', padding: 3, borderRadius: 28, width: '90%', alignItems: 'center', margin: 10 }}
      >
      
          {/* Logo Image */}
          <Image
            source={require('../assets/google.png')} // Add the path to your logo image
            style={{ width: 38, height: 38, resizeMode: 'contain' }}
          />
          
     
      
      </TouchableOpacity>
      </View>
      
      <View style={{ flexDirection: 'row', width: '90%',marginTop: 50, justifyContent:'center',alignItems:'flex-end' }}>
      <Text style={{ color: '#000', fontSize: 15 }}>Don't have an account?</Text>
      <TouchableOpacity
         style={{color:'#221995'}}
         onPress={handleSignup}
         >
      <Text style={{ color: '#221995', fontSize: 17,fontWeight:700,marginHorizontal:4 }}>Signup</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
