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
// import FileClass from "../pages/Library/FileClass/FileClass";
// import FileClassAdd from "../pages/Library/FileClass/FileClassAdd";
// import FileClassEdit from "../pages/Library/FileClass/FileClassEdit";
// import FileGroup from "../pages/Library/FileGroup/FileGroup";
// import FileSubject from "../pages/Library/FileSubject/FileSubject";
// import FileType from "../pages/Library/FileType/FileType";
// import FileDetail from "../pages/Library/FileDetail/FileDetail";
// import FileDetailAdd from "../pages/Library/FileDetail/FileDetailAdd";
// import FileDetailEdit from "../pages/Library/FileDetail/FileDetailEdit";
// import LocationItem from "../pages/Library/LocationItem/LocationItem";
// import LocationItemAdd from "../pages/Library/LocationItem/LocationItemAdd";
// import LocationItemEdit from "../pages/Library/LocationItem/LocationItemEdit";
// import ReceiptStatus from "../pages/Library/ReceiptStatus/ReceiptStatus";
// import ReceiptType from "../pages/Library/ReceiptType/ReceiptType";
// import Location from "../pages/Library/Location/Location";
import FileCategory from "../pages/master/FileCategory/FileCategory";
import FileCategoryAdd from "../pages/master/FileCategory/FileCategoryAdd";
import FileCategoryEdit from "../pages/master/FileCategory/FileCategoryEdit";
// import FileDetailsReports from "../pages/reports/FileDetailsReports/FileDetailsReports";
// import FileMovementReports from "../pages/reports/FileMovementReports/FileMovementReports";
// import FileMovement from "../pages/Library/FileMovement/FileMovement";
// import UserFileMovement from "../pages/Library/UserFileMovement/UserFileMovement";
import Jurisdiction from "../pages/master/Jurisdiction/Jurisdiction";
import JurisdictionMasterAdd from "../pages/master/Jurisdiction/JurisdictionMasterAdd";
import JurisdictionMasterEdit from "../pages/master/Jurisdiction/JurisdictionMasterEdit";
import NodePermission from "../pages/master/NodePermission/NodePermission";
// import ReqForm from "../pages/Library/ReqForm/ReqForm";
// import ReqFormEdit from "../pages/Library/ReqForm/ReqFormEdit";
// import ReqFormAdd from "../pages/Library/ReqForm/ReqFormAdd";
import FileMaster from "../pages/master/FileMaster/FileMaster";
import LetterType from "../pages/master/LetterType/LetterType";
import CommitteeMaster from "../pages/Committee/Committee/CommitteeMaster";
import CommitteeAdd from "../pages/Committee/Committee/CommitteeAdd";
import CommitteeEdit from "../pages/Committee/Committee/CommitteeEdit";
import CommitteeEmployeeMapping from "../pages/Committee/CommitteeEmployeeMapping/CommitteeEmployeeMapping";
import CommitteeEmployeeMappingAdd from "../pages/Committee/CommitteeEmployeeMapping/CommitteeEmployeeMappingAdd";
import CommitteeEmployeeMappingEdit from "../pages/Committee/CommitteeEmployeeMapping/CommitteeEmployeeMappingEdit";
import Route from "../pages/Route/RouteMaster/Route";
// import FileMovementEdit from "../pages/Library/FileMovement/FileMovementEdit";
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
        path: "/master/FileCategory",
        element: <FileCategory />,
        state: "master.FileCategory",
        sidebarProps: {
          displayText: "File Category",
        },
      },
      {
        path: "/master/FileCategoryAdd",
        element: <FileCategoryAdd />,
        state: "master.FileCategoryAdd",
      },
      {
        path: "/master/FileCategoryEdit",
        element: <FileCategoryEdit />,
        state: "master.FileCategoryEdit",
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
        path: "/master/FileMaster",
        element: <FileMaster />,
        state: "master.FileMaster",
        sidebarProps: {
          displayText: "File Master",
        },
      },
      {
        path: "/master/LetterType",
        element: <LetterType />,
        state: "master.LetterType",
        sidebarProps: {
          displayText: "Letter Type",
        },
      },
      {
        path: "/master/AuthorityMaster",
        element: <AuthorityMaster />,
        state: "master.AuthorityMaster",
        sidebarProps: {
          displayText: "Authority",
        },
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
        path: "/master/SectionMaster",
        element: <SectionMaster/>,
        state: "master.SectionMaster",
        sidebarProps: {
          displayText: "Section",
        },
      },

      {
        path: "/master/SectionMasterAdd",
        element: <SectionMasterAdd/>,
        state: "master.SectionMasterAdd",
      },

      {
        path: "/master/SectionMasterEdit",
        element: <SectionMasterEdit/>,
        state: "master.SectionMasterEdit",
      },



    ],
  },
  //======================Master Form End========================


  //======================Route Section Start========================
  {
    path: "/Route",
    element: <DashboardPageLayout />,
    state: "Route",
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "Route.index",
      },
      {
        path: "/Route/Route",
        element: <Route />,
        state: "Route.Route",
        sidebarProps: {
          displayText: "Route",
        },
      },
      {
        path: "/Route/RouteAdd",
        element: <RouteAdd />,
        state: "Route.RouteAdd",
      },
      {
        path: "/Route/RouteEdit",
        element: <RouteEdit />,
        state: "Route.RouteEdit",
      },
    ],
  },
  //======================Route Section End========================

  
