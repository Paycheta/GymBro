import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import WorkoutCard from '../components/WorkoutCard';

const STORAGE_KEY = '@gymbro_data_v1';

function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 9);
}

export default function HomeScreen() {
  const [data, setData] = useState({ days: [] });
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  const selectedDay = data.days.find(d => d.id === selectedDayId);

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      setData(JSON.parse(json));
    } else {
      const initial = {
        days: [
          { id: 'day1', name: 'Day 1 - Push', workouts: [] },
          { id: 'day2', name: 'Day 2 - Pull', workouts: [] },
          { id: 'day3', name: 'Day 3 - Legs & Core', workouts: [] },
        ],
      };
      setData(initial);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  }

  async function save(newData) {
    setData(newData);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }

  /* ---------------- IMAGE PICKER ---------------- */
  async function pickWorkoutImage() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Camera access is required.');
      return;
    }

    Alert.alert('Add photo', 'Choose source', [
      {
        text: 'Camera',
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
          if (!result.canceled) setImageUri(result.assets[0].uri);
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
          if (!result.canceled) setImageUri(result.assets[0].uri);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  /* ---------------- ADD WORKOUT (minimal) ---------------- */
  function addWorkout() {
    if (!selectedDayId) return;
    if (!name) {
      Alert.alert('Workout name required');
      return;
    }

    const workout = {
      id: uid('w'),
      name: name.trim(),
      imageUri: imageUri ?? undefined,
      logs: [],
    };

    const newData = {
      ...data,
      days: data.days.map(d =>
        d.id === selectedDayId
          ? { ...d, workouts: [...d.workouts, workout] }
          : d
      ),
    };

    setName('');
    setImageUri(null);
    setModalOpen(false);
    save(newData);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>GymBro</Text>

      {/* Day selector */}
      <View style={styles.row}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 8 }}
        >
          {data.days.map(d => (
            <TouchableOpacity
              key={d.id}
              style={[
                styles.dayBtn,
                selectedDayId === d.id && styles.dayBtnActive,
              ]}
              onPress={() => setSelectedDayId(d.id)}
            >
              <Text style={styles.dayText}>{d.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {!selectedDay ? (
        <View style={styles.center}>
          <Text>Select a day</Text>
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={styles.addWorkoutBtn}
            onPress={() => setModalOpen(true)}
          >
            <Text style={styles.addWorkoutText}>＋ Add workout</Text>
          </TouchableOpacity>

          <FlatList
            data={selectedDay.workouts}
            extraData={data}   // ⭐ forces instant UI update
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <WorkoutCard
                workout={item}
                selectedDayId={selectedDayId}
                data={data}
                save={save}
              />
            )}
            ListEmptyComponent={
              <Text style={{ padding: 12 }}>No workouts yet</Text>
            }
          />
        </>
      )}

      {/* MODAL */}
      <Modal visible={modalOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add workout</Text>

            {/* IMAGE PICKER */}
            {imageUri ? (
              <TouchableOpacity onPress={pickWorkoutImage}>
                <Image source={{ uri: imageUri }} style={styles.thumb} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={pickWorkoutImage} style={styles.addPhoto}>
                <Text style={styles.addPhotoText}>＋{"\n"}Add photo</Text>
              </TouchableOpacity>
            )}

            {/* WORKOUT NAME */}
            <TextInput
              placeholder="Workout name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={addWorkout}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setModalOpen(false); setImageUri(null); }}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', padding: 12 },

  row: { paddingHorizontal: 8 },
  dayBtn: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginRight: 8,
  },
  dayBtnActive: { backgroundColor: '#cde' },
  dayText: { fontWeight: '600' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  addWorkoutBtn: {
    margin: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  addWorkoutText: { color: '#fff', fontWeight: '700', textAlign: 'center' },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  modal: {
    margin: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
  },
  saveText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  cancel: { textAlign: 'center', marginTop: 10, color: '#666' },

  addPhoto: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  addPhotoText: { fontSize: 16, fontWeight: '700' },
  thumb: { width: 60, height: 60, borderRadius: 6, marginBottom: 10 },
});
