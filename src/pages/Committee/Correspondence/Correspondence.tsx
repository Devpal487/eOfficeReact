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
    FormLabel
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
import { getISTDate } from "../../../utils/Constant";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Avatar, Stack } from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
// import QuillEditor from "../../../QuillEditor";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import nopdf from '../../../assets/images/imagepreview.jpg'


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
    const { i18n, t } = useTranslation();
    const { defaultValues, defaultValuestime } = getISTDate();

    const [columns, setColumns] = useState<any>([]);
    const [rows, setRows] = useState<any>([]);
    const [editId, setEditId] = useState<any>(-1);
    const [isLoading, setIsLoading] = useState(true);

    const [fileTypeOption, setFileTypeOption] = useState([{ value: "-1", label: t("text.SelectFileType") }]);

    const [panOpens, setPanOpen] = useState(false);
    const [modalImg, setModalImg] = useState("");
    const [editorContent, setEditorContent] = useState<string>('');

    const handleEditorChange = (content: any) => {
        const textWithoutTags = content.replace(/<[^>]*>/g, '').trim(); // Remove HTML tags
        console.log("textWithoutTags", textWithoutTags);
        setEditorContent(textWithoutTags);
    };
    // console.log("editorContent", editorContent)

    useEffect(() => {
        const dataString = localStorage.getItem("userdata");

        getList();
        getFileTypeData();

    }, []);

    const getFileTypeData = async () => {
        const collectData = {
            "fnId": -1,
            "fId": -1,
            "inst_id": -1,
            "user_id": -1,
            "divisionId": -1
        }
        const res = await api.post(`FileNumber/GetFileNumber`, collectData)
        // console.log("check file type", res?.data?.data)
        const arr = [];
        for (let index = 0; index < res.data.data.length; index++) {
            arr.push({
                value: res.data.data[index]["fnId"],
                label: res.data.data[index]["fileNm"],
            })
            setFileTypeOption(arr);
        }
    }

    let delete_id = "";
    const accept = () => {
        const collectData = {
            fnId: delete_id,
        };
        console.log("collectData " + JSON.stringify(collectData));
        api
            .delete(`FileNumber/DeleteFileNumber`, { data: collectData })
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

    const getListbyid = (id:any) => {
        const collectData = {
            "fileId": id,
            "fNid": -1,
            "nodeId": -1
        };
            api
                .post(`Correspondance/GetCorrespondance`, collectData)
                .then((res) => {
                    console.log(res.data.data[0]['uploading'])
                    formik.setFieldValue("uploading",res.data.data[0]['uploading'])})
};

    const getList = () => {
        const collectData = {
            "fileId": -1,
            "fNid": -1,
            "nodeId": -1
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
                                            {/*  {permissionData?.isEdit ? ( */}
                                            <EditIcon
                                                style={{
                                                    fontSize: "20px",
                                                    color: "blue",
                                                    cursor: "pointer",
                                                }}
                                                className="cursor-pointer"
                                                onClick={() => routeChangeEdit(params.row)}
                                            />
                                            {/* ) : ( */}
                                            {/*   "" */}
                                            {/* )} */}
                                            {/*  {permissionData?.isDel ? ( */}
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
                                            {/*  ) : ( */}
                                            {/*  "" */}
                                            {/* )} */}
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
                                field: "fileNo",
                                headerName: "File Number",
                                flex: 1,
                                headerClassName: "MuiDataGrid-colCell",
                            },
                            {
                                field: "reviewFlag",
                                headerName: "Type",
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
            "fNid": "",
            "fileType": "",
            "fileCont": "",
            "nodeId": 0,
            "dateSave": defaultValuestime,
            "reviewFlag": "",
            "uploading": "",
            "uploadingbyte": ""
        },
        // validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (values.reviewFlag === "") {
                values.reviewFlag = "N"
            }
            // values.fileType = editorContent;
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
                setEditId(-1);
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
    return (
        <>
            <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "3vh" }}>
                <Card
                    style={{
                        width: "100%",
                        height: "50%",
                        backgroundColor: "#E9FDEE",
                        border: ".5px solid #42AEEE ",
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
                            Correspondance
                        </Typography>
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
                                                (option) => option.value === formik.values.fNid
                                            ) || null
                                        }
                                        fullWidth
                                        size="small"
                                        onChange={(event: any, newValue: any) => {
                                            console.log(newValue?.value);
                                            // if(newValue!=null){
                                                formik.setFieldValue("fNid", newValue?.value);
                                            // }
                                            formik.setFieldTouched("fNid", true);
                                            formik.setFieldTouched("fNid", false);
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label={
                                                <span>
                                                    Select File Number {""}

                                                </span>
                                            } />
                                        )}
                                    />
                                    {formik.touched.fNid &&
                                        formik.errors.fNid ? (
                                        <div style={{ color: "red", margin: "5px" }}>
                                            {formik.errors.fNid}
                                        </div>
                                    ) : null}
                                </Grid>

                                <Grid item xs={12} sm={6}>
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
                                        <Grid>
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="row-radio-buttons-group"
                                                // defaultValue="N"
                                                value={formik.values.reviewFlag || "N"}
                                                onChange={(event) => {
                                                    console.log("radio value check", event.target.value);
                                                    formik.setFieldValue("reviewFlag", event.target.value);
                                                }}
                                            >
                                                <FormControlLabel
                                                    value="N"
                                                    control={<Radio />}
                                                    label="Note Sheet"
                                                />
                                                <FormControlLabel
                                                    value="C"
                                                    control={<Radio />}
                                                    label="Correspondence"
                                                />
                                                <FormControlLabel
                                                    value="R"
                                                    control={<Radio />}
                                                    label="Report"
                                                />
                                                <FormControlLabel
                                                    value="1"
                                                    control={<Radio />}
                                                    label="Offer"
                                                />
                                                <FormControlLabel
                                                    value="2"
                                                    control={<Radio />}
                                                    label="Other"
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
                                            //   inputProps={{ accept: "application/pdf" }}
                                            InputLabelProps={{ shrink: true }}
                                            label={
                                                <strong style={{ color: "#000" }}>
                                                    {t("text.AttachedFile")}
                                                </strong>
                                            }
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
                                                <img
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
                                                    <img
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
                                    <TextareaAutosize
                                        aria-label="empty textarea"
                                        placeholder="Enter Remark"
                                        // name="fileCont"
                                        // id="fileCont"
                                        style={{
                                            width: "100%",
                                            fontSize: " 1.075rem",
                                            fontWeight: "400",
                                            // lineHeight: "5",
                                            padding: "8px 12px",
                                            borderRadius: "4px",
                                        }}
                                        //value={formik.values.fileCont}
                                        // onChange={formik.handleChange}
                                    //   onBlur={formik.handleBlur}
                                    />
                                </Grid>


                                <Grid item xs={2}>
                                    <Button type="submit" variant="contained" size="large">
                                        {editId == "-1" ? t("text.save") : t("text.update")}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>

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
                            <Box>
                                <br></br>
                                <div style={{ width: "100%", backgroundColor: "#FFFFFF" }}>
                                    <DataGrid
                                        rows={rows}
                                        columns={columns}
                                        autoHeight
                                        slots={{
                                            toolbar: GridToolbar,
                                        }}
                                        rowSpacingType="border"
                                        pagination={true}
                                        pageSizeOptions={[5, 10, 25, 50, 100].map((size) => ({
                                            value: size,
                                            label: `${size}`,
                                        }))}
                                        initialState={{
                                            pagination: { paginationModel: { pageSize: 5 } },
                                        }}
                                        slotProps={{
                                            toolbar: {
                                                showQuickFilter: true,
                                            },
                                        }}
                                    />
                                </div>
                            </Box>
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
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
    ],
};

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
];