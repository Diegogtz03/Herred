import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BodyTemplate({
  children,
  sidebarContent,
  isSidebarOpen,
}: {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
  isSidebarOpen?: boolean;
  onSidebarToggle?: (isOpen: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(isSidebarOpen);

  useEffect(() => {
    setIsOpen(isSidebarOpen);
  }, [isSidebarOpen]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 overflow-auto">{children}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full border-l border-gray-200 bg-white overflow-auto"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
