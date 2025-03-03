import React, { useEffect, useState } from "react";
import styled from "styled-components";
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
import supportedTokenList from "../../components/APIs/tokenlabel.json";
import tokenSupplyAndTVL from "../../components/APIs/lockToken.json";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
// Define a function to add TVL and amount data to supported tokens
function addTVLAndAmountToTokens() {
  const updatedTokens = Object.keys(supportedTokenList).map((tokenKey) => {
    const matchingSupply = tokenSupplyAndTVL.find(
      (item) => item.tokenKey === tokenKey
    );
    if (matchingSupply) {
      return {
        ...supportedTokenList[tokenKey],
        supply: matchingSupply.amount,
        tvl: matchingSupply.tvl,
      };
    }
    return supportedTokenList[tokenKey];
  });
  return updatedTokens;
}

export default function Tokens() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allSupportedTokens, setAllSupportedTokens] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Reset the page when the search query changes

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
    if (supportedTokenList) {
      const tokensWithTVLAndAmount = addTVLAndAmountToTokens();
      console.log(tokensWithTVLAndAmount);

      setAllSupportedTokens(tokensWithTVLAndAmount);
    }
  }, [supportedTokenList]);

  // Filter the supported tokens based on the search query
  const filteredSupportedTokens = allSupportedTokens
    ? allSupportedTokens.filter((supportedToken) => {
        const query = searchQuery.toLowerCase();
        return (
          supportedToken.name.toLowerCase().includes(query) ||
          supportedToken.symbol.toLowerCase().includes(query)
        );
      })
    : [];
  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 10 }}>
      <Paper sx={{ p: 0, display: "flex", flexDirection: "column" }}>
        <Toolbar
          className="table-header"
          sx={{ py: 2, pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}
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
                All Tokens <span>{filteredSupportedTokens.length}</span>
              </Typography>
            </div>
          </Typography>

          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              className="token-searchbar"
              variant="standard"
              placeholder="Search by name, or symbol"
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
          {/* <Link
          color="primary"
          href="#"
          onClick={preventDefault}
          sx={{ fontSize: "small" }}
        >
          View all transactions
        </Link> */}
        </Toolbar>
        {filteredSupportedTokens ? (
          <React.Fragment>
            <Table size="small">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell>Token</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Symbol</TableCell>
                  <TableCell>Supply</TableCell>
                  <TableCell>TVL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSupportedTokens
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((supportedToken, index) => (
                    <TableRow
                      className="table-row"
                      key={index}
                      variant="overline"
                    >
                      <TableCell>
                        <TokenLogo
                          symbol={getSymbol(supportedToken.symbol)}
                          logoUrl={supportedToken.logoUrl}
                          size={"24px"}
                        />
                      </TableCell>
                      <TableCell>{supportedToken.name}</TableCell>
                      <TableCell>{supportedToken.symbol}</TableCell>
                      <TableCell>{supportedToken.supply}</TableCell>
                      <TableCell>{supportedToken.tvl}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={filteredSupportedTokens.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </React.Fragment>
        ) : (
          <Skeleton variant="rectangular" width="100%" height={220} />
        )}
      </Paper>
    </Container>
  );
}
