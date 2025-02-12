// routes/about-us.tsx
import AboutUs from "~/about-us/about-us";

export function meta() {
    return [
        { title: "Scar Soft - About Us" },
        { name: "description", content: "Learn more about Scar-soft" }
    ];
}

export default function APropos() {
    return (
        <>
            <AboutUs />
        </>
    );
}
