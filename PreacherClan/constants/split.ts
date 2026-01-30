export interface workoutSplitHomeScreen{
    day : string ;
    title : string ;
    image : string ; 


}
export interface ExerciseDetails {
  name: string;
  sets: number;
  reps: number;
  description?: string;
  image?: string;
  youtube?: string;
  target_muscles?: string[];
  equipment?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
   instructions?: string[];
}
export interface WorkoutSplit {
  split_id: string;
  split_name: string;
  creator: string;
  creatorId? : string ;
  description: string;
  exercises: SplitExercise[];
  cover_image?: string;
  trending?: boolean;
  trusted?: boolean;
  verified? : boolean;
}

export interface SplitExercise extends ExerciseDetails {
    day : string ;

}


export const MOCK_SPLITS: WorkoutSplit[] = [
  {
    split_id: "odin_strength_5day",
    split_name: "Odin’s Power Forge",
    creator: "Ragnar Lothbrok",
    description:
      "A 5-day strength-focused warrior split forged in the halls of Valhalla. Built for raw power and progressive overload.",
    trending: true,
    trusted: true,
    cover_image:
      "https://images.unsplash.com/photo-1579758629938-03607ccdbaba",

    exercises: [
      // MONDAY
      {
        day: "Mo",
        name: "Barbell Bench Press",
        sets: 5,
        reps: 5,
        difficulty: "Intermediate",
        target_muscles: ["Chest", "Triceps", "Front Delts"],
        equipment: "Barbell",
        youtube: "https://youtu.be/gRVjAtPip0Y",
        description:
          "A foundational Viking pressing movement to build relentless chest strength.",
      },
      {
        day: "Mo",
        name: "Incline Dumbbell Press",
        sets: 4,
        reps: 8,
        difficulty: "Intermediate",
        equipment: "Dumbbells",
        target_muscles: ["Upper Chest", "Shoulders"],
        youtube: "https://youtu.be/8iPEnn-ltC8",
      },

      // TUESDAY
      {
        day: "Tu",
        name: "Back Squat",
        sets: 5,
        reps: 5,
        difficulty: "Intermediate",
        target_muscles: ["Quads", "Glutes", "Core"],
        equipment: "Barbell",
        youtube: "https://youtu.be/YaXPRqUwItQ",
      },
      {
        day: "Tu",
        name: "Romanian Deadlift",
        sets: 4,
        reps: 8,
        difficulty: "Intermediate",
        equipment: "Barbell",
        target_muscles: ["Hamstrings", "Glutes", "Lower Back"],
        youtube: "https://youtu.be/7j-2_s8fOPs",
      },

      // WEDNESDAY
      {
        day: "We",
        name: "Overhead Press",
        sets: 5,
        reps: 5,
        difficulty: "Intermediate",
        equipment: "Barbell",
        target_muscles: ["Shoulders", "Triceps"],
        youtube: "https://youtu.be/2yjwXTZQDDI",
      },

      // FRIDAY
      {
        day: "Fr",
        name: "Conventional Deadlift",
        sets: 5,
        reps: 3,
        difficulty: "Advanced",
        equipment: "Barbell",
        target_muscles: ["Posterior Chain", "Core", "Upper Back"],
        youtube: "https://youtu.be/-4qRntuXBSc",
      },
    ],
  },

  {
    split_id: "valkyrie_sculpt_hyper",
    split_name: "Valkyrie Sculpt Split",
    creator: "Lagertha",
    trusted: true,
    description:
      "A hypertrophy-focused split for fearless lifters seeking sculpted strength and warrior endurance.",
    cover_image:
      "https://images.unsplash.com/photo-1558611848-73f7eb4001a1",

    exercises: [
      {
        day: "Mo",
        name: "Incline Dumbbell Press",
        sets: 4,
        reps: 12,
        difficulty: "Beginner",
        equipment: "Dumbbells",
        target_muscles: ["Chest", "Shoulders"],
        youtube: "https://youtu.be/8iPEnn-ltC8",
      },
      {
        day: "Tu",
        name: "Goblet Squat",
        sets: 4,
        reps: 15,
        equipment: "Dumbbell",
        difficulty: "Beginner",
        target_muscles: ["Quads", "Glutes"],
        youtube: "https://youtu.be/6xwGFn-J_QM",
      },
      {
        day: "Th",
        name: "Lat Pulldown",
        sets: 4,
        reps: 12,
        equipment: "Cable",
        difficulty: "Beginner",
        target_muscles: ["Lats", "Biceps"],
        youtube: "https://youtu.be/CAwf7n6Luuc",
      },
    ],
  },

  {
    split_id: "berserker_push_pull_legs",
    split_name: "Berserker Push • Pull • Legs",
    creator: "Ubbe",
    trending: true,
    description:
      "A classic Viking Push-Pull-Legs split designed for steady growth and battle-ready conditioning.",
    cover_image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e",

    exercises: [
      {
        day: "Mo",
        name: "Dumbbell Shoulder Press",
        sets: 4,
        reps: 10,
        target_muscles: ["Shoulders", "Triceps"],
        equipment: "Dumbbells",
        youtube: "https://youtu.be/B-aVuyhvLHU",
        difficulty: "Intermediate",
      },
      {
        day: "Tu",
        name: "Seated Cable Row",
        sets: 4,
        reps: 12,
        target_muscles: ["Back", "Biceps"],
        equipment: "Cable Machine",
        youtube: "https://youtu.be/GZbfZ033f74",
      },
      {
        day: "We",
        name: "Leg Press",
        sets: 4,
        reps: 12,
        target_muscles: ["Quads", "Glutes"],
        equipment: "Machine",
        youtube: "https://youtu.be/IZxyjW7MPJQ",
      },
    ],
  },
];



