// Context pour la gestion temporaire des indicateurs en édition
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Indicator } from "@/entities/Indicator";
import localStorage from "@/utils/localStorage";
import { areStringArraysIdentical } from "@/utils/string-util";

// Types
type IndicatorEditContextType = {
  userIndicateurs: Indicator[];
  setUserIndicateurs: React.Dispatch<React.SetStateAction<Indicator[]>>;
  isChanged: boolean;
  setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  resetIndicators: () => Promise<void>;
  saveIndicators: () => Promise<void>;
};

const IndicatorEditContext = createContext<IndicatorEditContextType | undefined>(undefined);

export const IndicatorEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userIndicateurs, setUserIndicateurs] = useState<Indicator[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialisation depuis le localStorage
  useEffect(() => {
    (async () => {
      const user_indicateurs = await localStorage.getIndicateurs();
      if (user_indicateurs) setUserIndicateurs(user_indicateurs);
    })();
  }, []);

  // Détection des changements (par rapport au localStorage)
  useEffect(() => {
    const checkChanged = async () => {
      const savedUserIndicators = await localStorage.getIndicateurs();
      const savedActiveIndicators = savedUserIndicators?.filter((i) => i.active).map((i) => i.uuid) || [];
      const modifiedIndicators = userIndicateurs.filter((i) => i.active).map((i) => i.uuid);
      setIsChanged(!areStringArraysIdentical(savedActiveIndicators, modifiedIndicators));
    };
    checkChanged();
  }, [userIndicateurs]);

  // Remettre à l’état initial (depuis le localStorage)
  const resetIndicators = useCallback(async () => {
    const user_indicateurs = await localStorage.getIndicateurs();
    if (user_indicateurs) setUserIndicateurs(user_indicateurs);
  }, []);

  // Persister dans le localStorage (à utiliser uniquement dans l’écran principal)
  const saveIndicators = useCallback(async () => {
    setIsLoading(true);
    await localStorage.setIndicateurs(userIndicateurs);
    setIsLoading(false);
  }, [userIndicateurs]);

  return (
    <IndicatorEditContext.Provider
      value={{
        userIndicateurs,
        setUserIndicateurs,
        isChanged,
        setIsChanged,
        isLoading,
        setIsLoading,
        resetIndicators,
        saveIndicators,
      }}
    >
      {children}
    </IndicatorEditContext.Provider>
  );
};

export const useIndicatorEdit = () => {
  const context = useContext(IndicatorEditContext);
  if (!context) {
    throw new Error("useIndicatorEdit must be used within an IndicatorEditProvider");
  }
  return context;
};
