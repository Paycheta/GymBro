import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

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

  /* ---------------- IMAGE PICKER ---------------- */

  async function pickImage() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Camera access is required.');
      return;
    }

    Alert.alert('Add photo', 'Choose source', [
      {
        text: 'Camera',
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            quality: 0.5,
          });
          if (!result.canceled) saveImage(result.assets[0].uri);
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            quality: 0.5,
          });
          if (!result.canceled) saveImage(result.assets[0].uri);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  function saveImage(uri: string) {
    save(
      updateWorkout({
        ...workout,
        imageUri: uri,
      })
    );
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
      {/* WORKOUT HEADER (image + title) */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {workout.imageUri ? (
          <TouchableOpacity onPress={pickImage}>
            <Image source={{ uri: workout.imageUri }} style={styles.thumb} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={pickImage} style={styles.addPhoto}>
            <Text style={styles.addPhotoText}>＋</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onLongPress={deleteWorkout}>
          <Text style={styles.title}>{workout.name}</Text>
        </TouchableOpacity>
      </View>

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
  title: { fontSize: 16, fontWeight: '700', marginLeft: 10 },
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

  /* picture styles */
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 6,
  },
  addPhoto: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: 22,
    fontWeight: '700',
  },
});
