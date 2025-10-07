import Layout from "./components/Layout";
import Image from "next/image";

export default function Home() {
  return (
    <Layout>
      <main className="flex-grow flex flex-col justify-center items-center text-center -mt-20">
        <div className="relative w-40 h-40 mb-8">
          <div className="absolute inset-0 bg-gray-400 rounded-full"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full border-4 border-[var(--accent-color)] -mb-1"></div>
              <div className="w-12 h-16 border-l-4 border-r-4 border-b-4 border-[var(--accent-color)] transform skew-y-6"></div>
            </div>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl text-[var(--accent-color)]">
            v v v v v
          </div>
        </div>
        <h1 className="text-7xl tracking-wider">
          @pashaslayer
        </h1>
      </main>
    </Layout>
  );
}