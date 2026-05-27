function App() {
  return (
    <div className="min-h-screen bg-black text-white">

      <nav className="flex justify-between items-center p-5">
        <h1 className="text-3xl font-bold">
          My Website
        </h1>

        <ul className="flex gap-5">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>

      <div className="flex flex-col justify-center items-center h-[80vh] text-center">

        <h1 className="text-6xl font-bold mb-5">
          Welcome to My Website
        </h1>

        <p className="text-gray-400 max-w-xl">
          I built this website using React and Vite.
        </p>

        <button className="mt-8 bg-white text-black px-6 py-3 rounded-xl">
          Explore
        </button>

      </div>

    </div>
  )
}

export default App
import Navbar from "./components/Navbar"

<Navbar />