import { Card, Collapse, Table } from 'react-bootstrap';
import React, { Component } from 'react';

import { FILE_SORT_CHOICES } from '../../../constants/js-metrics';
import FileDetailsModal from './FileDetails';
import getNestedProperty from 'lodash/get';

class JsResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  render() {
    const { isOpen } = this.state;
    const { file: fileName, metrics } = this.props.data;

    return (
      <Card>
        <Card.Body>
          <Card.Header
            style={{ cursor: 'pointer' }}
            onClick={() => this.setState({ shouldShow: true })}
          >
            {fileName.split('/').pop()}
          </Card.Header>
          <br />
          <Card.Subtitle className="mb-2 text-muted">
            Lines: {metrics.aggregate.sloc.logical}
          </Card.Subtitle>
          <Card.Text as="div">
            {`The file contains a total of ${
              metrics.methods.length
            } methods, with an average of ${
              metrics.methodAverage.paramCount
            } argument per method`}
            <hr />
            <Collapse in={isOpen}>
              <div>
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(FILE_SORT_CHOICES).map((optionKey, i) => (
                      <tr key={i}>
                        <td>{optionKey}</td>
                        <td>
                          <strong>
                            {getNestedProperty(
                              metrics,
                              FILE_SORT_CHOICES[optionKey]
                            )}
                          </strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Collapse>
          </Card.Text>
          <button
            className="btn btn-primary"
            onClick={() => this.setState({ isOpen: !isOpen })}
          >
            {this.state.isOpen ? 'Hide ' : 'Show'} Metrics
          </button>
          <hr />

          <FileDetailsModal
            fileName={fileName}
            metrics={metrics}
            show={this.state.shouldShow}
            onHide={() => this.setState({ shouldShow: false })}
          />
          <Card.Footer className="justify-content-md-center">
            <pre style={{ whiteSpace: 'pre-wrap' }}>{fileName}</pre>
          </Card.Footer>
        </Card.Body>
      </Card>
    );
  }
}

export default JsResult;
