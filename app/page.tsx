"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { SocialIcon } from "react-social-icons";
import { Typewriter } from "react-simple-typewriter";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";
import { useGetMyInfoQuery } from "@/store/myInfoApi";
import { useGetTestimonialsQuery } from "@/store/testimonialsApi";

export default function Home() {
  const { data: myInfo, isLoading: loadingInfo } = useGetMyInfoQuery();
  const { data: testimonials, isLoading: loadingTestimonials } = useGetTestimonialsQuery();

  const info = myInfo?.info?.[0];
  const projects = myInfo?.projects?.slice(0, 5) || [];

  return (
    <main className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#0093E9] via-[#4facfe] to-[#00f2fe] text-white overflow-hidden">
      {/* Floating Shapes */}
      <div className="pointer-events-none absolute z-0 inset-0">
        <div className="absolute -top-28 -left-40 w-[340px] h-[340px] bg-cyan-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[280px] h-[180px] bg-blue-200/20 rounded-full blur-2xl" />
        <div className="absolute left-1/2 top-10 -translate-x-1/2 w-[460px] h-[180px] bg-gradient-to-r from-cyan-100/20 via-blue-200/20 to-transparent rounded-2xl blur-2xl" />
      </div>

      {/* HERO */}
      <section className="z-10 flex flex-col md:flex-row items-center justify-center min-h-[80vh] gap-10 px-6 pt-20 md:pt-8 relative">
        {/* Avatar with Glow */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="shadow-xl border-4 border-white/40 rounded-full bg-white/20 p-2"
        >
          <Image
            src={info?.avatar || "/avatar/lud.jpeg"}
            alt={info?.name_complete || "Ludmil Paulo"}
            width={190}
            height={190}
            className="rounded-full object-cover"
            priority
            style={{ boxShadow: "0 0 38px 0 #0093E955" }}
          />
        </motion.div>
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col items-center md:items-start text-center md:text-left max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-2 drop-shadow-xl">
            Hi, I’m{" "}
            <span className="bg-gradient-to-r from-[#52e5e7] to-[#0093e9] bg-clip-text text-transparent">
              {info?.name_complete || "Ludmil Paulo"}
            </span>
          </h1>
          <h2 className="text-lg sm:text-xl font-semibold text-white/90 mb-2 flex flex-col items-center md:items-start">
            <span>
              <Typewriter
                words={[
                  "Founder • Software Engineer",
                  "Digital Solutions Expert",
                  "Full Stack Developer",
                  "Business Builder",
                  "Mentor & Consultant",
                ]}
                loop={0}
                cursor
                cursorStyle="_"
                typeSpeed={62}
                deleteSpeed={32}
                delaySpeed={1200}
              />
            </span>
          </h2>
          <p className="mt-1 text-lg text-white/80 font-medium leading-relaxed">
            I craft scalable, user-friendly web & mobile products, help businesses grow, and love solving real-world problems with code.
            <br />
            <span className="text-cyan-100 font-semibold">
              Let’s build something impactful together.
            </span>
          </p>
          {/* Social links from backend */}
          <div className="flex gap-4 mt-7 flex-wrap justify-center">
            {info &&
              [
                info.linkedin,
                info.github,
                info.twitter,
                info.instagram,
                info.facebook,
              ].map(
                (url) =>
                  url && (
                    <SocialIcon
                      key={url}
                      url={url}
                      fgColor="#fff"
                      bgColor="#0093E9"
                      className="hover:scale-110 transition-all duration-200 shadow-xl"
                    />
                  )
              )}
          </div>
          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/About"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#0093e9] to-[#52e5e7] rounded-full font-bold text-lg shadow-xl hover:from-[#00f2fe] hover:to-[#4facfe] hover:scale-105 transition"
            >
              Let’s Connect
            </Link>
            <Link
              href="/Projects"
              className="inline-block px-8 py-3 border-2 border-cyan-100/60 rounded-full font-bold text-lg shadow-xl hover:bg-white/10 hover:scale-105 transition"
            >
              See My Work
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Loading state */}
      {(loadingInfo || loadingTestimonials) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-tr from-blue-900/80 to-cyan-600/70">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 border-t-4 border-b-4 border-blue-300 rounded-full animate-spin"></div>
            <span className="text-white font-semibold text-lg">Loading...</span>
          </div>
        </div>
      )}

      {/* Scroll Cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
        animate={{ y: [0, 16, 0] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
      >
        <FaChevronDown className="text-2xl text-white/70" />
        <span className="text-xs mt-1 text-white/80 tracking-wider">Scroll Down</span>
      </motion.div>

      {/* PROJECTS CAROUSEL */}
      {projects.length > 0 && (
        <section className="z-10 pt-32 pb-12 max-w-4xl mx-auto w-full px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-white/90 mb-6 text-center">
            Featured Projects
          </h3>
          <Swiper
            modules={[EffectCoverflow, Autoplay, Pagination]}
            effect="coverflow"
            grabCursor
            centeredSlides
            loop
            slidesPerView={1}
            coverflowEffect={{
              rotate: 18,
              stretch: 0,
              depth: 150,
              modifier: 1.5,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: true }}
            className="w-full"
            breakpoints={{
              768: { slidesPerView: 2 },
              1280: { slidesPerView: 3 },
            }}
          >
            {projects.map((p) => (
              <SwiperSlide key={p.id}>
                <Link href={`/Projects#${p.slug}`} passHref>
                  <motion.div
                    whileHover={{ scale: 1.04, boxShadow: "0 8px 32px #4facfe70" }}
                    className="bg-white/80 rounded-xl shadow-lg p-5 m-2 text-black flex flex-col items-center cursor-pointer min-h-[290px] transition-all"
                  >
                    <Image
                      src={p.image}
                      alt={p.title}
                      width={200}
                      height={120}
                      className="rounded-lg mb-3 object-cover"
                    />
                    <h4 className="text-lg font-bold mb-1 text-blue-900">{p.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{p.description.replace(/<[^>]+>/g, "")}</p>
                  </motion.div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {/* TESTIMONIALS CAROUSEL */}
      {!!testimonials?.length && (
        <section className="z-10 pt-12 pb-24 max-w-2xl mx-auto w-full px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-white/90 mb-6 text-center">
            What My Clients & Collaborators Say
          </h3>
          <Swiper
            modules={[Autoplay, Pagination]}
            loop
            grabCursor
            slidesPerView={1}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="w-full"
          >
            {testimonials.slice(0, 8).map((t, idx) => (
              <SwiperSlide key={t.id || idx}>
                <motion.div
                  initial={{ opacity: 0, y: 48 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.13 * idx }}
                  className="bg-white/90 dark:bg-gray-900/90 border-2 border-cyan-200 rounded-2xl shadow-xl px-7 py-8 flex flex-col items-center text-center mx-2"
                >
                  <Image
                    src={t.avatar || "/testimonials/default.jpg"}
                    alt={t.name}
                    width={72}
                    height={72}
                    className="rounded-full border-2 border-blue-400 mb-4 shadow"
                  />
                  <blockquote className="text-lg text-gray-800 dark:text-cyan-100 italic mb-2">
                    “{t.text}”
                  </blockquote>
                  <span className="text-blue-700 dark:text-cyan-200 font-bold">{t.name}</span>
                  <span className="text-gray-500 dark:text-cyan-400 text-xs">{t.role}</span>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}
    </main>
  );
}
