"use client";
import { useGetMyInfoQuery } from "@/store/myInfoApi";
import { Competence } from "@/hooks/types";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

// ---- Skill Details Modal ----
const SkillModal: React.FC<{
  skill: Competence | null;
  onClose: () => void;
}> = ({ skill, onClose }) => {
  if (!skill) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed z-50 inset-0 bg-black/40 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.95 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-7 w-[98vw] max-w-sm sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl text-gray-300 dark:text-gray-500 hover:text-blue-500 dark:hover:text-cyan-400 font-bold"
          aria-label="Close modal"
        >×</button>
        <div className="flex flex-col items-center">
          <Image
            src={skill.image}
            alt={skill.title}
            width={96}
            height={96}
            className="rounded-full border-4 border-blue-100 dark:border-cyan-400 object-cover mb-3"
          />
          <h3 className="text-xl font-extrabold text-blue-700 dark:text-cyan-200 mb-2">{skill.title}</h3>
          <p className="text-base text-gray-700 dark:text-cyan-100 mb-3 text-center">{skill.description}</p>
          <div className="text-center text-xs text-gray-500 dark:text-cyan-300 mb-2">
            Proficiency: <span className="font-bold">{skill.percentage}%</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ---- Confetti for 100% skills ----
const MaxConfetti: React.FC<{ active: boolean }> = ({ active }) => {
  const { width, height } = useWindowSize();
  if (!active) return null;
  return (
    <Confetti width={width} height={height} numberOfPieces={120} recycle={false} />
  );
};

// ---- Skill Progress ----
const SkillProgress: React.FC<{ value: number }> = ({ value }) => (
  <div className="w-full mt-3">
    <div className="relative w-full h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, type: "spring" }}
        className="absolute left-0 top-0 h-full rounded-full
          bg-gradient-to-r from-green-400 via-blue-400 to-cyan-300
          dark:from-cyan-500 dark:via-blue-600 dark:to-blue-400
          shadow-[0_0_14px_0px_rgba(59,130,246,0.25)]"
        style={{ width: `${value}%` }}
      />
    </div>
    <div className="text-xs mt-1 text-gray-500 dark:text-gray-400 font-semibold">{value}%</div>
  </div>
);

type SortOption = "proficiency" | "az" | "za";
const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "By Proficiency", value: "proficiency" },
  { label: "A-Z", value: "az" },
  { label: "Z-A", value: "za" },
];

const getAllCategories = (skills: Competence[]): string[] => {
  const cats = new Set(skills.map((s) => s.category || "Other"));
  return ["All", ...Array.from(cats).filter((c) => !!c && c !== "All")];
};

