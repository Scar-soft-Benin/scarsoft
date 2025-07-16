import { motion } from "motion/react";
import About from "~/about-us/about";
import Contact from "~/contact/contact";
import NosProject from "~/nos-projets/nos-projet";
import Service from "~/nos-service/service";

export function Welcome() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
        >
            <About />
            <Service />
            <NosProject />
            <Contact />
        </motion.div>
    );
}