export const PRESET_EXERCISES: ExerciseDetails[] = [
  {
    name: "Barbell Bench Press",
    sets: 4,
    reps: 8,
    youtube: "https://youtu.be/gRVjAtPip0Y",
    target_muscles: ["Chest", "Triceps", "Front Delts"],
    description:
      "A staple chest movement. Keep your feet planted, scapula retracted, and drive evenly through the bar.",
    equipment: "Barbell",
    difficulty: "Intermediate",
  },
  {
    name: "Incline Dumbbell Press",
    sets: 3,
    reps: 10,
    youtube: "https://youtu.be/8iPEnn-ltC8",
    target_muscles: ["Upper Chest", "Front Delts"],
    description:
      "Targets the upper chest. Keep elbows slightly tucked and control the weight on the negative.",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
  },
  {
    name: "Push-Up",
    sets: 3,
    reps: 15,
    youtube: "https://youtu.be/_l3ySVKYVJ8",
    target_muscles: ["Chest", "Triceps", "Core"],
    description:
      "A great bodyweight chest builder. Maintain a straight plank and full range of motion.",
    equipment: "Bodyweight",
    difficulty: "Beginner",
  },
  {
    name: "Pull-Up",
    sets: 4,
    reps: 6,
    youtube: "https://youtu.be/eGo4IYlbE5g",
    target_muscles: ["Lats", "Biceps", "Upper Back"],
    description:
      "Hang from the bar and pull your chest up to the bar. Avoid swinging to maximize tension.",
    equipment: "Pull-Up Bar",
    difficulty: "Intermediate",
  },
  {
    name: "Barbell Squat",
    sets: 4,
    reps: 8,
    youtube: "https://youtu.be/-bJIpOq-LWk?si=OXGx5kDzUp7guiSt",
    target_muscles: ["Quads", "Glutes", "Hamstrings"],
    description:
      "The king of lower body exercises. Brace the core and sit back into the squat.",
    equipment: "Barbell",
    difficulty: "Intermediate",
  },
  {
    name: "Deadlift",
    sets: 3,
    reps: 5,
    youtube: "https://youtu.be/op9kVnSso6Q",
    target_muscles: ["Back", "Glutes", "Hamstrings"],
    description:
      "A full body powerhouse move. Keep the bar close and hips drive forward at the top.",
    equipment: "Barbell",
    difficulty: "Advanced",
  },
  {
    name: "Romanian Deadlift",
    sets: 3,
    reps: 8,
    youtube: "https://youtu.be/2SHsk9AzdjA",
    target_muscles: ["Hamstrings", "Glutes"],
    description:
      "Emphasizes hamstring stretch with hip hinge. Keep knees soft and back flat.",
    equipment: "Barbell",
    difficulty: "Intermediate",
  },
  {
    name: "Overhead Press",
    sets: 3,
    reps: 8,
    youtube: "https://youtu.be/qEwKCR5JCog",
    target_muscles: ["Shoulders", "Triceps"],
    description:
      "Press weight overhead from shoulders. Keep core tight and avoid arching the back.",
    equipment: "Barbell",
    difficulty: "Intermediate",
  },
  {
    name: "Dumbbell Lateral Raise",
    sets: 3,
    reps: 12,
    youtube: "https://youtu.be/3VcKaXpzqRo",
    target_muscles: ["Shoulders (Lateral)"],
    description:
      "Raises to the side to build shoulder width. Keep a small bend in the elbow.",
    equipment: "Dumbbells",
    difficulty: "Beginner",
  },
  {
    name: "Triceps Dips",
    sets: 3,
    reps: 10,
    youtube: "https://youtu.be/2z8JmcrW-As",
    target_muscles: ["Triceps", "Chest", "Shoulders"],
    description:
      "Lean slightly forward for chest emphasis or stay upright for triceps focus.",
    equipment: "Dip Bars",
    difficulty: "Intermediate",
  },
  {
    name: "Barbell Row",
    sets: 4,
    reps: 8,
    youtube: "https://youtu.be/vT2GjY_Umpw",
    target_muscles: ["Upper Back", "Lats", "Biceps"],
    description:
      "Row with tension through the lats. Keep back flat and pull elbows to the hips.",
    equipment: "Barbell",
    difficulty: "Intermediate",
  },
  {
    name: "Leg Press",
    sets: 4,
    reps: 12,
    youtube: "https://youtu.be/IZxyjW7MPJQ",
    target_muscles: ["Quads", "Glutes"],
    description:
      "Push from heels with controlled descent. Great for quad volume without spinal load.",
    equipment: "Leg Press Machine",
    difficulty: "Beginner",
  },
  {
    name: "Calf Raise",
    sets: 4,
    reps: 15,
    youtube: "https://youtu.be/YbX7Wd8jQ-Q",
    target_muscles: ["Calves"],
    description:
      "Full range stretch at bottom and squeeze at top for maximum calf engagement.",
    equipment: "Machine / Bodyweight",
    difficulty: "Beginner",
  },
  {
    name: "Plank",
    sets: 3,
    reps: 60,
    youtube: "https://youtu.be/pSHjTRCQxIw",
    target_muscles: ["Core"],
    description:
      "Hold stable with a straight line from shoulders to ankles. No sagging or piking.",
    equipment: "Bodyweight",
    difficulty: "Beginner",
  },
  {
    name: "Bicep Curl",
    sets: 3,
    reps: 10,
    youtube: "https://youtu.be/ykJmrZ5v0Oo",
    target_muscles: ["Biceps"],
    description:
      "Strict curl for peak contraction. Avoid swinging for strict form.",
    equipment: "Dumbbells / Barbell",
    difficulty: "Beginner",
  },
  {
    name: "Cable Face Pull",
    sets: 3,
    reps: 12,
    youtube: "https://youtu.be/d8LJpYxK4Zs",
    target_muscles: ["Rear Delts", "Upper Back"],
    description:
      "Great for shoulder health and posture. Pull rope toward face with elbows up.",
    equipment: "Cable Machine",
    difficulty: "Intermediate",
  },
];


