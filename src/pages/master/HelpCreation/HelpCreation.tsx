import Paper from "@mui/material/Paper";
import { SetStateAction, useEffect, useState } from "react";
import {
  Button,
  CardContent,
  Card,
  Grid,
  TextField,
  Typography,
  Divider,
  Modal,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import api from "../../../utils/Url";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import { getISTDate, getdivisionId } from "../../../utils/Constant";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Avatar, Stack } from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
// import QuillEditor from "../../../QuillEditor";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import nopdf from "../../../assets/images/imagepreview.jpg";
import CustomLabel from "../../../CustomLable";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import parse from "html-react-parser";

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
export default function HelpCreation() {
  const { i18n, t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);

  const [PageTitle, setPageTitle] = useState([
    { value: "-1", label: t("text.PageTitle") },
  ]);

  const [totalFile, setTotalFile] = useState([]);
  const [columns, setColumns] = useState<any>([]);
 
  
  
  const [editorContent, setEditorContent] = useState<string>("");
 // const [plainTextContent, setPlainTextContent] = useState<string>("");



  const handleEditorChange = (content: any) => {
    setEditorContent(content);

   
  };
  //   useEffect(() => {

  //   }, [plainTextContent]);

  //console.log("checkContext", editorContent);

  const divid = getdivisionId();

  useEffect(() => {
    const dataString = localStorage.getItem("userdata");
    fetchTotalFile();
    // getList();
    getFileTypeData();
  }, []);

  const getFileTypeData = () => {
    const collectData = {
      menuId: -1,
    };
    api.post(`Menu/GetMenuMaster`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.menuName,
        value: item.menuId,
      }));
      setPageTitle(arr);
    });
  };

  const fetchTotalFile = async () => {
    try {
      const collectData = {
        pageTitleId: -1,
      };
      console.log("collectData", collectData);
      const response = await api.post(
        `HelpCreation/GetHelpCreation`,
        collectData
      );

      console.log("result", response.data.data);
      const data = response.data.data;
      const DocsWithIds = data.map((doc: any, index: any) => ({
        ...doc,
        serialNo: index + 1,
        id: doc.pageTitleId,
      }));
 
      

      setTotalFile(DocsWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            width: 120,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "frontDesign",
            headerName: t("text.Description"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "page_Name",
            headerName: t("text.PageName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
        ];
        setColumns(columns as any);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));

  const [toaster, setToaster] = useState(false);
  const formik = useFormik({
    initialValues: {
      formatName: "",
      height: 0,
      width: 0,
      roundedCorner: "",
      variableBackSide: "",
      frontDesign: "",
      backDesign: "",
      page_Name: "",
      pageTitleId: 0,
    },

    onSubmit: async (values) => {
      values.frontDesign = editorContent;
      console.log("checktext", values);
      const response = await api.post(`HelpCreation/AddHelpCreation`, values);
      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        formik.resetForm();
        setEditorContent("");
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  return (
    <>
      <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "3vh" }}>
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
              variant="h5"
              component="div"
              sx={{ padding: "20px" }}
              align="left"
            >
              {t("text.HelpCreation")}
            </Typography>
            <Divider />

            <Box height={10} />

            <form onSubmit={formik.handleSubmit}>
              <Grid item xs={12} container spacing={3}>
                <Grid xs={12} sm={4} item>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={PageTitle}
                    value={
                      PageTitle.find(
                        (option: any) =>
                          option.value === formik.values.pageTitleId
                      ) || null
                    }
                    fullWidth
                    size="small"
                    onChange={(event, newValue: any) => {
                      console.log(newValue?.value);
                   const rowdata =totalFile.find((x:any)=>x.pageTitleId === newValue?.value);
                   if (rowdata) {
                    setEditorContent(rowdata['frontDesign']);
                  }
                 
                  // setEditorContent(rowdata['frontDesign']);
                      formik.setFieldValue("pageTitleId", newValue?.value);
                      formik.setFieldValue("page_Name", newValue?.label);

                      formik.setFieldTouched("pageTitleId", true);
                      formik.setFieldTouched("pageTitleId", false);
                     
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={<CustomLabel text={t("text.PageTitle")} />}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  {/* <QuillEditor /> */}
                  <ReactQuill
                    value={editorContent}
                    onChange={handleEditorChange}
                    modules={modules}
                    formats={formats}
                  />
                </Grid>

                <Grid item lg={6} sm={6} xs={12}>
                  <Grid>
                    <Button
                      type="submit"
                      fullWidth
                      style={{
                        backgroundColor: "#059669",
                        color: "white",
                        marginTop: "10px",
                      }}
                    >
                      {t("text.save")}
                    </Button>
                  </Grid>
                </Grid>

                <Grid item lg={6} sm={6} xs={12}>
                  <Button
                    type="reset"
                    fullWidth
                    style={{
                      backgroundColor: "#F43F5E",
                      color: "white",
                      marginTop: "10px",
                    }}
                    onClick={(e) => {
                      formik.resetForm();
                      setEditorContent("");
                    }}
                  >
                    {t("text.reset")}
                  </Button>
                </Grid>

                <Grid item sm={12} md={12}>
                  {isLoading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CircularProgress />
                    </div>
                  ) : (
                    <CustomDataGrid
                      isLoading={isLoading}
                      rows={totalFile}
                      columns={adjustedColumns}
                      pageSizeOptions={[5, 10, 25, 50, 100]}
                      initialPageSize={5}
                    />
                  )}
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Card>
      </Grid>
      <ToastApp />
    </>
  );
}
const modules = {
  toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, ],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video', 'formula'],
      ['clean']
  ],
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script',
  'list', 'bullet', 'indent',
  'align',
  'link', 'image', 'video', 'formula',
  'code-block'
];