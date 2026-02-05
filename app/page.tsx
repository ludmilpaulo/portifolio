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
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#0093E9] via-[#3b9ee0] to-[#00c9d4] text-white overflow-hidden">
      {/* Floating Shapes */}
      <div className="pointer-events-none absolute z-0 inset-0 overflow-hidden">
        <div className="absolute -top-28 -left-40 w-[380px] h-[380px] bg-cyan-400/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[320px] h-[200px] bg-blue-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute left-1/2 top-10 -translate-x-1/2 w-[480px] h-[200px] bg-gradient-to-r from-cyan-100/20 via-blue-200/15 to-transparent rounded-2xl blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 right-1/4 w-[220px] h-[220px] bg-gradient-to-br from-blue-300/12 to-cyan-200/12 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "3s" }} />
      </div>

      {/* Enhanced HERO - Responsive */}
      <section className="z-10 flex flex-col lg:flex-row items-center justify-center min-h-[85vh] gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-8 relative">
        {/* Avatar with Enhanced Glow - Responsive */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          whileHover={{ scale: 1.05, rotate: 2 }}
          className="relative shadow-2xl border-4 border-white/40 rounded-full bg-white/20 p-2 group w-fit mx-auto lg:mx-0"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/30 to-blue-400/30 blur-xl group-hover:blur-2xl transition-all duration-500" />
          <Image
            src={info?.avatar || "/avatar/lud.jpeg"}
            alt={`${info?.name_complete || "Ludmil Paulo"} - Senior Software Engineer & Full Stack Developer`}
            width={190}
            height={190}
            className="relative rounded-full object-cover z-10 w-[150px] h-[150px] sm:w-[170px] sm:h-[170px] lg:w-[190px] lg:h-[190px]"
            priority
            quality={90}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            style={{ boxShadow: "0 0 38px 0 #0093E955" }}
            sizes="(max-width: 640px) 150px, (max-width: 1024px) 170px, 190px"
          />
          <motion.div
            className="absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-400 rounded-full border-2 border-white shadow-lg"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </motion.div>
        {/* Enhanced Text Section - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl w-full"
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-2 drop-shadow-lg [font-family:var(--font-heading),sans-serif]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Hi, I&apos;m{" "}
            <motion.span
              className="bg-gradient-to-r from-[#52e5e7] via-[#0093e9] to-[#80D0C7] bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              {info?.name_complete || "Ludmil Paulo"}
            </motion.span>
          </motion.h1>
          
          <motion.div
            className="text-base sm:text-lg lg:text-xl font-semibold text-white/90 mb-4 flex flex-col items-center lg:items-start w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="relative min-h-[1.5em]">
              <Typewriter
                words={[
                  "Founder • Software Engineer",
                  "Digital Solutions Expert",
                  "Full Stack Developer",
                  "Business Builder",
                  "Mentor & Consultant",
                  "Tech Innovator",
                  "Problem Solver",
                ]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={40}
                delaySpeed={1500}
              />
            </span>
          </motion.div>
          
          <motion.p 
            className="mt-2 text-base sm:text-lg text-white/85 font-medium leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            I craft scalable, user-friendly web & mobile products, help businesses grow, and love solving real-world problems with code.
            <br />
            <motion.span 
              className="text-cyan-100 font-semibold inline-block mt-2"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Let&apos;s build something impactful together.
            </motion.span>
          </motion.p>
          {/* Enhanced Social links - Responsive */}
          <motion.div 
            className="flex gap-3 sm:gap-4 mt-6 sm:mt-8 flex-wrap justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {info &&
              [
                info.linkedin,
                info.github,
                info.twitter,
                info.instagram,
                info.facebook,
              ].map(
                (url, index) =>
                  url && (
                    <motion.div
                      key={url}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 1 + (index * 0.1),
                        type: "spring",
                        stiffness: 200
                      }}
                      whileHover={{ 
                        scale: 1.2, 
                        rotate: 5,
                        boxShadow: "0 8px 25px rgba(0, 147, 233, 0.4)"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <SocialIcon
                        url={url}
                        fgColor="#fff"
                        bgColor="#0093E9"
                        className="transition-all duration-300 shadow-xl hover:shadow-2xl"
                        style={{ height: 36, width: 36 }}
                      />
                    </motion.div>
                  )
              )}
          </motion.div>
          
          {/* Enhanced CTA Buttons - Responsive */}
          <motion.div 
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md sm:max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/About"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-[#0093e9] via-[#52e5e7] to-[#0093e9] rounded-full font-bold text-base sm:text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent relative overflow-hidden group w-full"
                aria-label="Learn more about Ludmil Paulo"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span>Let&apos;s Connect</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.div>
                </span>
              </Link>
            </motion.div>
            
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="/Projects"
              className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 border-2 border-cyan-100/80 rounded-full font-bold text-base sm:text-lg shadow-xl hover:bg-white/15 hover:border-white hover:scale-105 transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent backdrop-blur-sm w-full"
              aria-label="View Ludmil Paulo's projects"
            >
              <span className="flex items-center justify-center gap-3">
                <span>See My Work</span>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  💼
                </motion.div>
              </span>
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="/project-inquiry"
              className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 rounded-full font-bold text-base sm:text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent relative overflow-hidden group w-full"
              aria-label="Start a project with Ludmil Paulo"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
              <span className="relative z-10 flex items-center justify-center gap-3">
                <span>Start Project</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  🚀
                </motion.div>
              </span>
            </Link>
          </motion.div>
          
          </motion.div>
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

      {/* Enhanced PROJECTS CAROUSEL */}
      {projects.length > 0 && (
        <motion.section 
          className="z-10 pt-20 sm:pt-24 lg:pt-32 pb-8 sm:pb-12 max-w-6xl mx-auto w-full px-4 sm:px-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white/98 mb-3 [font-family:var(--font-heading),sans-serif] tracking-tight">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h3>
            <motion.div
              className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            />
            <p className="text-white/85 mt-3 text-base sm:text-lg max-w-xl mx-auto">
              Explore some of my recent work and innovative solutions
            </p>
          </motion.div>
          <Swiper
            modules={[EffectCoverflow, Autoplay, Pagination]}
            effect="coverflow"
            grabCursor
            centeredSlides
            loop
            slidesPerView={1}
            coverflowEffect={{
              rotate: 15,
              stretch: 0,
              depth: 200,
              modifier: 1.8,
              slideShadows: true,
            }}
            pagination={{ 
              clickable: true,
              bulletClass: 'swiper-pagination-bullet-custom',
              bulletActiveClass: 'swiper-pagination-bullet-active-custom'
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className="w-full"
            breakpoints={{
              640: { 
                slidesPerView: 1,
                coverflowEffect: {
                  rotate: 12,
                  stretch: 0,
                  depth: 150,
                  modifier: 1.5,
                  slideShadows: true,
                }
              },
              768: { 
                slidesPerView: 2,
                coverflowEffect: {
                  rotate: 15,
                  stretch: 0,
                  depth: 200,
                  modifier: 1.8,
                  slideShadows: true,
                }
              },
              1280: { 
                slidesPerView: 3,
                coverflowEffect: {
                  rotate: 15,
                  stretch: 0,
                  depth: 200,
                  modifier: 1.8,
                  slideShadows: true,
                }
              },
            }}
          >
            {projects.map((p, index) => (
              <SwiperSlide key={p.id}>
                <Link href={`/Projects#${p.slug}`} passHref>
                  <motion.div
                    initial={{ opacity: 0, y: 50, rotateY: -15 }}
                    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 20px 40px rgba(79, 172, 254, 0.3)",
                      rotateY: 5
                    }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 m-1 sm:m-2 text-black flex flex-col items-center cursor-pointer min-h-[280px] sm:min-h-[320px] transition-all duration-500 border border-white/20 group"
                  >
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src={p.image}
                        alt={`${p.title} - Project showcase`}
                        width={220}
                        height={140}
                        className="rounded-xl object-cover group-hover:scale-110 transition-transform duration-500 w-[180px] h-[100px] sm:w-[200px] sm:h-[120px] lg:w-[220px] lg:h-[140px]"
                        loading="lazy"
                        quality={90}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        sizes="(max-width: 640px) 180px, (max-width: 1024px) 200px, 220px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold mb-2 text-blue-900 group-hover:text-blue-700 transition-colors text-center">
                      {p.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 text-center leading-relaxed px-2">
                      {p.description.replace(/<[^>]+>/g, "")}
                    </p>
                    <motion.div
                      className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full text-xs sm:text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      View Project
                    </motion.div>
                  </motion.div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.section>
      )}

      {/* Enhanced TESTIMONIALS CAROUSEL */}
      {!!testimonials?.length && (
        <motion.section 
          className="z-10 pt-12 sm:pt-16 pb-16 sm:pb-20 lg:pb-24 max-w-4xl mx-auto w-full px-4 sm:px-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white/98 mb-3 [font-family:var(--font-heading),sans-serif] tracking-tight">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                What My Clients & Collaborators Say
              </span>
            </h3>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            />
            <p className="text-white/85 mt-3 text-base sm:text-lg max-w-xl mx-auto">
              Trusted by clients worldwide for exceptional results
            </p>
          </motion.div>
          <Swiper
            modules={[Autoplay, Pagination]}
            loop
            grabCursor
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ 
              clickable: true,
              bulletClass: 'swiper-pagination-bullet-custom',
              bulletActiveClass: 'swiper-pagination-bullet-active-custom'
            }}
            className="w-full"
          >
            {testimonials.slice(0, 8).map((t, idx) => (
              <SwiperSlide key={t.id || idx}>
                <motion.div
                  initial={{ opacity: 0, y: 60, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 * idx }}
                  className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-cyan-200/50 dark:border-cyan-700/50 rounded-2xl sm:rounded-3xl shadow-2xl px-6 sm:px-8 py-8 sm:py-10 flex flex-col items-center text-center mx-1 sm:mx-2 group hover:shadow-3xl transition-all duration-500"
                >
                  <motion.div
                    className="relative mb-6"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Image
                      src={t.avatar || "/testimonials/default.jpg"}
                      alt={`${t.name} - Testimonial`}
                      width={80}
                      height={80}
                      className="rounded-full border-3 border-blue-400 dark:border-cyan-400 shadow-xl group-hover:shadow-2xl transition-all duration-300 w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] lg:w-[80px] lg:h-[80px]"
                      loading="lazy"
                      quality={85}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                      sizes="(max-width: 640px) 60px, (max-width: 1024px) 70px, 80px"
                    />
                    <motion.div
                      className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white dark:border-gray-900"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  </motion.div>
                  
                  <motion.blockquote 
                    className="text-base sm:text-lg text-gray-800 dark:text-cyan-100 italic mb-4 leading-relaxed relative px-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-2xl sm:text-3xl lg:text-4xl text-blue-400 dark:text-cyan-400 absolute -top-1 sm:-top-2 -left-1 sm:-left-2">&ldquo;</span>
                    {t.text}
                    <span className="text-2xl sm:text-3xl lg:text-4xl text-blue-400 dark:text-cyan-400 absolute -bottom-2 sm:-bottom-4 -right-1 sm:-right-2">&rdquo;</span>
                  </motion.blockquote>
                  
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="text-blue-700 dark:text-cyan-200 font-bold text-base sm:text-lg mb-1">
                      {t.name}
                    </div>
                    <div className="text-gray-500 dark:text-cyan-400 text-xs sm:text-sm font-medium">
                      {t.role}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="flex mt-4 space-x-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="text-yellow-400 text-xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                      >
                        ★
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.section>
      )}

      {/* Footer with Login Links */}
      <footer className="relative z-10 bg-slate-900/95 backdrop-blur-sm text-white py-10 sm:py-12 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold tracking-tight text-white">Ludmil Paulo</h3>
              <p className="text-slate-400 text-sm mt-1">Full Stack Developer & Software Engineer</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
              <Link
                href="/admin-login"
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-700/80 hover:bg-slate-600 rounded-xl transition-colors text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                <span aria-hidden>🔐</span>
                <span>Admin Login</span>
              </Link>
              <Link
                href="/client-login"
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600/90 hover:bg-emerald-500 rounded-xl transition-colors text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                <span aria-hidden>👤</span>
                <span>Client Portal</span>
              </Link>
            </div>
          </div>
          <div className="border-t border-slate-700/80 mt-8 pt-6 text-center">
            <p className="text-slate-500 text-sm">
              © 2025 Ludmil Paulo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
