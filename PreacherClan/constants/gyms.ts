export interface Gym  {
  name: string;
  image: string;
  location: string;
  distance?: string;
  trainers: number | string;
  equipments?: string[];
  fees?: number | string;
  rating?: number;
  featured?: boolean;
  gymId: string | number;
};
type BackendGym = {
  _id: string;
  name: string;
  location: string;
  profileImage?: string | null;
  trainers?: string[];
  equipment?: string[];
  rating?: number;
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
    featured: (gym.rating ?? 0) >= 4.5
  };
}
