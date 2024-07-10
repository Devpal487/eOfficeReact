import DashboardPageLayout from "../pages/master/MasterPageLayout";
import { RouteType } from "./config";
import DashboardIndex from "../pages/master/MasterPageIndex";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import HomeIcon from "@mui/icons-material/Home";
import ZoneMaster from "../pages/master/ZoneMaster/ZoneMaster";
import ZoneMasterAdd from "../pages/master/ZoneMaster/ZoneMasterAdd";
import ZoneMasterEdit from "../pages/master/ZoneMaster/ZoneMasterEdit";
import DepartmentMaster from "../pages/master/DepartmentMaster/DepartmentMaster";
import DesignationMaster from "../pages/master/DesignationMaster/DesignationMaster";
import DesignationMasterAdd from "../pages/master/DesignationMaster/DesignationMasterAdd";
import DesignationMasterEdit from "../pages/master/DesignationMaster/DesignationMasterEdit";
import LoginPage from "../loginPage/LoginPage";
import HomePage from "../pages/home/HomePage";
import WardMaster from "../pages/master/WardMaster/WardMaster";
import WardMasterAdd from "../pages/master/WardMaster/WardMasterAdd";
import WardMasterEdit from "../pages/master/WardMaster/WardMasterEdit";
import DepartmentAdd from "../pages/master/DepartmentMaster/DepartmentAdd";
import DepartmentEdit from "../pages/master/DepartmentMaster/DepartmentEdit";
// import FileAssigning from "../pages/Library/FileAssigning/FileAssigning";
// import IssueReturn from "../pages/Library/IssueReturn/IssueReturn";
import CityMaster from "../pages/master/CityMaster/CityMaster";
import CityMasterAdd from "../pages/master/CityMaster/CityMasterAdd";
import CityMasterEdit from "../pages/master/CityMaster/CityMasterEdit";
import StateMaster from "../pages/master/StateMaster/StateMaster";
import StateMasterAdd from "../pages/master/StateMaster/StateMasterAdd";
import StateMasterEdit from "../pages/master/StateMaster/StateMasterEdit";
import GenderMaster from "../pages/master/GenderMaster/GenderMaster";
import GenderMasterAdd from "../pages/master/GenderMaster/GenderMasterAdd";
import GenderMasterEdit from "../pages/master/GenderMaster/GenderMasterEdit";
import CountryMaster from "../pages/master/CountryMaster/CountryMaster";
import CountryMasterAdd from "../pages/master/CountryMaster/CountryMasterAdd";
import CountryMasterEdit from "../pages/master/CountryMaster/CountryMasterEdit";
import UserManagement from "../pages/UserManagementMaster/UserManagement/UserManagement";
import UserManagementAdd from "../pages/UserManagementMaster/UserManagement/UserManagementAdd";
import UserManagementEdit from "../pages/UserManagementMaster/UserManagement/UserManagementEdit";
import UserType from "../pages/UserManagementMaster/UserType/UserType";
import RoleMaster from "../pages/UserManagementMaster/RoleMaster/RoleMaster";
import UserPermissionMaster from "../pages/UserManagementMaster/UserPermissionMaster/UserPermissionMaster";
import MenuMaster from "../pages/master/Menu/MenuMaster";
import MenuMasterAdd from "../pages/master/Menu/MenuMasterAdd";
import MenuMasterEdit from "../pages/master/Menu/MenuMasterEdit";
import EmployeeMaster from "../pages/Employee/EmployeeMaster";
import EmployeeAdd from "../pages/Employee/EmployeeAdd";
import EmployeeEdit from "../pages/Employee/EmployeeEdit";
import Jurisdiction from "../pages/master/Jurisdiction/Jurisdiction";
import JurisdictionMasterAdd from "../pages/master/Jurisdiction/JurisdictionMasterAdd";
import JurisdictionMasterEdit from "../pages/master/Jurisdiction/JurisdictionMasterEdit";
import NodePermission from "../pages/master/NodePermission/NodePermission";
import CommitteeMaster from "../pages/Committee/Committee/CommitteeMaster";
import CommitteeAdd from "../pages/Committee/Committee/CommitteeAdd";
import CommitteeEdit from "../pages/Committee/Committee/CommitteeEdit";
import CommitteeEmployeeMapping from "../pages/Committee/CommitteeEmployeeMapping/CommitteeEmployeeMapping";
import CommitteeEmployeeMappingAdd from "../pages/Committee/CommitteeEmployeeMapping/CommitteeEmployeeMappingAdd";
import CommitteeEmployeeMappingEdit from "../pages/Committee/CommitteeEmployeeMapping/CommitteeEmployeeMappingEdit";
import Route from "../pages/Route/RouteMaster/Route";
import RouteAdd from "../pages/Route/RouteMaster/RouteAdd";
import RouteEdit from "../pages/Route/RouteMaster/RouteEdit";
import AuthorityMaster from "../pages/master/Authority/AuthorityMaster";
import PageCreate from "../pages/master/PageCreate/PageCreate";
import PageCreateAdd from "../pages/master/PageCreate/PageCreateAdd";
import PageCreateEdit from "../pages/master/PageCreate/PageCreateEdit";
import Institute from "../pages/master/InstitueForm/Institute";
import InstituteAdd from "../pages/master/InstitueForm/InstituteAdd";
import ReviewOficer from "../pages/home/ReviewOficer";
import ViewEditFile from "../pages/Committee/ViewEditFile/ViewEditFile";
import Correspondence from "../pages/Committee/Correspondence/Correspondence";
import SplitPDF from "../pages/DocManagement/SplitPDFToJump/SplitPDF";
import SplitPage from "../pages/DocManagement/SplitPDFToJump/SplitPage";
import SectionMaster from "../pages/master/SectionMaster/SectionMaster";
import SectionMasterAdd from "../pages/master/SectionMaster/SectionMasterAdd";
import SectionMasterEdit from "../pages/master/SectionMaster/SectionMasterEdit";
import DocumentIndexing from "../pages/reports/DocumentReports/DocumentIndexing";
import FileCategory from "../pages/FileManagement/FileCategory/FileCategory";
import FileCategoryAdd from "../pages/FileManagement/FileCategory/FileCategoryAdd";
import FileCategoryEdit from "../pages/FileManagement/FileCategory/FileCategoryEdit";
import FileMaster from "../pages/FileManagement/FileMaster/FileMaster";
import LetterType from "../pages/FileManagement/LetterType/LetterType";
import FileType from "../pages/FileManagement/FileType/FileType";
import FileClassAdd from "../pages/FileManagement/FileClass/FileClassAdd";
import FileClassEdit from "../pages/FileManagement/FileClass/FileClassEdit";
import FileClass from "../pages/FileManagement/FileClass/FileClass";
import FileGroup from "../pages/FileManagement/FileGroup/FileGroup";
import FileSubject from "../pages/FileManagement/FileSubject/FileSubject";
import InstituteEdit from "../pages/master/InstitueForm/InstituteEdit";
import AuthorityEmployeeMapping from "../pages/master/Authority Employee Mapping/AuthorityEmployeeMapping";
import AuthorityMail from "../pages/Committee/AuthorityMail/AuthorityMail";
import HelpCreation from "../pages/master/HelpCreation/HelpCreation";
import HelpDesk from "../pages/master/HelpDesk/HelpDesk";
import Certificate from "../pages/master/Certificate/Certificate";
import CertificateAdd from "../pages/master/Certificate/CertificateAdd";
import CertificateEdit from "../pages/master/Certificate/CertificateEdit";
import StatusMaster from "../pages/master/StatusMaster/StatusMaster";

