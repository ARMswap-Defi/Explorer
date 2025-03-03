import * as React from "react";
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
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import Hash from "../../components/ui/Hash";
import { getTransactionReceipt } from "../../components/AlchemySDK/commons";
import { Utils } from "alchemy-sdk";

export default function Transaction() {
  const router = useRouter();
  const { transaction } = router.query;
  const [transactionDetail, setTransactionDetail] = useState();

  useEffect(() => {
    if (transaction) {
      getTransactionReceipt(transaction)
        .then((res) => {
          if (res.error) {
            // Handle the error case (you could show a user-friendly message in the UI)
            console.error(res.error);
            setTransactionDetail({ error: res.error, details: res.details });
          } else {
            // Handle the successful case
            console.log(res);
            setTransactionDetail(res);
          }
        })
        .catch((error) => {
          // Catch any unexpected errors from the `getTransactionReceipt` promise
          console.error("Unexpected error:", error);
          setTransactionDetail({
            error: "Unexpected error",
            details: error.message,
          });
        });
    }
  }, [transaction]);

  return (
    <Grid item xs={12}>
      <Paper
        sx={{
          px: 4,
          py: 4,
          display: "flex",
          flexDirection: "column",
          marginTop: "56px",
        }}
      >
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Transaction detail
        </Typography>

        {transactionDetail ? (
          transactionDetail.error ? (
            <div style={{ padding: "20px" }}>
              <p style={{ textAlign: "center", color: "#626d72" }}>
                No record found please try again later
              </p>
            </div>
          ) : (
            <div className="mobile-td" style={{ overflowX: "auto" }}>
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
                        hash={transaction}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      Status:
                    </TableCell>
                    <TableCell>
                      {transactionDetail.status ? "Success" : "Pending"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      Block:
                    </TableCell>
                    <TableCell>
                      <Hash
                        path="block"
                        text={transactionDetail.blockNumber}
                        hash={transactionDetail.blockHash}
                      />{" "}
                      {transactionDetail.confirmations} confirmations
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      From:
                    </TableCell>
                    <TableCell>
                      <Hash
                        path="address"
                        hash={transactionDetail.from}
                        isCompressed={false}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ whiteSpace: "nowrap" }}>To:</TableCell>
                    <TableCell>
                      <Hash
                        path="address"
                        hash={transactionDetail.to}
                        isCompressed={false}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      Value:
                    </TableCell>
                    <TableCell>
                      {parseFloat(
                        Utils.formatEther(transactionDetail.value)
                      ).toFixed(6)}{" "}
                      ETH
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      Transaction fee:
                    </TableCell>
                    {transactionDetail.maxFeePerGas ? (
                      <TableCell>
                        {Utils.formatEther(
                          transactionDetail.maxFeePerGas.mul(
                            transactionDetail.gasUsed
                          )
                        )}{" "}
                        ETH ( gasPrice * gasUsed (in Gwei):{" "}
                        {Utils.formatUnits(
                          transactionDetail.gasPrice.mul(
                            transactionDetail.gasUsed
                          ),
                          "gwei"
                        )}
                        )
                      </TableCell>
                    ) : (
                      <TableCell>
                        <span style={{ color: "#626d72" }}>
                          No record found
                        </span>
                      </TableCell>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      Gas used:
                    </TableCell>
                    <TableCell>
                      {Utils.formatEther(transactionDetail.gasUsed)} ETH (
                      {Utils.formatUnits(transactionDetail.gasUsed, "gwei")}{" "}
                      Gwei)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      Gas price:
                    </TableCell>
                    <TableCell>
                      {Utils.formatEther(transactionDetail.gasPrice)} ETH (
                      {Utils.formatUnits(transactionDetail.gasPrice, "gwei")}{" "}
                      Gwei)
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )
        ) : (
          <Skeleton variant="rectangular" width="100%" height={220} />
        )}
      </Paper>
    </Grid>
  );
}
