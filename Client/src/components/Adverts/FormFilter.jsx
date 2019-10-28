import React from "react";
import { withRouter } from "react-router-dom";

import { UserContext } from "../Context/UserContext";
import ListOfAdverts from "./ListOfAdverts";

// react-bootstrap imports
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

// Toast use
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastConf = {
  autoClose: 3000,
  pauseOnHover: true,
  delay: 700,
  transition: Flip
};
toast.configure(toastConf);

// const TAGS = ["Lifestile", "mobile", "motor", "work"];

class FormFilter extends React.Component {
  componentDidMount() {
    const state = this.context;
    console.log("FormFilter DidMount STATE", state);
    const selectedTag = state.user.tag;
    this.setState({
      ...state,
      selectedTag,
      query: ""
    });
  }

  handle_onExecuteFilter = () => {
    const filter = document.getElementById("filterInput").value;
    const sale = document.getElementById("saleInput").checked;
    const buy = document.getElementById("buyInput").checked;
    const selectedTag = this.state.selectedTag;
    console.log("Pulsado EXECUTE ", selectedTag);

    // To prepare the filter and conditions
    const filterToSend = this.makeFilter(filter, sale, buy, selectedTag);
    const query = filterToSend;
    console.log("filterToSend", filterToSend);
    this.setState(
      {
        ...this.state,
        selectedTag,
        query
      },
      () => {
        console.log("setState handleExecute FormFilter STATE", this.state);
        this.state.updateContext(this.state);
      }
    );
    return query;
  };

  makeFilter = (filter, sale, buy, selectedTag) => {
    let filterToSend = filter;
    let type = "";

    if (!sale || !buy) {
      if (sale) {
        type = "sell";
      }
      if (buy) {
        type = "buy";
      }
    }
    if (["sell", "buy"].includes(type)) {
      filterToSend += (filterToSend ? "&type=" : "type=") + type;
    }

    if (selectedTag) {
      filterToSend += (filterToSend ? "&" : "") + "tag=" + selectedTag;
    }

    return filterToSend;
  };

  handle_onTagsChange = event => {
    let value = Array.from(
      event.target.selectedOptions,
      option => option.value
    );
    console.log("reading tags from input", value);
    this.setState({
      ...this.state,
      selectedTag: value
    });
  };

  render() {
    if (!this.state) {
      return null;
    }
    console.log("render FormFilter STATE", this.state);
    return (
      <>
        <Container>
          <Card bg="light">
            <Card.Title className="text-center" as="h2">
              Filter options
            </Card.Title>
            <Card.Subtitle className="text-center">
              {this.state.user.name} {this.state.user.surname} connected!!
            </Card.Subtitle>
            <hr />
            <Card.Body>
              <Form>
                {/* Filter input */}
                <Form.Group>
                  <Form.Label>Filter (name, price)</Form.Label>
                  <Form.Control
                    id="filterInput"
                    value={this.state.filter}
                    type="text"
                    placeholder="type the filter"
                  />
                </Form.Group>

                <Row>
                  <Col>
                    {/* type of state (buy or sale) */}
                    <Row>
                      <Form.Label className="ml-3">Type of state</Form.Label>
                      <Form.Group className="ml-1" as={Row}>
                        <Col>
                          <Form.Label>
                            Sale
                            <Form.Check
                              value={this.state.sale}
                              className="ml-1"
                              type="checkbox"
                              id="saleInput"
                            />
                          </Form.Label>
                        </Col>
                        <Col>
                          <Form.Label>
                            Buy
                            <Form.Check
                              value={this.state.buy}
                              className="ml-1"
                              type="checkbox"
                              id="buyInput"
                            />
                          </Form.Label>
                        </Col>
                      </Form.Group>
                    </Row>
                  </Col>

                  <Col className="ml-2">
                    <Form.Group>
                      <Row className="mr-1">
                        <Form.Label>
                          Tag selected: {this.state.selectedTag}
                        </Form.Label>
                        <Form.Control
                          as="select"
                          onChange={this.handle_onTagsChange}
                          defaultValue={this.state.user.tag}
                          // value={this.state.enableTags}
                        >
                          {this.context.enableTags.map((value, index) => {
                            return (
                              <option key={index} value={value}>
                                {value}
                              </option>
                            );
                          })}
                        </Form.Control>
                      </Row>
                    </Form.Group>
                  </Col>
                  <Button onClick={this.handle_onExecuteFilter}>
                    Execute filter
                  </Button>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Container>
        <ListOfAdverts
          updateData={this.handle_onExecuteFilter}
          query={this.state.query}
        />
      </>
    );
  }
}

FormFilter.contextType = UserContext;
export default withRouter(FormFilter);
