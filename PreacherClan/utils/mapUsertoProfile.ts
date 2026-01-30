export const mapUserToProfileCard = (user: any) => {
  console.log('user received for mapping', user);
  return {
    id: user._id,
    image:
      user.profile?.profileImage ||
      user.image ||
      "https://via.placeholder.com/300",

    name: user.name,
    age: 22, // 

    goal:
      user.profile?.fitnessGoals?.[0] ||
      "Fitness",

    time:
      user.profile?.timings ||
      "Flexible",

    tags: [
      ...(user.profile?.ambition || []),
      ...(user.profile?.exerciseGenre || []),
      ...(user.profile?.fitnessGoals || []),
    ].slice(0, 4),
    

    preacherRank:
      user.preacherScore >= 800
        ? "Master"
        : user.preacherScore >= 600
        ? "Legend"
        : user.preacherScore >=400
        ? "Elite"
        :user.preacherScore >=200 ? "Veteran"
        : "Rookie",

    isVerified: Boolean(user.isVerified)
  };
};
