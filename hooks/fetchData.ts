import { Competence, Experience, Project, Info, Education } from "@/hooks/types";


const rawBase =
  (typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.DJANGO_API_URL) || "https://ludmil.pythonanywhere.com";
/** Backend API base URL (always ends with /) for full frontend-backend interaction */
export const baseUrl = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;
interface MyInfoResponse {
    competences: Competence[];
    experiences: Experience[];
    projects: Project[];
    info: Info[];
    education: Education[];
  }

export async function fetchTestimonials() {
  const res = await fetch(`${baseUrl}testimonials/`);
  return await res.json();
}
// Correct API URL concatenation:
const API_URL = `${baseUrl}my_info/`;

export const fetchMyInfo = async (): Promise<MyInfoResponse> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  const data: MyInfoResponse = await response.json();
  return data;
};
