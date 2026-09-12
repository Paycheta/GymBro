import benkpress from "../assets/exercises/bench_press.gif";
import bicepscurl from "../assets/exercises/biceps_curl.gif";
import cablefly from "../assets/exercises/cable_fly.gif";
import calfraise from "../assets/exercises/calf_raise.gif";
import chestpress from "../assets/exercises/chest_press.gif";
import dumbbellfly from "../assets/exercises/dumbbell_fly.gif";
import facepull from "../assets/exercises/face_pull.gif";
import hammercurl from "../assets/exercises/hammer_curl.gif";
import skrabenkpress from "../assets/exercises/incline_dumbbell_press.gif";
import lateralraise from "../assets/exercises/lateral_raise.gif";
import legcurl from "../assets/exercises/leg_curl.gif";
import legextension from "../assets/exercises/leg_extension.gif";
import legpress from "../assets/exercises/leg_press.gif";
import legraise from "../assets/exercises/leg_raise.gif";
import lunges from "../assets/exercises/lunges.gif";
import overheadtricepsextension from "../assets/exercises/overhead_triceps_extension.gif";
import plank from "../assets/exercises/plank.gif";
import romaniandeadlift from "../assets/exercises/romanian_deadlift.gif";
import seatedcablerow from "../assets/exercises/seated_cable_row.gif";
import seatedshoulderpress from "../assets/exercises/seated_shoulder_press.gif";
import kneboy from "../assets/exercises/squat.gif";
import standingrow from "../assets/exercises/standing_row.gif";
import tricepspushdown from "../assets/exercises/triceps_pushdown.gif";
import widegriplatpulldown from "../assets/exercises/wide_grip_lat_pulldown.gif";

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
    image: benkpress,
  },
  {
    id: "chest_press",
    name: "Chest press",
    category: "Bryst",
    muscleGroup: "Bryst",
    equipment: "Maskin",
    image: chestpress,
  },
  {
    id: "cable_fly",
    name: "Kabel-fly",
    category: "Bryst",
    muscleGroup: "Bryst",
    equipment: "Kabel",
    image: cablefly,
  },
  {
    id: "dumbbell_fly",
    name: "Hantelfly",
    category: "Bryst",
    muscleGroup: "Bryst",
    equipment: "Manualer",
    image: dumbbellfly,
  },

  // SHOULDERS
  {
    id: "seated_shoulder_press",
    name: "Sittende skulderpress",
    category: "Skuldre",
    muscleGroup: "Skuldre",
    equipment: "Manualer",
    image: seatedshoulderpress,
  },
  {
    id: "lateral_raise",
    name: "Sidehev",
    category: "Skuldre",
    muscleGroup: "Skuldre",
    equipment: "Manualer",
    image: lateralraise,
  },
  {
    id: "face_pull",
    name: "Face pull",
    category: "Skuldre",
    muscleGroup: "Skuldre",
    equipment: "Kabel",
    image: facepull,
  },

  // TRICEPS
  {
    id: "triceps_pushdown",
    name: "Triceps pushdown",
    category: "Armer",
    muscleGroup: "Triceps",
    equipment: "Kabel",
    image: tricepspushdown,
  },
  {
    id: "overhead_triceps_extension",
    name: "Overhead triceps extension",
    category: "Armer",
    muscleGroup: "Triceps",
    equipment: "Kabel",
    image: overheadtricepsextension,
  },

  // BACK
  {
    id: "wide_grip_lat_pulldown",
    name: "Nedtrekk bredt grep",
    category: "Rygg",
    muscleGroup: "Rygg",
    equipment: "Kabel",
    image: widegriplatpulldown,
  },
  {
    id: "seated_cable_row",
    name: "Sittende kabelroing",
    category: "Rygg",
    muscleGroup: "Rygg",
    equipment: "Kabel",
    image: seatedcablerow,
  },
  {
    id: "standing_row",
    name: "Stående roing",
    category: "Rygg",
    muscleGroup: "Rygg",
    equipment: "Stang / Smith",
    image: standingrow,
  },

  // BICEPS
  {
    id: "biceps_curl",
    name: "Biceps curl",
    category: "Armer",
    muscleGroup: "Biceps",
    equipment: "Manualer",
    image: bicepscurl,
  },
  {
    id: "hammer_curl",
    name: "Hammer curl",
    category: "Armer",
    muscleGroup: "Biceps",
    equipment: "Manualer",
    image: hammercurl,
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
    image: legpress,
  },
  {
    id: "romanian_deadlift",
    name: "Rumensk markløft",
    category: "Bein",
    muscleGroup: "Bakside lår + setemuskler",
    equipment: "Stang / Manualer",
    image: romaniandeadlift,
  },
  {
    id: "lunges",
    name: "Utfall",
    category: "Bein",
    muscleGroup: "Forside lår + setemuskler",
    equipment: "Manualer",
    image: lunges,
  },
  {
    id: "leg_extension",
    name: "Leg extension",
    category: "Bein",
    muscleGroup: "Forside lår",
    equipment: "Maskin",
    image: legextension,
  },
  {
    id: "leg_curl",
    name: "Leg curl",
    category: "Bein",
    muscleGroup: "Bakside lår",
    equipment: "Maskin",
    image: legcurl,
  },
  {
    id: "calf_raise",
    name: "Tåhev",
    category: "Bein",
    muscleGroup: "Legger",
    equipment: "Maskin / Manualer",
    image: calfraise,
  },

  // CORE
  {
    id: "plank",
    name: "Planke",
    category: "Kjerne",
    muscleGroup: "Kjerne",
    equipment: "Kroppsvekt",
    image: plank,
  },
  {
    id: "leg_raise",
    name: "Benhev",
    category: "Kjerne",
    muscleGroup: "Kjerne",
    equipment: "Kroppsvekt",
    image: legraise,
  },
];
