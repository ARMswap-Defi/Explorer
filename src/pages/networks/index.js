import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { getSymbol } from "../../utils/tools";
import TokenLogo from "../../components/TokenLogo";
import supportedChainList from "../../components/APIs/getSupportedChainList.json";
import DetailCard from "../../components/DetailCard";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

export default function Networks() {
  const [searchQuery, setSearchQuery] = useState("");
  let [allSupportedChains, setAllSupportedChains] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  useEffect(() => {
    if (supportedChainList) {
      setAllSupportedChains(supportedChainList); // Convert the JSON data into an array of objects
    }
  }, [supportedChainList]);

  // Filter the supported chains based on the search query
  const filteredSupportedChains = allSupportedChains
    ? Object.entries(allSupportedChains)
        .map(([key, chain]) => ({
          key,
          ...chain,
        }))
        .filter((supportedChain) => {
          const query = searchQuery.toLowerCase();
          return (
            supportedChain.name.toLowerCase().includes(query) ||
            supportedChain.symbol.toLowerCase().includes(query) ||
            supportedChain.networkType.toLowerCase().includes(query)
          );
        })
    : [];

  return (
    <Container style={{ padding: "0px" }} sx={{ mt: 10, mb: 10 }}>
      {/* <Grid container spacing={2}>
        
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ mb: 2, p: 2, display: "flex", flexDirection: "column" }}>
            <DetailCard mainText={"Nodes"} subText={"21"} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ mb: 2, p: 2, display: "flex", flexDirection: "column" }}>
            <DetailCard mainText={"Chains"} subText={"81"} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ mb: 2, p: 2, display: "flex", flexDirection: "column" }}>
            <DetailCard mainText={"Bridges"} subText={"3256"} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ mb: 2, p: 2, display: "flex", flexDirection: "column" }}>
            <DetailCard mainText={"TVL (USD)"} subText={"$1.76 B"} />
          </Paper>
        </Grid>
      </Grid> */}
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Toolbar
          className="table-header"
          sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}
        >
          <Typography
            sx={{ flex: "1 1 70%" }}
            component="h2"
            variant="h6"
            color="primary"
            gutterBottom
          >
            <div className="table-nav">
              <Typography
                sx={{
                  flex: "1 1 100%",
                  fontFamily: "Inter",
                  fontWeight: "600",
                  color: "#000",
                }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                All Networks <span>{filteredSupportedChains.length}</span>
              </Typography>
            </div>
          </Typography>

          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              variant="standard"
              className="token-searchbar"
              placeholder="Search by name, symbol, or type"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ marginBottom: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Toolbar>
        {filteredSupportedChains ? (
          <React.Fragment>
            <>
              {filteredSupportedChains && filteredSupportedChains.length > 0 ? (
                <>
                  <div style={{ overflowX: "auto" }}>
                    <Table size="small">
                      <TableHead className="table-head">
                        <TableRow>
                          <TableCell>Icon</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Symbol</TableCell>
                          <TableCell>ChainId</TableCell>
                          <TableCell>Type</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredSupportedChains
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((supportedChain, index) => (
                            <TableRow
                              key={index}
                              variant="overline"
                              className="table-row"
                            >
                              <TableCell>
                                <TokenLogo
                                  symbol={getSymbol(supportedChain.symbol)}
                                  logoUrl={supportedChain.logoUrl}
                                  size={"24px"}
                                />
                              </TableCell>
                              <TableCell>{supportedChain.name}</TableCell>
                              <TableCell>{supportedChain.symbol}</TableCell>
                              <TableCell>{supportedChain.key}</TableCell>
                              <TableCell>
                                {supportedChain.networkType}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                  <TablePagination
                    className="table-pagination"
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={filteredSupportedChains.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </>
              ) : (
                <div style={{ textAlign: "center", margin: "15px 0px" }}>
                  <span style={{ textAlign: "center", color: "#626d72" }}>
                    No record found
                  </span>
                </div>
              )}
            </>
          </React.Fragment>
        ) : (
          <Skeleton variant="rectangular" width="100%" height={220} />
        )}
      </Paper>
    </Container>
  );
}
