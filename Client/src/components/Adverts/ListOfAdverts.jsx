import React from "react";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import { withRouter } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

// Api handler
import api from "../../utils/Api";

class ListOfAdverts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      data: {
        count: 0,
        results: []
      }
    };
  } // end of constructor}

  async componentDidMount() {
    const query = this.props.query;
    console.log("componentDidMount ListAdverts STATE", this.state);
    console.log("componentDidMount ListAdverts context", this.context);
    console.log("componentDidMount ListAdverts QUERY", query);
    const count = 0;
    const results = [];
    // await this.loadItems(query);
    // const count = results.length;
    const data = { count, results };
    console.log("componentDidMount ListAdverts DATA", data);
    this.setState({ query, data });
  }

  static async getDerivedStateFrom(nextProps, prevState) {
    console.log("getDeriv ListOfAdverts PREVSTATE", prevState);
    console.log("getDeriv ListOfAdverts NEXTPROPS", nextProps);
    if (prevState.query !== nextProps.query) {
      const query = this.prevState.query;
      const { count, results } = await this.loadItems(query);
      const data = { count, results };

      this.setState({ query, data });
    }
  }

  loadItems = async query => {
    try {
      const value = await api.getItems(query);
      console.log("loadItems ListOfAdverts VALUE", value);
      const { count, results } = value;
      // const count = results.length;
      const data = {
        count,
        results
      };
      this.setState({ query, data }, () => {
        console.log("setState loadItems ListOfAdverts VALUE", value);
        return data;
      });
    } catch (error) {
      console.log("ERROR loading results", error);
    }
  };

  render() {
    console.log("render ListOfAdverts state", this.state);
    if (!this.state.data.count >= 0) {
      return null;
    }
    const { count, results } = this.props.data;
    console.log("render ListOfAdverts context", this.context);
    return (
      <>
        <p className="text-center mt-2">Results ({count || 0} adverts)</p>
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
                          variant="primary"
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

ListOfAdverts.contextType = UserContext;
export default withRouter(ListOfAdverts);
