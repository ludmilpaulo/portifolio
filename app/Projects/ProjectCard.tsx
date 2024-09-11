import Image from "next/image";
import Link from "next/link";
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
  demo: string;
  github: string;
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
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
        {/* Project Image */}
        <Image
          src={image}
          alt={title}
          width={400}
          height={250}
          className="w-full object-cover rounded-t-lg"
        />

        {/* Project Details */}
        <div className="px-6 py-4">
          <h3 className="font-bold text-xl mb-2 text-gray-800">{title}</h3>
          <p className="text-gray-600 text-sm">{truncatedDescription}</p>
        </div>

        {/* Tools Used */}
        <div className="px-6 py-4">
          <h4 className="font-semibold mb-2 text-gray-700">Tools Used:</h4>
          <div className="flex space-x-2 overflow-x-auto no-scrollbar">
            {tools.map((tool) => (
              <div key={tool.id} className="flex-shrink-0 flex items-center bg-gray-100 p-2 rounded-lg shadow-sm hover:bg-gray-200 transition">
                <Image
                  src={tool.image}
                  alt={tool.title}
                  width={30}
                  height={30}
                  className="mr-2 rounded-full"
                />
                <div>
                  <span className="font-semibold">{tool.title}</span>
                  <span className="text-sm text-gray-500"> - {tool.percentage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Links */}
        <div className="flex justify-between items-center px-6 py-4 border-t">
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-500 hover:text-yellow-600 transition"
          >
            <FaExternalLinkAlt className="mr-2" />
            <span>Demo</span>
          </a>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-700 hover:text-yellow-600 transition"
          >
            <FaGithub className="mr-2" />
            <span>GitHub</span>
          </a>
        </div>

        {/* View Details Button */}
        <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-b-lg transition-colors hover:bg-yellow-600">
          View Details
        </button>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
