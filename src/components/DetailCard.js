import styled from "styled-components";
import { ButtonBase, Grid, Skeleton, Typography } from "@mui/material";
const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

export default function DetailCard({ mainText, subText }) {
  const src =
    mainText === "Nodes"
      ? "/nodes.svg"
      : mainText === "Chains"
      ? "/chains.svg"
      : mainText === "Bridges"
      ? "/bridges.svg"
      : mainText === "TVL (USD)"
      ? "/nodes.svg"
      : "";
  return mainText ? (
    <Grid container spacing={2}>
      <Grid item>
        <ButtonBase sx={{ width: 46, height: 46 }}>
          <Img alt="complex" src={src} />
        </ButtonBase>
      </Grid>
      <Grid item xs={12} sm container>
        <Grid item xs container direction="column" spacing={2}>
          <Grid item xs>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              {mainText}
            </Typography>
            <Typography
              component="div"
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 500 }}
            >
              {subText}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <Skeleton variant="rectangular" width={210} height={118} />
  );
}
