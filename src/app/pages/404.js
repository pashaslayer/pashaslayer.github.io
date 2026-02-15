import Layout from "./components/Layout";
import Link from 'next/link';

export default function NotFound() {
  return (
    <Layout>
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-9xl tracking-wider">404</h1>
        <p className="text-4xl mt-4 mb-8">Page Not Found</p>
        <Link href="/" className="border-4 px-8 py-3 text-2xl hover:bg-gray-500/20 transition-colors">
          Return Home
        </Link>
      </main>
    </Layout>
  );
}