const appRoutes: RouteType[] = [
  {
    index: true,
    element: <LoginPage />,
    state: "home",
  },
  {
    element: <HomePage />,
    state: "home",
    path: "/home",
    sidebarProps: {
      displayText: "Home",
      icon: <HomeIcon />,
    },
  },
  {
    element: <ReviewOficer />,
    state: "ReviewOficer",
    path: "/home/ReviewOficer",
    sidebarProps: {
      displayText: "ReviewOficer",
     
    },
   
  },
  {
    path: "/master",
    element: <DashboardPageLayout />,
    state: "master",
    sidebarProps: {
      displayText: "Master",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "master.index",
      },
      {
        path: "/master/ZoneMaster",
        element: <ZoneMaster />,
        state: "master.ZoneMaster",
        sidebarProps: {
          displayText: "Zone Master",
        },
      },
      {
        path: "/master/ZoneMasterAdd",
        element: <ZoneMasterAdd />,
        state: "master.ZoneMasterAdd",
      },
      {
        path: "/master/ZoneMasterEdit",
        element: <ZoneMasterEdit />,
        state: "master.ZoneMasterEdit",
      },
      {
        path: "/master/WardMaster",
        element: <WardMaster />,
        state: "master.WardMaster",
        sidebarProps: {
          displayText: "Ward Master",
        },
      },
      {
        path: "/master/WardMasterAdd",
        element: <WardMasterAdd />,
        state: "master.WardMasterAdd",
      },
      {
        path: "/master/WardMasterEdit",
        element: <WardMasterEdit />,
        state: "master.WardMasterEdit",
      },
      {
        path: "/master/DepartmentMaster",
        element: <DepartmentMaster />,
        state: "master.DepartmentMaster",
        sidebarProps: {
          displayText: "Department Master",
        },
      },
      {
        path: "/master/DepartmentAdd",
        element: <DepartmentAdd />,
        state: "master.DepartmentAdd",
      },
      {
        path: "/master/DepartmentEdit",
        element: <DepartmentEdit/>,
        state: "master.DepartmentEdit",
      },

      {
        path: "/master/DesignationMaster",
        element: <DesignationMaster />,
        state: "master.DesignationMaster",
        sidebarProps: {
          displayText: "Designation Master",
        },
      },
      {
        path: "/master/DesignationMasterAdd",
        element: <DesignationMasterAdd />,
        state: "master.DesignationMasterAdd",
      },
      {
        path: "/master/DesignationMasterEdit",
        element: <DesignationMasterEdit />,
        state: "master.DesignationMasterEdit",
      },
      {
        path: "/master/CityMaster",
        element: <CityMaster />,
        state: "master.CityMaster",
        sidebarProps: {
          displayText: "District",
        },
      },
      {
        path: "/master/CityMasterAdd",
        element: <CityMasterAdd />,
        state: "master.CityMasterAdd",
      },
      {
        path: "/master/CityMasterEdit",
        element: <CityMasterEdit />,
        state: "master.CityMasterEdit",
      },
      {
        path: "/master/StateMaster",
        element: <StateMaster />,
        state: "master.StateMaster",
        sidebarProps: {
          displayText: "State",
        },
      },
      {
        path: "/master/StateMasterAdd",
        element: <StateMasterAdd />,
        state: "master.StateMasterAdd",
      },
      {
        path: "/master/StateMasterEdit",
        element: <StateMasterEdit />,
        state: "master.StateMasterEdit",
      },
      {
        path: "/master/GenderMaster",
        element: <GenderMaster />,
        state: "master.GenderMaster",
        sidebarProps: {
          displayText: "Gender",
        },
      },
      {
        path: "/master/GenderMasterAdd",
        element: <GenderMasterAdd />,
        state: "master.GenderMasterAdd",
      },
      {
        path: "/master/GenderMasterEdit",
        element: <GenderMasterEdit />,
        state: "master.GenderMasterEdit",
      },
      {
        path: "/master/CountryMaster",
        element: <CountryMaster />,
        state: "master.CountryMaster",
        sidebarProps: {
          displayText: "Country",
        },
      },
      {
        path: "/master/CountryMasterAdd",
        element: <CountryMasterAdd />,
        state: "master.CountryMasterAdd",
      },
      {
        path: "/master/CountryMasterEdit",
        element: <CountryMasterEdit />,
        state: "master.CountryMasterEdit",
      },
      {
        path: "/master/MenuMaster",
        element: <MenuMaster />,
        state: "master.MenuMaster",
        sidebarProps: {
          displayText: "Menu Master",
        },
      },
      {
        path: "/master/MenuMasterAdd",
        element: <MenuMasterAdd />,
        state: "master.MenuMasterAdd",
      },
      {
        path: "/master/MenuMasterEdit",
        element: <MenuMasterEdit />,
        state: "master.MenuMasterEdit",
      },

      {
        path: "/master/Jurisdiction",
        element: <Jurisdiction/>,
        state: "master.Jurisdiction",
        sidebarProps: {
          displayText: "Jurisdiction",
        },
      },
      {
        path: "/master/NodePermission",
        element: <NodePermission/>,
        state: "master.NodePermission",
        sidebarProps: {
          displayText: "Node Permission",
        },
      },

      {
        path: "/master/JurisdictionMasterAdd",
        element: <JurisdictionMasterAdd/>,
        state: "master.JurisdictionMasterAdd",
      },

      {
        path: "/master/JurisdictionMasterEdit",
        element: <JurisdictionMasterEdit/>,
        state: "master.JurisdictionMasterEdit",
      },
     
      
      
      {
        path: "/master/PageCreate",
        element: <PageCreate/>,
        state: "master.PageCreate",
        sidebarProps: {
          displayText: "Page Create",
        },
      },

      {
        path: "/master/PageCreateAdd",
        element: <PageCreateAdd/>,
        state: "master.PageCreateAdd",
      },

      {
        path: "/master/PageCreateEdit",
        element: <PageCreateEdit/>,
        state: "master.PageCreateEdit",
      },
      {
        path: "/master/Institute",
        element: <Institute/>,
        state: "master.Institute",
        sidebarProps: {
          displayText: "Institute Form",
        },
      },

      {
        path: "/master/InstituteAdd",
        element: <InstituteAdd/>,
        state: "master.InstituteAdd",
      },

      {
        path: "/master/InstituteEdit",
        element: <InstituteEdit/>,
        state: "master.InstituteEdit",
      },

      {
        path: "/master/HelpCreation",
        element: <HelpCreation/>,
        state: "master.HelpCreation",
        sidebarProps: {
          displayText: "Help Creation",
        },
      },

      {
        path: "/master/HelpDesk",
        element: <HelpDesk/>,
        state: "master.HelpDesk",
        sidebarProps: {
          displayText: "Help Desk",
        },
      },

      {
        path: "/master/Certificate",
        element: <Certificate/>,
        state: "master.Certificate",
        sidebarProps: {
          displayText: "Certificate Apply",
        },
      },

      {
        path: "/master/CertificateAdd",
        element: <CertificateAdd/>,
        state: "master.CertificateAdd",
      },

      {
        path: "/master/CertificateEdit",
        element: <CertificateEdit/>,
        state: "master.CertificateEdit",
      },


      {
        path: "/master/StatusMaster",
        element: <StatusMaster/>,
        state: "master.StatusMaster",
        sidebarProps: {
          displayText: "Status Master",
        },
      },





     



    ],
  },
  //======================Master Form End========================


  //======================FileManagement Start====================
  {
      path: "/FileManagement",
      element: <DashboardPageLayout />,
      state: "FileManagement",
      child: [
        {
          index: true,
          element: <DashboardIndex />,
          state: "FileManagement.index",
        },
        {
          path: "/FileManagement/FileCategory",
          element: <FileCategory />,
          state: "FileManagement.FileCategory",
          sidebarProps: {
            displayText: "File Category",
          },
        },
        {
          path: "/FileManagement/FileCategoryAdd",
          element: <FileCategoryAdd />,
          state: "FileManagement.FileCategoryAdd",
        },
        {
          path: "/FileManagement/FileCategoryEdit",
          element: <FileCategoryEdit />,
          state: "FileManagement.FileCategoryEdit",
        },
        {
          path: "/FileManagement/FileMaster",
          element: <FileMaster />,
          state: "FileManagement.FileMaster",
          sidebarProps: {
            displayText: "File Master",
          },
        },
        {
          path: "/FileManagement/LetterType",
          element: <LetterType />,
          state: "FileManagement.LetterType",
          sidebarProps: {
            displayText: "Letter Type",
          },
        },
        {
          path: "/FileManagement/FileType",
          element: <FileType/>,
          state: "FileManagement.FileType",
          sidebarProps: {
            displayText: "File Type",
          },
        },
        {
          path: "/FileManagement/FileClass",
          element: <FileClass/>,
          state: "FileManagement.FileClass",
          sidebarProps: {
            displayText: "File Class",
          },
        },
  
        {
          path: "/FileManagement/FileClassAdd",
          element: <FileClassAdd/>,
          state: "FileManagement.FileClassAdd",
          
        },
        {
          path: "/FileManagement/FileClassEdit",
          element: <FileClassEdit/>,
          state: "FileManagement.FileClassEdit",
          
        },
        {
          path: "/FileManagement/FileGroup",
          element: <FileGroup/>,
          state: "FileManagement.FileGroup",
          sidebarProps: {
            displayText: "File Group",
          },
        },
        {
          path: "/FileManagement/FileSubject",
          element: <FileSubject/>,
          state: "FileManagement.FileSubject",
          sidebarProps: {
            displayText: "File Subject",
          },
        },
      ]},
  //======================FileManagement End====================

  
