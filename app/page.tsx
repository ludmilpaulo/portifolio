import Hero from "@/components/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gradient-to-r from-[#0093E9] to-[#80D0C7] text-white h-screen snap-y snap-mandatory overflow-scroll z-0">
    <Hero  />
  </div>
  );
}
