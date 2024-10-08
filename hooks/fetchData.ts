import { Competence, Experience, Project, Info, Education } from "@/hooks/types";


export const baseUrl ='https://ludmil.pythonanywhere.com/'
interface MyInfoResponse {
    competences: Competence[];
    experiences: Experience[];
    projects: Project[];
    info: Info[];
    education: Education[];
  }


const API_URL = 'https://ludmil.pythonanywhere.com/my_info/';

export const fetchMyInfo = async (): Promise<MyInfoResponse> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  const data: MyInfoResponse = await response.json();
  return data;
};
