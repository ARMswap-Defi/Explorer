import * as React from "react";
import { CopyTextToClip } from "./CopyTextToClip";
import Link from "./Link";

const sliceHash = (hash) => {
  return hash
    ? `${hash.substring(0, 5)}...${hash.substring(hash.length - 3)}`
    : "0x";
};

export default function Hash({
  hash = "0x",
  text,
  path,
  transactionDetail = null, // Optional parameter with a default value of null
  hasLink = true,
  hasCopy = true,
  isCompressed = true,
  ...props
}) {
  const hrefPath = path ? `/${path}/${hash}` : `/${hash}`;
  const hashText = text ? text : isCompressed ? sliceHash(hash) : hash;
  return (
    <span {...props}>
      <span>
        {hasLink && path === "/trxDetail/[trxHash]/[trxDetail]" ? (
          <Link
            color="primary"
            href="/trxDetail/[trxHash]/[trxDetail]"
            as={`/trxDetail/${hash}/${JSON.stringify(transactionDetail)}`}
          >
            {hashText}
          </Link>
        ) : hasLink && path !== "/trxDetail/[trxHash]/[trxDetail]" ? (
          <Link color="primary" href={hrefPath}>
            {hashText}
          </Link>
        ) : (
          hashText
        )}
      </span>
      {hasCopy && (
        <span style={{ margin: 3 }}>
          <CopyTextToClip text={hash} size="x-small" />
        </span>
      )}
    </span>
  );
}
