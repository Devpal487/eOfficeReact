import React from 'react'
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {Button,CircularProgress} from "@mui/material";

// interface ButtonWithLoaderProps {
//   buttonText: string;
//   onClickHandler: () => Promise<void>;
// }

interface ButtonWithLoaderProps {
  buttonText: string;
  onClickHandler: () => Promise<void>;
  successColor?: string;
  loadingColor?: string;
  fullWidth?: boolean;
}

  
//const ButtonWithLoader: React.FC<ButtonWithLoaderProps> = ({ buttonText, onClickHandler }) => {
  const ButtonWithLoader: React.FC<ButtonWithLoaderProps> = ({ 
    buttonText, 
    onClickHandler, 
    successColor = "green", 
    loadingColor = "green", 
    fullWidth = false
  }) => {
    // console.log("Checkfullwidth", fullWidth)

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // const handleClick = async () => {
  //   setLoading(true);
  //   try {
  //     await onClickHandler();
  //     setSuccess(true);
  //   } catch (error) {
  //     setSuccess(false);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleClick = async () => {
    setLoading(true);
    setTimeout(async () => { 
      try {
        await onClickHandler();
        setSuccess(true);
      } catch (error) {
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const buttonSx = {
    ...(success && {
      // bgcolor: "green",
      '&:hover': {
        bgcolor: "green",
      },
    }),
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ m: 1, position: 'relative' }}>
        <Button
          variant="contained"
          sx={buttonSx}
          disabled={loading}
          onClick={handleClick}
          fullWidth={fullWidth}
        >
          {buttonText}
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              color: "green",
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
    </Box>
  );
}

export default ButtonWithLoader;