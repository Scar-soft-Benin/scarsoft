import AppBaseButton from "~/components/appBaseButton";
import AppBaseTitle from "~/components/appBaseTitle";
import project_1 from "./project_1.jpeg";
import project_2 from "./project_2.jpeg";

const NosProject = () => {
    return (
        <div className="py-8 px-6">
            <AppBaseTitle
                title="Projets"
                subtitle="Nous avons collaboré avec de nombreuses entreprises à travers des projets novateurs"
            >
                <div className="sm:mr-32 my-4 sm:my-0">
                    <AppBaseButton
                        text="Tous nos projets"
                        bgColor="bg-secondary"
                        href="/projects"
                        textColor="text-dark"
                        type="first"
                    />
                </div>
            </AppBaseTitle>

            {/* Main project list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <img
                            src={project.image}
                            alt={`Project ${index + 1}`}
                            className="w-lg h-64 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-xl font-semibold">
                            {project.title}
                        </h3>
                        <p className="text-center text-gray-600">
                            {project.subtitle}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NosProject;

const projects = [
    {
        image: project_1,
        title: "Project 1 Title",
        subtitle: "Project 1 Subtitle"
    },
    {
        image: project_2,
        title: "Project 2 Title",
        subtitle: "Project 2 Subtitle"
    },
    {
        image: project_1,
        title: "Project 3 Title",
        subtitle: "Project 3 Subtitle"
    }
    // Add more projects as needed
];
