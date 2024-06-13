import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import sizeConfigs from "../../configs/sizeConfigs";
import Sidebar from "../common/Sidebar";
import { useLocation } from 'react-router-dom';
import FolderIcon from '@mui/icons-material/Folder';
import { useNavigate } from "react-router-dom";
import TouchAppIcon from '@mui/icons-material/TouchApp';

const MainLayout = () => {
  
  const location = useLocation()
  var menuarray=[];
  let navigate = useNavigate();
  
  if(localStorage.getItem('userdata')==null){

    navigate("/");
    
  }else {
  const items2 = JSON.parse(localStorage.getItem('userdata')!);
  if(items2.length>0){

    const items1 = [
      {
        menuName: "Master",
        path: "",
        menuId:1,
        displayNo:1, 
        childMenu:[
          {menuId: 1, menuName: 'Zone', path:"/master/ZoneMaster",displayNo:0},
          {menuId: 2, menuName: 'Ward', path:"/master/WardMaster",displayNo:0},
          {menuId: 3, menuName: 'State', path:"/master/StateMaster",displayNo:0},
          {menuId: 4, menuName: 'Country', path:"/master/CountryMaster",displayNo:0},
          {menuId: 5, menuName: 'District', path:"/master/CityMaster",displayNo:0},
          {menuId: 6, menuName: 'Gender', path:"/master/GenderMaster",displayNo:0},
          {menuId: 7, menuName: 'File Type', path:"/Library/FileType",displayNo:0},
          {menuId: 8, menuName: 'File Master', path:"/master/FileMaster",displayNo:0},
          {menuId: 9, menuName: 'Letter Type', path:"/master/LetterType",displayNo:0},
          {menuId: 10, menuName: 'Department', path:"/master/DepartmentMaster",displayNo:0},
          {menuId: 11, menuName: 'Designation', path:"/master/DesignationMaster",displayNo:0},
          {menuId: 12, menuName: 'File Category', path:"/master/FileCategory",displayNo:0},
          {menuId: 13, menuName: 'File Class', path:"/Library/FileClass",displayNo:0},
          {menuId: 14, menuName: 'File Group', path:"/Library/FileGroup",displayNo:0},
          {menuId: 15, menuName: 'File Subject', path:"/Library/FileSubject",displayNo:0},
          {menuId: 16, menuName: 'Jurisdiction', path:"/master/Jurisdiction",displayNo:0},
          {menuId: 17, menuName: 'Node Permission', path:"/master/NodePermission",displayNo:0},
          {menuId: 18, menuName: 'Menu Master', path:"/master/MenuMaster",displayNo:0},
          {menuId: 21, menuName: 'Authority', path:"/master/AuthorityMaster",displayNo:0},
          {menuId: 22, menuName: 'Page Create', path:"/master/PageCreate",displayNo:0},
          {menuId: 23, menuName: 'Institute Form', path:"/master/Institute",displayNo:0},

        ] 
    },
  
  {
    menuName: "File Mgmt",
    path: "",
    menuId:2,
    displayNo:1, 
    childMenu:[
     
    ] 
},
  {
    menuName: "E-Office",
    path: "",
    menuId:3,
    displayNo:1, 
    childMenu:[
      {menuId: 1, menuName: 'Committee/Group', path:"/Committee/CommitteeMaster",displayNo:0},
      {menuId: 2, menuName: 'Committee Emp Mapping', path:"/Committee/CommitteeEmployeeMapping",displayNo:0},
      {menuId: 3, menuName: 'Route', path:"/Route/Route",displayNo:0},
      {menuId: 4, menuName: 'View Edit File', path:"/Committee/ViewEditFile",displayNo:0},
      {menuId: 5, menuName: 'Correspondence', path:"/Committee/Correspondence",displayNo:0},
     
     
    ] 
},
{
  menuName: "Employee",
  path: "",
  menuId:4,
  displayNo:1, 
  childMenu:[
    {menuId: 1, menuName: 'Employee', path:"/Employee/EmployeeMaster",displayNo:0},
   
  ] 
},
{
  menuName: "User Management",
  path: "",
  menuId:5,
  displayNo:1, 
  childMenu:[
    {menuId: 1, menuName: 'User Management', path:"/UserManagement/UserManagement",displayNo:0},
    {menuId: 2, menuName: 'Role Master', path:"/UserManagement/RoleMaster",displayNo:0},
    {menuId: 3, menuName: 'User Type', path:"/UserManagement/UserType",displayNo:0},
    {menuId: 4, menuName: 'User Permission ', path:"/UserManagement/UserPermissionMaster",displayNo:0},
  ] 
},

    ]

  for (let index = 0; index < items1.length; index++) {
   const element = items1[index];
 
   var childmenuarray=[];
   var childMenu =items1[index]["childMenu"];

   
   for (let index2 = 0; index2 < childMenu.length; index2++) {
     childmenuarray.push({
       id:childMenu[index2]["menuId"],
       name:childMenu[index2]["menuName"],
       label:childMenu[index2]["menuName"],
       path:childMenu[index2]["path"],
       displayNo:childMenu[index2]["displayNo"],
       Icon:TouchAppIcon,
       onClick
     });
   }
   menuarray.push({
     id:items1[index]["menuId"],
     name:items1[index]["menuName"],
     label:items1[index]["menuName"],
     displayNo:items1[index]["displayNo"],
     path:'',
     Icon:FolderIcon,
     items:childmenuarray.sort((a, b) => (a.displayNo - b.displayNo))
   });
   
  }
  } else {
    navigate("/");
  }
}
  
  const items =menuarray.sort((a, b) => (a.displayNo - b.displayNo));

  function onClick(e: any, item: any) {
   
    console.log("Main "+ item);
    
      let path = item.path;
      if(path=="" || path==null || path =="undefind"){
        window.alert("Path Not Found ????");
      } else {
        navigate(path);
      }
     
  }
  return (
    <div>
      {location.pathname == "/" ? <Outlet /> : <div>
        <Box sx={{ display: "flex" }}>
         
          <Sidebar items={items} />

          <Box
            sx={{
              flexGrow: 1,
              px: 5,
              py: 3,
              width: `calc(100% - ${sizeConfigs.sidebar.width})`,
              minHeight: "100vh",
              backgroundColor:"#F2F3F4",
              backgroundSize: "cover", 
              backgroundPosition: "center" 
            }}
          >
            <Toolbar />
            <Outlet />
          </Box></Box>
          </div>}

    </div>
  );
};

export default MainLayout;