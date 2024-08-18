import Image from "next/image";
import Link from "next/link";
import { SocialIcon } from "react-social-icons";
import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

interface Tool {
  id: number;
  title: string;
  percentage: string;
  description: string;
  image: string;
}

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  tools: Tool[];
  demo: string;    // Added demo link prop
  github: string;  // Added GitHub link prop
}

const truncateText = (htmlContent: string, maxLength: number) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  const plainText = tempDiv.textContent || "";
  return plainText.length > maxLength
    ? `${plainText.substring(0, maxLength)}...`
    : plainText;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  image,
  link,
  tools,
  demo,
  github,
}) => {
  const truncatedDescription = truncateText(description, 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      viewport={{ once: true }}
      className="max-w-sm rounded overflow-hidden shadow-lg bg-white transform transition-all duration-500 hover:scale-105"
    >
      <Link
        href={{
          pathname: "/projectDetails",
          query: {
            title: title,
            image: image,
            description: description,
            link: link,
          },
        }}
      >
        <Image
          src={image}
          alt={title}
          width={400}
          height={250}
          className="w-full object-cover"
        />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{title}</div>
          <p className="text-gray-700 text-base">{truncatedDescription}</p>
        </div>
        <div className="px-6 py-4">
          <h4 className="font-bold mb-2">Tools Used:</h4>
          <div className="flex space-x-4 overflow-x-auto no-scrollbar">
            {tools.map((tool) => (
              <div key={tool.id} className="flex-shrink-0 flex items-center bg-gray-100 p-2 rounded-lg shadow-sm hover:bg-gray-200 transition">
                <Image
                  src={tool.image}
                  alt={tool.title}
                  width={30}
                  height={30}
                  className="mr-2"
                />
                <div>
                  <span className="font-semibold">{tool.title}</span>
                  <span className="text-sm text-gray-600"> - {tool.percentage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center px-6 py-4">
          <a href={demo} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:text-yellow-600 transition">
            <FaExternalLinkAlt className="mr-2" />
            <span>Demo</span>
          </a>
          <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-800 hover:text-yellow-600 transition">
            <FaGithub className="mr-2" />
            <span>GitHub</span>
          </a>
        </div>
        <button className="w-full mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors hover:bg-yellow-600">
          View Details
        </button>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
