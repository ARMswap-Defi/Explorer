import React from "react";
import styled from "styled-components";

const Image = styled.img<{ size?: any }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  min-width: ${({ size }) => size};
  min-height: ${({ size }) => size};
  max-width: 100%;
  max-height: 100%;
  background-color: white;
  border-radius: ${({ size }) => size};
`;
export default function TokenLogo({
  symbol,
  size = "1rem",
  style,
  logoUrl,
  ...rest
}: {
  symbol?: any;
  size?: any;
  style?: React.CSSProperties;
  logoUrl?: any;
}) {
  let path = "";
  if (logoUrl) {
    path = logoUrl;
  }
  return <Image {...rest} alt={symbol} src={path} size={size} style={style} />;
}
