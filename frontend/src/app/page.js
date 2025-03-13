import SideBar from "../app/components/SideBar/SideBar";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Welcome to My Next.js App!</h1>
        <p className="text-gray-600 mt-2">
          This is a simple test to check if the Sidebar is working.
        </p>
      </div>
    </div>
  );
}