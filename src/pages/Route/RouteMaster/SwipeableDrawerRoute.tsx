import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";



import React, { useState, useEffect } from "react";
import {
    Card,
    Divider,
    Paper,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import { styled } from '@mui/material/styles';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#1976d2",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


interface Props {
    open: boolean;
    onClose: () => void;
    userData: any;
}

function Row({ row, index }: { row: any; index: number }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const renderNodeMode = (nodeMode: string) => {
        // console.log("nodeMode:", nodeMode);
        switch (nodeMode) {
            case 'A':
                return 'Authority';
            case 'C':
                return 'Committee';
            case 'G':
                return 'Group';
            case 'P':
                return 'Committee/Groups Parameters';
            default:
                return nodeMode;
        }
    };

    return (
        <React.Fragment>
            <StyledTableRow sx={{ border: "1px gray solid" }} key={row.id}>
                <TableCell style={{
                    border: "1px gray solid"}} align="center">
                    {index + 1}
                </TableCell>
                <TableCell
                    style={{
                        border: "1px gray solid",
                        cursor: "pointer",
                        textDecoration: isHovered ? "underline" : "underline",
                        color: isHovered ? "blue" : "blue",
                    }}
                >
                    <a
                        onClick={() => setIsOpen(!isOpen)}
                        // onMouseEnter={() => setIsHovered(true)}
                        // onMouseLeave={() => setIsHovered(false)}

                    > {renderNodeMode(row.nodeMode)}</a>
                   
                </TableCell>
                </StyledTableRow>
                <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, margin: "5px" }}
          colSpan={2}
        >
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <div  style={{ paddingBottom: "5px", paddingTop: "5px" }}>
                        <p><b>Authority :</b> {row.authName}</p>
                        <p><b>Department :</b> {row.auth_DeptName}</p>
                        <p><b>Section :</b> {row.auth_SectionName}</p>
                        <p><b>Email :</b> {row.email == "Y"? "Yes" : "No"}</p>
                        <p><b>SMS :</b> {row.sms== "Y"? "Yes" : "No"}</p>
                        <p><b>Message :</b> {row.message}</p>
                    </div>
                </Collapse>
                </TableCell>
      </TableRow>
           

        </React.Fragment>
    );
}

export default function SwipeableDrawerRoute({ open, onClose, userData }: Props) {

    return (
        <div>
            <SwipeableDrawer
                anchor="right"
                open={open}
                onClose={onClose}
                onOpen={() => { }}
                slotProps={{
                    backdrop: {
                        // style: { backgroundColor: "rgba(0, 0, 0, 0)" },
                    },
                }}
                PaperProps={{
                    style: {
                        // boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.2)",
                        // backgroundColor: "whitesmoke",
                    },
                }}
                style={{
                    zIndex: 1300,
                }}
            >
                <Box sx={{ width: 300 }}>
                    {userData && userData.length > 0 && (
                        <>
                            <p
                                style={{
                                    paddingTop: "5vh",
                                    paddingBottom: "5vh",
                                    textAlign: "center",
                                    backgroundColor: "#00009a",
                                    color: "whitesmoke",
                                    borderBottomLeftRadius: "10px",
                                    borderBottomRightRadius: "10px",
                                    fontSize: "20px",
                                }}
                            >
                                #{userData[0]['id']} Route Details
                            </p>


                            <div style={{ margin: "15px" }}>
                                <p><strong>Route Name: </strong> {userData[0]["routeName"]}</p>
                            </div>
                            <div style={{ margin: "15px" }}>
                                <p><strong>Total Level: </strong> {userData[0]["totalLevel"]}</p>
                            </div>

                        </>)}

                    <Divider />
                    <br />
                    <TableContainer component={Paper} sx={{ maxHeight: "65vh", padding: "10px", border: "1px solid transparent" }}>
                        <Table aria-label="customized  table" style={{
                            border: "1px gray solid",
                            borderCollapse: "collapse",
                            width: "100%",
                        }}>
                            <TableHead style={{ border: "1px gray solid", borderCollapse: "collapse" }}>

                                <TableRow>
                                    <StyledTableCell align="center" style={{
                                        fontSize: 16,
                                        fontWeight: 500,
                                        border: "1px gray solid", padding: "5px"
                                    }}>Level</StyledTableCell>
                                    <StyledTableCell align="center" style={{
                                        fontSize: 16,
                                        fontWeight: 500,
                                        border: "1px gray solid", padding: "5px"
                                    }}>Node Mode</StyledTableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {userData && userData.length > 0 && (
                                    userData[0].routeMembercycless.map((row: any, index: any) => (
                                        <Row key={row.id} row={row} index={index} />
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </SwipeableDrawer>
        </div>
    );
}