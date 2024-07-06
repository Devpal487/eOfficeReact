import Paper from "@mui/material/Paper";
import { SetStateAction, useEffect, useState } from "react";
import { Card, Grid, Typography, Divider, Box } from "@mui/material";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import api from "../../../utils/Url";
import { useTranslation } from "react-i18next";
import ToastApp from "../../../ToastApp";
import { getISTDate, getdivisionId } from "../../../utils/Constant";
import "react-quill/dist/quill.snow.css";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "180vh",
  height: "85vh",
  bgcolor: "#f5f5f5",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
};

type Props = {};

export default function HelpDesk(props: Props) {
  const location = useLocation();
  console.log("location", location.state);
  const { i18n, t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const divid = getdivisionId();
  const [PageName, setPageName] = useState<any>("");
  const [PageDesk, setPageDesk] = useState<any>("");

  useEffect(() => {
    // const dataString = localStorage.getItem("userdata");
    // if (dataString) {
    //   const data = JSON.parse(dataString);
    //   if (data && data.length > 0) {
    //     const userPermissionData = data[0]?.userPermission;
    //     if (userPermissionData && userPermissionData.length > 0) {
    //       const menudata = userPermissionData[0]?.parentMenu;
    //       for (let index = 0; index < menudata.length; index++) {
    //         const childMenudata = menudata[index]?.childMenu;
    //         const pathrow = childMenudata.find(
    //           (x: any) => x.path === location.pathname
    //         );
    //         console.log("pathrow", pathrow);

    //         if (pathrow) {
    //           console.log("pathrow if", pathrow);
    //           console.log("pathrow.menuId", pathrow.menuId);
    //           //  setPermissionData(pathrow);
    //         }
    //       }
    //     }
    //   }
    // }

    const menuData = localStorage.getItem("menuData");

    if (
      menuData != null ||
      menuData != "" ||
      menuData != undefined ||
      menuData != "undefined"
    ) {
      console.log("localMenu", menuData);
      getHelpDesk(menuData);
    } else {
      toast.error("No Menu Id is present. Please try again.......");
    }
  }, []);

  const getHelpDesk = (id: any) => {
    const collectData = {
      pageTitleId: id,
    };
    api.post(`HelpCreation/GetHelpCreation`, collectData).then((res) => {
      const arr: any = [];
      // console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        setPageName(res.data.data[index]["page_Name"]);
        setPageDesk(res.data.data[index]["frontDesign"]);
      }
    });
  };

  return (
    <>
      <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "3vh" }}>
        <ToastApp />
        <Card
          style={{
            width: "100%",
            height: "50%",
            backgroundColor: "#E9FDEE",
            border: ".5px solid #2B4593 ",
            marginTop: "5px",
          }}
        >
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              "& .MuiDataGrid-colCell": {
                backgroundColor: "#00009C",
                color: "#fff",
                fontSize: 18,
                fontWeight: 800,
              },
            }}
            style={{ padding: "10px" }}
          >
            <ConfirmDialog />
            <Typography
              gutterBottom
              variant="h4"
              component="div"
              sx={{ padding: "20px", fontWeight: "bold", textAlign: "center" }}
            >
              {t("text.HelpDesk")}
            </Typography>
            <Divider />

            <Box height={10} />

            {PageName && PageDesk ? (
              <Grid item xs={12} container spacing={3}>
                <Grid xs={12} sm={4} item>
                  <Typography fontWeight="600" fontSize={20}>
                    Page Name :- <i>{PageName}</i>{" "}
                  </Typography>
                </Grid>

                <Grid item sm={12} md={12}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Content :-{" "}
                    <span dangerouslySetInnerHTML={{ __html: PageDesk }} />
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography fontWeight="530" fontSize={30}>
                No content ?
              </Typography>
            )}
          </Paper>
        </Card>
      </Grid>
      <ToastApp />
    </>
  );
}
