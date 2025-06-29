import { Competence, Experience, Project, Info, Education } from "@/hooks/types";


export const baseUrl ='https://ludmil.pythonanywhere.com/'

//export const baseUrl ='http://127.0.0.1:8000/'
interface MyInfoResponse {
    competences: Competence[];
    experiences: Experience[];
    projects: Project[];
    info: Info[];
    education: Education[];
  }

export async function fetchTestimonials() {
  const res = await fetch(`${baseUrl}/testimonials/`);
  return await res.json();
}
// Correct API URL concatenation:
const API_URL = `${baseUrl}/my_info/`;

export const fetchMyInfo = async (): Promise<MyInfoResponse> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  const data: MyInfoResponse = await response.json();
  return data;
};
