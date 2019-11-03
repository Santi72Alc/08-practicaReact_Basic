import React from "react";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import { withRouter } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

class ListOfAdverts extends React.Component {
  static contextType = UserContext;

  componentDidMount() {
    const state = {
      ...this.context,
      data: this.props.data
    };
    this.updateState(state);
  }

  static getDerivedStateFrom(nextProps, prevState) {
    let data = this.context.data;
    if (prevState.query !== nextProps.query) {
      data = this.nextProps.data;
    }
    const state = {
      ...this.context,
      data
    };
    this.updateState(state);
  }

  updateState = state => {
    try {
      this.setState(state);
    } catch (error) {
      console.log("Error updating the context");
    }
  };

  render() {
    if (!this.props) {
      return null;
    }
    const { count, results } = this.props.data;
    return (
      <>
        <p className="text-center mt-2">
          Results :({count} {count === 1 ? "advert" : "adverts"})
        </p>
        <hr />
        <ListGroup>
          {results.map((advert, index) => {
            return (
              <Card
                className="mx-2 mb-1"
                bg="light"
                border="dark"
                key={index}
                style={{ width: "auto" }}
              >
                <Card.Body>
                  <Card.Title>{advert.name}</Card.Title>
                  <Card.Text>{advert.description}</Card.Text>
                  <Card.Footer>
                    {advert.tags.map((optionTagName, index) => {
                      return (
                        <Badge
                          pill
                          variant={
                            optionTagName !== this.context.selectedTag
                              ? "primary"
                              : "warning"
                          }
                          className="mr-1"
                          key={index}
                        >
                          {optionTagName}
                        </Badge>
                      );
                    }) // end map
                    }
                    <span className="float-right">
                      {advert.price.toFixed(2)}€
                    </span>
                  </Card.Footer>
                  {/* <Card.Link href="#">Card Link</Card.Link>
                    <Card.Link href="#">Another Link</Card.Link> */}
                </Card.Body>
              </Card>
            );
          }) // end map
          }
        </ListGroup>
      </>
    );
  }
}

export default withRouter(ListOfAdverts);
