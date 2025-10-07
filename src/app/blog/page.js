import Layout from "../components/Layout";

export default function Blog() {
  return (
    <Layout>
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-2xl">
          <h1 className="text-7xl tracking-wider mb-12">Blog</h1>
          <p className="text-3xl">
            Coming soon! I&apos;ll be sharing my thoughts and experiences here.
          </p>
        </div>
      </main>
    </Layout>
  );
}