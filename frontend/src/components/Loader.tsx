import { motion } from "framer-motion";

const Loading = ({ text = "Loading...", size = "w-10 h-10" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <motion.div
        className={`border-4 border-gray-300 border-t-blue-500 rounded-full ${size}`}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <p className="mt-3 text-lg font-medium text-gray-700">{text}</p>
    </div>
  );
};

export default Loading;
