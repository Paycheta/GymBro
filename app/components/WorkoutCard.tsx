import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';

function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 9);
}

export default function WorkoutCard({ workout, selectedDay, data, save }) {
  const [open, setOpen] = useState(false);
  const [kg, setKg] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  const lastLog = workout.logs?.[workout.logs.length - 1];

  function repeatWorkout() {
    if (!lastLog) {
      Alert.alert('No previous data', 'Add the first workout first.');
      return;
    }

    const newLog = {
      ...lastLog,
      id: uid('l'),
      date: new Date().toISOString().slice(0, 10),
    };

    const newData = {
      ...data,
      days: data.days.map(d =>
        d.id === selectedDay.id
          ? {
              ...d,
              workouts: d.workouts.map(w =>
                w.id === workout.id
                  ? { ...w, logs: [...(w.logs || []), newLog] }
                  : w
              ),
            }
          : d
      ),
    };

    save(newData);
  }

  function addManual() {
    if (!kg || !sets || !reps) {
      Alert.alert('Fill all fields');
      return;
    }

    const newLog = {
      id: uid('l'),
      kg: Number(kg),
      sets: Number(sets),
      reps: Number(reps),
      date: new Date().toISOString().slice(0, 10),
    };

    const newData = {
      ...data,
      days: data.days.map(d =>
        d.id === selectedDay.id
          ? {
              ...d,
              workouts: d.workouts.map(w =>
                w.id === workout.id
                  ? { ...w, logs: [...(w.logs || []), newLog] }
                  : w
              ),
            }
          : d
      ),
    };

    setKg('');
    setSets('');
    setReps('');
    setOpen(false);
    save(newData);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{workout.name}</Text>

      {lastLog ? (
        <Text style={styles.last}>
          Last: {lastLog.kg}kg × {lastLog.sets} × {lastLog.reps} ({lastLog.date})
        </Text>
      ) : (
        <Text style={styles.last}>No data yet</Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.repeatBtn} onPress={repeatWorkout}>
          <Text style={styles.btnText}>REPEAT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addBtn} onPress={() => setOpen(!open)}>
          <Text style={styles.btnText}>ADD / EDIT</Text>
        </TouchableOpacity>
      </View>

      {open && (
        <View style={styles.inputs}>
          <TextInput placeholder="kg" placeholderTextColor="#999" value={kg} onChangeText={setKg} keyboardType="numeric" style={styles.input} />
          <TextInput placeholder="sets" placeholderTextColor="#999" value={sets} onChangeText={setSets} keyboardType="numeric" style={styles.input} />
          <TextInput placeholder="reps" placeholderTextColor="#999" value={reps} onChangeText={setReps} keyboardType="numeric" style={styles.input} />
          <TouchableOpacity style={styles.saveBtn} onPress={addManual}>
            <Text style={styles.btnText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderRadius: 10, backgroundColor: '#fafafa', margin: 8, borderWidth: 1, borderColor: '#eee' },
  title: { fontSize: 16, fontWeight: '700' },
  last: { fontSize: 13, marginVertical: 6 },
  actions: { flexDirection: 'row', marginTop: 8 },
  repeatBtn: { flex: 1, backgroundColor: '#28a745', padding: 10, borderRadius: 6, marginRight: 6 },
  addBtn: { flex: 1, backgroundColor: '#007bff', padding: 10, borderRadius: 6 },
  saveBtn: { backgroundColor: '#000', padding: 10, borderRadius: 6, marginTop: 6 },
  btnText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  inputs: { marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginBottom: 6 },
});
