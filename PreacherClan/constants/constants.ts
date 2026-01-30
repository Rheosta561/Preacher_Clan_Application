// location point 
export interface GeoPoint {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
  updatedAt?: string | Date;
}


// ================= PROFILE =================
export interface useClan{
  _id : string ;
  name : string ;
  profileImage : string ; 
}
export interface Profile {
  id: string;
  image: string;
  name: string;
  age: number;
  goal: string;
  time: string;
  tags: string[];
  preacherRank?: string;
  isVerified: boolean;
  onSendRequest?: ()=> void ; 
  hideaction : boolean ; 
  clan? : useClan ;
}
// interfaces/profile.ts

export interface ISocialHandles {
  instagram?: string
  twitter?: string
  facebook?: string
  youtube?: string
}

export interface IProfile {
  userId: string
  profileImage?: string
  coverImage?: string
  about?: string

  socialHandles?: ISocialHandles

  fitnessGoals: string[]
  ambition: string[]
  exerciseGenre: string[]

  milestones?: any[]        // can refine later
  preacherRank?: number

}

// ================= USER =================

export interface User {
  _id: string;
}
// interfaces/user.ts

export interface IUser {
  id: string
  name: string
  username: string
  email: string
  coverImage?: string
  profileImage?: string
  about?: string

  profile?: string | IProfile

  followers?: string[]
  following?: string[]
  partner?: string[]

  isAdmin?: boolean
  isTrainer?: boolean
  isVerified?: boolean

  streak?: {
    count: number
    todayUpdated: boolean
  }

  gym?:{
    id: string ;
    name : string ; 
  }
location?: GeoPoint;


  preacherScore?: number
  onboardingCompleted?:boolean
}

export interface IUserWithProfile extends IUser {
  rank? : number 
  profileDetails? : IProfile
  fitnessGoals? : string[]
  ambition? : string[]
  exerciseGenre? : string[]
  timings? : string 
  repmates?: Repmate_Profile[]

}


// ================= REQUEST =================
export interface MiniProfile {
  id: string;
  name: string;
  image: string;
  isVerified: boolean;
  
}

export interface RepMateRequest {
  id: string;
  profile: MiniProfile;
  isTrainer: boolean;
  gym: string;
  isVerified: boolean;
   direction: "incoming" | "outgoing";
}

// ================= DUMMY DATA =================

export const DUMMY_PROFILES: Profile[] = [
  {
    id: "u1",
    image:
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1",
    name: "RepMate King",
    age: 24,
    goal: "Hypertrophy",
    time: "6 AM – 8 AM",
    tags: ["chest", "strength", "push-day"],
    preacherRank: "Iron Lord",
    isVerified: true,
    hideaction: true 
  },
  {
    id: "u2",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0bbd6555d33",
    name: "Jane Smith",
    age: 22,
    goal: "Fat Loss",
    time: "7 PM – 9 PM",
    tags: ["cardio", "hiit"],
    isVerified: false,
    hideaction : true , 
  },
];

// ================= DUMMY REQUESTS =================

export const DUMMY_REQUESTS: RepMateRequest[] = [
  {
    id: "r1",
    profile: DUMMY_PROFILES[0],
    isTrainer: true,
    gym: "Valhalla Iron Gym",
    isVerified: true,
    direction: 'incoming'
  },
];



export interface GetStartedCard{
  title: string;
  description: string;
  image: keyof typeof images;
}

export const images = {
  hero: require('@/assets/images/placeholder1.jpg'),
  onboarding1: require('@/assets/images/placeholder2.jpg'),
  onboarding2: require('@/assets/images/placeholder3.jpg'),
  
} as const


export interface Repmate_Profile {
  _id: string
  name: string
  profileImage: string
  preacherScore: number
  username: string
  onRemove?: () => void
  onPoke?: ()=> void 
}

