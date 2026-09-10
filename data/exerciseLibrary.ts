import skrabenkpress from "../assets/exercises/incline_dumbbell_press.gif";
import kneboy from "../assets/exercises/kneboy.gif";

export type Exercise = {
  id: string;
  name: string;
  category: "Bryst" | "Rygg" | "Skuldre" | "Armer" | "Bein" | "Kjerne";
  muscleGroup: string;
  equipment: string;
  image?: any;
};

export const exerciseLibrary: Exercise[] = [
  // CHEST
  {
    id: "incline_dumbbell_press",
    name: "Skrå benkpress med manualer",
    category: "Bryst",
    muscleGroup: "Bryst",
    equipment: "Manualer",
    image: skrabenkpress,
  },
  {
    id: "bench_press",
    name: "Benkpress",
    category: "Bryst",
    muscleGroup: "Bryst",
    equipment: "Stang",
  },
  {
    id: "chest_press",
    name: "Chest press",
    category: "Bryst",
    muscleGroup: "Bryst",
    equipment: "Maskin",
  },
  {
    id: "cable_fly",
    name: "Kabel-fly",
    category: "Bryst",
    muscleGroup: "Bryst",
    equipment: "Kabel",
  },
  {
    id: "dumbbell_fly",
    name: "Hantelfly",
    category: "Bryst",
    muscleGroup: "Bryst",
    equipment: "Manualer",
  },

  // SHOULDERS
  {
    id: "seated_shoulder_press",
    name: "Sittende skulderpress",
    category: "Skuldre",
    muscleGroup: "Skuldre",
    equipment: "Manualer",
  },
  {
    id: "lateral_raise",
    name: "Sidehev",
    category: "Skuldre",
    muscleGroup: "Skuldre",
    equipment: "Manualer",
  },
  {
    id: "face_pull",
    name: "Face pull",
    category: "Skuldre",
    muscleGroup: "Skuldre",
    equipment: "Kabel",
  },

  // TRICEPS
  {
    id: "triceps_pushdown",
    name: "Triceps pushdown",
    category: "Armer",
    muscleGroup: "Triceps",
    equipment: "Kabel",
  },
  {
    id: "overhead_triceps_extension",
    name: "Overhead triceps extension",
    category: "Armer",
    muscleGroup: "Triceps",
    equipment: "Kabel",
  },

  // BACK
  {
    id: "wide_grip_lat_pulldown",
    name: "Nedtrekk bredt grep",
    category: "Rygg",
    muscleGroup: "Rygg",
    equipment: "Kabel",
  },
  {
    id: "seated_cable_row",
    name: "Sittende kabelroing",
    category: "Rygg",
    muscleGroup: "Rygg",
    equipment: "Kabel",
  },
  {
    id: "standing_row",
    name: "Stående roing",
    category: "Rygg",
    muscleGroup: "Rygg",
    equipment: "Stang / Smith",
  },

  // BICEPS
  {
    id: "biceps_curl",
    name: "Biceps curl",
    category: "Armer",
    muscleGroup: "Biceps",
    equipment: "Manualer",
  },
  {
    id: "hammer_curl",
    name: "Hammer curl",
    category: "Armer",
    muscleGroup: "Biceps",
    equipment: "Manualer",
  },

  // LEGS
  {
    id: "squat",
    name: "Knebøy",
    category: "Bein",
    muscleGroup: "Forside lår + setemuskler",
    equipment: "Stang",
    image: kneboy,
  },
  {
    id: "leg_press",
    name: "Leg press",
    category: "Bein",
    muscleGroup: "Forside lår + setemuskler",
    equipment: "Maskin",
  },
  {
    id: "romanian_deadlift",
    name: "Rumensk markløft",
    category: "Bein",
    muscleGroup: "Bakside lår + setemuskler",
    equipment: "Stang / Manualer",
  },
  {
    id: "lunges",
    name: "Utfall",
    category: "Bein",
    muscleGroup: "Forside lår + setemuskler",
    equipment: "Manualer",
  },
  {
    id: "leg_extension",
    name: "Leg extension",
    category: "Bein",
    muscleGroup: "Forside lår",
    equipment: "Maskin",
  },
  {
    id: "leg_curl",
    name: "Leg curl",
    category: "Bein",
    muscleGroup: "Bakside lår",
    equipment: "Maskin",
  },
  {
    id: "calf_raise",
    name: "Tåhev",
    category: "Bein",
    muscleGroup: "Legger",
    equipment: "Maskin / Manualer",
  },

  // CORE
  {
    id: "plank",
    name: "Planke",
    category: "Kjerne",
    muscleGroup: "Kjerne",
    equipment: "Kroppsvekt",
  },
  {
    id: "leg_raise",
    name: "Benhev",
    category: "Kjerne",
    muscleGroup: "Kjerne",
    equipment: "Kroppsvekt",
  },
];
