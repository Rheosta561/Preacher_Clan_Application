export interface Gym {
  gymId: string | number;
  name: string;
  image: string;
  location: string;

  distance?: string;
  trainers: number;
  equipments?: string[];

  rating?: number;
  featured?: boolean;

  fees?: {
    monthly?: number;
    quarterly?: number;
    halfYearly?: number;
    yearly?: number;
  };
}

export type BackendGym = {
  _id: string;
  name: string;
  location: string;
  profileImage?: string | null;
  image?: string | null;

  trainers?: string[];
  equipment?: string[];
  rating?: number;
  featured?: boolean;

  membership?: {
    monthly?: number;
    quarterly?: number;
    halfYearly?: number;
    yearly?: number;
  };
};


export function mapBackendGymToUI(gym: BackendGym): Gym {
  return {
    gymId: gym._id,
    name: gym.name,
    image: gym.profileImage || "https://placehold.co/600x400?text=Gym",
    location: gym.location,
    trainers: gym.trainers?.length ?? 0,
    equipments: gym.equipment ?? [],
    rating: gym.rating ?? 0,
    fees: gym.membership
      ? {
          monthly: gym.membership.monthly,
          quarterly: gym.membership.quarterly,
          halfYearly: gym.membership.halfYearly,
          yearly: gym.membership.yearly,
        }
      : undefined,

    featured: (gym.rating ?? 0) >= 4.5
  };
}



export interface GymReview {
  _id: string;
  rating: number;
  review: string;
  userId: {
    name: string;
    username: string;
    preacherScore: number;
  };
}

export interface GymWithExtras {
  _id: string;
  name: string;
  gallery?: string[];
  rating?: number;
  reviews?: GymReview[];
}
