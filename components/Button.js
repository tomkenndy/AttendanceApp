import { StatusBar } from 'expo-status-bar';
import { StyleSheet,Text,TouchableOpacity, View } from 'react-native';

export default function Button() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{backgroundColor:'#000' }}>
        <Text style={{color:'#fff', padding:10}}>Click me</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});