const SkillsPage: React.FC = () => {
  const { data, isLoading, isError } = useGetMyInfoQuery();
  const [sort, setSort] = useState<SortOption>("proficiency");
  const [category, setCategory] = useState("All");
  const [modalSkill, setModalSkill] = useState<Competence | null>(null);
  const [dndSkills, setDndSkills] = useState<Competence[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // When data changes, update DnD state
  React.useEffect(() => {
    if (data?.competences) {
      setDndSkills([...data.competences]);
    }
  }, [data?.competences]);

  // Categories
  const categories = useMemo(() => (data?.competences ? getAllCategories(data.competences) : []), [data?.competences]);

  // Filtering/sorting
  const skills: Competence[] = useMemo(() => {
    let arr = [...dndSkills];
    if (category !== "All") arr = arr.filter((s) => s.category === category);
    if (sort === "proficiency") {
      arr.sort((a, b) => parseInt(b.percentage) - parseInt(a.percentage));
    } else if (sort === "az") {
      arr.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "za") {
      arr.sort((a, b) => b.title.localeCompare(a.title));
    }
    return arr;
  }, [dndSkills, sort, category]);

  // Responsive: grid or carousel
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Drag end handler (desktop only)
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(dndSkills);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setDndSkills(reordered);
    // If you want, POST new order to backend here!
  };

  // Show confetti if opening a 100% skill modal
  React.useEffect(() => {
    if (modalSkill && parseInt(modalSkill.percentage) === 100) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2400);
    }
  }, [modalSkill]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, type: "spring" }}
      className="min-h-screen flex flex-col items-center
        bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100
        dark:from-gray-950 dark:via-gray-900 dark:to-gray-950
        pb-16 overflow-x-hidden relative"
    >
      <MaxConfetti active={showConfetti} />
      {/* Animated bg */}
      <div className="pointer-events-none fixed z-0 inset-0">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-gradient-to-br from-cyan-200/30 via-blue-200/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tr from-blue-300/30 via-cyan-200/30 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header, Category and Sort */}
      <div className="mt-24 mb-10 text-center z-10">
        <h2 className="uppercase tracking-widest text-gray-600 dark:text-cyan-200 text-4xl font-extrabold drop-shadow">
          Skills
        </h2>
        <h4 className="mt-2 uppercase tracking-[3px] text-gray-500 dark:text-gray-400 text-base">
          Swipe/drag or tap for more info
        </h4>
        <div className="flex flex-wrap gap-3 mt-7 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-full border text-sm font-bold transition shadow
                ${category === cat
                  ? "bg-gradient-to-r from-blue-400 to-cyan-300 text-white shadow-lg scale-105 border-transparent"
                  : "bg-white dark:bg-gray-900 text-blue-800 dark:text-cyan-200 border-blue-100 dark:border-cyan-900 hover:bg-blue-100 dark:hover:bg-cyan-800/60"}
              `}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="mt-4 flex gap-4 justify-center">
          {SORT_OPTIONS.map((s) => (
            <button
              key={s.value}
              className={`px-4 py-2 rounded-full border text-sm font-bold transition shadow
                ${sort === s.value
                  ? "bg-gradient-to-r from-blue-400 to-cyan-300 text-white shadow-lg scale-105 border-transparent"
                  : "bg-white dark:bg-gray-900 text-blue-800 dark:text-cyan-200 border-blue-100 dark:border-cyan-900 hover:bg-blue-100 dark:hover:bg-cyan-800/60"}
              `}
              onClick={() => setSort(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skills: Grid or Carousel or DnD */}
      <div className="z-10 w-full">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 w-full max-w-7xl px-4 sm:px-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div key={i} className="flex flex-col items-center bg-white/60 dark:bg-gray-900/50 rounded-3xl px-6 py-8 animate-pulse">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-3" />
                <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-600 rounded mb-3" />
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded" />
              </motion.div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center text-red-400 dark:text-red-300 font-bold py-20">
            Could not load skills. Try again later.
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No skills found.</div>
        ) : isMobile ? (
          // Mobile Carousel (auto-advance)
          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView={1.12}
            spaceBetween={18}
            centeredSlides
            pagination={{ clickable: true }}
            autoplay={{ delay: 2600, disableOnInteraction: false }}
            className="max-w-xs mx-auto"
          >
            {skills.map((skill) => (
              <SwiperSlide key={skill.id}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, type: "spring" }}
                  viewport={{ once: true }}
                  className="group flex flex-col items-center 
                    bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl
                    shadow-2xl dark:shadow-blue-950 border border-blue-100 dark:border-blue-900
                    rounded-3xl px-6 py-7
                    hover:scale-105 hover:bg-white/90 dark:hover:bg-gray-900/80
                    hover:shadow-blue-300/30 dark:hover:shadow-cyan-400/40
                    transition-all duration-300 relative overflow-hidden"
                  tabIndex={0}
                  onClick={() => setModalSkill(skill)}
                >
                  <Image
                    src={skill.image}
                    alt={skill.title}
                    width={96}
                    height={96}
                    className="rounded-full border-2 border-blue-100 dark:border-cyan-400 object-cover shadow-lg dark:shadow-cyan-900"
                  />
                  <div className="mt-4 font-bold text-lg text-blue-800 dark:text-cyan-200 text-center drop-shadow">
                    {skill.title}
                  </div>
                  <SkillProgress value={parseInt(skill.percentage, 10)} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          // Desktop/Tablet Drag & Drop grid
       <DragDropContext onDragEnd={onDragEnd}>
  <Droppable droppableId="skills-droppable" direction="horizontal">
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="flex flex-wrap gap-8 w-full max-w-7xl px-4 sm:px-8"
      >
        {skills.map((skill, idx) => (
          <Draggable key={skill.id} draggableId={skill.id.toString()} index={idx}>
            {(prov, snapshot) => (
              <div
                ref={prov.innerRef}
                {...prov.draggableProps}
                {...prov.dragHandleProps}
                tabIndex={0}
                className={`
                  group flex flex-col items-center
                  bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl
                  shadow-2xl dark:shadow-blue-950 border border-blue-100 dark:border-blue-900
                  rounded-3xl px-6 py-7 cursor-grab
                  hover:scale-105 hover:bg-white/90 dark:hover:bg-gray-900/80
                  hover:shadow-blue-300/30 dark:hover:shadow-cyan-400/40
                  transition-all duration-300 relative overflow-hidden
                  before:absolute before:inset-0 before:rounded-3xl
                  before:border-2 before:border-blue-200 dark:before:border-cyan-900
                  before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300
                  ${snapshot.isDragging ? "ring-4 ring-blue-400/40 scale-110 shadow-2xl" : ""}
                `}
                onClick={() => setModalSkill(skill)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.07, type: "spring" }}
                  viewport={{ once: true }}
                >
                  <Image
                    src={skill.image}
                    alt={skill.title}
                    width={96}
                    height={96}
                    className="rounded-full border-2 border-blue-100 dark:border-cyan-400 object-cover shadow-lg dark:shadow-cyan-900"
                  />
                  <div className="mt-4 font-bold text-lg text-blue-800 dark:text-cyan-200 text-center drop-shadow">
                    {skill.title}
                  </div>
                  <SkillProgress value={parseInt(skill.percentage, 10)} />
                </motion.div>
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>

        )}
      </div>
      {/* Modal */}
      <AnimatePresence>
        {modalSkill && (
          <SkillModal
            skill={modalSkill}
            onClose={() => setModalSkill(null)}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default SkillsPage;
