import webDevImg from "./web-dev.jpeg";
import marketingImg from "./marketingImg.jpeg";
import ServiceSection from "./serviceSection";

const Services = () => {
    return (
        <div className="p-4">
            <ServiceSection
                title="Développement d’Applications et Logiciels"
                description="Que vous ayez besoin d’une application mobile, d’un logiciel métier ou d’un outil web performant, nous concevons des solutions adaptées à vos exigences. Notre expertise nous permet d’offrir des produits évolutifs, ergonomiques et sécurisés."
                details={
                    <p className="text-sm sm:text-2xl text-left my-4 sm:my-8">
                        <strong>Applications mobiles & web</strong>:
                        Développement d’applications intuitives pour iOS,
                        Android et le web, avec une expérience utilisateur
                        optimisée. <br />
                        <br />
                        <strong>Logiciels sur mesure</strong>: Conception
                        d’outils spécifiques à votre secteur d’activité pour
                        automatiser et améliorer votre gestion. <br />
                        <br />
                        <strong>Intégration et maintenance</strong>:
                        Installation fluide dans votre environnement
                        technologique et support technique pour garantir la
                        pérennité de vos solutions.
                    </p>
                }
                buttonText="Contactez nous"
                image={webDevImg}
            />
            <ServiceSection
                title="Marketing Digital"
                description="Le digital est un levier puissant pour atteindre vos objectifs commerciaux. Nous créons et déployons des stratégies adaptées pour maximiser votre présence en ligne et accroître votre chiffre d’affaires."
                details={
                    <p className="text-sm sm:text-2xl text-left my-4 sm:my-8">
                        <strong>Stratégie de communication digitale</strong>:
                        Analyse de votre marché, définition de vos objectifs et
                        mise en place d’une stratégie alignée avec votre image
                        de marque. <br />
                        <br />
                        <strong>Référencement SEO/SEA</strong>: Amélioration du
                        positionnement de votre site sur Google grâce à des
                        optimisations SEO et gestion de campagnes publicitaires
                        ciblées pour maximiser votre visibilité. <br />
                        <br />
                        <strong>Community Management</strong>: Animation et
                        modération de vos réseaux sociaux, création de contenus
                        engageants (posts, visuels, vidéos) et suivi des
                        performances pour renforcer votre interaction avec votre
                        audience et fidéliser votre communauté. <br />
                        <br />
                        <strong>Publicité en ligne</strong>: Campagnes ciblées
                        sur Google Ads, Facebook Ads et autres plateformes.
                    </p>
                }
                buttonText="Échangeons sur votre projet"
                image={marketingImg}
                reverse={true}
            />
            <ServiceSection
                title="Recrutement IT"
                description="Le recrutement de profils IT qualifiés est un enjeu majeur pour toute entreprise en pleine croissance. Nous mettons à votre disposition les meilleurs experts grâce à un processus de sélection rigoureux."
                details={
                    <p className="text-sm sm:text-2xl text-left my-4 sm:my-8">
                        <strong>Chasse de talents :</strong>: Identification des
                        profils les plus pertinents pour répondre à vos besoins
                        spécifiques. <br />
                        <br />
                        <strong>Évaluation et sélection des candidats</strong>:
                        Tests techniques et entretiens approfondis pour garantir
                        l’adéquation des profils aux postes. <br />
                        <br />
                        <strong>Accompagnement et intégration</strong>: Suivi
                        personnalisé des recrues pour assurer une transition
                        fluide et une performance optimale.
                    </p>
                }
                buttonText="Recrutez dès mainteant "
                image={webDevImg}
            />
        </div>
    );
};

export default Services;
