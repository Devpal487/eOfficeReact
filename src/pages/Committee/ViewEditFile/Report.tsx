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
import { getinstId, getId, getdivisionId } from "../../../utils/Constant";
import { toast } from "react-toastify";
import CustomDataGrid from "../../../utils/CustomDatagrid";

interface ReportProps {
    triggerFetch: boolean;
    fileID:any | null;
}


const Report: React.FC<ReportProps> = ({ fileID, triggerFetch }) => {
    const [totalFile, setTotalFile] = useState([]);
    const [columns, setColumns] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const { t } = useTranslation();

    useEffect(() => {
        console.log(fileID);
        if (fileID == null || fileID == "" ) {
            toast.error("Please select file for further proceed....")
        }else{
        fetchTotalFile(fileID);
        }
    }, [fileID, triggerFetch]);




    const fetchTotalFile = async (fileID:any) => {

        const value = {
            "fileId":-1,
            "fNid": fileID,
            "nodeId": -1,
            "reviewFlag": "R"
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

                {
                    field: "fileCont",
                    headerName: "Message ",
                    flex: 1,
                    headerClassName: "MuiDataGrid-colCell",
                },
                {
                    field: "remark",
                    headerName: "Remark ",
                    flex: 1,
                    headerClassName: "MuiDataGrid-colCell",
                }
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
};
export default Report;
