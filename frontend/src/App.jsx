import { Route,Routes } from 'react-router'
import VolunteerAgenda from "./pages/VolunteerAgenda"

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<VolunteerAgenda/>}/>
        <Route path='*' element={<h1 className="text-white p-4 bg-red">Page not found 404</h1>}/>

      </Routes>
    </>
  );
}

export default App;