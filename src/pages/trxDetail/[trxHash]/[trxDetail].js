import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Grid,
  Paper,
  Typography,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import Hash from "../../../components/ui/Hash";
import { fromWei, safeFormatValue, thousandBit } from "../../../utils/tools";
import { getTransactionStatusRPC } from "../../../components/AlchemySDK/commons";
import CircularProgress from "@mui/joy/CircularProgress";

export default function TrxDetail() {
  const router = useRouter();
  const { trxHash, trxDetail } = router.query;
  const [transactionDetail, setTransactionDetail] = useState();
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (trxDetail && JSON.parse(trxDetail)) {
      setTransactionDetail(JSON.parse(trxDetail));
    }
  }, [trxDetail]);

  useEffect(() => {
    if (transactionDetail) {
      // console.log(transactionDetail);
      // console.log(transactionDetail.txhash, "trans", transactionDetail.chainid);
      setIsLoading(true);
      getTransactionStatusRPC(
        transactionDetail.txhash,
        transactionDetail.chainid
      )
        .then((res) => {
          console.log("Transaction Status:", res);
          setStatus(res);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching transaction status:", error);
          setStatus("Unable to fetch status try again later");
          setIsLoading(false);
        });
    }
  }, [transactionDetail]);

  return (
    <Grid item xs={12}>
      <Paper
        sx={{
          px: 4,
          py: 4,
          mt: 8,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          onClick={() => router.back()}
          className="back-btn"
          sx={{ cursor: "pointer" }}
          component="h2"
          variant="h6"
          color="primary"
          gutterBottom
        >
          <ArrowBackIcon />
          Back
        </Typography>

        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Transaction detail
        </Typography>

        {transactionDetail ? (
          <div style={{ overflowX: "auto" }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Transaction Hash:
                  </TableCell>
                  <TableCell>
                    <Hash
                      isCompressed={false}
                      hasLink={false}
                      hash={transactionDetail.txhash}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Status:
                  </TableCell>
                  <TableCell>
                    {isLoading ? (
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={18}
                      />
                    ) : (
                      status
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Action:
                  </TableCell>
                  <TableCell>{transactionDetail.action}</TableCell>
                </TableRow>
                {/* <TableRow>
                <TableCell style={{ whiteSpace: "nowrap" }}>Block:</TableCell>
                <TableCell>
                  <Hash
                    path="block"
                    text={transactionDetail.blockNumber}
                    hash={transactionDetail.blockHash}
                  />{" "}
                  {transactionDetail.confirmations} confirmations
                </TableCell>
              </TableRow> */}
                <TableRow>
                  <TableCell style={{ whiteSpace: "nowrap" }}>From:</TableCell>
                  <TableCell>
                    <Hash
                      path="address"
                      hash={transactionDetail.signeraddress}
                      isCompressed={false}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Intrected With(To):
                  </TableCell>
                  <TableCell>
                    <Hash
                      path="address"
                      hash={transactionDetail.to}
                      isCompressed={false}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ whiteSpace: "nowrap" }}>To:</TableCell>
                  <TableCell>
                    <Hash
                      path="address"
                      hash={transactionDetail.receiver}
                      isCompressed={false}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Value:</TableCell>
                  <TableCell>
                    <p className="p">
                      Sent: {safeFormatValue(transactionDetail.value, 18)}
                    </p>
                    {/* <p className="p">
                    Received:{" "}
                    {thousandBit(fromWei(transactionDetail.swapvalue, 18), 2)}
                  </p> */}
                  </TableCell>
                </TableRow>
                {/* <TableRow>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  Transaction fee:
                </TableCell>
                <TableCell>
                  {Utils.formatEther(
                    transactionDetail.maxFeePerGas.mul(
                      transactionDetail.gasUsed
                    )
                  )}{" "}
                  ETH ( gasPrice * gasUsed (in Gwei):{" "}
                  {Utils.formatUnits(
                    transactionDetail.gasPrice.mul(transactionDetail.gasUsed),
                    "gwei"
                  )}
                  )
                </TableCell>
              </TableRow> */}
                {/* TODO: <TableRow>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  Transaction action:
                </TableCell>
                <TableCell>GET THIS FROM LOGS</TableCell>
              </TableRow> */}
                {/* <TableRow>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  Gas used:
                </TableCell>
                <TableCell>
                  {Utils.formatEther(transactionDetail.gasUsed)} ETH (
                  {Utils.formatUnits(transactionDetail.gasUsed, "gwei")} Gwei)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  Gas price:
                </TableCell>
                <TableCell>
                  {Utils.formatEther(transactionDetail.gasPrice)} ETH (
                  {Utils.formatUnits(transactionDetail.gasPrice, "gwei")} Gwei)
                </TableCell>
              </TableRow> */}
                {/* Use collapsible row to show even more information https://mui.com/material-ui/react-table/#collapsible-table
              <TableRow>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  Timestamp:
                </TableCell>
                <TableCell>GET THIS FROM BLOCK DATA</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  Transaction action:
                </TableCell>
                <TableCell>GET THIS FROM LOGS</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  Transaction JSON
                </TableCell>
                <TableCell>{JSON.stringify(transactionDetail)}</TableCell>
              </TableRow> */}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Skeleton variant="rectangular" width="100%" height={220} />
        )}
      </Paper>
    </Grid>
  );
}
