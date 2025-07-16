import { Outlet } from "react-router";
import { motion } from "motion/react";

export default function MainContent() {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex-1 p-6 bg-neutral-light-bg dark:bg-neutral-dark-bg"
        >
            <Outlet />
        </motion.main>
    );
}
