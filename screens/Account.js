import React, {useState, useEffect, useContext} from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { fetchUnitsFromFirestore,fetchDetails,fetchDetails2,createAttendanceRecord,fetchAttendanceDetail  } from '../firebase'
import UserContext from '../UserContext';
const Account = () => {
  const navigation = useNavigation();

  
  const [units, setUnits] = useState([]);
  const { userId } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);
  const [userDetails2, setUserDetails2] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [unitDetailsModalVisible, setUnitDetailsModalVisible] = useState(false);
  const [selectedUnitDetails, setSelectedUnitDetails] = useState(null);

  const [filteredUnits, setFilteredUnits] = useState([]);
  const [nextClass, setNextClass] = useState(null);
  const [attendanceUnits, setAttendanceUnits] = useState([]);
  const [attendanceDetails, setAttendanceDetails] = useState({});

  useEffect(() => {
    const fetchAttendanceDetails = async () => {
      try {
        // Loop through filteredUnits and fetch attendance details for each unit
        const attendanceDetailsMap = {};
        for (const unit of filteredUnits) {
          const unitAttendance = await fetchAttendanceDetail(unit.unit_code);
          attendanceDetailsMap[unit.unit_code] = unitAttendance;
        }
        setAttendanceDetails(attendanceDetailsMap);
      } catch (error) {
        // console.error('Error fetching attendance details:', error);
      }
    };

    fetchAttendanceDetails();
  }, [filteredUnits]);
  useEffect(() => {
    // Fetch units from Firestore when the component mounts
    const fetchData = async () => {
      try {
        const unitsFromFirestore = await fetchUnitsFromFirestore();
        setUnits(unitsFromFirestore);

        const user = await fetchDetails(userId);
        setUserDetails(user);
        const user2 = await fetchDetails2(userId);
        setUserDetails2(user2);
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

          // Create the attendanceUnits map
          const attendanceUnitsMap = user2.unit_codes;
          setAttendanceUnits(attendanceUnitsMap);
          
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]); // Add userId as a dependency to re-run the effect when userId changes

  const createAttendance = async () => {
    try {
      if (nextClass) {
        // Assuming you have a function to create attendance in your firebase.js
        await createAttendanceRecord(nextClass.unit_code);
      } else {
        console.log('No upcoming classes for today.');
      }
    } catch (error) {
      console.error('Error creating attendance record:', error);
    }
  };
  

  return (
    <View >
    <ScrollView vertical showsVerticalScrollIndicator={false} style={{marginHorizontal:14}}>
      {/* Header Component */}
      <View style={{ width: '100%', margin: 2, padding: 10, paddingTop: 30, flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'center' }}>
     
        <View style={{ alignItems: 'center' }}>
  <View style={{ paddingHorizontal: 2 }}>
    <TouchableOpacity onPress={() => navigation.navigate('Account')} style={{ borderRadius: 70, height: 150, width: 150, backgroundColor: '#ebebeb', justifyContent: 'center', alignItems: 'center' }}>
      <Ionicons name="person" size={57} color="#afafaf" />
    </TouchableOpacity>
  </View>
  <Text style={{ textAlign: 'center', fontSize:20,fontWeight:700 ,paddingTop:10 }}>{userDetails?.firstName} {userDetails?.lastName}</Text>
  <Text style={{ textAlign: 'center', fontSize:20,fontWeight:700 ,paddingTop:10 }}>{userDetails?.reg_no}</Text>
  <Text style={{ textAlign: 'center', fontSize:20,fontWeight:700 ,paddingTop:10 }}>{userDetails?.course}</Text>
</View>

      </View>

      {/* The body */}
      
        {/* Information Card */}
        {userDetails?.userType === 'Teacher'? (
  
  
       
        <View >
       
 {nextClass ? (
  <TouchableOpacity onPress={createAttendance} style={{ backgroundColor: '#221995', padding: 20, borderRadius: 10,marginTop:5}}>
         <View  style={{ flex: 1 }}>
           <Text style={{ fontSize: 18, color: '#F9F9FF', fontWeight: '700' }}>
             Start Class Now?
           </Text>
           <Text style={{ fontSize: 15, color: '#F9F9FF', marginTop: 10, fontWeight: '500' }}>
             Lecturer: {nextClass.unit_code}
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
         </View>
      </TouchableOpacity>  
       ) : (
        <View style={{ backgroundColor: '#221995', padding: 20, borderRadius: 10,marginTop:5}}>
         <Text style={{ fontSize: 18, color: '#F9F9FF', fontWeight: '700' }}>
           No upcoming classes for today.
         </Text>
         </View>
       )}
       
 </View>
 ) : (
    <View />
  )}
       
{/* Units */}
<View style={{paddingBottom:100}}>
<View style={{ paddingVertical: 5 }}>
  <Text style={{ textAlign: 'center', fontSize: 25, fontWeight: '700',paddingVertical:10 }}>Attendance Analysis</Text>
</View>
<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
  {filteredUnits.map((unit, index) => (
    <View key={index} style={{ width: '100%', padding: 5 }}>
    {userDetails?.userType === 'Student'? (
  
      <TouchableOpacity 
        onPress={() => {
                setSelectedUnitDetails(unit);
                setUnitDetailsModalVisible(true);
              }}
      style={{ backgroundColor: '#dfdfdf', borderRadius: 50, marginBottom: 3,paddingVertical:10, paddingHorizontal: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 ,justifyContent:'center'}}>
     
        <Text style={{ fontSize: 18,textAlign:'center', color: '#000', fontWeight: '700' }}>
          {unit.unit_name}
        </Text>
       <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'flex-end'}}>
       <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          {/* <Ionicons name="book" size={20} color="#afafaf" /> */}
          <Text style={{ fontSize: 15, fontWeight: '500' }}>
            {unit.unit_code}
          </Text>
        </View>
        <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          {/* <Ionicons name="graph" size={20} color="#afafaf" /> */}
          
          <Text style={{ fontSize: 15, fontWeight: '500' }}>
       
  
          {userDetails2.unit_codes[unit.unit_code] !== undefined && (
              <Text style={{ fontSize: 15, fontWeight: '500' }}>
               
                Attendance: {((userDetails2.unit_codes[unit.unit_code] / 11) * 100).toFixed(2)}%
              </Text>
            )}

          </Text>
         
        </View>
        </View>
        
      </TouchableOpacity>
      ) : (
        <TouchableOpacity 
         onPress={() => {
                  setSelectedUnit(unit);
                  setModalVisible(true);
                }}
        style={{ backgroundColor: '#dfdfdf', borderRadius: 50, marginBottom: 3,paddingVertical:10, paddingHorizontal: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 ,justifyContent:'center'}}>
     
     <Text style={{ fontSize: 18,textAlign:'center', color: '#000', fontWeight: '700' }}>
       {unit.unit_name}
     </Text>
    <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'flex-end'}}>
    <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
       {/* <Ionicons name="book" size={20} color="#afafaf" /> */}
       <Text style={{ fontSize: 15, fontWeight: '500' }}>
         {unit.unit_code}
       </Text>
     </View>
     <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
       {/* <Ionicons name="graph" size={20} color="#afafaf" /> */}
       
       <Text style={{ fontSize: 15, fontWeight: '500' }}>
    

       
           <Text style={{ fontSize: 15, fontWeight: '500' }}>
            
            {attendanceDetails[unit.unit_code]?.present && (
                        <Text style={{ fontSize: 15, fontWeight: '500' }}>
                         Attendance Percentage: {((attendanceDetails[unit?.unit_code]?.present.length / unit?.students_number) * 100).toFixed(2)}%
                        </Text>
                      )}
           </Text>
         

       </Text>
      
     </View>
     </View>
     
   </TouchableOpacity>
  )}
     
    </View>
  ))}
