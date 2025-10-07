import Layout from "../components/Layout";

export default function About() {
  return (
    <Layout>
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-7xl tracking-wider mb-12">About Me</h1>
        <div className="max-w-2xl mx-auto space-y-6 text-2xl">
          <p>Hello! I&apos;m Pavel. <span style={{ marginRight: '200px' }}></span>Nice to have you! </p>
          <p>This is my personal space on the web where I share my projects, thoughts, and experiences.</p>
          
          <h2 className="text-4xl tracking-wider pt-8">Skills & Technologies</h2>
          <ul className="list-none space-y-2">
            <li>JavaScript/TypeScript</li>
            <li>React & Vue.js</li>
            <li>Python</li>
            <li>Java</li>
            <li>❣</li>
          </ul>
        </div>
      </main>
    </Layout>
  );
}