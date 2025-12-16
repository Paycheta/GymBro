// screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WorkoutCard from '../components/WorkoutCard';
import ExerciseRow from '../components/ExerciseRow';

const STORAGE_KEY = '@gymbro_data_v1';

function uid(prefix = ''){ return prefix + Math.random().toString(36).slice(2,9); }

export default function HomeScreen(){
  const [data, setData] = useState({ days: [] });
  const [selectedDay, setSelectedDay] = useState(null);
  const [workoutName, setWorkoutName] = useState('');

  useEffect(()=>{ load(); },[]);

  async function load(){
    try{
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if(json) setData(JSON.parse(json));
      else {
        const initial = {
          days: [
            { id: 'day1', name: 'Day 1 - Push', workouts: [] },
            { id: 'day2', name: 'Day 2 - Pull', workouts: [] },
            { id: 'day3', name: 'Day 3 - Legs & Core', workouts: [] },
          ]
        };
        setData(initial);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      }
    }catch(e){ console.warn(e); }
  }

  async function save(newData){
    setData(newData);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }

  function selectDay(day){ setSelectedDay(day); }

  async function addWorkout(){
    if(!selectedDay) return Alert.alert('Select a day first');
    if(!workoutName.trim()) return Alert.alert('Workout name empty');
    const newWorkout = { id: uid('w'), name: workoutName.trim(), exercises: [] };
    const newData = { ...data, days: data.days.map(d => d.id===selectedDay.id ? {...d, workouts: [...d.workouts, newWorkout]} : d ) };
    setWorkoutName('');
    await save(newData);
  }

  function exportText(){ return JSON.stringify(data, null, 2); }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>GymBro — Starter</Text>
      <View style={styles.row}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flex:1}}>
          {data.days.map(d => (
            <TouchableOpacity key={d.id} style={[styles.dayBtn, selectedDay?.id===d.id && styles.dayBtnActive]} onPress={()=>selectDay(d)}>
              <Text style={styles.dayText}>{d.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {selectedDay ? (
        <View style={{flex:1}}>
          <Text style={styles.header}>Selected: {selectedDay.name}</Text>
          <View style={styles.addRow}>
            <TextInput placeholder="New workout name" value={workoutName} onChangeText={setWorkoutName} style={styles.input} />
            <TouchableOpacity onPress={addWorkout} style={styles.btn}><Text style={styles.btnText}>Add</Text></TouchableOpacity>
          </View>

          <FlatList
            data={selectedDay.workouts}
            keyExtractor={i=>i.id}
            ListEmptyComponent={<Text style={{padding:10}}>No workouts yet</Text>}
            renderItem={({item: workout}) => (
              <WorkoutCard workout={workout} selectedDay={selectedDay} data={data} setData={setData} save={save} />
            )}
          />
        </View>
      ) : (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <Text>Select a day to start</Text>
        </View>
      )}

      <View style={{padding:6}}>
        <TouchableOpacity onPress={()=>Alert.alert('Export data', exportText())} style={styles.exportBtn}><Text>Export JSON</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'#fff'},
  title:{fontSize:20, fontWeight:'700', padding:12},
  row:{flexDirection:'row', paddingHorizontal:8},
  dayBtn:{padding:10, borderRadius:8, marginRight:8, backgroundColor:'#eee'},
  dayBtnActive:{backgroundColor:'#cde'},
  dayText:{fontWeight:'600'},
  header:{fontSize:16, fontWeight:'700', padding:10},
  addRow:{flexDirection:'row', padding:10, alignItems:'center'},
  input:{flex:1, borderWidth:1, borderColor:'#ddd', padding:8, borderRadius:6, marginRight:8},
  btn:{backgroundColor:'#007bff', padding:10, borderRadius:6},
  btnText:{color:'#fff', fontWeight:'700'},
  exportBtn:{alignSelf:'center', padding:8, borderWidth:1, borderColor:'#ddd', borderRadius:6}
});
