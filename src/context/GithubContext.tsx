"use client"

import { createContext, useContext, useState, ReactNode } from "react";

interface GithubContextType {
  userId: string;
  setUserId: (userId: string) => void;
  // repositories: any[];
  // setRepositories: (repos: any[]) => void;
  // currentTab: string;
  // setCurrentTab: (tab: string) => void;
}

const GithubContext = createContext<GithubContextType | undefined>(undefined);

export const GithubProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState("");
  // const [repositories, setRepositories] = useState<any[]>([]);
  // const [currentTab, setCurrentTab] = useState<string>("overview");

  return (
    <GithubContext.Provider
      value={{
        userId,
        setUserId,
        // repositories,
        // setRepositories,
        // currentTab, 
        // setCurrentTab,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export const useGithubContext = () => {
  const context = useContext(GithubContext);
  if (!context) {
    throw new Error("useGithub must be used within a GithubProvider");
  }
  return context;
};