</View>


</View>
{/* modal for Student details */}
<Modal
        animationType="slide"
        transparent={true}
        visible={unitDetailsModalVisible}
        onRequestClose={() => {
          setUnitDetailsModalVisible(!unitDetailsModalVisible);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', elevation: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 10 }}>
              Your Attendance Report
            </Text>
            {selectedUnitDetails && (
              <View>
                <Text style={{ fontSize: 18, fontWeight: '500', textAlign: 'center', marginBottom: 10 }}>
                  {selectedUnitDetails.unit_name}
                </Text>
                <View style={{ flexDirection: 'col', justifyContent: 'space-evenly', alignItems: 'flex-start' }}>
                  <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Text style={{ fontSize: 15, fontWeight: '500' }}>
                      Unit Code: {selectedUnitDetails.unit_code}
                    </Text>
                  </View>
                  <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Text style={{ fontSize: 15, fontWeight: '500' }}>
                      Lecturer: {selectedUnitDetails.lecturer}
                    </Text>
                  </View>
                  <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Text style={{ fontSize: 15, fontWeight: '500' }}>
                      Attendance: {((userDetails2.unit_codes[selectedUnitDetails.unit_code] / 11) * 100).toFixed(2)}%
                    </Text>
                  </View>
                  <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Text style={{ fontSize: 15, fontWeight: '500' }}>
                    Attended {((userDetails2.unit_codes[selectedUnitDetails.unit_code] ) )} of 11
                    </Text>
                  </View>
                 
                </View>
              
              </View>
            )}
           <View style={{flexDirection:'row',justifyContent:'space-between'}}>
           <Pressable
              style={{
                backgroundColor: '#221995',
                padding: 10,
                borderRadius: 5,
                alignItems: 'center',
                marginTop: 10,
                width:'49%'
              }}
             
            >
              <Ionicons name="cloud-download-outline" style={{ color: 'white', fontSize: 16 }} color="#ffffff" />
            </Pressable>
            <Pressable
              style={{
                backgroundColor: '#221995',
                padding: 10,
                borderRadius: 5,
                alignItems: 'center',
                marginTop: 10,
                width:'49%'
              }}
              onPress={() => setUnitDetailsModalVisible(!unitDetailsModalVisible)}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Close</Text>
            </Pressable>
           </View>
          </View>
        </View>
      </Modal>
 {/* Modal for Attendance Details */}
 <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', elevation: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 10 }}>
              {selectedUnit?.unit_name} Attendance Details
            </Text>
           

            <Text style={{ fontSize: 15, fontWeight: '500', marginBottom: 10 }}>
              Unit Code: {selectedUnit?.unit_code}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: '500', marginBottom: 10 }}>
   Date: {attendanceDetails[selectedUnit?.unit_code]?.date && (
    new Date(attendanceDetails[selectedUnit?.unit_code]?.date.toMillis()).toLocaleDateString()
  )}
