import React from "react";
import CssResultCard from "../result-cards/CssResultCard";
import chunkArray from "../../../utils/chunkArray";
import { Row, Col } from "react-bootstrap";

export default props => {
  const { data: files } = props;
  const rows = chunkArray(files, 3);

  return rows.map((chunk, i) => (
    <React.Fragment key={i}>
      <Row>
        {chunk.map((file, ix) => (
          <Col md={4} key={ix}>
            <CssResultCard data={file} />
          </Col>
        ))}
      </Row>
      <br />
    </React.Fragment>
  ));
};