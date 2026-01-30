
export type PreacherRank =
  | "Rookie"
  | "Veteran"
  | "Elite"
  | "Legend"
  | "Master";

export const getPreacherRank = (preacherScore = 0): PreacherRank => {
  if (preacherScore >= 800) return "Master";
  if (preacherScore >= 600) return "Legend";
  if (preacherScore >= 400) return "Elite";
  if (preacherScore >= 200) return "Veteran";
  return "Rookie";
};
