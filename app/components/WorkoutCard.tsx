import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';

function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 9);
}

export default function WorkoutCard({
  workout,
  selectedDayId,
  data,
  save,
}) {
  const [open, setOpen] = useState(false);
  const [kg, setKg] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  const logs = workout.logs || [];
  const lastLog = logs[logs.length - 1];

  /* ---------- helpers ---------- */

  function updateWorkout(updatedWorkout) {
    return {
      ...data,
      days: data.days.map(day =>
        day.id === selectedDayId
          ? {
              ...day,
              workouts: day.workouts.map(w =>
                w.id === workout.id ? updatedWorkout : w
              ),
            }
          : day
      ),
    };
  }

  /* ---------- repeat ---------- */

  function repeatWorkout() {
    if (!lastLog) {
      Alert.alert('No previous data');
      return;
    }

    const newLog = {
      ...lastLog,
      id: uid('l'),
      date: new Date().toISOString().slice(0, 10),
    };

    save(
      updateWorkout({
        ...workout,
        logs: [...logs, newLog],
      })
    );
  }

  /* ---------- add / edit ---------- */

  function openAddEdit() {
    if (lastLog) {
      setKg(String(lastLog.kg));
      setSets(String(lastLog.sets));
      setReps(String(lastLog.reps));
    }
    setOpen(true);
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

    setKg('');
    setSets('');
    setReps('');
    setOpen(false);

    save(
      updateWorkout({
        ...workout,
        logs: [...logs, newLog],
      })
    );
  }

  /* ---------- delete last log ---------- */

  function deleteLastLog() {
    if (!lastLog) return;

    Alert.alert(
      'Delete last entry?',
      `${lastLog.kg}kg × ${lastLog.sets} × ${lastLog.reps}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            save(
              updateWorkout({
                ...workout,
                logs: logs.slice(0, -1),
              })
            );
          },
        },
      ]
    );
  }

  /* ---------- delete workout ---------- */

  function deleteWorkout() {
    Alert.alert(
      'Delete workout?',
      `Delete "${workout.name}" and all history?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            save({
              ...data,
              days: data.days.map(day =>
                day.id === selectedDayId
                  ? {
                      ...day,
                      workouts: day.workouts.filter(
                        w => w.id !== workout.id
                      ),
                    }
                  : day
              ),
            });
          },
        },
      ]
    );
  }

  return (
    <View style={styles.card}>
      {/* WORKOUT TITLE — long press deletes workout */}
      <TouchableOpacity onLongPress={deleteWorkout}>
        <Text style={styles.title}>{workout.name}</Text>
      </TouchableOpacity>

      {/* LAST LOG — long press deletes last log */}
      <TouchableOpacity onLongPress={deleteLastLog}>
        {lastLog ? (
          <Text style={styles.last}>
            Last: {lastLog.kg}kg × {lastLog.sets} × {lastLog.reps} ({lastLog.date})
          </Text>
        ) : (
          <Text style={styles.last}>No data yet</Text>
        )}
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.repeatBtn} onPress={repeatWorkout}>
          <Text style={styles.btnText}>REPEAT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addBtn} onPress={openAddEdit}>
          <Text style={styles.btnText}>ADD / EDIT</Text>
        </TouchableOpacity>
      </View>

      {open && (
        <View style={styles.inputs}>
          <TextInput
            placeholder="kg"
            placeholderTextColor="#999"
            value={kg}
            onChangeText={setKg}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="sets"
            placeholderTextColor="#999"
            value={sets}
            onChangeText={setSets}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="reps"
            placeholderTextColor="#999"
            value={reps}
            onChangeText={setReps}
            keyboardType="numeric"
            style={styles.input}
          />
          <TouchableOpacity style={styles.saveBtn} onPress={addManual}>
            <Text style={styles.btnText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fafafa',
    margin: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  title: { fontSize: 16, fontWeight: '700' },
  last: { fontSize: 13, marginVertical: 6 },
  actions: { flexDirection: 'row', marginTop: 8 },
  repeatBtn: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 6,
    marginRight: 6,
  },
  addBtn: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
  },
  saveBtn: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 6,
    marginTop: 6,
  },
  btnText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  inputs: { marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
});
