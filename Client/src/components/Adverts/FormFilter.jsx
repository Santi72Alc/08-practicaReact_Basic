import React from "react";
import { withRouter } from "react-router-dom";

import { UserContext } from "../Context/UserContext";
import ListOfAdverts from "./ListOfAdverts";

// Api handler
import api from "../../utils/Api";

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

class FormFilter extends React.Component {
  static contextType = UserContext;

  componentDidMount() {
    const state = {
      ...this.context,
      user: {
        ...this.context.user,
        isConnected: true
      },
      query: "",
      data: {
        count: 0,
        results: []
      }
    };
    this.updateState(state);
    // this.handle_onExecuteFilter();
  }

  loadItems = async query => {
    try {
      const value = await api.getItems(query);
      const { count, results } = value;
      const data = {
        count,
        results
      };
      return data;
    } catch (error) {
      console.log("ERROR loading results", error);
    }
  };

  updateState = state => {
    try {
      this.setState(state);
    } catch (error) {
      console.log("Error updating the context");
    }
  };

  handle_onExecuteFilter = async () => {
    const filter = document.getElementById("filterInput").value;
    const sale = document.getElementById("saleInput").checked;
    const buy = document.getElementById("buyInput").checked;
    const selectedTag = document.getElementById("selectInput").value;
    console.log("Executing filter...");

    try {
      // Prepare the filter and conditions
      const query = this.makeFilter(filter, sale, buy, selectedTag);
      const data = await this.loadItems(query);
      const state = {
        ...this.state,
        selectedTag,
        query,
        data
      };
      this.updateState(state);
      this.state.updateContext(this.state);
    } catch (error) {
      console.log("Error loading the query", error);
    }
  };

  makeFilter = (filter, sale, buy, selectedTag) => {
    let filterToSend = filter || "";
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
      filterToSend += (filterToSend ? "&tag=" : "") + selectedTag;
    }

    return filterToSend;
  };

  handle_onTagsChange = event => {
    const state = {
      ...this.state,
      selectedTag: event.target.value
    };
    this.updateState(state);
  };

  render() {
    if (!this.state) {
      return null;
    }
    return (
      <>
        <Container>
          <Card bg="light">
            <Card.Title className="text-center" as="h2">
              Filter options
            </Card.Title>
            <Card.Subtitle className="text-center">
              {this.state.user.name} {this.state.user.surname}
              {this.state.user.isConnected}
              {this.state.user.isConnected === true
                ? " - connected!!"
                : "Disconnected!!"}
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
                          id="selectInput"
                          onChange={this.handle_onTagsChange}
                          // defaultValue={this.state.enableTags}
                          value={this.state.selectedTag}
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
        <ListOfAdverts data={this.state.data} />
      </>
    );
  }
}

export default withRouter(FormFilter);
