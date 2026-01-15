"use client"

import { createContext, useContext, useState, ReactNode } from "react";
import { ApolloError } from '@apollo/client';


interface GithubContextType {
  userId: string;
  setUserId: (userId: string) => void;
  // repositories: any[];
  // setRepositories: (repos: any[]) => void;
  // currentTab: string;
  // setCurrentTab: (tab: string) => void;
  userData: any;
  setUserData: (data: any) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  contributions: any;
  setContributions: (data: any) => void;
  isLoadingContributions: boolean;
  setIsLoadingContributions: (data: boolean) => void;
  contributionsError: ApolloError | undefined;
  setContributionsError: (error: ApolloError | undefined) => void;
}


const GithubContext = createContext<GithubContextType | undefined>(undefined);

export const GithubProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState<any>(null);
  // const [repositories, setRepositories] = useState<any[]>([]);
  // const [currentTab, setCurrentTab] = useState<string>("overview");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [contributions, setContributions] = useState(null)
  const [isLoadingContributions, setIsLoadingContributions] = useState(false)
  const [contributionsError, setContributionsError] = useState<ApolloError | undefined>(undefined)

  // console.log('====>',userData)


  return (
    <GithubContext.Provider
      value={{
        userId,
        setUserId,
        // repositories,
        // setRepositories,
        // currentTab, 
        // setCurrentTab,
        userData,
        setUserData,
        selectedYear,
        setSelectedYear,
        contributions,
        setContributions,
        isLoadingContributions,
        setIsLoadingContributions,
        contributionsError,
        setContributionsError,
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