//   //==================Start Committee====================
  {
    path: "/Committee",
    element: <DashboardPageLayout />,
    state: "Committee",
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "Committee.index",
      },
      {
        path: "/Committee/CommitteeMaster",
        element: <CommitteeMaster />,
        state: "Committee.CommitteeMaster",
        sidebarProps: {
          displayText: "Committee/Group",
        },
      },
      {
        path: "/Committee/CommitteeAdd",
        element: <CommitteeAdd />,
        state: "Committee.CommitteeAdd",
      },
      {
        path: "/Committee/CommitteeEdit",
        element: <CommitteeEdit />,
        state: "Committee.CommitteeEdit",
      },
      {
        path: "/Committee/CommitteeEmployeeMapping",
        element: <CommitteeEmployeeMapping />,
        state: "Committee.CommitteeEmployeeMapping",
        sidebarProps: {
          displayText: "Committee Employee Mapping",
        },
      },
      {
        path: "/Committee/CommitteeEmployeeMappingAdd",
        element: <CommitteeEmployeeMappingAdd />,
        state: "Committee.CommitteeEmployeeMappingAdd",
      },
      {
        path: "/Committee/CommitteeEmployeeMappingEdit",
        element: <CommitteeEmployeeMappingEdit />,
        state: "Committee.CommitteeEmployeeMappingEdit",
      },
      {
        path: "/Committee/ViewEditFile",
        element: <ViewEditFile/>,
        state: "Committee.ViewEditFile",
        sidebarProps: {
          displayText: "View Edit File",
        },
      },
      {
        path: "/Committee/Correspondence",
        element: <Correspondence/>,
        state: "Committee.Correspondence",
        sidebarProps: {
          displayText: "Correspondence",
        },
      },

      {
        path: "/Committee/SplitPDF",
        element: <SplitPDF/>,
        state: "Committee.SplitPDF",
       
      },
      {
        path: "/Committee/SplitPage",
        element: <SplitPage/>,
        state: "Committee.SplitPage",
       
      },


      {
        path: "/Committee/DocumentIndexing",
        element: <DocumentIndexing/>,
        state: "Committee.DocumentIndexing",
       
      },

      



    ],
  },
