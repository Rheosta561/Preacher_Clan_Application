export type TrainerStatus = "idle" | "booking" | "booked";

export interface TrainerCardProps {
  profile: {
    id: string;
    image: any;
    name: string;
    age: number;
    goal: string;
    time: string;
    tags: string[];
    preacherRank?: string;
    isVerified: boolean;
  };
  status?: TrainerStatus;
  onBookTrainer?: (trainerId: string) => Promise<void> | void;
}
