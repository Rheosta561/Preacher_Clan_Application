import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ChallengeType {
  title: string;
  description: string;
  rules: string[];
  createdAt?: Date;
  isCompleted?: boolean;
}

interface ChallengeContextType {
  challenge: ChallengeType | null;
  setChallenge: (challenge: ChallengeType | null) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const ChallengeProvider = ({ children }: { children: ReactNode }) => {
  const [challenge, setChallenge] = useState<ChallengeType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <ChallengeContext.Provider value={{ challenge, setChallenge, loading, setLoading }}>
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenge = () => {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error("useChallenge must be used within a ChallengeProvider");
  }
  return context;
};
