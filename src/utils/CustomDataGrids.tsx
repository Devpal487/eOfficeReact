import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import { Language } from 'react-transliterate';
import TranslateTextField from '../TranslateTextField';

interface CustomDataGridProps {
    isLoading: boolean;
    rows: any[];
    columns: any[];
    pageSizeOptions?: number[];
    initialPageSize?: number;
    lang: Language;
}

const CustomDataGrids: React.FC<CustomDataGridProps> = ({
  isLoading,
  rows,
  columns,
  pageSizeOptions = [5, 10, 25, 50, 100],
  initialPageSize = 5,
  lang,
  ...otherProps
}) => {
    const [searchText, setSearchText] = useState("");
    const [filteredRows, setFilteredRows] = useState(rows);
    
    useEffect(() => {
        // Filter rows based on searchText and language
        const searchRegex = new RegExp(searchText, "i");
        const filtered = rows.filter((row) =>
            Object.values(row).some((value: any) => {
                const valueStr = value.toString();
                // Adjust the search logic here if needed for specific languages
                return searchRegex.test(valueStr);
            })
        );
        setFilteredRows(filtered);
    }, [searchText, rows, lang]);
    
    const CustomToolbar = () => (
        <GridToolbarContainer>
            <TranslateTextField
                label="Search data"
                value={searchText}
                onChangeText={(text: string) => setSearchText(text)}
                required={false}
                lang={lang}
            />
        </GridToolbarContainer>
    );

    return (
        isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </div>
        ) : (
            <Box>
                <br />
                <div style={{ height: "50vh", width: "100%", backgroundColor: "#FFFFFF", overflowY: "auto" }}>
                    <DataGrid
                        rows={filteredRows} // Use filteredRows here
                        columns={columns}
                        autoHeight
                        rowHeight={35}
                        slots ={{
                            toolbar: CustomToolbar // Use your custom toolbar
                        }}
                        rowSpacingType="border"
                        pagination
                        pageSizeOptions={pageSizeOptions}
                        initialState={{
                            pagination: { paginationModel: { pageSize: initialPageSize } },
                        }}
                        sx={{
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#2B4593',
                                color: '#fff',
                                fontSize: '15px !important',
                                fontWeight: 900,
                                height: '37px',
                                minHeight: '37px',
                                maxHeight: '37px',
                                lineHeight: '37px',
                            },
                            '& .MuiDataGrid-columnHeader': {
                                height: '37px !important',
                                minHeight: '37px !important',
                                maxHeight: '37px !important',
                                lineHeight: '37px !important',
                            },
                            '& .MuiDataGrid-columnHeader--sortable': {
                                height: '37px !important',
                                minHeight: '37px !important',
                                maxHeight: '37px !important',
                                lineHeight: '37px !important',
                            },
                            '& .MuiDataGrid-withBorderColor': {
                                height: '37px !important',
                                minHeight: '37px !important',
                                maxHeight: '37px !important',
                                lineHeight: '37px !important',
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                overflow: 'visible',
                            },
                            '& .MuiDataGrid-colCell': {
                                fontSize: '15px !important',
                            }
                        }}
                    />
                </div>
            </Box>
        )
    );
};

export default CustomDataGrids;


// import React, { useEffect, useState } from 'react';
// import { Box, CircularProgress, TextField } from '@mui/material';
// import { DataGrid, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer } from '@mui/x-data-grid';
// import { Language } from 'react-transliterate';
// import TranslateTextField from '../TranslateTextField';


// interface CustomDataGridProps {
//     isLoading: boolean;
//     rows: any[]; 
//     columns: any[]; 
//     pageSizeOptions?: number[];
//     initialPageSize?: number;
//     lang: Language;
//   }


// const CustomDataGrids: React.FC<CustomDataGridProps> = ({
//   isLoading,
//   rows,
//   columns,
//   pageSizeOptions = [5, 10, 25, 50, 100],
//   initialPageSize = 5,
//   lang,
//   ...otherProps
// }) => {
//     console.log("check lang", lang)
//     const [searchText, setSearchText] = useState("");
//     const [filteredRows, setFilteredRows] = useState(rows);
    
//     useEffect(() => {
//         // Filter rows based on searchText and language
//         const searchRegex = new RegExp(searchText, "i");
//         const filtered = rows.filter((row) =>
//             Object.values(row).some((value:any) => {
//                 const valueStr = value.toString();
//                 // For Hindi or other languages, you can adjust the search logic here
//                 return searchRegex.test(valueStr);
//             })
//         );
//         setFilteredRows(filtered);
//     }, [searchText, rows, lang]);
    
//     console.log("searchText", lang, searchText)

//   const CustomToolbar = () => (
//     <GridToolbarContainer>
//       <TranslateTextField
//                   label="Search data"
//                   value={searchText}
//                   onChangeText={(text: string) => setSearchText(text)}
//                   required={false}
//                   lang={lang}
//                 />
//     </GridToolbarContainer>
//   );

//   return (
//     isLoading ? (
      
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <CircularProgress />
//       </div>
//     ) : (
//       <Box>
//         <br />
//         <div style={{ height: "50vh", width: "100%", backgroundColor: "#FFFFFF",overflowY: "auto" }}>
          
//           <DataGrid
//             rows={rows}
//             columns={columns}
//             autoHeight
//             rowHeight={35}
//             slots={{
//               toolbar: GridToolbar,
//             }}
//             rowSpacingType="border"
//             pagination={true}
//             pageSizeOptions={pageSizeOptions.map((size) => ({
//               value: size,
//               label: `${size}`,
//             }))}
//             initialState={{
//               pagination: { paginationModel: { pageSize: initialPageSize } },
//             }}
//             slotProps={{
//                 toolbar: {
//                   showQuickFilter: true,
//                 },
//               }}
            
//               sx={{
//                 '& .MuiDataGrid-columnHeaders': {
//                   backgroundColor: '#2B4593',
//                   color: '#fff',
//                   fontSize: '15px !important',
//                   fontWeight: 900,
//                   height: '37px',
//                   minHeight: '37px',
//                   maxHeight: '37px',
//                   lineHeight: '37px',
//                 },
//                 '& .MuiDataGrid-columnHeader': {
//                   height: '37px !important',
//                   minHeight: '37px !important',
//                   maxHeight: '37px !important',
//                   lineHeight: '37px !important',
//                 },
//                 '& .MuiDataGrid-columnHeader--sortable': {
//                   height: '37px !important',
//                   minHeight: '37px !important',
//                   maxHeight: '37px !important',
//                   lineHeight: '37px !important',
//                 },
//                 '& .MuiDataGrid-withBorderColor': {
//                   height: '37px !important',
//                   minHeight: '37px !important',
//                   maxHeight: '37px !important',
//                   lineHeight: '37px !important',
//                 },
//                 '& .MuiDataGrid-columnHeaderTitle': {
//                   overflow: 'visible',
//                   // whiteSpace: 'normal',
//                 },
//                 '& .MuiDataGrid-colCell' :{
//                   fontSize: '15px !important',
//                 }
//               }}
//           />
//         </div>
//       </Box>
      
//     )
//   );
// };

// export default CustomDataGrids;
