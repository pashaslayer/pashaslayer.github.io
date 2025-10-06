export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">About Me</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Hello! I&apos;m a passionate developer who loves building amazing things with code.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              This is my personal space on the web where I share my projects, thoughts, and experiences.
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Skills & Technologies</h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6">
              <li>JavaScript/TypeScript</li>
              <li>React & Next.js</li>
              <li>Node.js</li>
              <li>Python</li>
              <li>And much more...</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}