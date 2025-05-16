import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../sidebar/Sidebar";

export default function BodyCanvas({
  children,
  isSidebarOpen,
}: {
  children: React.ReactNode;
  isSidebarOpen?: boolean;
  onSidebarToggle?: (isOpen: boolean) => void;
}) {

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 overflow-auto">{children}</div>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full border-l border-gray-200 bg-white overflow-auto"
          >
            <Sidebar/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
