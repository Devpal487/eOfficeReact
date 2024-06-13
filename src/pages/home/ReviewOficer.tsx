import {
    Button,
    CardContent,
    Grid,
    Typography,
    Tabs,
    Tab,
    useMediaQuery, useTheme 
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import api from "../../utils/Url";
import { EmailIcons, FileCopyIcons, FilemoveIcons, FolderIcons, ImportExportIcons, InboxIcons, NotificationsIcons, PendingIcons, ShareIcons, SmsIcons, UpgradeIcons } from "../../utils/icons";
import Inbox from "./Inbox";
import Sent from "./Sent";
import Awaited from "./Awaited";
import WorkPlace from "./Workplace";
import Parked from "./Parked";
import Closed from "./Closed";
import BulkClosed from "./BulkClosed";
import MyAllFiles from "./MyAllFiles";
import MergeFile from "./MergeFile";
import Notifications from "./Notifications";
import Message from "./Message";
import Letter from "./Letter";


type Props = {};

const ReviewOficer = (props: Props) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [value, setValue] = useState<any>(0);


    const handleTab = (event: any, newValue: any) => {
        console.log(newValue)
        setValue(newValue);
    };

    const items = [
        { id: 0, text: " Inbox", icon:<InboxIcons/>, },
        { id: 1, text: " Sent", icon:<ShareIcons/>},
        { id: 2, text: " Awaited", icon:<FolderIcons/>},
        { id: 3, text: " WorkPlace", icon:<FilemoveIcons/>,  },
        { id: 4, text: " Parked / Archived", icon:<UpgradeIcons/>,  },
        { id: 5, text: " Closed", icon:<UpgradeIcons/>},
        { id: 6, text: " Bulk Closed", icon:<PendingIcons/>},
        { id: 7, text: " My All Files", icon:<FilemoveIcons/>, },
        { id: 8, text: " Create New File", icon:<FileCopyIcons/>},
        { id: 9, text: " Merge File", icon:<ImportExportIcons/>},
        { id: 10, text: " Notifications", icon:<NotificationsIcons/>},
        { id: 11, text: " Message", icon:<SmsIcons/>},
        { id: 12, text: " Letter", icon:<EmailIcons/>},
    ];

    const tabStyle = {
        default: {
          minWidth: isMobile ? 'auto' : 120,
        },
        selected: {
          minWidth: isMobile ? 'auto' : 120,
          fontWeight: 'bold',
        },
      };

    return (
        <>
            <div
                style={{
                    padding: "-5px 5px",
                    backgroundColor: "#ffffff",
                    borderRadius: "5px",
                    marginTop: "5px",
                }}
            >
                <CardContent>                  

                    <Grid item sm={4} md={6} xs={12} alignItems="center" justifyContent="flex-start" display="flex">
                        <Tabs
                            value={value}
                            onChange={handleTab}
                            indicatorColor="primary"
                            textColor="primary"
                            // centered={!isMobile}
                            variant="scrollable" 
                            scrollButtons="auto" 
                            >
                           
                        {items.map((item, index) => (
                             <Tab 
                             key={item.id}
                             icon={item.icon}
                                label={item.text}
                            />
                            ))}
                        </Tabs>
                    </Grid>

                    {value === 0 && (<Inbox/>)}
                    {value === 1 && (<Sent/>)}
                    {value === 2 && (<Awaited/>)}
                    {value === 3 && (<WorkPlace/>)}
                    {value === 4 && (<Parked/>)}
                    {value === 5 && (<Closed/>)}
                    {value === 6 && (<BulkClosed/>)}
                    {value === 7 && (<MyAllFiles/>)}
                    {value === 9 && (<MergeFile/>)}
                    {value === 10 && (<Notifications/>)}
                    {value === 11 && (<Message/>)}
                    {value === 12 && (<Letter/>)}

                </CardContent>
            </div>
        </>
    );
};

export default ReviewOficer;
