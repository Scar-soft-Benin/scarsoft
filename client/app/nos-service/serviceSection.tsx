import AppBaseButton from "~/components/appBaseButton";
import AppBaseTitle from "~/components/appBaseTitle";

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
                <div className="w-full my-12 sm:w-1/2 mx-8 text-lg">
                    <p className="text-lg sm:text-xl text-justify">
                        {description}
                    </p>
                    {details}
                    <AppBaseButton
                        text={buttonText}
                        textColor="text-dark"
                        bgColor="bg-secondary"
                        type="first"
                        href={'/contactez-nous'}
                        className="w-full sm:w-2/3"
                    />
                </div>
                <img src={image} alt={title} className="w-full sm:w-1/3 my-4 rounded-xl shadow-lg" />
            </div>
        </div>
    );
};

export default ServiceSection;
