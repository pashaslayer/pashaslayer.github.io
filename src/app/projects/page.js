import Layout from "../components/Layout";

const projects = [
  { title: "SportsMap", description: "Web-based platform designed to help users organize, join, and manage group sports events", tech: ["Vue.js", "Python", "PHP", "JavaScript" ], link: "#" },
  { title: "Helfit", description: "Coming soon...", tech: ["?", "?", "?", "?", "?"], link: "#" }
];

export default function Projects() {
  return (
    <Layout>
      <main className="flex-grow flex flex-col items-center text-center px-4">
        <h1 className="text-7xl tracking-wider mb-12">My Projects</h1>
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl w-full">
          {projects.map((project, index) => (
            <div key={index} className="border-4 p-6 space-y-4">
              <h3 className="text-4xl">{project.title}</h3>
              <p className="text-xl">{project.description}</p>
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                {project.tech.map((tech, i) => (
                  <span key={i} className="border-2 px-3 py-1 text-sm">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}