//   //==================Start Committee====================
  {
    path: "/E-Office",
    element: <DashboardPageLayout />,
    state: "E-Office",
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "E-Office.index",
      },
      {
        path: "/E-Office/CommitteeMaster",
        element: <CommitteeMaster />,
        state: "E-Office.CommitteeMaster",
        sidebarProps: {
          displayText: "Committee/Group",
        },
      },
      {
        path: "/E-Office/CommitteeAdd",
        element: <CommitteeAdd />,
        state: "E-Office.CommitteeAdd",
      },
      {
        path: "/E-Office/CommitteeEdit",
        element: <CommitteeEdit />,
        state: "E-Office.CommitteeEdit",
      },
      {
        path: "/E-Office/CommitteeEmployeeMapping",
        element: <CommitteeEmployeeMapping />,
        state: "E-Office.CommitteeEmployeeMapping",
        sidebarProps: {
          displayText: "Committee Employee Mapping",
        },
      },
      {
        path: "/E-Office/CommitteeEmployeeMappingAdd",
        element: <CommitteeEmployeeMappingAdd />,
        state: "E-Office.CommitteeEmployeeMappingAdd",
      },
      {
        path: "/E-Office/CommitteeEmployeeMappingEdit",
        element: <CommitteeEmployeeMappingEdit />,
        state: "E-Office.CommitteeEmployeeMappingEdit",
      },

      
      {
        path: "/E-Office/ViewEditFile",
        element: <ViewEditFile/>,
        state: "E-Office.ViewEditFile",
        sidebarProps: {
          displayText: "View Edit File",
        },
      },

      {
        path: "/E-Office/AuthorityMail",
        element: <AuthorityMail/>,
        state: "E-Office.AuthorityMail",
        sidebarProps: {
          displayText: "Authority Mail",
        },
      },

      {
        path: "/E-Office/Correspondence",
        element: <Correspondence/>,
        state: "E-Office.Correspondence",
        sidebarProps: {
          displayText: "Correspondence",
        },
      },

      {
        path: "/E-Office/SplitPDF",
        element: <SplitPDF/>,
        state: "E-Office.SplitPDF",
       
      },
      {
        path: "/E-Office/SplitPage",
        element: <SplitPage/>,
        state: "E-Office.SplitPage",
       
      },
      {
        path: "/E-Office/DocumentIndexing",
        element: <DocumentIndexing/>,
        state: "E-Office.DocumentIndexing",
       
      },

      {
        path: "/E-Office/Route",
        element: <Route />,
        state: "E-Office.Route",
        sidebarProps: {
          displayText: "Route",
        },
      },
      {
        path: "/E-Office/RouteAdd",
        element: <RouteAdd />,
        state: "E-Office.RouteAdd",
      },
      {
        path: "/E-Office/RouteEdit",
        element: <RouteEdit />,
        state: "E-Office.RouteEdit",
      },

      {
        path: "/E-Office/SectionMaster",
        element: <SectionMaster/>,
        state: "E-Office.SectionMaster",
        sidebarProps: {
          displayText: "Section",
        },
      },

      {
        path: "/E-Office/SectionMasterAdd",
        element: <SectionMasterAdd/>,
        state: "E-Office.SectionMasterAdd",
      },

      {
        path: "/E-Office/SectionMasterEdit",
        element: <SectionMasterEdit/>,
        state: "E-Office.SectionMasterEdit",
      },
      {
        path: "/E-Office/AuthorityEmployeeMapping",
        element: <AuthorityEmployeeMapping />,
        state: "E-Office.AuthorityEmployeeMapping",
        sidebarProps: {
          displayText: "Authority Emp Mapping",
        },
      },
      {
        path: "/E-Office/AuthorityMaster",
        element: <AuthorityMaster />,
        state: "E-Office.AuthorityMaster",
        sidebarProps: {
          displayText: "Authority",
        },
      },
    ],
  },
