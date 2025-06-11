// headerConfig.ts
import homeBanner from "./banner.jpeg";
import aboutBanner from "../about-us/about-us.jpeg";
import serviceBanner from '../nos-service/banner.jpeg'
import projectBanner from '../nos-projets/banner.jpg'


export const headerConfig: Record<
    string,
    {
        bannerImage: string;
        title: string;
        subtitle: string;
        btnText: string;
    }
> = {
    "/": {
        bannerImage: homeBanner,
        title: "Scar-Soft, des solutions digitales adaptées à votre réussite !",
        subtitle:
            "Nous transformons vos idées en solutions performantes et innovantes.",
        btnText: "Découvrez nos services"
    },
    "/a-propos": {
        bannerImage: aboutBanner,
        title: "Qui sommes-nous ?",
        subtitle:
            "Depuis 2015, nous avons réuni une équipe d’ingénieurs, d’experts en marketing digital et de spécialistes en recrutement IT pour accompagner les entreprises dans leur transformation numérique. Grâce à notre expertise en développement logiciel, en stratégie digitale et en gestion des talents, nous concevons des solutions innovantes adaptées aux besoins de nos clients.",
        btnText: "Discutons de votre projet"
    },
    "/nos-service": {
        bannerImage: serviceBanner,
        title: "Détail des Services",
        subtitle: "Chez Scar-Soft, nous offrons des solutions adaptées aux besoins des entreprises grâce à notre expertise en développement d’applications et logiciels, marketing digital, community management et recrutement IT. Découvrez en détail nos services et comment ils peuvent booster votre activité.",
        btnText: "Obtenir un devis"
    },
    "/nos-projets": {
        bannerImage: projectBanner,
        title: "Réalisations et études de cas",
        subtitle: "Découvrez quelques-unes de nos réalisations qui témoignent de notre expertise et de notre engagement envers nos clients.",
        btnText: "Discutons de votre projet"
    },
    
};
