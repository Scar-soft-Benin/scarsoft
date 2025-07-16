import AppBaseButton from "~/components/appBaseButton";
import AppBaseTitle from "~/components/appBaseTitle";
import { motion } from "motion/react";

interface ServiceSectionProps {
    title: string;
    description: string;
    details: React.ReactNode;
    buttonText: string;
    image: string;
    reverse?: boolean; // Optional: For row-reverse or column-reverse layout
}

const ServiceSection: React.FC<ServiceSectionProps> = ({
    title,
    description,
    details,
    buttonText,
    image,
    reverse = false
}) => {
    return (
        <div className="my-6 sm:16">
            <AppBaseTitle title={title} subtitle={""} />

            <div
                className={`flex flex-col sm:flex-row ${
                    reverse ? "sm:flex-row-reverse" : ""
                } items-center justify-around px-4 sm:px-16`}
            >
                {/* Animate Text Section */}
                <motion.div
                    className="w-full my-12 sm:w-1/2 mx-8 text-lg"
                    initial={{ opacity: 0, x: reverse ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <p className="text-lg sm:text-xl text-justify">
                        {description}
                    </p>
                    {details}
                    <AppBaseButton
                        text={buttonText}
                        textColor="text-dark"
                        bgColor="bg-secondary"
                        type="first"
                        href={"/contactez-nous"}
                        className="w-full sm:w-2/3"
                    />
                </motion.div>

                {/* Animate Image Section */}
                <motion.img
                    src={image}
                    alt={title}
                    className="w-full sm:w-1/3 my-4 rounded-xl shadow-lg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                />
            </div>
        </div>
    );
};

export default ServiceSection;
