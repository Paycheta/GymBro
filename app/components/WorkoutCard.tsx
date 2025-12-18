// components/WorkoutCard.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import ExerciseRow from './ExerciseRow';

function uid(prefix = ''){ return prefix + Math.random().toString(36).slice(2,9); }

export default function WorkoutCard({ workout, selectedDay, data, setData, save }){
const [exerciseName, setExerciseName] = useState('');
const [kg, setKg] = useState('');
const [reps, setReps] = useState('');
const [sets, setSets] = useState('');
const [date, setDate] = useState(new Date().toISOString().slice(0,10));

function lastExercise(workout){
if(!workout.exercises || workout.exercises.length===0) return null;
return workout.exercises[workout.exercises.length-1];
}

function progressionSuggestion(workout){
const last = lastExercise(workout);
if(!last) return 'No data yet';
const targetReps = 8;
if(last.reps >= targetReps) return `Good — consider increasing +2.5kg from ${last.kg}kg`;
if(last.reps >= targetReps - 2) return `Close — keep ${last.kg}kg or try same weight next time`;
return `Reduce weight or aim for more reps at ${last.kg}kg`;
}

async function addExercise(){
if(!exerciseName.trim()) return Alert.alert('Exercise name empty');
const e = { id: uid('e'), name: exerciseName.trim(), kg: Number(kg)||0, reps: Number(reps)||0, sets: Number(sets)||0, date };
const newData = {
...data,
days: data.days.map(d => d.id===selectedDay.id ? {
...d,
workouts: d.workouts.map(w => w.id===workout.id ? {...w, exercises: [...w.exercises, e]} : w)
} : d)
};
setExerciseName(''); setKg(''); setReps(''); setSets('');
await save(newData);
}

return (
<View style={styles.card}>
<Text style={styles.cardTitle}>{workout.name}</Text>
<Text style={{fontSize:12}}>{progressionSuggestion(workout)}</Text>

<FlatList
data={workout.exercises}
keyExtractor={e=>e.id}
renderItem={({item}) => <ExerciseRow exercise={item} />}
/>

<View style={{ marginTop: 8 }}>
  <TextInput
    placeholder="Exercise name"
    value={exerciseName}
    onChangeText={setExerciseName}
    style={styles.input}
    placeholderTextColor="#999"

  />

  {/* Row 1 */}
  <View style={styles.row}>
    <TextInput
      placeholder="kg"
      value={kg}
      onChangeText={setKg}
      style={styles.inputSmall}
      keyboardType="numeric"
      placeholderTextColor="#999"

    />
    <TextInput
      placeholder="sets"
      value={sets}
      onChangeText={setSets}
      style={styles.inputSmall}
      keyboardType="numeric"
      placeholderTextColor="#999"

    />
    <TextInput
      placeholder="reps"
      value={reps}
      onChangeText={setReps}
      style={styles.inputSmall}
      keyboardType="numeric"
      placeholderTextColor="#999"

    />
  </View>

  {/* Row 2 */}
  <View style={styles.row}>
    <TextInput
      placeholder="YYYY-MM-DD"
      value={date}
      onChangeText={setDate}
      style={[styles.input, { flex: 1 }]}
    />
    <TouchableOpacity onPress={addExercise} style={styles.btn}>
      <Text style={styles.btnText}>Add</Text>
    </TouchableOpacity>
  </View>
</View>

</View>
);
}

const styles = StyleSheet.create({
card:{padding:10, borderRadius:8, backgroundColor:'#fafafa', margin:8, borderWidth:1, borderColor:'#eee'},
cardTitle:{fontSize:16, fontWeight:'700'},
addSubRow:{flexDirection:'row', alignItems:'center', marginTop:6},
input:{flex:1, borderWidth:1, borderColor:'#ddd', padding:8, borderRadius:6, marginRight:8},
inputSmall:{width:80, borderWidth:1, borderColor:'#ddd', padding:8, borderRadius:6, marginRight:6},
btn:{backgroundColor:'#007bff', padding:10, borderRadius:6},
btnText:{color:'#fff', fontWeight:'700'}
});