import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { routes } from "./routes";
import LoginPage from "./loginPage/LoginPage";
import { Provider } from "react-redux";
import ServiceDashboard from "./pages/FileManagement/ServiceDashboard/ServiceDashboard";
import TokenGenration from "./pages/FileManagement/ServiceDashboard/TokenGenration";
import AplicantService from "./pages/FileManagement/ServiceDashboard/AplicantService";
import AplicantDetailsAdd from "./pages/DocManagement/AplicantDetails/AplicantDetailsAdd";




function App() {


  
  return (
    <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<LoginPage />}></Route> */}
          <Route path="/" element={<MainLayout />}>
            {routes}
          </Route>

          <Route path="/ServiceDashboard" element={<ServiceDashboard/>}></Route>
          <Route path="/TokenGenration" element={<TokenGenration/>}></Route>
          <Route path="/AplicantService" element={<AplicantService/>}></Route>
          <Route path="/AplicantDetailsAdd" element={<AplicantDetailsAdd/>}></Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
