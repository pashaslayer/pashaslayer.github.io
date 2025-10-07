import Layout from "../components/Layout";

export default function Contact() {
  return (
    <Layout>

      <main className="flex-grow flex items-center justify-center text-center">
        <h1 className="text-7">Contact: <br></br>Pavel.khakhlou@gmx.at</h1>
      </main>
      {/*
      <main className="flex-grow flex flex-col items-center text-center px-4">
        <h1 className="text-7xl tracking-wider mb-12">Contact Me</h1>
        <form className="w-full max-w-xl space-y-8 text-2xl">
          <input
            type="text"
            placeholder="Name"
            className="w-full bg-transparent border-b-4 pb-2 outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-transparent border-b-4 pb-2 outline-none"
          />
          <textarea
            placeholder="Message"
            rows="4"
            className="w-full bg-transparent border-b-4 pb-2 outline-none resize-none"
          ></textarea>
          <button
            type="submit"
            className="w-full border-4 py-3 text-3xl hover:bg-gray-500/20 transition-colors"
          >
            Send (does not work here, contact)
          </button>
        </form>
      </main>
      */}
    </Layout>
  );
}