//   //===================End committee===================


  /////-------------------start ------UserManagement-----------------------

{
  path: "/UserManagement",
  element: <DashboardPageLayout/>,
  state: "UserManagement",
  sidebarProps: {
    displayText: "User Management",
    icon: <DashboardOutlinedIcon />
  },
  child: [
    {
      index: true,
      element: <DashboardIndex />,
      state: "UserManagement.index",
    },

    {
      path: "/UserManagement/UserManagement",
      element: <UserManagement/>,
      state: "UserManagement.UserManagement",
      sidebarProps: {
        displayText: "User Management Master",
      }
    },
    {
      path: "/UserManagement/UserManagementAdd",
      element: <UserManagementAdd/>,
      state: "UserManagement.UserManagementAdd",
      // sidebarProps: {
      //   displayText: "Advertisement Entry Add",
      // }
      },
      {
        path: "/UserManagement/UserManagementEdit",
        element: <UserManagementEdit/>,
        state: "UserManagement.UserManagementEdit",
   
        },
        // UserType
        {
          path: "/UserManagement/UserType",
          element: <UserType/>,
          state: "UserManagement.UserType",
          sidebarProps: {
            displayText: "User Type",
          }
        },
        {
          path: "/UserManagement/RoleMaster",
          element: <RoleMaster />,
          state: "UserManagement.RoleMaster",
          sidebarProps: {
            displayText: "Role Master",
          },
        },
        {
          path: "/UserManagement/UserPermissionMaster",
          element: <UserPermissionMaster />,
          state: "UserManagement.UserPermissionMaster",
          sidebarProps: {
            displayText: "User Permission",
          },
        },
        {
          path: "/UserManagement/NodePermission",
          element: <NodePermission/>,
          state: "UserManagement.NodePermission",
          sidebarProps: {
            displayText: "Node Permission",
          },
        },
    ]

  },

