import Contact from "~/contacts/contact";
import NosProject from "~/nos-projets/nos-projet";
import About from "~/about-us/about";
import Service from "~/nos-service/service";

export function Welcome() {
    return (
        <>
            <About />
            <Service />
            <NosProject />
            <Contact />
        </>
    );
}
