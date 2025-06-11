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
                } items-center justify-center px-4 sm:px-16`}
            >
                <div className="w-full sm:w-1/2 mx-8">
                    <p className="text-sm sm:text-2xl text-left">
                        {description}
                    </p>
                    <br />
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
                <img src={image} alt={title} className="w-full sm:w-1/2 my-4" />
            </div>
        </div>
    );
};

export default ServiceSection;
