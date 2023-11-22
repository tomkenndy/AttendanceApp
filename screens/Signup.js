import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signUpWithEmailAndPassword, saveUserDetails } from '../firebase';

const SignupScreen = () => {
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('');

  const handleSignup = async () => {
    // Check if any of the required fields are empty
    if (!firstName || !lastName || !email || !password || !confirmPassword || !userType) {
      alert('Please fill in all fields');
      return;
    }

    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (userType !== 'Student' && userType !== 'Teacher') {
      alert('Invalid User Type');
      return;
    }

    try {
      // Use Firebase authentication to create a new user
      const user = await signUpWithEmailAndPassword(email, password);

      // Save user details in Firestore
      saveUserDetails(user.uid, firstName, lastName, email, userType, null);

      // Optionally, you can navigate to another screen here
      navigation.navigate('Login');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignin = () => {
    // Navigate to the login screen
    navigation.navigate('Login');
  };

  return (
    <View style={{ paddingVertical:100, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', padding: 10 }}>
      <Text style={{ fontSize: 30,fontWeight:700, marginBottom: 20, color: '#000' }}>Sign Up</Text>
      <View style={{ flexDirection: 'row', width: '90%',margin: 10, justifyContent:'space-between' }}>
            <TextInput
                style={{ backgroundColor: 'transparent', width: '47.5%', padding: 10, borderRadius: 28,borderColor:'#221995',borderWidth:2,}}
                placeholder="First Name"
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
            />
            <TextInput
                style={{ backgroundColor: 'transparent', width: '47.5%', padding: 10, borderRadius: 28 ,borderColor:'#221995',borderWidth:2,}}
                placeholder="Last Name"
                value={lastName}
                onChangeText={(text) => setLastName(text)}
            />
        </View>

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
      <TextInput
        style={{ backgroundColor: 'transparent', width: '90%', padding: 10, borderRadius: 28,borderColor:'#221995',borderWidth:2, margin: 10  }}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
      />
      <TextInput
        style={{ backgroundColor: 'transparent', width: '90%', padding: 10, borderRadius: 28,borderColor:'#221995',borderWidth:2, margin: 10 }}
        placeholder="User Type (Student/Teacher)"
        value={userType}
        onChangeText={(text) => setUserType(text)}
      />
      <TouchableOpacity
        onPress={handleSignup}
        style={{ backgroundColor: '#221995', padding: 10, borderRadius: 28, width: '90%', alignItems: 'center', margin: 10 }}
      >
        <Text style={{ color: '#fff', fontSize: 20 }}>Signup</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', width: '90%',marginTop: 70, justifyContent:'center',alignItems:'flex-end' }}>
      <Text style={{ color: '#000', fontSize: 15 }}>Already have an account?</Text>
      <TouchableOpacity
         style={{color:'#221995'}}
         onPress={handleSignin}
         >
      <Text style={{ color: '#221995', fontSize: 17,fontWeight:700,marginHorizontal:4 }}>Login</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignupScreen;
