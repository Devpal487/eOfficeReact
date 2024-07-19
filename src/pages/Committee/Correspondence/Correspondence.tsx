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
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    FormLabel,
    IconButton,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import api from "../../../utils/Url";
import { useLocation, useNavigate } from "react-router-dom";
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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import nopdf from '../../../assets/images/nopdf.png';
import CustomLabel from "../../../CustomLable";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import Quill from 'quill'; 
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import Languages from "../../../Languages";


interface MenuPermission {
    isAdd: boolean;
    isEdit: boolean;
    isPrint: boolean;
    isDel: boolean;
}


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


export default function Correspondence() {
    const location = useLocation();
    const { t } = useTranslation();
    const { defaultValuestime } = getISTDate();

    const [columns, setColumns] = useState<any>([]);
    const [rows, setRows] = useState<any>([]);
    const [editId, setEditId] = useState<any>("-1");
    const [isLoading, setIsLoading] = useState(true);

    const [fileTypeOption, setFileTypeOption] = useState([{ value: "-1", label: t("text.SelectFileNo") }]);

    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState<DialogProps["maxWidth"]>("lg");
  
    const [panOpens, setPanOpen] = useState(false);
    const [pdfPreviewOpens, setPdfPreviewOpen] = useState(false);
    const [modalImg, setModalImg] = useState("");
    const [editorContent, setEditorContent] = useState<string>('');
    const [permissionData, setPermissionData] = useState<MenuPermission>({
        isAdd: false,
        isEdit: false,
        isPrint: false,
        isDel: false,
    });
    const [pdfPreviewFile, setPdfPreviewFile] = useState("");
    const [pdfFileId, setPdfFileId] = useState("");
    const [pdfFileName, setPdfFileName] = useState("");
    const [lang, setLang] = useState<Language>("en");
    const [FillRemark,setFillRemark] = useState('');

    const handleEditorChange = (content: any) => {
      setEditorContent(content);
    };
  
    useEffect(() => {
        getFileTypeData();
    }, []);

    useEffect(() => {
        const dataString = localStorage.getItem("userdata");
        if (dataString) {
            const data = JSON.parse(dataString);
            if (data && data.length > 0) {
                const userPermissionData = data[0]?.userPermission;
                if (userPermissionData && userPermissionData.length > 0) {
                    const menudata = userPermissionData[0]?.parentMenu;
                    for (let index = 0; index < menudata.length; index++) {
                        const childMenudata = menudata[index]?.childMenu;
                        const pathrow = childMenudata.find(
                            (x: any) => x.path === location.pathname
                        );
                        console.log("data", pathrow);
                        if (pathrow) {
                            setPermissionData(pathrow);
                            getList();
                        }
                    }
                }
            }
        }
    }, [isLoading]);

    const back = useNavigate();


    const getFileTypeData = () => {
        const collectData = {
            "fnId": -1,
            "fId": -1,
            "inst_id": -1,
            "user_id": -1,
            "divisionId": -1
        };
        api
            .post(`FileNumber/GetFileNumber`, collectData)
            .then((res) => {
                const arr = res.data.data.map((item: any) => ({
                    label: item.fileNm,
                    value: item.fnId,
                }));
                setFileTypeOption(arr);
            });
    };


    let delete_id = "";
    const accept = () => {
        const collectData = {
            fileId: delete_id,
        };
        console.log("collectData " + JSON.stringify(collectData));
        api
            .delete(`Correspondance/DeleteCorrespondance`, { data: collectData })
            .then((response) => {
                if (response.data.isSuccess) {
                    toast.success(response.data.mesg);
                    getList();
                } else {
                    toast.error(response.data.mesg);
                }
            });
    };

    const reject = () => {
        // toast.warn({summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        toast.warn("Rejected: You have rejected", { autoClose: 3000 });
    };

    const handledeleteClick = (del_id: any) => {
        // console.log(del_id + " del_id ");
        delete_id = del_id;
        confirmDialog({
            message: "Do you want to delete this record ?",
            header: "Delete Confirmation",
            icon: "pi pi-info-circle",
            acceptClassName: "p=-button-danger",
            accept,
            reject,
        });
    };

    const getListbyid = (id: any) => {
        const collectData = {
            "fileId": id,
            "fNid": -1,
            "nodeId": -1,
            "reviewFlag": ""
        };
        api
            .post(`Correspondance/GetCorrespondance`, collectData)
            .then((res) => {
                console.log(res.data.data[0]['uploading'])
                formik.setFieldValue("uploading", res.data.data[0]['uploading'])
            })
    };

    const getFileViewById=(row:any) => {
        setPdfPreviewOpen(true);
        console.log("🚀 ~ getFileViewById ~ row:", row);
        console.log("🚀 ~ getFileViewById ~ row:", row.id);
        setPdfFileId(row.id);
        setPdfFileName(row.fileNo);
        const collectData = {
            "fileId": row.id,
            "fNid": -1,
            "nodeId": -1,
            "reviewFlag": ""
        };
        api
            .post(`Correspondance/GetCorrespondance`, collectData)
            .then((res) => {
                // console.log(res.data.data[0]['uploading']);
                setPdfPreviewFile(res.data.data[0]["uploading"]);
            })
    }

    const getList = () => {
        const collectData = {
            "fileId": -1,
            "fNid": -1,
            "nodeId": -1,
            "reviewFlag": ""
        };
        try {
            api
                .post(`Correspondance/GetCorrespondance`, collectData)
                .then((res) => {
                    console.log("result" + JSON.stringify(res.data.data));
                    const data = res.data.data;
                    const arr = data.map((item: any, index: any) => ({
                        ...item,
                        serialNo: index + 1,
                        id: item.fileId,
                    }));
                    setRows(arr);
                    setIsLoading(false);
                    if (data.length > 0) {
                        const columns: GridColDef[] = [
                            {
                                field: "actions",
                                headerClassName: "MuiDataGrid-colCell",
                                headerName: t("text.Action"),
                                width: 150,

                                renderCell: (params) => {

                                    return [
                                        <Stack
                                            spacing={1}
                                            direction="row"
                                            sx={{ alignItems: "center", marginTop: "5px" }}
                                        >
                                             {permissionData?.isEdit ? ( 
                                            <EditIcon
                                                style={{
                                                    fontSize: "20px",
                                                    color: "blue",
                                                    cursor: "pointer",
                                                }}
                                                className="cursor-pointer"
                                                onClick={() => routeChangeEdit(params.row)}
                                            />
                                            ) : ( 
                                              "" 
                                            )} 
                                             {permissionData?.isDel ? ( 
                                            <DeleteIcon
                                                style={{
                                                    fontSize: "20px",
                                                    color: "red",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                    handledeleteClick(params.row.id);
                                                }}
                                            />
                                             ) : ( 
                                             "" 
                                            )} 
                                        </Stack>,
                                    ];
                                },
                            },

                            {
                                field: "serialNo",
                                headerName: t("text.SrNo"),
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                            },
                            {
                                field: "reviewFlag",
                                headerName: t("text.Type"),
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                                renderCell: (params) => {
                                    const reviewFlag = params.row.reviewFlag;
                                    const documentType = reviewFlag === 'N' ? 'Note Sheet' :
                                        reviewFlag === 'C' ? 'Correspondence' :
                                            reviewFlag === 'R' ? 'Report' :
                                                reviewFlag === '1' ? 'Offer' :
                                                    reviewFlag === '2' ? 'Other' :
                                                        '--';
                                    return documentType
                                }
                            },
                            {
                                field: "fileNo",
                                headerName: t("text.FileNo"),
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                                renderCell: (params) => {           
                                    return (
                                        <a
                                        href="#"
                                        onClick={(event) => getFileViewById(params.row)}
                                        >
                                            {params.row.fileNo}
                                        </a>
                                    );
                                }
                            },

                        ];
                        setColumns(columns as any);
                    }
                });
            // setIsLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            // setIsLoading(false);
        }
    };

    const validationSchema = Yup.object({
        fId: Yup.string().test(
            "required",
            "Select File Type Required",
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
    });

    const [toaster, setToaster] = useState(false);
    
    const formik = useFormik({
        initialValues: {
            "fileId": -1,
            "fileNo": "",
            "fNid": 0,
            "fileType": "",
            "fileCont":"",
            "nodeId": 1,
            "dateSave": defaultValuestime,
            "reviewFlag": "",
            "uploading": "",
            "uploadingbyte": "",
           
        },
        // validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (values.reviewFlag === "") {
                values.reviewFlag = "N"
            }
            // values.fileType = editorContent;
            values.fileCont = editorContent;
            values.fileId = editId;
            console.log("check", values);

            const response = await api.post(
                `Correspondance/AddUpdateCorrespondance`,
                values
            );
            if (response.data.isSuccess) {
                setToaster(false);
                toast.success(response.data.mesg);
                formik.resetForm();
                getList();
                setEditId("-1");
            } else {
                setToaster(true);
                toast.error(response.data.mesg);
            }

        },
    });

    const requiredFields = ["fId"];


    const routeChangeEdit = (row: any) => {
        formik.setFieldValue("fNid", row.fNid);
        formik.setFieldValue("reviewFlag", row.reviewFlag);
        formik.setFieldValue("uploading", row.uploading);

        setEditId(row.id);
        getListbyid(row.id);

    };

    const handlePdfPreviewClose = () => {
        setPdfPreviewOpen(false);
        setPdfPreviewFile("");
        setPdfFileId("");
        setPdfFileName("");
    };


    const handlePanClose = () => {
        setPanOpen(false);
    };

    const modalOpenHandle = (event: any) => {
        setPanOpen(true);
        if (event === "uploading") {
            setModalImg(formik.values.uploading);
        }
    };
    const ConvertBase64 = (file: Blob) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const otherDocChangeHandler = async (event: any, params: any) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const base64 = await ConvertBase64(file);
            formik.setFieldValue(params, base64);
            console.log(base64);

        }
    };


    const handleConversionChange = (params: any, text: string) => {
        formik.setFieldValue(params, text);
        setFillRemark(text);
      };


    useEffect(() => {
        if (!formik.values.reviewFlag) {
            formik.setFieldValue('reviewFlag', 'N');
        }
    }, [formik.values.reviewFlag, formik.setFieldValue]);


    const handleSubmitWrapper = async () => {
        await formik.handleSubmit();
      };


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
                        <Grid item xs={12} container spacing={2} >
            <Grid item lg={2} md={2} xs={2} marginTop={2}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{
                  backgroundColor: "blue",
                  width: 20,
                }}
              >
                <ArrowBackSharpIcon />
              </Button>
            </Grid>
            <Grid item lg={7} md={7} xs={7} alignItems="center" justifyContent="center">
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="center"
              >
                {t("text.Correspondence")}
              </Typography>
            </Grid>

            <Grid item lg={3} md={3} xs={3} marginTop={3}>
              <select
                className="language-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {Languages.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>
                        <Divider />

                        <Box height={10} />

                        <form onSubmit={formik.handleSubmit}>
                            <Grid item xs={12} container spacing={3}>

                                <Grid xs={12} sm={4} item>

                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={fileTypeOption}
                                        value={
                                            fileTypeOption.find(
                                                (option: any) => option.value === formik.values.fNid
                                            ) || null
                                        }
                                        fullWidth
                                        size="small"
                                        onChange={(event, newValue: any) => {
                                            console.log(newValue?.value);

                                            formik.setFieldValue("fNid", newValue?.value);
                                            formik.setFieldValue("fileNo", newValue?.label);

                                            formik.setFieldTouched("fNid", true);
                                            formik.setFieldTouched("fNid", false);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={<CustomLabel text={t("text.SelectFileNo")} />}
                                            />
                                        )}
                                    />


                                </Grid>

                                {/* <Grid item xs={6} sm={6}>
                                            <TextField
                                                id="fileNm"
                                                type="text"
                                                                                                                                                        label="Save File ID"
                                                placeholder="Save File ID"
                                                // value={formik.values.fileNm}
                                                size="small"
                                                name="fileNm"
                                                fullWidth
                                                // onChange={formik.handleChange}
                                                // onBlur={formik.handleBlur}
                                            />
                                            
                                        </Grid> */}

                                <Grid item xs={12} sm={8}>
                                    <FormControl
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 20,
                                            // marginTop: "13px",
                                            marginLeft: "12px",
                                        }}
                                    >
                                        {/* <Grid>
                    <FormLabel>Type</FormLabel>
                  </Grid> */}
                                        <Grid>
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="row-radio-buttons-group"
                                                defaultValue="N"
                                                value={formik.values.reviewFlag}
                                                onChange={(event) => {
                                                    console.log("radio value check", event.target.value);
                                                    formik.setFieldValue("reviewFlag", event.target.value);
                                                }}
                                            >
                                                <FormControlLabel
                                                    value="N"
                                                    control={<Radio />}
                                                    label={t("text.NoteSheet")}
                                                />
                                                <FormControlLabel
                                                    value="C"
                                                    control={<Radio />}
                                                    label={t("text.Correspondence")}
                                                />
                                                <FormControlLabel
                                                    value="R"
                                                    control={<Radio />}
                                                    label={t("text.Report")}
                                                />
                                                <FormControlLabel
                                                    value="D"
                                                    control={<Radio />}
                                                    label={t("text.Draft")}
                                                />

                                                <FormControlLabel
                                                    value="O"
                                                    control={<Radio />}
                                                    label={t("text.Other")}
                                                />


                                            </RadioGroup>
                                        </Grid>
                                    </FormControl>
                                </Grid>

                                <Grid container spacing={1} item>
                                    <Grid
                                        xs={12}
                                        md={4}
                                        sm={4}
                                        item
                                        style={{ marginBottom: "30px", marginTop: "30px" }}
                                    >
                                        <TextField
                                            type="file"
                                            inputProps={{ accept: "application/pdf" }}
                                            InputLabelProps={{ shrink: true }}
                                            label={<CustomLabel text={t("text.AttachedFile")} />}
                                            size="small"
                                            fullWidth
                                            style={{ backgroundColor: "white" }}
                                            onChange={(e) => otherDocChangeHandler(e, "uploading")}
                                        />
                                    </Grid>
                                    <Grid xs={12} md={4} sm={4} item></Grid>

                                    <Grid xs={12} md={4} sm={4} item>
                                        <Grid
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-around",
                                                alignItems: "center",
                                                margin: "10px",
                                            }}
                                        >
                                            {formik.values.uploading == "" ? (
                                                <img
                                                    src={nopdf}
                                                    style={{
                                                        width: 150,
                                                        height: 100,
                                                        border: "1px solid grey",
                                                        borderRadius: 10,
                                                    }}
                                                />
                                            ) : (
                                                <embed
                                                    src={formik.values.uploading}
                                                    style={{
                                                        width: 150,
                                                        height: 100,
                                                        border: "1px solid grey",
                                                        borderRadius: 10,
                                                        padding: "2px",
                                                    }}
                                                />
                                            )}
                                            <Typography
                                                onClick={() => modalOpenHandle("uploading")}
                                                style={{
                                                    textDecorationColor: "blue",
                                                    textDecorationLine: "underline",
                                                    color: "blue",
                                                    fontSize: "15px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {t("text.Preview")}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Modal open={panOpens} onClose={handlePanClose}>
                                        <Box sx={style}>
                                            {modalImg == "" ? (
                                                <img
                                                    src={nopdf}
                                                    style={{
                                                        width: "170vh",
                                                        height: "75vh",
                                                    }}
                                                />
                                            ) : (
                                                <div style={{ width: "100%", height: "100%" }}>
                                                    <embed
                                                        src={modalImg}
                                                        // type="application/pdf"
                                                        width="100%"
                                                        height="100%"
                                                        style={{ borderRadius: 10 }}
                                                    />
                                                </div>
                                            )}
                                        </Box>
                                    </Modal>
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

                                <Grid xs={12} sm={12} item>
                                <TranslateTextField
                          label={t("text.EnterRemark")}
                          value={FillRemark}
                          onChangeText={(text: string) =>
                            handleConversionChange("Remark", text)
                          }
                          required={true}
                          lang={lang}
                        />
                                </Grid>


                                <Grid item xs={2} sx={{m:-1}}>
                                    {/* <Button type="submit" variant="contained" size="large">
                                        {editId == "-1" ? t("text.save") : t("text.update")}
                                    </Button> */}

                                    {editId === "-1" && permissionData?.isAdd && (
  <ButtonWithLoader
    buttonText={t("text.save")}
    onClickHandler={handleSubmitWrapper}
    fullWidth={true}
  />
)}

{editId !== "-1" && (
  <ButtonWithLoader
    buttonText={t("text.update")}
    onClickHandler={handleSubmitWrapper}
    fullWidth={true}
  />
)}
                                </Grid>
                            </Grid>
                        </form>

                        <Dialog open={pdfPreviewOpens}
                        // onClose={handlePdfPreviewClose}
                        fullWidth={fullWidth}
                        maxWidth={maxWidth}
                        >
                            <DialogTitle
                      // style={{ cursor: "move" }}
                      // id="draggable-dialog-title"
                      sx={{
                        backgroundColor: "#00009c",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color:"#fff"
                      }}
                    >
                      <Typography fontWeight="600" fontSize={20}>
                        <i>
                          #{pdfFileId}-{pdfFileName}
                        </i>{" "}
                      </Typography>
                      <IconButton
                        edge="end"
                        onClick={handlePdfPreviewClose}
                        aria-label="close"
                        sx={{
                          color: "#fff",
                          position: "absolute",
                          right: 17,
                          top: 3,
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </DialogTitle>

                    <Divider />

                    <DialogContent
                      sx={{ backgroundColor: "#f4f4f5", height: "85vh" }}
                    >
                      <DialogContentText>
                          {/* </Dialog><Box sx={{ ...style, overflowY: "auto" }}> */}
                            {pdfPreviewFile == "" ? (
                              <img
                                src={nopdf}
                                style={{
                                  width: "97%",
                                  height: "97% !important",
                                }}
                              />
                            ) : (
                              <div style={{ width: "100%", height: "75vh" }}>
                                <embed
                                  src={pdfPreviewFile}
                                  width="100%"
                                  height="100%"
                                  style={{ borderRadius: 10 }}
                                />
                              </div>
                            )}
                          {/* </Box> */}
                          </DialogContentText>
                          </DialogContent>
                        </Dialog>

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
                                rows={rows}
                                columns={columns}
                                pageSizeOptions={[5, 10, 25, 50, 100]}
                                initialPageSize={5}
                            />
                        )}
                    </Paper>
                </Card>
            </Grid>
            <ToastApp />
        </>
    );
}
const modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }],
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
