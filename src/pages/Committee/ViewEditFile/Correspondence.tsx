import React, { useEffect, useState } from "react";
import {
    GridColDef,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Paper,
    CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import api from "../../../utils/Url"; 
import Box from "@mui/material/Box";
import { getinstId, getId, getdivisionId } from  "../../../utils/Constant";
import { toast } from "react-toastify";
import CustomDataGrid from "../../../utils/CustomDatagrid"; 

interface MenuPermission {
    isAdd: boolean;
    isEdit: boolean;
    isPrint: boolean;
    isDel: boolean;
}

interface ReportProps {
    fileID:any | null;
}

const Correspondence: React.FC<ReportProps> = ({ fileID }) => {
    const [totalFile, setTotalFile] = useState([]);
    const [columns, setColumns] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [ReviewModalData, setReviewModalData] = useState(false);
    const { t } = useTranslation();

    const userId = getId();

    const instId = getinstId();
    // console.log("🚀 ~ ViewEditFile ~ userId:", userId);
    const divId = getdivisionId();
    // console.log("🚀 ~ ViewEditFile ~ divId:", divId);

    const navigate = useNavigate();

   
    useEffect(() => {
        if (fileID !== null) {
            fetchTotalFile(fileID);
        }
    }, [fileID]);





    const fetchTotalFile = async (fileID:any) => {

        const value = {
            "fileId":-1,
            "fNid": fileID,
            "nodeId": -1,
            "reviewFlag": ""
        };
            console.log("collectData", value);
            const response = await api.post(`Correspondance/GetCorrespondance`, value)

            console.log("result", response.data.data);
            const data = response.data.data;
            const DocsWithIds = data.map((doc: any, index: any) => ({
                ...doc,
                serialNo: index + 1,
                id: doc.fileId,
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
                        field: "fileNo",
                        headerName: "File Name",
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },


                    // {
                    //     field: "cSubject",
                    //     headerName: "Subject ",
                    //     flex: 1,
                    //     headerClassName: "MuiDataGrid-colCell",
                    // },

                    // {
                    //     field: "dairyDate",
                    //     headerName: "Dairy Date",
                    //     flex: 1,
                    //     headerClassName: "MuiDataGrid-colCell",
                    // },
                    // {
                    //     field: "fileStatus",
                    //     headerName: "File Status ",
                    //     flex: 1,
                    //     headerClassName: "MuiDataGrid-colCell",
                    // },

                    // {
                    //     field: "createdby",
                    //     headerName: "Created By",
                    //     flex: 1,
                    //     headerClassName: "MuiDataGrid-colCell",
                    // },


                   
                ];
                setColumns(columns as any);
            }
    };

    const adjustedColumns = columns.map((column: any) => ({
        ...column,
    }));

    return (
        <Paper
            sx={{
                width: "100%",
                overflow: "hidden",
                "& .MuiDataGrid-colCell": {
                    backgroundColor: "#2B4593",
                    color: "#fff",
                    fontSize: 17,
                    fontWeight: 900
                },
            }}
            style={{ padding: "10px", }}
        >

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
                />)}

        </Paper>
    );
}

export default Correspondence;
