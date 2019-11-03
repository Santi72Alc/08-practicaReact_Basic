import React from "react";
import { withRouter } from "react-router-dom";
import Storage from "../../utils/Storage";

// import Spinner from 'react-bootstrap/Spinner';

import { UserContext } from "../Context/UserContext";

import AppNavbar from "../AppNavbar/AppNavbar";

// react-bootstrap imports
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

// Api handler
import api from "../../utils/Api";

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

class Register extends React.Component {
  componentDidMount() {
    // Take the tags from api
    try {
      this.loadTagsFromApi();

      // Check if there are a user saved in localStorage
      const userExist = Storage.isKey("user");
      let user = this.context.user;
      if (userExist) {
        user = Storage.load("user");
        toast.success("User loaded!!");
      }
      const state = {
        ...this.context,
        user: {
          ...user,
          isConnected: false
        },
        userExist: userExist
      };
      console.log("Saving Register state", state);
      this.setState(state);
    } catch (error) {
      const msg = "Error getting tags from api";
      console.info(msg, error);
      toast.error(msg);
    }
  }

  loadTagsFromApi = () => {
    let isBusy = true;
    this.setState(this.context, () => {
      this.setState({ isBusy }, async () => {
        const loadingToast = toast.info("Loading...");
        this.API_TAGS = await api.getTags();
        console.log("Tags readed from api:", this.API_TAGS);
        this.setState({
          ...this.state,
          enableTags: this.API_TAGS
        });
        isBusy = false;
        this.setState({ isBusy }, () => {
          toast.dismiss(loadingToast);
        });
      });
    });
  };

  initTags = () => {
    const state = this.context;
    this.loadTagsFromApi();
    this.setState(state);
  };

  onInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      ...this.state,
      user: {
        ...this.state.user,
        [name]: value
      }
    });
  };

  onTagChange = event => {
    let value = Array.from(
      event.target.selectedOptions,
      option => option.value
    );
    this.setState({
      ...this.state,
      selectedTag: value,
      user: {
        ...this.state.user,
        tag: value
      }
    });
  };

  onPermanentChange = () => {
    this.setState({
      ...this.state,
      user: {
        ...this.state.user,
        isPermanent: !this.state.user.isPermanent
      }
    });
  };

  onConfirmForm = event => {
    let isOk = false;
    event.preventDefault();

    isOk = this.isFormValid(this.state.user);

    if (!isOk) {
      toast.error("There are errors in your inputs - Check them!!!");
      return false;
    }
    // Validated!!
    const selectedTag = document.getElementById("tagInput").selected;
    const state = {
      ...this.state,
      enableTags: this.API_TAGS,
      selectedTag,
      user: {
        ...this.state.user,
        isConnected: true
      }
    };
    this.setState(state);
    this.context.updateContext(state);

    // Save user's data in localStorage
    if (this.state.user.isPermanent) {
      const saved = Storage.save(state.user, "user");
      toast.success(
        `User: ${saved.name} ${saved.surname} saved in local storage!!!`
      );
    }
    this.props.history.push("/adverts");
  };

  onClearForm = event => {
    event.preventDefault();
    this.initTags();
    this.setState(this.initialState, () => {
      this.initTags();
      Storage.remove("user");
    });
    toast.success("User deleted from local storage");
  };

  isFormValid = user => {
    const { name } = user;
    let isOk = true;
    let errorData = this.state.errorData;
    if (name.length < 3) {
      errorData.push([{ name: "Name is too short (min. 4ch)" }]);
      this.setState({
        ...this.state,
        errorData
      });
      isOk = false;
    }
    return isOk;
  };

  render() {
    if (!this.state) {
      return null;
    }
    return (
      <>
        <AppNavbar />
        <Card
          className="mt-xs-2 mb-5 mt-3"
          style={{ width: "35rem", marginLeft: "auto", marginRight: "auto" }}
        >
          <Card.Header as="h2" className="text-center">
            Login
          </Card.Header>
          <Card.Body>
            <Card.Text>
              <Form id="mainForm" noValidate>
                <Form.Row>
                  <Form.Group>
                    <Form.Label>
                      Name
                      <span>
                        <sup>*</sup>
                      </span>
                    </Form.Label>
                    <Form.Control
                      required
                      name="name"
                      onChange={this.onInputChange}
                      type="text"
                      placeholder="Enter name"
                      value={this.state.user.name}
                    />
                  </Form.Group>

                  <Form.Group className="ml-1">
                    <Form.Label className="mb">Surname</Form.Label>
                    <Form.Control
                      id="surnameInput"
                      name="surname"
                      onChange={this.onInputChange}
                      type="text"
                      placeholder="Enter surname"
                      value={this.state.user.surname}
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Group>
                  <Form.Label>Tag selected</Form.Label>
                  <Form.Control
                    id="tagInput"
                    as="select"
                    onChange={this.onTagChange}
                    value={this.state.user.tag}
                    placeholder="Select tag"
                  >
                    {this.state.enableTags.map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formBasicCheckbox">
                  <Form.Check
                    id="isPermanent"
                    name="isPermanent"
                    onChange={this.onPermanentChange}
                    checked={this.state.user.isPermanent || false}
                    type="switch"
                    label="Keep permanent this login"
                    value={this.state.user.isPermanent}
                  />
                </Form.Group>

                <ButtonToolbar>
                  <ButtonGroup className="mr-4">
                    <Button
                      onClick={this.onConfirmForm}
                      variant="primary"
                      type="submit"
                    >
                      Login
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup>
                    <Button
                      onClick={this.onClearForm}
                      variant="secondary"
                      type="reset"
                    >
                      Reset
                    </Button>
                  </ButtonGroup>
                </ButtonToolbar>
                <p className="mt-2">(*) Required</p>
              </Form>
            </Card.Text>
          </Card.Body>
        </Card>
      </>
    );
  }
} // end class

Register.contextType = UserContext;
export default withRouter(Register);
