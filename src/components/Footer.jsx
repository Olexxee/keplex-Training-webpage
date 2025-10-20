export default function Footer() {
  return (
    <footer className="w-full bg-blue-900 text-white py-8">
      <div className="px-6 md:px-12 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          © {new Date().getFullYear()} <strong>Keplex Training</strong>. All
          rights reserved.
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="text-xs md:text-sm hover:underline">
            Privacy
          </a>
          <a href="#" className="text-xs md:text-sm hover:underline">
            Terms
          </a>
          <a
            href="#registration"
            className="bg-green-500 px-4 py-2 rounded text-white text-sm"
          >
            Register
          </a>
        </div>
      </div>
    </footer>
  );
}
