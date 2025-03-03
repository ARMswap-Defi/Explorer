import * as React from "react";
import { useRouter } from "next/router";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Button,
} from "@mui/material";
import logo from "../../public/assets/logo-svg.svg";
import Link from "./ui/Link";
import Image from "next/image";
const navItems = ["home", "networks"];
import BottomNavigation from "@mui/material/BottomNavigation";
export default function HeaderNavToolBar() {
  const handleLaunchAppClick = () => {
    // Change the route when the Launch App button is clicked
    window.open("https://app.armswap.com", "_blank"); // Replace with the route you want to navigate to
  };
  const router = useRouter();
  const [value, setValue] = React.useState(0);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar component={"nav"} className="nav-bar">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Link color="#ffffff" href="/" underline="none">
              <Image className="logo" src={logo} />
            </Link>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {navItems.map((item) => (
                <Link
                  key={item}
                  className="header-links"
                  color={
                    router.pathname === `/${item}` ||
                    (router.pathname === "/" && item === "home")
                      ? "#298DFE" // Active color
                      : "#475467" // Default color
                  }
                  href={item === "home" ? "/" : `/${item}`}
                  underline="none"
                  sx={{ margin: "0 10px" }} // Add bold font weight when on root path and 'home' tab
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              ))}
            </Box>
            <Box style={{ padding: "10px" }}>
              <Button
                variant="contained"
                className="launchapp"
                onClick={handleLaunchAppClick}
                sx={{ marginLeft: "10px" }}
              >
                Launch App
              </Button>
            </Box>
            <Box
              className="bottom-navigation"
              sx={{ display: { xs: "block", sm: "none" } }}
            >
              <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                sx={{ alignItems: "center" }}
              >
                {navItems.map((item) => (
                  <Link
                    key={item}
                    className="header-links"
                    color={
                      router.pathname === `/${item}` ||
                      (router.pathname === "/" && item === "home")
                        ? "#298DFE" // Active color
                        : "#475467" // Default color
                    }
                    href={item === "home" ? "/" : `/${item}`}
                    underline="none"
                    sx={{ margin: "0 10px" }} // Add bold font weight when on root path and 'home' tab
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Link>
                ))}
              </BottomNavigation>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
