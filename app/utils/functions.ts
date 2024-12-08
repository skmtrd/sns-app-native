import { ApiResponse, Assignment } from "@/constants/types";

export const fetchAssignment = async (): Promise<Assignment[]> => {
  try {
    const response = await fetch("https://iniad-sns.vercel.app/api/assignment");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: ApiResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};
