import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

interface Props {
    open: boolean;
    onClose: () => void;
    userData: any;
}

function SwipeableDrawerRoute({ open, onClose, userData }: Props) {
// console.log("line 13 drawer", userData)


const renderNodeMode = (nodeMode: string) => {
    console.log("nodeMode:", nodeMode);
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
        <div>
            <SwipeableDrawer
                anchor="right"
                open={open}
                onClose={onClose}
                onOpen={() => { }}
                slotProps={{
                    backdrop: {
                        style: { backgroundColor: "rgba(0, 0, 0, 0)" },
                    },
                }}
                PaperProps={{
                    style: {
                        boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.2)",
                        backgroundColor: "whitesmoke",
                    },
                }}
                style={{
                    zIndex: 1300,
                }}
            >
                <Box sx={{ width: 260 }}>
                    {userData && userData.length > 0 ? (
                        <>
                    <p
                        style={{
                            paddingTop: "5vh",
                            paddingBottom: "5vh",
                            textAlign: "center",
                            backgroundColor:"#00009a",
                            color: "whitesmoke",
                            borderBottomLeftRadius: "10px",
                            borderBottomRightRadius: "10px",
                            fontSize: "20px",
                        }}
                    >
                       #{userData[0]['id']} Route Details
                    </p>
                       <div style={{margin:"15px"}}>
                        <p><strong>Route Name: </strong> {userData[0]["routeName"]}</p>
                       </div>
                       <div style={{margin:"15px"}}>
                        <p><strong>Total Level: </strong> {userData[0]["totalLevel"]}</p>
                       </div>

                       {userData[0]["routeMembercycless"].map((Level: any, index: any) => (
                                <div key={index} style={{ margin: "25px" }}>
                                    <p><strong>Level {index + 1}: </strong>  {renderNodeMode(Level.nodeMode)}</p>
                                </div>
                            ))}
                        </>
                    ): (
                        <div style={{ margin: "15px", textAlign: "center" }}>
                            <p>No data available</p>
                        </div>
                    )}
                </Box>
            </SwipeableDrawer>
        </div>
    );
}

export default SwipeableDrawerRoute;
