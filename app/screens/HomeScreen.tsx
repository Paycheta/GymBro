import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import WorkoutCard from '../components/WorkoutCard';

const STORAGE_KEY = '@gymbro_data_v1';

function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 9);
}

export default function HomeScreen() {
  const [data, setData] = useState<{ days: any[] }>({ days: [] });
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');

  const hour = new Date().getHours();
  const isDayMode = hour >= 6 && hour < 18;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
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
    } catch (e) {
      console.log('Error loading data', e);
    }
  }

  async function save(newData: any) {
    setData(newData);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.log('Error saving data', e);
    }
  }

  const selectedDay = data.days.find(d => d.id === selectedDayId);

  function getNextDayId() {
    const daysWithLogs = data.days
      .map(d => {
        const lastLog = d.workouts
          .flatMap(w => w.logs || [])
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        return { dayId: d.id, lastDate: lastLog ? new Date(lastLog.date) : null };
      })
      .sort((a, b) => (b.lastDate ? b.lastDate.getTime() : 0) - (a.lastDate ? a.lastDate.getTime() : 0));

    if (!daysWithLogs.length || !daysWithLogs[0].lastDate) return 'day1';

    const lastDayIndex = data.days.findIndex(d => d.id === daysWithLogs[0].dayId);
    return data.days[(lastDayIndex + 1) % data.days.length].id;
  }

  const nextDayId = getNextDayId();

  function addWorkout() {
    if (!selectedDayId || !name.trim()) {
      Alert.alert('Enter workout name');
      return;
    }

    const workout = { id: uid('w'), name: name.trim(), logs: [] };
    const newData = {
      ...data,
      days: data.days.map(d =>
        d.id === selectedDayId ? { ...d, workouts: [...d.workouts, workout] } : d
      ),
    };

    setName('');
    setModalOpen(false);
    save(newData);
  }

  const dayTypeStyles = {
    'Push': ['#ff7e5f', '#feb47b'],
    'Pull': ['#6a11cb', '#2575fc'],
    'Legs': ['#43cea2', '#185a9d'],
  };

  const getDayType = (dayName: string) => {
    if (dayName.includes('Push')) return 'Push';
    if (dayName.includes('Pull')) return 'Pull';
    return 'Legs';
  };

  const getDayIcon = (dayName: string) => {
    const type = getDayType(dayName);
    if (type === 'Push') return '💪';
    if (type === 'Pull') return '🏋️';
    return '🦵';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDayMode ? '#f0f4f8' : '#1e1e2f' }}>
      <LinearGradient
        colors={isDayMode ? ['#f0f4f8', '#e0ebf5'] : ['#1e1e2f', '#2a2a3d']}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          {selectedDayId && (
            <TouchableOpacity onPress={() => setSelectedDayId(null)}>
              <Text style={[styles.backArrow, { color: isDayMode ? '#222' : '#fff' }]}>←</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setSelectedDayId(null)}>
            <Text style={[styles.title, { color: isDayMode ? '#222' : '#fff' }]}>GymBro</Text>
          </TouchableOpacity>
        </View>

        {/* Main content */}
        {!selectedDayId ? (
          <ScrollView contentContainerStyle={styles.daysContainer}>
            <Text style={[styles.greeting, { color: isDayMode ? '#222' : '#fff' }]}>
              {isDayMode ? 'Good Morning, Pavle!' : 'Good Evening, Pavle!'}
            </Text>
            {data.days.map(d => {
              const type = getDayType(d.name);
              const gradientColors = dayTypeStyles[type];
              return (
                <TouchableOpacity key={d.id} onPress={() => setSelectedDayId(d.id)}>
                  <LinearGradient
                    colors={gradientColors}
                    style={[styles.dayCard, nextDayId === d.id ? styles.dayCardNext : {}]}
                  >
                    <Text style={styles.dayText}>{getDayIcon(d.name)} {d.name}</Text>
                    <Text style={styles.workoutCount}>{d.workouts.length} workout{d.workouts.length !== 1 ? 's' : ''}</Text>
                    {nextDayId === d.id && <Text style={styles.nextBadge}>Next Up</Text>}
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <View style={{ flex: 1, paddingHorizontal: 16 }}>
            <TouchableOpacity style={styles.addWorkoutBtn} onPress={() => setModalOpen(true)}>
              <Text style={styles.addWorkoutText}>＋ Add workout</Text>
            </TouchableOpacity>

            <FlatList
              data={selectedDay?.workouts || []}
              extraData={data}
              keyExtractor={i => i.id}
              renderItem={({ item }) => (
                <WorkoutCard workout={item} selectedDayId={selectedDayId} data={data} save={save} />
              )}
              ListEmptyComponent={<Text style={{ padding: 12, color: isDayMode ? '#222' : '#fff' }}>No workouts yet</Text>}
              contentContainerStyle={{ paddingBottom: 80 }}
            />
          </View>
        )}

        {/* Modal */}
        <Modal visible={modalOpen} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Add workout</Text>
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
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 36, // safe below notch
    paddingBottom: 8,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backArrow: { fontSize: 20, marginRight: 8 },
  title: { fontSize: 26, fontWeight: '700' },
  greeting: { fontSize: 20, fontWeight: '600', marginBottom: 16, paddingHorizontal: 4 },

  daysContainer: { paddingTop: 20 },
  dayCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  dayCardNext: { borderWidth: 2, borderColor: '#fff' },
  dayText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  workoutCount: { color: '#fff', marginTop: 4 },
  nextBadge: { marginTop: 8, fontSize: 14, fontWeight: '700', color: '#fff' },

  addWorkoutBtn: { marginVertical: 12, padding: 12, borderRadius: 8, backgroundColor: '#000' },
  addWorkoutText: { color: '#fff', fontWeight: '700', textAlign: 'center' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center' },
  modal: { margin: 20, padding: 16, backgroundColor: '#fff', borderRadius: 12 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, marginBottom: 12 },
  saveBtn: { backgroundColor: '#000', padding: 12, borderRadius: 8 },
  saveText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  cancel: { textAlign: 'center', marginTop: 10, color: '#666' },
});