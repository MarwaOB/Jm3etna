
import RegisterPageOrganization from "../app/pages/RegisterPageOrganization"
import Need from "./pages/AddNeedsPage/AddNeedsPage"
import EventDetails from "./pages/EventsDetails/EventDetails"
import LoginPage from "../app/pages/LoginPage"
import SideBar from "../app/components/SideBar/SideBar";
import VolunteerList from "./pages/VolunteersDetails/VolunteersDetails";
import Dashboard from "./pages/Dashbord/Dashbord";
import EventsPage from "./pages/EventsPage/EventsPage"

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Need></Need>
      {/*<EventsPage></EventsPage>*/}
      {/*<Dashboard></Dashboard>*/}
      {/*<SideBar></SideBar>*/}
      {/*<VolunteerList></VolunteerList>*/}
      {/*<LoginPage></LoginPage>*/}
      {/*<RegisterPageOrganization></RegisterPageOrganization>*/}
      {/*<Need></Need>*/}
    {/* <EventDetails event={{
  eventName: "Charity Food Drive",
  dateStart: "2025-03-20",
  status: false, // Ongoing
  needs: [
    { type: "human", requiredPeople: 10, skill: "Medical", startTime: "10:00", endTime: "14:00" },
    { type: "material", itemName: "Blankets", requiredQuantity: 20 },
  ],
}} />*/}
      {/*<div className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Welcome to My Next.js App!</h1>
        <p className="text-gray-600 mt-2">
          This is a simple test to check if the Sidebar is working.chouuuuuuuuuuuuuuu
        </p>
      </div>*/}
    </div>
  );
}