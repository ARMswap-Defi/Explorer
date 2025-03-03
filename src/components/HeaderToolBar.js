import * as React from "react";
import { AppBar, Box, Toolbar, Typography, Container } from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";
import Link from "./ui/Link";
import SearchBar from "./ui/SearchBar";

export default function HeaderToolBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Link color="#ffffff" href="/" underline="none">
              <Typography
                variant="h6"
                noWrap
                component="span"
                sx={{
                  display: { xs: "none", sm: "flex", alignItems: "center" },
                }}
              >
                <AdbIcon
                  sx={{
                    mr: 1,
                    ml: 1,
                  }}
                />
                ARMMultinet Explorer
              </Typography>
            </Link>
            <SearchBar />
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {/* Network selection */}

              {/* Theme selection */}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
