import AppBaseTitle from "~/components/appBaseTitle";
import innovationIcon from "./innovation.png";
import collaborationIcon from "./collaboration.png";
import expertiseIcon from "./expertise.png";
import excellenceIcon from "./excellence.png";
import adaptibilityIcon from "./adapatibility.png";
import responsabilityIcon from "./responsability.png";
import checkIcon from "./Check.png";
import illustration from "./demarchIllustration.jpeg";
import AppBaseButton from "~/components/appBaseButton";

import img_1 from "./img-1.jpeg";
import img_2 from "./img-2.jpeg";
import img_3 from "./img-3.jpeg";
import img_4 from "./img-4.jpeg";
import img_5 from "./img-5.jpeg";

const AboutUs = () => {
    const values = [
        {
            icon: innovationIcon,
            title: "Innovation",
            subtitle:
                "Toujours à la recherche de nouvelles idées et de solutions créatives pour répondre aux défis numériques de nos clients."
        },
        {
            icon: collaborationIcon,
            title: "Collaboration",
            subtitle:
                "Travailler ensemble, en interne et avec nos clients, pour concevoir des solutions sur mesure et assurer la réussite des projets."
        },
        {
            icon: expertiseIcon,
            title: "Expertise",
            subtitle:
                "Une équipe d'ingénieurs et de spécialistes hautement qualifiés pour offrir des services de développement logiciel, marketing digital et gestion des talents de qualité."
        },
        {
            icon: excellenceIcon,
            title: "Excellence",
            subtitle:
                "S'engager à fournir des résultats de qualité, avec une attention particulière aux détails et à l’efficacité."
        },
        {
            icon: adaptibilityIcon,
            title: "Adaptabilité",
            subtitle:
                "Être capable de s'ajuster aux évolutions technologiques et aux besoins changeants du marché pour proposer des solutions toujours pertinentes."
        },
        {
            icon: responsabilityIcon,
            title: "Responsabilité",
            subtitle:
                "Prendre des décisions éthiques et durables qui favorisent la réussite à long terme de nos clients et de notre équipe."
        }
    ];

    const demarches = [
        "Écoute et analyse : Nous échangeons avec vous pour comprendre vos besoins, vos objectifs et les défis à relever.",
        "Conception sur mesure : Nous élaborons des solutions personnalisées, intégrant les dernières innovations technologiques.",
        "Déploiement et optimisation : Nous assurons une mise en place fluide, avec des tests rigoureux pour garantir performance et fiabilité.",
        "Suivi et accompagnement : Nous restons à vos côtés pour assurer la maintenance, l’évolution et l’optimisation continue de vos solutions."
    ];

    const images = [
        { src: img_1, alt: "Image 1", span: "row-span-2" },
        { src: img_2, alt: "Image 2", span: "row-span-1" },
        { src: img_3, alt: "Image 3", span: "row-span-4" },
        { src: img_4, alt: "Image 4", span: "row-span-1" },
        { src: img_5, alt: "Image 5", span: "row-span-2 sm:col-span-2" }
    ];

    return (
        <div className="p-4">
            <AppBaseTitle
                title="Nos valeurs"
                subtitle="Nos actions et nos engagements reposent sur six piliers essentiels"
            />

            {/* Grid Section */}
            <div className="sm:px-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {values.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center p-6 rounded-2xl text-center"
                    >
                        <div className="mb-4">
                            <img
                                src={item.icon}
                                alt={item.title}
                                className="w-24 h-24"
                            />
                        </div>
                        <h3 className="font-bold text-xl">{item.title}</h3>
                        <p className="text-gray-600 mt-2">{item.subtitle}</p>
                    </div>
                ))}
            </div>

            <AppBaseTitle
                title="Notre démarche"
                subtitle="Une approche structurée et agile"
            />

            <p className="text-sm sm:text-2xl sm:my-4 text-center">
                Chez Scar-Soft, nous adoptons une approche structurée et agile
                pour garantir des solutions efficaces et adaptées aux besoins de
                nos clients.
            </p>

            <div className="px-4 sm:px-16 flex flex-col-reverse sm:flex-row justify-center items-center">
                <div className="flex flex-col sm:w-1/3 sm:mx-16">
                    {demarches.map((demarche, index) => (
                        <div className="flex flex-row my-4" key={index}>
                            <img
                                src={checkIcon}
                                alt="check icon"
                                className="w-8 h-8"
                            />
                            <p className="mx-4">{demarche}</p>
                        </div>
                    ))}
                </div>
                <img
                    src={illustration}
                    alt="demarche illustration"
                    className="sm:w-1/3 grayscale-100"
                />
            </div>
            <div className="flex flex-row items-center justify-center my-20">
                <AppBaseButton
                    type="first"
                    bgColor="bg-secondary"
                    textColor="text-dark"
                    href="/contact"
                    text="Contactez-nous dès aujourd’hui"
                />
            </div>

            <AppBaseTitle
                title="Notre équipe"
                subtitle="Notre équipe est composée de professionnels passionnés et expérimentés dans divers domaines "
            />

            <div className="flex flex-col sm:flex-row sm:px-32 mb-16 relative">
                <div className="flex flex-col">
                    <div className="bg-secondary text-white rounded-2xl p-8 sm:w-sm">
                        <h2 className="text-8xl">+ 10</h2>
                        <p>Membres de l'équipe</p>
                    </div>
                    <div className="border-l-secondary p-4 border-l-2 my-4 sm:w-2/3">
                        <p className="my-2 sm:text-xl">Développeurs Full Stack</p>
                        <p className="my-2 sm:text-xl">Designers UI/UX</p>
                        <p className="my-2 sm:text-xl">Community managers</p>
                        <p className="my-2 sm:text-xl">Experts en marketing digital</p>
                        <p className="my-2 sm:text-xl">Consultants en recrutement </p>
                    </div>
                </div>
                <div className="sm:-ml-24 mt-8 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[150px] z-30">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className={`${img.span} overflow-hidden rounded-lg`}
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
                <div className="sm:absolute sm:right-24 bg-secondary sm:w-32 sm:h-32 rounded-2xl -bottom-6"></div>
            </div>
        </div>
    );
};

export default AboutUs;
