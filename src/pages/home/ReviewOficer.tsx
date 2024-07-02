import {
    CardContent,
    Grid,
    Tabs,
    Tab,
    useMediaQuery, useTheme 
} from "@mui/material";
import  {  useState } from "react";
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
import { useTranslation } from "react-i18next";


type Props = {};

const ReviewOficer = (props: Props) => {
    const { t } = useTranslation();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [value, setValue] = useState<any>(0);


    const handleTab = (event: any, newValue: any) => {
        console.log(newValue)
        setValue(newValue);
    };

    const items = [
        { id: 0, text: t("text.Inbox"), icon:<InboxIcons/> },
        { id: 1, text:t("text.Sent"), icon:<ShareIcons/>},
        { id: 2, text:t("text.Awaited"), icon:<FolderIcons/>},
        { id: 3, text:t("text.Workplace"), icon:<FilemoveIcons/>  },
        { id: 4, text:t("text.ParkedArchived"), icon:<UpgradeIcons/>  },
        { id: 5, text:t("text.Closed"), icon:<UpgradeIcons/>},
        { id: 6, text: t("text.BulkClosed"), icon:<PendingIcons/>},
        { id: 7, text:t("text.MyAllFiles"), icon:<FilemoveIcons/> },
       // { id: 8, text: " Create New File", icon:<FileCopyIcons/>},
        { id: 8, text:t("text.MergeFile"), icon:<ImportExportIcons/>},
        { id: 9, text: t("text.Notifications"), icon:<NotificationsIcons/>},
        { id: 10, text:t("text.Message"), icon:<SmsIcons/>},
        { id: 11, text:t("text.Letter"), icon:<EmailIcons/>},
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
                    {value === 8 && (<MergeFile/>)}
                    {value === 9 && (<Notifications/>)}
                    {value === 10 && (<Message/>)}
                    {value === 11 && (<Letter/>)}

                </CardContent>
            </div>
        </>
    );
};

export default ReviewOficer;