</Text>
            {attendanceDetails[selectedUnit?.unit_code]?.present && (
              <Text style={{ fontSize: 15, fontWeight: '500', marginBottom: 10 }}>
                Attendance Percentage: {((attendanceDetails[selectedUnit?.unit_code]?.present.length / selectedUnit?.students_number) * 100).toFixed(2)}%
              </Text>
              
            )}
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 15, fontWeight: '500', marginBottom: 5 }}>Present Students:</Text>
              {attendanceDetails[selectedUnit?.unit_code]?.present &&
                attendanceDetails[selectedUnit?.unit_code]?.present.map((student, index) => (
                  <Text key={index} style={{ fontSize: 15, fontWeight: '500', marginBottom: 3 }}>
                    {student}
                  </Text>
                ))}
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
           <Pressable
              style={{
                backgroundColor: '#221995',
                padding: 10,
                borderRadius: 5,
                alignItems: 'center',
                marginTop: 10,
                width:'49%'
              }}
             
            >
                           <Ionicons name="cloud-download-outline" style={{ color: 'white', fontSize: 16 }} color="#ffffff" />

            </Pressable>
            <Pressable
              style={{
                backgroundColor: '#221995',
                padding: 10,
                borderRadius: 5,
                alignItems: 'center',
                marginTop: 10,
                width:'49%'
              }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Close</Text>
            </Pressable>
          </View>
          </View>
        </View>
      </Modal>

        {/* Other content goes here */}
      </ScrollView>
     
    </View>
  );
};

export default Account;

