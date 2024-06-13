import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import Chip from "@mui/material/Chip";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import InfoIcon from "@mui/icons-material/Info";
import { useTranslation } from "react-i18next";



const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#007FFF",
        color: theme.palette.common.white,
        fontWeight: 700,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

const Root = styled("div")(({ theme }) => ({
    width: "100%",
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    "& > :not(style) ~ :not(style)": {
        marginTop: theme.spacing(5),
    },
}));

interface Props {
    open: boolean;
    onClose: () => void;
    userData: any;
    title: any;
}

function PageCreateSwipeableDrawer({ open, onClose, title, userData }: Props) {
    // console.log("data", userData?.approvalForReg);
    // console.log("check", )
    const handleClose = () => {
        onClose();
        // userData("");
        // setRegistrationData("");
    };


    const { t } = useTranslation();


    return (
        <div>
            <SwipeableDrawer
                anchor="right"
                open={open}
                onClose={() => { }}
                onOpen={() => { }}
                slotProps={{
                    backdrop: {
                        style: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
                    },
                }}
                PaperProps={{
                    style: {
                        boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.2)",
                        backgroundColor: "white",
                    },
                }}
                style={{
                    zIndex: 1300,
                }}
            >
                <Box sx={{ backgroundColor: "whitesmoke" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            left: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        {" "}
                        <CloseIcon />
                    </IconButton>
                    <p
                        style={{
                            paddingTop: "2vh",
                            paddingBottom: "2vh",
                            paddingLeft: "10vh",
                            //   textAlign: "center",
                            fontSize: "20px",
                        }}
                    >
                        {title}
                    </p>

                    <Divider />
                </Box>



                <Box sx={{ p: 2 }}>
                    <TableContainer component={Paper}>
                        <Table
                            sx={{ minWidth: "60vh", backgroundColor: "#fff", boxShadow: 1 }}
                            aria-label="customized table"
                        >
                            <TableBody>
                                {userData?.map((row: any) => (
                                    <React.Fragment key={row.fileID}>
                                        <StyledTableRow>
                                            <StyledTableCell align="left">
                                                {" "}
                                                <span style={{ fontWeight: 600 }}>
                                                {t("text.FileNo")} :
                                                </span>{" "}
                                                {row.rFileNumber}
                                            </StyledTableCell>


                                            <StyledTableCell
                                                colSpan={2}
                                                align="left"
                                                style={{
                                                    whiteSpace: "pre-wrap",
                                                    wordWrap: "break-word",
                                                }}
                                            >
                                                <span style={{ fontWeight: 600 }}>
                                                {t("text.FileType")} :{" "}
                                                </span>
                                                {row.rFileType}
                                            </StyledTableCell>
                                        </StyledTableRow>

                                        <StyledTableRow>

                                            <StyledTableCell align="left">
                                                {" "}
                                                <span style={{ fontWeight: 600 }}>
                                                {t("text.LetterNo")} :
                                                </span>{" "}
                                                {row.rLetterNumber}
                                            </StyledTableCell>

                                            <StyledTableCell align="left">
                                                {" "}
                                                <span style={{ fontWeight: 600 }}>
                                                {t("text.LetterType")} :{" "}
                                                </span>
                                                {row.rlId}{" "}
                                            </StyledTableCell>

                                        </StyledTableRow>
                                        <StyledTableRow>

                                            <StyledTableCell align="left">
                                                {" "}
                                                <span style={{ fontWeight: 600 }}>
                                                {t("text.Priority")} :
                                                </span>{" "}
                                                {row.rPriority}
                                            </StyledTableCell>

                                            <StyledTableCell align="left">
                                                {" "}
                                                <span style={{ fontWeight: 600 }}>
                                                {t("text.Language")} :
                                                </span>{" "}
                                                {row.rLanguage}
                                            </StyledTableCell>

                                        </StyledTableRow>

                                        <StyledTableRow>

                                            <StyledTableCell align="left">
                                                {" "}
                                                <span style={{ fontWeight: 600 }}>
                                                {t("text.LetterSentOn")} :
                                                </span>{" "}
                                                {dayjs(row.rLetterSentOn).format("YYYY-MM-DD")}
                                            </StyledTableCell>

                                            <StyledTableCell align="left">
                                                <span style={{ fontWeight: 600 }}>
                                                {t("text.ReceivedDate")}:
                                                </span>{" "}
                                                {dayjs(row.rReceivedDate).format("YYYY-MM-DD")}
                                                {/* {(row.status === "2" ? <>Issue</> : <>N/A</>)} */}
                                            </StyledTableCell>

                                        </StyledTableRow>


                                        
                                        <StyledTableRow>
                                            <StyledTableCell align="left">
                                                <span style={{ fontWeight: 600 }}>{t("text.MobNo")} :</span>{" "}
                                                {row.rPhone}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                <span style={{ fontWeight: 600 }}>
                                                {t("text.SendTo")} :
                                                </span>{" "}
                                                {row.letterBy}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell align="left">
                                                <span style={{ fontWeight: 600 }}> {t("text.SendFrom")} :</span>{" "}
                                                {row.rSendAdrs}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                <span style={{ fontWeight: 600 }}>
                                                {t("text.Remark")} :
                                                </span>{" "}
                                                {row.rRemark}
                                            </StyledTableCell>
                                        </StyledTableRow>

                                        <StyledTableRow>
                                            <StyledTableCell align="left">
                                                <span style={{ fontWeight: 600 }}>{t("text.Subject")} :</span>{" "}
                                                {row.rSubject}
                                            </StyledTableCell>
                                           
                                        </StyledTableRow>


                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <br />
                    {userData?.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table
                                sx={{ minWidth: "60vh", backgroundColor: "#f4f4f5", boxShadow: 1 }}
                                aria-label="customized table"
                            >

                                <TableBody>
                                    {userData?.map((row: any) => (
                                        <React.Fragment key={row.rid}>
                                            <StyledTableRow>

                                                <StyledTableCell align="center">
                                                    {" "}

                                                    <embed
                                                        src={`${row.fileattach_name}`}
                                                        //alt={`${row.fileName}`}
                                                        style={{ width: "95%", height: "35vh", alignItems: "center" }}
                                                    />

                                                </StyledTableCell>
                                            </StyledTableRow>
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        "No File Found"
                    )}

                </Box>
            </SwipeableDrawer>
        </div>
    );
}

export default PageCreateSwipeableDrawer;
