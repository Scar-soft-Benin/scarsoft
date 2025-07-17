import { motion } from "motion/react";

interface AppBaseTitleProps {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}

const AppBaseTitle: React.FC<AppBaseTitleProps> = ({
    title,
    subtitle,
    children
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full h-32 md:h-40 bg-gradient-to-r from-green-100 via-green-50 to-green-100/30 flex items-center px-6 md:px-12 lg:px-24"
        >
            {/* Titre principal à gauche */}
            <div className="flex-flex-shrink-1">
                <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-800">
                    {title}
                </h1>
            </div>

            {/* Sous-titre à droite */}
            <div className="flex-1 ml-8 md:ml-16 flex items-center">
                <p className="text-sm md:text-lg lg:text-xl text-gray-600 font-medium">
                    {subtitle}
                </p>
            </div>

            {/* Children si présents */}
            {children && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    {children}
                </div>
            )}
        </motion.div>
    );
};

export default AppBaseTitle;
