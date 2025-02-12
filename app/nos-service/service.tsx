import AppBaseTitle from "~/components/appBaseTitle";
import card_1 from "./card-1.jpeg";
import card_2 from "./card-2.jpeg";
import card_3 from "./card-3.jpeg";

const Service = () => {
    return (
        <div className="p-4">
            <AppBaseTitle
                title="Nos Services"
                subtitle="Nous proposons une large gamme de services dans les domaines suivants :"
            />
            <div className="flex flex-col sm:flex-row items-center justify-baseline sm:ml-36 mb-12 sm:mb-24">
                <div
                    className="rounded-3xl w-[80vw] sm:w-72 h-72 bg-cover bg-center mt-10"
                    style={{ backgroundImage: `url(${card_1})` }}
                ></div>
                <div
                    className="-mt-12 sm:mt-10 sm:-ml-12 rounded-lg flex flex-col bg-white border-xs p-4 w-[78vw] sm:w-lg"
                    style={{ boxShadow: "0px 0px 20px 0px #04FF001A" }}
                >
                    <h3 className="text-xl sm:text-4xl mb-6 font-bold">
                        Développement d’applications et logiciels
                    </h3>
                    <p className="text-left">
                        Nous créons des applications mobiles et web
                        performantes, des logiciels métiers sur mesure et
                        assurons leur intégration ainsi que leur maintenance.
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end sm:mr-36 mb:12 sm:mb-24">
                <div
                    className="rounded-3xl w-[80vw] sm:w-72 h-72 bg-cover bg-center mt-10"
                    style={{ backgroundImage: `url(${card_2})` }}
                ></div>
                <div
                    className="-mt-12 sm:mt-10 sm:-ml-12 rounded-lg flex flex-col bg-white border-xs p-4 w-[78vw] sm:w-lg"
                    style={{ boxShadow: "0px 0px 20px 0px #04FF001A" }}
                >
                    <h3 className="text-xl sm:text-4xl mb-6 font-bold">
                        Marketing digital
                    </h3>
                    <p className="text-left">
                        Nous mettons en place des stratégies de communication
                        digitale, optimisons la visibilité des entreprises grâce
                        au SEO/SEA et gérons des campagnes publicitaires ciblées
                        pour maximiser leur impact.
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-baseline sm:ml-36">
                <div
                    className="rounded-3xl w-[80vw] sm:w-72 h-72 bg-cover bg-center mt-10"
                    style={{ backgroundImage: `url(${card_3})` }}
                ></div>
                <div
                    className="-mt-12 sm:mt-10 sm:-ml-12 rounded-lg flex flex-col bg-white border-xs p-4 w-[78vw] sm:w-lg"
                    style={{ boxShadow: "0px 0px 20px 0px #04FF001A" }}
                >
                    <h3 className="text-xl sm:text-4xl mb-6 font-bold">
                        Recrutement IT
                    </h3>
                    <p className="text-left">
                        Nous sélectionnons des talents spécialisés en IT,
                        évaluons leurs compétences et accompagnons leur
                        intégration pour répondre efficacement aux besoins des
                        entreprises.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Service;
