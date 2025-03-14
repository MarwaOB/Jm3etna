export default function SideBar() {
    return (
      <div className="w-64 h-screen bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold">Sidebar</h2>
        <ul className="mt-4 space-y-2">
          <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer">🏠 Home</li>
          <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer">📄 About</li>
          <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer">📞 Contact</li>
        </ul>
      </div>
    );
  }