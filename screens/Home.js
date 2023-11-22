import React, {useState, useEffect, useContext} from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { fetchUnitsFromFirestore,fetchDetails, updateAttendanceRecord } from '../firebase'

import UserContext from '../UserContext';

const Home = () => {
  const navigation = useNavigation();

  
  const [units, setUnits] = useState([]);
  const { userId } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [nextClass, setNextClass] = useState(null);
  useEffect(() => {
    // Fetch units from Firestore when the component mounts
    const fetchData = async () => {
      try {
        const unitsFromFirestore = await fetchUnitsFromFirestore();
        setUnits(unitsFromFirestore);

        const user = await fetchDetails(userId);
        setUserDetails(user);

      

        // Filter units based on unit_codes in user details
        if (user?.unit_codes) {
          const filtered = unitsFromFirestore.filter((unit) => user.unit_codes.includes(unit.unit_code));
          setFilteredUnits(filtered);

          // Find the next class based on the current day and time
          const now = new Date();
          const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' }).split(',')[0].toLowerCase();
         
          const nextClass = filtered.find((unit) => {
            const classDay = unit.day.toLowerCase();
          
            return classDay.includes(dayOfWeek);
          });
          
          

          setNextClass(nextClass);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]); // Add userId as a dependency to re-run the effect when userId changes


  return (
    <View style={{ paddingTop: 20 }}>
      {/* Header Component */}
      <View style={{ width: '100%', margin: 2, padding: 10, paddingTop: 30, flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'space-between' }}>
      <View style={{ flex: 1 }}>
          {/* Logo Image */}
          <Image
            source={require('../assets/MKSU_Logo.png')} // Add the path to your logo image
            style={{ width: 60, height: 50, resizeMode: 'contain' }}
          />
          
        </View>
        <View style={{ alignItems: 'center' }}>
  <View style={{ paddingHorizontal: 2 }}>
    <TouchableOpacity onPress={() => navigation.navigate('Account')} style={{ borderRadius: 20, height: 40, width: 40, backgroundColor: '#ebebeb', justifyContent: 'center', alignItems: 'center' }}>
      <Ionicons name="person" size={27} color="#afafaf" />
    </TouchableOpacity>
  </View>
  <Text style={{ textAlign: 'center', fontWeight:700 }}>{userDetails?.firstName}</Text>
</View>

      </View>

      {/* The body */}
      <ScrollView vertical showsVerticalScrollIndicator={false} style={{margin:14}}>
        {/* Information Card */}
       

        <View style={{ backgroundColor: '#221995', padding: 20, borderRadius: 10, marginTop: 5 }}>
  {nextClass ? (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 18, color: '#F9F9FF', fontWeight: '700' }}>
        {nextClass.unit_details}
      </Text>
      <Text style={{ fontSize: 15, color: '#F9F9FF', marginTop: 10, fontWeight: '500' }}>
        Lecturer: {nextClass.lecturer}
      </Text>
      <Text style={{ fontSize: 15, color: '#F9F9FF', fontWeight: '500' }}>
        Unit: {nextClass.unit_name}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Ionicons name="time" size={20} color="gold" />
          <Text style={{ fontSize: 15, fontWeight: '500', color: '#F9F9FF' }}>
            From: {nextClass.start_time}
          </Text>
        </View>
        <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Ionicons name="location" size={20} color="red" />
          <Text style={{ fontSize: 15, fontWeight: '500', color: '#F9F9FF' }}>
            Venue: {nextClass.venue}
          </Text>
        </View>
      </View>
      
      {userDetails?.userType === 'Student'? (
  <TouchableOpacity onPress={() => updateAttendanceRecord(nextClass.unit_code, userDetails?.reg_no)}>
    <View style={{ backgroundColor: 'gold', padding: 10, borderRadius: 5, marginTop: 10 }}>
      <Text style={{ color: '#000000', fontWeight: '700', fontSize: 15, textAlign: 'center' }}>Attend Now</Text>
    </View>
  </TouchableOpacity>
) : (
  <View />
)}

    </View>
  ) : (
    <Text style={{ fontSize: 18, color: '#F9F9FF', fontWeight: '700' }}>
      No upcoming classes for today.
    </Text>
  )}
</View>


       
{/* Units */}
<View style={{paddingBottom:200}}>
<View style={{ paddingVertical: 5 }}>
  <Text style={{ textAlign: 'left', fontSize: 25, fontWeight: '700',paddingVertical:10 }}>All Classes</Text>
</View>
<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
{filteredUnits.map((unit, index) => (
    <View key={index} style={{ width: '50%', padding: 5 }}>
      <View style={{ backgroundColor: '#dfdfdf', borderRadius: 10, marginBottom: 3, minHeight: 180, maxHeight: 180, paddingHorizontal: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 ,justifyContent:'center'}}>
        <Text style={{ fontSize: 18, color: '#000', fontWeight: '700' }}>
          {unit.unit_name}
        </Text>
        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Ionicons name="person" size={20} color="#afafaf" />
          <Text style={{ fontSize: 15, fontWeight: '500' }}>
            {unit.lecturer}
          </Text>
        </View>
        <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Ionicons name="time" size={20} color="#afafaf" />
          <Text style={{ fontSize: 15, fontWeight: '500' }}>
            Start: {unit.start_time}
          </Text>
        </View>
        <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Ionicons name="location" size={20} color="#afafaf" />
          <Text style={{ fontSize: 15, fontWeight: '500' }}>
            Venue: {unit.venue}
          </Text>
        </View>
      </View>
    </View>
  ))}
</View>


</View>



        {/* Other content goes here */}
      </ScrollView>
     
    </View>
  );
};

export default Home;

