import React, { useEffect, useState } from "react";
import {
  Grid,
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
import Hash from "./ui/Hash";
import Link from "./ui/Link";
import {
  fromWei,
  thousandBit,
  timesFun,
  safeFormatValue,
} from "../utils/tools";
// import { getAllSwapTrxHistories } from "./hooks/useSwapHistory";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { getSourcePath } from "./config/getSourcePath";
import axios from "axios";
import { getTransactionStatusRPC } from "../components/AlchemySDK/commons";

function preventDefault(event) {
  event.preventDefault();
}
export default function AllTransactions({ blockNumber }) {
  // const { allSwapTrxHistories } = getAllSwapTrxHistories();
  const chainId = {
    ARBITRUM: "42161",
    AURORA: "1313161554",
    AVAX: "43114",
    BNB: "56",
    CELO: "42220",
    CORE: "1116",
    CRO: "25",
    CHZ: "88888",
    ETH: "1",
    BASE: "8453",
    FLARE: "14",
    FSN: "32659",
    FTM: "250",
    IOTEX: "4689",
    MATIC: "137",
    GLMR: "1284",
    MOVR: "1285",
    OKT: "66",
    OPTIMISM: "10",
    ETHW: "10001",
    TLOS: "40",
    CFX: "1030",
    EVMOS: "9001",
    ETC: "61",
    SCROLL: "534354",
    MNT: "5000",
    BLAST: "81457",
    THETA: "361",
    SCRL: "534353",
    AMB: "16718",
    BB: "6001",
    ZK: "234",
  };
  const [countData, setCountData] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  // let [allTransactions, setAllTransactions] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const [apiData, setApiData] = useState([]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getToken = (item) => {
    const chainEntry = Object.entries(chainId).find(
      ([name, id]) => id === item
    );
    return chainEntry ? chainEntry[0] : "Unknown Token";
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // let filteredTransactions;

  // useEffect(() => {
  //   if (allSwapTrxHistories.data) {
  //     console.log(allSwapTrxHistories.data);
  //     setAllTransactions(allSwapTrxHistories.data.ExplorerTransactions);
  //     setCountData(allSwapTrxHistories.data.TotalRecords);
  //   } else {
  //     setAllTransactions([]);
  //     setCountData(0);
  //   }
  // }, [allSwapTrxHistories]);

  // Filter the transactions based on the search query
  // const filteredTransactions = allTransactions
  //   ? allTransactions?.filter((transaction) => {
  //       const query = searchQuery.toLowerCase();
  //       return (
  //         transaction.txid.toLowerCase().includes(query) ||
  //         transaction.txto.toLowerCase().includes(query) ||
  //         transaction.from.toLowerCase().includes(query) ||
  //         transaction.to.toLowerCase().includes(query)
  //       );
  //     })
  //   : [allTransactions];
  const visibleRows = React.useMemo(() => {
    if (!apiData || !Array.isArray(apiData)) return []; // Ensure apiData is an array
    const filteredRows = apiData;
    // console.log("Filter", filteredRows);
    // setCountData(filteredRows.length);
    // Sort the filtered rows
    // console.log(order, "-", orderBy);
    // const sortedRows = stableSort(filteredRows, getComparator(order, orderBy));
    console.log("visible row", filteredRows);
    return filteredRows;
  }, [apiData, page, rowsPerPage]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const params = {
          offset: page * rowsPerPage,

          limit: rowsPerPage,
          searchWord: searchQuery,
        };
        await axios
          .get(`${process.env.NEXT_PUBLIC_ROUTER_API}`, {
            params,
          })
          .then((response) => {
            if (response.data !== null && response.data !== undefined) {
              // console.log("API response", response.data);
              setApiData(response.data.ExplorerTransactions);
              setCountData(response.data.TotalRecords);
            } else {
              setApiData([]);
              setCountData(0);
            }
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setApiData([]);
            setCountData(0);
            setIsLoading(false);
          });
      } catch (error) {
        // Handle any errors that occur during the fetch operation
        console.log(error);
      }
    };
    // Call the fetchData function when the component mounts
    fetchData();
  }, [page, rowsPerPage]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const params = {
          offset: 0 * rowsPerPage,

          limit: rowsPerPage,
          searchWord: searchQuery,
        };
        await axios
          .get(`${process.env.NEXT_PUBLIC_ROUTER_API}`, {
            params,
          })
          .then((response) => {
            if (response.data !== null && response.data !== undefined) {
              // console.log("API response", response.data);
              setApiData(response.data.ExplorerTransactions);
              setCountData(response.data.TotalRecords);
              setPage(0);
            } else {
              setApiData([]);
              setCountData(0);
            }
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setApiData([]);
            setCountData(0);
            setIsLoading(false);
          });
      } catch (error) {
        // Handle any errors that occur during the fetch operation
        console.log(error);
        setIsLoading(false);
        // showAlert("error", "Failed", "Error fetching data");
      }
    };
    // Call the fetchData function when the component mounts
    fetchData();
  }, [searchQuery]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // After 1 second of no typing, update the debounced search query
      setSearchQuery(debouncedSearchQuery);
    }, 1000); // 1 second delay

    return () => {
      // Clean up the timeout when the component re-renders or user starts typing again
      clearTimeout(timeoutId);
    };
  }, [debouncedSearchQuery]);
  const handleChange = (e) => {
    setDebouncedSearchQuery(e.target.value); // Update search query immediately as user types
  };

  // useEffect(() => {
  //   // Test transaction hash (replace with your actual transaction hash)
  //   const txHashh =
  //     "0xf8f2217fc1081977474a139bee4ec74d16e30bf1f34005db8f570e39a4ec40b8";

  //   // Calling the function to get transaction status
  //   getTransactionStatusRPC(txHashh, 61).then((status) => {
  //     console.log("Status :", status); // Set the status in the state to render
  //   });
  // }, []);

  return (
    <React.Fragment>
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
              All Transactions <span>{countData}</span>
            </Typography>
          </div>
        </Typography>

        <Grid item xs={12} md={7}>
          <TextField
            fullWidth
            variant="standard"
            className="token-searchbar"
            placeholder="Search by address, trx or action"
            value={debouncedSearchQuery}
            onChange={handleChange}
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
      {!isLoading ? (
        <React.Fragment>
          {visibleRows && visibleRows.length > 0 ? (
            <>
              <div className="mobile-td" style={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead className="table-head">
                    <TableRow>
                      <TableCell>S.No</TableCell>
                      <TableCell>Coin</TableCell>
                      <TableCell>From</TableCell>
                      <TableCell>Trx Hash</TableCell>
                      <TableCell>Value</TableCell>
                      {/* <TableCell>Intracted with</TableCell> */}
                      <TableCell>To </TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <>
                      {visibleRows
                        // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((t, index) => {
                          const token = getToken(t.chainid);
                          return (
                            <TableRow
                              className="table-row"
                              key={index}
                              variant="overline"
                            >
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <div className="token-name-logo">
                                  <img
                                    className="token-logo"
                                    src={getSourcePath(token)}
                                  />
                                  <p className="token-id">{token}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Hash path="address" hash={t.signeraddress} />
                              </TableCell>
                              <TableCell>
                                <Hash
                                  path="/trxDetail/[trxHash]/[trxDetail]"
                                  hash={t.txhash}
                                  transactionDetail={t}
                                />
                              </TableCell>

                              <TableCell>
                                <p className="p" style={{ margin: "inherit" }}>
                                  Sent: {safeFormatValue(t.value, 18)}
                                </p>
                                {/* <p className="p" style={{ margin: "inherit" }}>
                          Received: {thousandBit(fromWei(t.swapvalue, 18), 2)}
                        </p> */}
                              </TableCell>
                              {/* <TableCell>
                        <Hash path="address" hash={t.to} />
                      </TableCell> */}
                              <TableCell>
                                <Hash
                                  path="address"
                                  hash={t.receiver}
                                  transactionDetail={t}
                                />
                              </TableCell>
                              <TableCell>{timesFun(t.time)} ago</TableCell>
                              <TableCell>{t.action}</TableCell>

                              {/* <TableCell>{getStatus(t.status)}</TableCell> */}
                            </TableRow>
                          );
                        })}
                    </>
                  </TableBody>
                </Table>
              </div>

              <TablePagination
                className="table-pagination"
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={countData}
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
        </React.Fragment>
      ) : (
        <Skeleton variant="rectangular" width="100%" height={220} />
      )}
    </React.Fragment>
  );
}
