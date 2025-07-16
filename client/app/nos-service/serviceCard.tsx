import { motion } from "motion/react";

interface ServiceCardProps {
    image: string;
    title: string;
    description: string;
    alignment: "left" | "right";
}

const ServiceCard: React.FC<ServiceCardProps> = ({
    image,
    title,
    description,
    alignment
}) => {
    const initialX = alignment === "left" ? -100 : 100;

    return (
        <motion.div
            initial={{ opacity: 0, x: initialX }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className={`flex flex-col sm:flex-row items-center ${
                alignment === "left"
                    ? "justify-baseline sm:ml-36"
                    : "justify-end sm:mr-36"
            } mb-12 sm:mb-24`}
        >
            <div
                className="rounded-3xl w-[80vw] sm:w-72 h-72 bg-cover bg-center mt-10 shadow-lg"
                style={{ backgroundImage: `url(${image})` }}
            ></div>
            <div
                className="-mt-12 sm:mt-10 sm:-ml-12 rounded-lg flex flex-col bg-white border-xs p-4 w-[78vw] sm:w-lg"
                style={{ boxShadow: "0px 0px 20px 0px #04FF001A" }}
            >
                <h3 className="text-xl sm:text-4xl mb-6 font-bold">{title}</h3>
                <p className="text-left">{description}</p>
            </div>
        </motion.div>
    );
};

export default ServiceCard;
