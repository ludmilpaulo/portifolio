import Head from "next/head";
import { SocialIcon } from "react-social-icons";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Header from "@/components/Header";
import About from "@/components/About";
import Hero from "@/components/Hero";
import WorkExperience from "@/components/WorkExperience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import ContactMe from "@/components/ContactMe";
import { useState } from "react";

type Props = {
 // myInfo: any,
 // headerData: any,
  id: number,
  name_complete: string,
  avatar: string,
  mini_about: string,
  born_date: string,
  address: string,
  phone: string,
  email: string,
  cv: string,
  github: string,
  linkedin: string,
  facebook: string,
  twitter: string,
  instagram: string,


};

export async function getServerSideProps() {
  const res = await fetch(
   " https://www.ludmilpaulo.com/my_info/"
  );
  const data = await res.json();

  return {
    props: {
      myInfo: data?.info,
    },
  };
}

const inter = Inter({ subsets: ["latin"] });

export default function Home({myInfo}: Props) {

  const [myInformation] = useState<Props>(myInfo);
  console.log("my information", myInfo)
  return (
    <div className="bg-[rgb(36,36,36)] text-white h-screen snap-y snap-mandatory overflow-scroll z-0">
      <Header headerData={myInformation}/>

      <section id="hero" className="snap-start">
        <Hero heroData={myInformation} />
      </section>

      <section id="about" className="snap-center">
        <About aboutData={myInformation} />
      </section>

      <section id="experience" className="snap-center">
        <WorkExperience workData={myInformation} />
      </section>

      <section id="skills" className="snap-start">
        <Skills />
      </section>

      <section id="projects" className="snap-start">
        <Projects />
      </section>

      <section id="contact" className="snap-start">
        <ContactMe />
      </section>
    </div>
  );
}