//==================end========UserManagement==========

  //==================== Start Employee Information====================
  {
    path: "/Employee",
    element: <DashboardPageLayout />,
    state: "Employee",
    sidebarProps: {
      displayText: "Employee",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "employeeinfo.index",
      },
      {
        path: "/Employee/EmployeeMaster",
        element: <EmployeeMaster />,
        state: "Employee.EmployeeMaster",
        sidebarProps: {
          displayText: "Employee Master",
        },
      },
      {
        path: "/Employee/EmployeeAdd",
        element: <EmployeeAdd />,
        state: "Employee.EmployeeAdd",
      },
      {
        path: "/Employee/EmployeeEdit",
        element: <EmployeeEdit />,
        state: "Employee.EmployeeEdit",
      },
      
    ],
  },
  //==================Start Correction=========Desable hai===========

  //==================Start Report=========Desable hai===========
  // {
  //   path: "/Reports",
  //   element: <DashboardPageLayout />,
  //   state: "Reports",
  //   child: [
  //     {
  //       path: "/Reports/FileDetailsReports",
  //       element: <FileDetailsReports />,
  //       state: "Reports.FileDetailsReports",
  //       sidebarProps: {
  //         displayText: "File Details Reports",
  //       },
  //     },
  //     {
  //       path: "/Reports/FileMovementReports",
  //       element: <FileMovementReports />,
  //       state: "Reports.FileMovementReports",
  //       sidebarProps: {
  //         displayText: "File Movement Reports",
  //       },
  //     },]
  //   }
];

export default appRoutes;
function handleSuccess(message: string): void {
  throw new Error("Function not implemented.");
}

