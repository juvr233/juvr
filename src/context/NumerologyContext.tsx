import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NumerologyProfile } from '../utils/numerology';

interface UserProfile {
  firstName: string;
  lastName: string;
  birthDate: string;
  numerologyProfile?: NumerologyProfile;
  readingHistory: ReadingRecord[];
  sacredName?: string;
}

interface ReadingRecord {
  id: string;
  date: string;
  type: 'full-reading' | 'compatibility' | 'yearly-forecast';
  results: any;
}

interface NumerologyContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  currentReading: NumerologyProfile | null;
  setCurrentReading: (reading: NumerologyProfile) => void;
  addReadingToHistory: (reading: ReadingRecord) => void;
}

const NumerologyContext = createContext<NumerologyContextType | undefined>(undefined);

export function NumerologyProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentReading, setCurrentReading] = useState<NumerologyProfile | null>(null);

  const addReadingToHistory = (reading: ReadingRecord) => {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        readingHistory: [reading, ...userProfile.readingHistory]
      });
    }
  };

  return (
    <NumerologyContext.Provider value={{
      userProfile,
      setUserProfile,
      currentReading,
      setCurrentReading,
      addReadingToHistory
    }}>
      {children}
    </NumerologyContext.Provider>
  );
}

export function useNumerology() {
  const context = useContext(NumerologyContext);
  if (context === undefined) {
    throw new Error('useNumerology must be used within a NumerologyProvider');
  }
  return context;
}