//   //===================End committee===================


  //==================Start Library====================
  // {
  //   path: "/Library",
  //   element: <DashboardPageLayout />,
  //   state: "Library",
  //   child: [
  //     {
  //       path: "/Library/FileAssigning",
  //       element: <FileAssigning />,
  //       state: "Library.FileAssigning",
  //       sidebarProps: {
  //         displayText: "File Assigning",
  //       },
  //     },

  //     {
  //       path: "/Library/IssueReturn",
  //       element: <IssueReturn />,
  //       state: "Library.IssueReturn",
  //       sidebarProps: {
  //         displayText: "Issue Return",
  //       },
  //     },
  //     {
  //       path: "/Library/FileClass",
  //       element: <FileClass/>,
  //       state: "Library.FileClass",
  //       sidebarProps: {
  //         displayText: "File Class",
  //       },
  //     },

  //     {
  //       path: "/Library/FileClassAdd",
  //       element: <FileClassAdd/>,
  //       state: "Library.FileClassAdd",
        
  //     },
  //     {
  //       path: "/Library/FileClassEdit",
  //       element: <FileClassEdit/>,
  //       state: "Library.FileClassEdit",
        
  //     },
  //     {
  //       path: "/Library/FileGroup",
  //       element: <FileGroup/>,
  //       state: "Library.FileGroup",
  //       sidebarProps: {
  //         displayText: "File Group",
  //       },
  //     },
  //     {
  //       path: "/Library/FileSubject",
  //       element: <FileSubject/>,
  //       state: "Library.FileSubject",
  //       sidebarProps: {
  //         displayText: "File Subject",
  //       },
  //     },
  //     {
  //       path: "/Library/FileMovement",
  //       element: <FileMovement/>,
  //       state: "Library.FileMovement",
  //       sidebarProps: {
  //         displayText: "File Movement",
  //       },
        
  //     },
  //     {
  //       path: "/Library/FileMovementEdit",
  //       element: <FileMovementEdit/>,
  //       state: "Library.FileMovementEdit",
        
  //     },


  //     {
  //       path: "/Library/UserFileMovement",
  //       element: <UserFileMovement/>,
  //       state: "Library.UserFileMovement",
  //       sidebarProps: {
  //         displayText: " User File Movement",
  //       },
  //     },



  //     {
  //       path: "/Library/FileType",
  //       element: <FileType/>,
  //       state: "Library.FileType",
  //       sidebarProps: {
  //         displayText: "File Type",
  //       },
  //     },

  //     {
  //       path: "/Library/FileDetail",
  //       element: <FileDetail/>,
  //       state: "Library.FileDetail",
  //       sidebarProps: {
  //         displayText: "File Detail",
  //       },
  //     },

  //     {
  //       path: "/Library/FileDetailAdd",
  //       element: <FileDetailAdd/>,
  //       state: "Library.FileDetailAdd",
        
  //     },

  //     {
  //       path: "/Library/FileDetailEdit",
  //       element: <FileDetailEdit/>,
  //       state: "Library.FileDetailEdit",
        
  //     },
  //     {
  //       path: "/Library/ReceiptType",
  //       element: <ReceiptType/>,
  //       state: "Library.ReceiptType",
  //       sidebarProps: {
  //         displayText: "Receipt Type",
  //       },
  //     },

  //     {
  //       path: "/Library/Location",
  //       element: <Location/>,
  //       state: "Library.Location",
  //       sidebarProps: {
  //         displayText: "Location",
  //       },
  //     },
  //     {
  //       path: "/Library/ReqForm",
  //       element: <ReqForm/>,
  //       state: "Library.ReqForm",
  //       sidebarProps: {
  //         displayText: "Requist Form",
  //       },
  //     },
  //     {
  //       path: "/Library/ReqFormAdd",
  //       element: <ReqFormAdd/>,
  //       state: "Library.ReqFormAdd",
       
  //     },
  //     {
  //       path: "/Library/ReqFormEdit",
  //       element: <ReqFormEdit/>,
  //       state: "Library.ReqFormEdit",
       
  //     },

      
  //   ],
  // },
  //===================End Library===================

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
        displayText: "User Management  Master",
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

