import Layout from "./components/Layout";
import Image from "next/image";

export default function Home() {
  return (
    <Layout>
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4 -mt-16 sm:-mt-20">
        
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-8">
          <div className="absolute inset-0 bg-gray-400 rounded-full"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 border-[var(--accent-color)] -mb-1"></div>
            <div className="w-10 h-14 sm:w-12 sm:h-16 border-l-4 border-r-4 border-b-4 border-[var(--accent-color)] transform skew-y-6"></div>
          </div>
          
          <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 text-3xl sm:text-4xl text-[var(--accent-color)]">
            v v v v v
          </div>
        </div>
        
        {/*
          - `text-5xl`: Base size for mobile phones.
          - `sm:text-6xl`: Size for small tablets and larger phones.
          - `md:text-7xl`: The original size for tablets and desktops.
        */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl tracking-wider">
          @pashaslayer
        </h1>
      </main>
    </Layout>
  );
}