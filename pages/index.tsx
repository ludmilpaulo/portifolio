import { Inter } from "@next/font/google";
import Header from "@/components/Header";
import About from "@/components/About";
import Hero from "@/components/Hero";
import WorkExperience from "@/components/WorkExperience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import ContactMe from "@/components/ContactMe";
import { useState } from "react";

type Props = {
  id: number;
  name_complete: string;
  avatar: string;
  mini_about: string;
  born_date: string;
  address: string;
  phone: string;
  email: string;
  cv: string;
  github: string;
  linkedin: string;
  facebook: string;
  twitter: string;
  instagram: string;
};

export async function getServerSideProps() {
  const res = await fetch("https://www.ludmilpaulo.com/my_info/");
  const data = await res.json();
  return {
    props: {
      myData: data,
    },
  };
}

const inter = Inter({ subsets: ["latin"] });

export default function Home({ myData }: any) {
  const [myInformation] = useState(myData?.info);
  const [myExperience] = useState(myData?.experiences);
  const [myCompetences, setCompetences] = useState(myData?.competences);
  const [myEducation] = useState(myData?.education);
  const [myProjects] = useState(myData?.projects);

  console.log("my information", myCompetences);
  return (
    <div className="bg-gradient-to-r from-[#0093E9] to-[#80D0C7] text-white h-screen snap-y snap-mandatory overflow-scroll z-0">
      
      <Header headerData={myInformation} />
      
      <section id="hero" className="snap-start">
        <Hero heroData={myInformation} />
      </section>
      
      <section id="about" className="snap-center">
        <About aboutData={myInformation} />
      </section>
      
      <section id="experience" className="snap-center">
        <WorkExperience workData={myExperience} />
      </section>
      
      <section id="skills" className="snap-start">
        <Skills mySkills={myCompetences} />
      </section>
      
      <section id="projects" className="snap-start">
        <Projects myProjects={myProjects} />
      </section>
      
      <section id="contact" className="snap-start">
        <ContactMe myContacts={myInformation} />
      </section>
    </div>
  );
}
