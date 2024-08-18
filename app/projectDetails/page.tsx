"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";

const ProjectDetails = () => {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(true);

  const link = searchParams.get("link") || "";
  const title = searchParams.get("title") || "";
  const image = searchParams.get("image") || "";
  const description = searchParams.get("description") || "";

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start justify-center pt-20 pb-12 md:px-8 px-4 bg-gray-50">
      <div className="w-full md:w-1/2 md:pr-8">
        <Image
          alt={title}
          src={image}
          width={400}
          height={500}
          layout="responsive"
          className="rounded-lg shadow-md"
        />
      </div>
      <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-8">
        <div className="border-b border-gray-300 pb-4">
          <p className="text-sm text-gray-500">{title}</p>
          <h1 className="text-2xl font-semibold text-gray-800 mt-2">{title}</h1>
        </div>

        <button
          className="flex items-center mt-4 text-gray-700 hover:text-gray-900 focus:outline-none"
          aria-label="Show or hide details"
          onClick={() => setShow(!show)}
        >
          <span className="mr-2">Details</span>
          <FaChevronDown
            className={`transition-transform transform ${
              show ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {show && (
          <div className="mt-4 bg-white p-4 rounded-lg shadow-inner max-h-80 overflow-y-auto">
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        )}

        {link && (
          <div className="mt-6">
            <a
              href={link}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-colors duration-300"
            >
              Visit Project
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const SuspenseProjectDetails = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ProjectDetails />
  </Suspense>
);

export default SuspenseProjectDetails;
