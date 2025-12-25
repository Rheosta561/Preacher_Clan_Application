import { Profile } from "@/constants/constants";
export const transformBackendProfileToUI = (
  backendProfile: any,
  onSendRequest: () => void
): Profile => {
  return {
    id: backendProfile.userId,
    image: backendProfile.profileImage,
    name: backendProfile.name,
    age: 22, // fallback / mock (backend doesn’t send age)
    goal: backendProfile.fitnessGoals?.[0] || "Fitness",
    time: "Evening", // fallback / mock
    tags: backendProfile.fitnessGoals || [],
    preacherRank: undefined, // optional
    isVerified: backendProfile.isVerified ?? false,
    onSendRequest,
    hideaction : true 
  };
};


