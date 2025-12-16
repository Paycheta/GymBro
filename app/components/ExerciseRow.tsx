// components/ExerciseRow.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExerciseRow({ exercise }){
return (
<View style={styles.exerciseRow}>
<Text style={{fontWeight:'600'}}>{exercise.name}</Text>
<Text>{exercise.kg}kg • {exercise.sets}x{exercise.reps} • {exercise.date}</Text>
</View>
);
}

const styles = StyleSheet.create({
exerciseRow:{flexDirection:'row', justifyContent:'space-between', marginTop:6}
});
