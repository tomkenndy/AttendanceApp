import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Account = () => {
  const navigation = useNavigation();

  const units = [
    { id: 1, title: 'Component Programming', lecturer:'Mr. George',venue:'General Lab', time: '12:00 p.m' , endTime: '2:00 p.m' },
    { id: 2, title: 'Software Project Management', lecturer:'Mr. Omuya',venue:'Engineering Lab', time: '12:00 p.m' , endTime: '2:00 p.m' },
    { id: 3, title: 'Advanced Database Systems', lecturer:'Mr. Mathenge',venue:'Lab 1', time: '12:00 p.m' , endTime: '2:00 p.m' },
    { id: 4, title: 'Computer Networks', lecturer:'Ms. Veronica',venue:'General Lab', time: '12:00 p.m' , endTime: '2:00 p.m' },
    { id: 5, title: 'Programming Languages', lecturer:'Ms. Mercy',venue:'General Lab', time: '12:00 p.m' , endTime: '2:00 p.m' },
    { id: 6, title: 'Analysis of Algorithms', lecturer:'Mr. Kimeu',venue:'Lab 4', time: '12:00 p.m' , endTime: '2:00 p.m' },
  ];

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
  <Text style={{ textAlign: 'center', fontSize:20,fontWeight:700 ,paddingTop:10 }}>Tom Musungu</Text>
  <Text style={{ textAlign: 'center', fontSize:20,fontWeight:700 ,paddingTop:10 }}>J17-8000-2021</Text>
  <Text style={{ textAlign: 'center', fontSize:20,fontWeight:700 ,paddingTop:10 }}>Bachelor of Science, Computer Science</Text>
</View>

      </View>

      {/* The body */}
      
        {/* Information Card */}
       
<View style={{ backgroundColor: '#221995', padding: 20, borderRadius: 10,marginTop:5}}>
 
  <View style={{ flex: 1 }}>

    <Text style={{ fontSize: 18, color: '#F9F9FF', fontWeight: '700' }}>
      Ongoing Class!
    </Text>
    <Text style={{ fontSize: 15,color: '#F9F9FF', marginTop: 10, fontWeight: '500' }}>
      Lecturer: Mr. Omuya
    </Text>
    <Text style={{ fontSize: 15,color: '#F9F9FF', fontWeight: '500' }}>
      Unit: Software Project Management
    </Text>
    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
       <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Ionicons name="time" size={20} color="#F9F9FF" />
          <Text style={{ fontSize: 15, fontWeight: '500',color:'#F9F9FF' }}>
            From: 4:00 p.m
          </Text>
        </View>
        <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Ionicons name="time" size={20} color="#F9F9FF" />
          <Text style={{ fontSize: 15, fontWeight: '500',color:'#F9F9FF' }}>
            To: 6:00 p.m
          </Text>
        </View>
       </View>
  </View>
</View>


       
{/* Units */}
<View style={{paddingBottom:100}}>
<View style={{ paddingVertical: 5 }}>
  <Text style={{ textAlign: 'left', fontSize: 25, fontWeight: '700',paddingVertical:10 }}>Attendance Analysis</Text>
</View>
<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
  {units.map((unit, index) => (
    <View key={index} style={{ width: '50%', padding: 5 }}>
      <View style={{ backgroundColor: '#efefef', borderRadius: 10, marginBottom: 3, minHeight: 180, maxHeight: 180, paddingHorizontal: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 ,justifyContent:'center'}}>
        <Text style={{ fontSize: 18, color: '#000', fontWeight: '700' }}>
          {unit.title}
        </Text>
        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Ionicons name="person" size={20} color="#afafaf" />
          <Text style={{ fontSize: 15, fontWeight: '500' }}>
            {unit.lecturer}
          </Text>
        </View>
        <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Ionicons name="analytics" size={20} color="#afafaf" />
          <Text style={{ fontSize: 15, fontWeight: '500' }}>
            Attendance percentage: 80%
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

export default Account;

