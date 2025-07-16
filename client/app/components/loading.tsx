import { motion } from "motion/react";
import { useLoading } from "~/context/loadingContext";

export default function Loading() {
    const { isLoading } = useLoading();

    return (
        <motion.div
            animate={
                isLoading
                    ? { opacity: 1, display: "flex" }
                    : { opacity: 0, transitionEnd: { display: "none" } }
            }
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
            <motion.div
                animate={
                    isLoading
                        ? { opacity: 1, scale: 1, rotate: 360 }
                        : { opacity: 0, scale: 0.8 }
                }
                transition={
                    isLoading
                        ? {
                              opacity: { duration: 0.5, ease: "easeOut" },
                              scale: { duration: 0.5, ease: "easeOut" },
                              rotate: {
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear"
                              }
                          }
                        : {
                              opacity: { duration: 0.5, ease: "easeOut" },
                              scale: { duration: 0.5, ease: "easeOut" }
                          }
                }
                className="w-16 h-16 border-4 border-t-secondary border-gray-200 rounded-full animate-spin"
            ></motion.div>
        </motion.div>
    );
}
