import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updateStudentDetails, updateTeacherDetails, fetchDetails} from '../firebase';
import UserContext from '../UserContext';

const SyncScreen = ({ route }) => {
  const navigation = useNavigation();

  const { userType } = route.params;
  const { userId } = useContext(UserContext);
  const [reg_no, setReg_no] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [unit_codes, setUnit_codes] = useState('');

  const handleSync = async () => {
    try {
      let userDetails; // Initialize userDetails variable with the actual user details
  
      if (userType === 'Student') {
        // Save student details in Firestore
        const unit_codesArray = unit_codes.split(',').map(code => code.trim());
        await updateStudentDetails(userId, reg_no, course, year, unit_codesArray);
  
        // Fetch the user details for the Student (you need to implement this)
        userDetails = await fetchDetails(userId);
      } else {
        // Save teacher details in Firestore
        const unit_codesArray = unit_codes.split(',').map(code => code.trim());
        await updateTeacherDetails(userId, reg_no, unit_codesArray);
  
        // Fetch the user details for the Teacher (you need to implement this)
        userDetails = await fetchDetails(userId);
      }
  
      // Now you can navigate to MainApp with userDetails as a route parameter
      
      
      navigation.navigate('MainApp');
  
    } catch (error) {
      console.error('Error saving details:', error);
    }
  };
  

  return (
    <View style={{ paddingVertical: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', padding: 10 }}>
      <Text style={{ fontSize: 30, fontWeight: 700, marginBottom: 20, color: '#000' }}>More User Details</Text>

      <TextInput
        style={{ backgroundColor: 'transparent', width: '90%', padding: 10, borderRadius: 28, borderColor: '#221995', borderWidth: 2, margin: 10 }}
        placeholder="Registration Number"
        value={reg_no}
        onChangeText={(text) => setReg_no(text)}
      />

      {userType === 'Student' && (
        <>
          <TextInput
            style={{ backgroundColor: 'transparent', width: '90%', padding: 10, borderRadius: 28, borderColor: '#221995', borderWidth: 2, margin: 10 }}
            placeholder="Course"
            value={course}
            onChangeText={(text) => setCourse(text)}
          />
          <TextInput
            style={{ backgroundColor: 'transparent', width: '90%', padding: 10, borderRadius: 28, borderColor: '#221995', borderWidth: 2, margin: 10 }}
            placeholder="Year"
            value={year}
            onChangeText={(text) => setYear(text)}
          />
        </>
      )}

      <TextInput
        style={{ backgroundColor: 'transparent', width: '90%', padding: 10, borderRadius: 28, borderColor: '#221995', borderWidth: 2, margin: 10 }}
        placeholder="Unit Codes (Comma-separated)"
        value={unit_codes}
        onChangeText={(text) => setUnit_codes(text)}
      />

      <TouchableOpacity
        onPress={handleSync}
        style={{ backgroundColor: '#221995', padding: 10, borderRadius: 28, width: '90%', alignItems: 'center', margin: 10 }}
      >
        <Text style={{ color: '#fff', fontSize: 20 }}>Finish</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SyncScreen;
