import * as FileSystem from "expo-file-system";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9);
}

export default function WorkoutCard({ workout, selectedDayId, data, save }) {
  const [open, setOpen] = useState(false);
  const [kg, setKg] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [animate, setAnimate] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const logs = workout.logs || [];
  const lastLog = logs[logs.length - 1];

  const isCompletedToday = workout.logs?.some((l: any) => l.date === today);

  /* ---------- helpers ---------- */
  function updateWorkout(updatedWorkout) {
    return {
      ...data,
      days: data.days.map((day) =>
        day.id === selectedDayId
          ? {
              ...day,
              workouts: day.workouts.map((w) =>
                w.id === workout.id ? updatedWorkout : w,
              ),
            }
          : day,
      ),
    };
  }

  /* ---------------- IMAGE PICKER ---------------- */
  async function pickImage() {
    Alert.alert("Add photo", "Choose source", [
      {
        text: "Camera",
        onPress: async () => {
          const permission = await ImagePicker.requestCameraPermissionsAsync();

          if (!permission.granted) {
            Alert.alert("Permission needed", "Camera access is required.");
            return;
          }

          const result = await ImagePicker.launchCameraAsync({
            quality: 0.5,
          });

          if (!result.canceled && result.assets?.length > 0) {
            const uri = result.assets[0].uri;
            await saveImage(uri);
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

          if (!permission.granted) {
            Alert.alert(
              "Permission needed",
              "Photo library access is required.",
            );
            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            quality: 0.5,
          });

          if (!result.canceled && result.assets?.length > 0) {
            const uri = result.assets[0].uri;
            await saveImage(uri);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  /* ---------------- SAVE IMAGE PERMANENTLY ---------------- */
  async function saveImage(uri: string) {
    try {
      if (!FileSystem.documentDirectory) {
        Alert.alert("Error", "Could not access app storage.");
        return;
      }

      const extension =
        uri.split(".").pop()?.split("?")[0].toLowerCase() || "jpg";

      const fileName = `workout_${workout.id}_${Date.now()}.${extension}`;

      const destination = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.copyAsync({
        from: uri,
        to: destination,
      });

      save(
        updateWorkout({
          ...workout,
          imageUri: destination,
        }),
      );
    } catch (error) {
      console.log("Error saving image:", error);
      Alert.alert("Error", "Could not save the image.");
    }
  }

  /* ---------- repeat ---------- */
  function repeatWorkout() {
    if (!lastLog) {
      Alert.alert("No previous data");
      return;
    }

    const newLog = {
      ...lastLog,
      id: uid("l"),
      date: new Date().toISOString().slice(0, 10),
    };

    save(
      updateWorkout({
        ...workout,
        logs: [...logs, newLog],
      }),
    );

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
      Alert.alert("Fill all fields");
      return;
    }

    const newLog = {
      id: uid("l"),
      kg: Number(kg),
      sets: Number(sets),
      reps: Number(reps),
      date: new Date().toISOString().slice(0, 10),
    };

    setKg("");
    setSets("");
    setReps("");
    setOpen(false);

    save(
      updateWorkout({
        ...workout,
        logs: [...logs, newLog],
      }),
    );

    setAnimate(true);

    setTimeout(() => setAnimate(false), 300);

    setTimeout(() => {
      if (isCompletedToday) return;
      // small visual delay so state updates first
    }, 50);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  /* ---------- delete last log ---------- */
  function deleteLastLog() {
    if (!lastLog) return;

    Alert.alert(
      "Delete last entry?",
      `${lastLog.kg}kg × ${lastLog.sets} × ${lastLog.reps}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            save(
              updateWorkout({
                ...workout,
                logs: logs.slice(0, -1),
              }),
            );
          },
        },
      ],
    );
  }

  /* ---------- delete workout ---------- */
  function deleteWorkout() {
    Alert.alert(
      "Delete workout?",
      `Delete "${workout.name}" and all history?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            save({
              ...data,
              days: data.days.map((day) =>
                day.id === selectedDayId
                  ? {
                      ...day,
                      workouts: day.workouts.filter((w) => w.id !== workout.id),
                    }
                  : day,
              ),
            });
          },
        },
      ],
    );
  }

  return (
    <View
      style={[
        styles.card,
        isCompletedToday && styles.cardDone,
        animate && styles.cardPop,
      ]}
    >
      {/* WORKOUT HEADER (image + title) */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {workout.imageUri ? (
          <TouchableOpacity
            onPress={() => setPreviewImage(workout.imageUri)}
            onLongPress={pickImage}
          >
            <Image source={{ uri: workout.imageUri }} style={styles.thumb} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={pickImage} style={styles.addPhoto}>
            <Text style={styles.addPhotoText}>＋</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onLongPress={deleteWorkout}>
          <Text style={styles.title}>
            {isCompletedToday ? "✅ " : ""}
            {String(workout.name ?? "")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* LAST LOG — long press deletes last log */}
      <TouchableOpacity onLongPress={deleteLastLog}>
        {lastLog ? (
          <Text style={styles.last}>
            Last: {lastLog.kg}kg × {lastLog.sets} × {lastLog.reps} (
            {lastLog.date})
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

      {/* IMAGE PREVIEW MODAL */}
      <Modal visible={!!previewImage} transparent animationType="fade">
        <TouchableOpacity
          style={styles.previewBackdrop}
          activeOpacity={1}
          onPress={() => setPreviewImage(null)}
        >
          {previewImage && (
            <Image
              source={{ uri: previewImage }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fafafa",
    margin: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },

  last: {
    fontSize: 13,
    marginVertical: 6,
  },

  actions: {
    flexDirection: "row",
    marginTop: 8,
  },

  repeatBtn: {
    flex: 1,
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 6,
    marginRight: 6,
  },

  addBtn: {
    flex: 1,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 6,
  },

  saveBtn: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 6,
    marginTop: 6,
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },

  inputs: {
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
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
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },

  addPhotoText: {
    fontSize: 22,
    fontWeight: "700",
  },

  /* preview modal */
  previewBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  previewImage: {
    width: "70%",
    height: "70%",
    borderRadius: 10,
  },

  cardDone: {
    borderColor: "#28a745",
    borderWidth: 2,
    backgroundColor: "#f3fff5",
  },

  cardPop: {
    transform: [{ scale: 1.02 }],
  },
});
