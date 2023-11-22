// Login.js
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { app,auth, signInWithEmailAndPassword } from '../firebase';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import UserContext from '../UserContext';

const Login = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { userId, setSessionUserId } = useContext(UserContext);

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  const handleLogin = async () => {
    // Check if any of the required fields are empty
    if (!email || !password) {
      alert('Please fill in both email and password');
      return;
    }

    try {
      // Use Firebase authentication to log in
      await signInWithEmailAndPassword(auth, email, password);

      // Get a reference to the Firestore database
      const db = getFirestore(app);

      // Create a reference to the 'users' collection
      const usersRef = collection(db, 'users');

      // Create a query to find the user with the provided email
      const userQuery = query(usersRef, where('email', '==', email));

      // Execute the query
      const querySnapshot = await getDocs(userQuery);

      // Check if the user exists
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();

        // Check if the user has a reg_no field
       // Assuming userDoc contains the user data with the reg_no field
        if (!userDoc.reg_no) {
          // If reg_no is empty, navigate to the Sync screen
          const newUserId = userDoc.userId;
          setSessionUserId(newUserId);
          navigation.navigate('Sync', { userType: userDoc.userType });
        } else {
          // If reg_no is not empty, navigate to the MainApp directly
           const newUserId = userDoc.userId;
          setSessionUserId(newUserId);

          navigation.navigate('MainApp');
        }

      }
    } catch (error) {
      console.log(error.message);
    }
  
  };

  return (
    <View style={{ paddingVertical: 100,flex:1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', padding: 10 }}>
      <Text style={{ fontSize: 30, fontWeight: 700, marginBottom: 20, color: '#000' }}>Login</Text>

      <TextInput
        style={{ backgroundColor: 'transparent', width: '90%', padding: 10, borderRadius: 28, borderColor: '#221995', borderWidth: 2, margin: 10 }}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={{ backgroundColor: 'transparent', width: '90%', padding: 10, borderRadius: 28, borderColor: '#221995', borderWidth: 2, margin: 10 }}
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
      <View style={{ flexDirection: 'row', width: '90%',marginTop: 70, justifyContent:'center',alignItems:'flex-end' }}>
      <Text style={{ color: '#000', fontSize: 15 }}>Have no account?</Text>
      <TouchableOpacity
         style={{color:'#221995'}}
         onPress={handleSignup}
         >
      <Text style={{ color: '#221995', fontSize: 17,fontWeight:700,marginHorizontal:4 }}>Sign up</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
