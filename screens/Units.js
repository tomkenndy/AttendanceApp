import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Modal, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchUnitsFromFirestore, fetchDetails,updateUnitInFirebase } from '../firebase';
import UserContext from '../UserContext';

const Units = () => {
  const [units, setUnits] = useState([]);
  const { userId } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentUnit, setCurrentUnit] = useState(null);

  useEffect(() => {
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
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);

  const openModal = (unit) => {
    setCurrentUnit(unit);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

 
  const updateUnitDetails = () => {
    // Assuming you have updated values in the currentUnit state
    const updatedData = {
      start_time: currentUnit?.start_time,
      venue: currentUnit?.venue,
      unit_details: currentUnit?.unit_details,
      // Add other fields as needed
    };

    // Call the function
    updateUnitInFirebase(currentUnit?.unit_code, updatedData);

    // Close the modal
    closeModal();
  };

  return (
    <View style={{ paddingTop: 20 }}>
      <View style={{ width: '100%', margin: 2, padding: 10, paddingTop: 30, flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Image
            source={require('../assets/MKSU_Logo.png')}
            style={{ width: 60, height: 50, resizeMode: 'contain' }}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <View style={{ paddingHorizontal: 2 }}>
            <TouchableOpacity style={{ borderRadius: 20, height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="list" size={27} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView vertical showsVerticalScrollIndicator={false} style={{ margin: 14 }}>
        <View style={{ paddingBottom: 200 }}>
          <View style={{ paddingVertical: 5 }}>
            <Text style={{ textAlign: 'left', fontSize: 25, fontWeight: '700', paddingVertical: 10 }}>Current Units</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {filteredUnits.map((unit, index) => (
              <View key={index} style={{ width: '100%', padding: 5 }}>
                <View style={{ backgroundColor: '#efefef', borderRadius: 10, marginBottom: 3, minHeight: 200, paddingHorizontal: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, justifyContent: 'center' }}>
                  <Text style={{ fontSize: 18, color: '#000', fontWeight: '700' }}>
                    {unit.unit_name}
                  </Text>
                  <Text style={{ color: '#000', fontSize: 14, fontWeight: 500, marginTop: 5 }}>
                    {unit.unit_details}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'flex-end' }}>
                    <View style={{ marginTop: 10, flexDirection: 'col', alignItems: 'center', gap: 3 }}>
                      <Ionicons name="person" size={20} color="#afafaf" />
                      <Text style={{ fontSize: 12, fontWeight: '500' }}>
                        {unit.lecturer}
                      </Text>
                    </View>
                    <View style={{ marginTop: 10, flexDirection: 'col', alignItems: 'center', gap: 3 }}>
                      <Ionicons name="location" size={20} color="#afafaf" />
                      <Text style={{ fontSize: 12, fontWeight: '500' }}>
                        {unit.venue}
                      </Text>
                    </View>
                    <View style={{ marginTop: 5, flexDirection: 'col', alignItems: 'center', gap: 3 }}>
                      <Ionicons name="time" size={20} color="#afafaf" />
                      <Text style={{ fontSize: 12, fontWeight: '500' }}>
                        Start: {unit.start_time}
                      </Text>
                    </View>
                  </View>
                  {userDetails?.userType === 'Teacher' ? (
                    <TouchableOpacity onPress={() => openModal(unit)}>
                      <View style={{ backgroundColor: '#221995', padding: 10, borderRadius: 5, marginTop: 10 }}>
                        <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15, textAlign: 'center' }}>Update Unit Details</Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Modal for updating unit details */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => closeModal()}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: '#FFFFFF', padding: 20, borderRadius: 10, width: '80%' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 10 }}>Update Unit Details</Text>
            
                <TextInput
                  placeholder="New Start Time"
                  value={currentUnit?.start_time}
                  onChangeText={(text) => setCurrentUnit({ ...currentUnit, start_time: text })}
                  style={{ borderBottomWidth: 1, marginBottom: 10 }}
                />

                <TextInput
                  placeholder="New Venue"
                  value={currentUnit?.venue}
                  onChangeText={(text) => setCurrentUnit({ ...currentUnit, venue: text })}
                  style={{ borderBottomWidth: 1, marginBottom: 10 }}
                />

                <TextInput
                  placeholder="New Unit Details"
                  value={currentUnit?.unit_details}
                  onChangeText={(text) => setCurrentUnit({ ...currentUnit, unit_details: text })}
                  style={{ borderBottomWidth: 1, marginBottom: 10 }}
                />

              {/* Add other input fields as needed */}
              <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%'}}>
              <TouchableOpacity onPress={() => updateUnitDetails()} style={{width:'70%'}}>
                <View style={{ backgroundColor: '#221995', padding: 10, borderRadius: 5, marginTop: 10 }}>
                  <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15, textAlign: 'center' }}>Save Changes</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => closeModal()} style={{width:'28%'}}>
                <View style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, marginTop: 10 }}>
                  <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15, textAlign: 'center' }}>Cancel</Text>
                </View>
              </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default Units;
