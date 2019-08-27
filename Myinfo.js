import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, FormText, CustomInput, Container, Row, Col,
    Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './Myinfo.css';
import Axios from 'axios';



class Myinfo extends Component {
  constructor(props) {
      super(props);

      this.state ={
          data:{
            wishlist: [],
            userid: "",
            name: "",
            email: "",
            createdAt: "",

          },
      }
      console.log(this.props.match.params);
  }

  async componentDidMount() {
      const res = await Axios.get('/mongo/userinfo');
      console.log(res.data);
      this.setState({
          data: res.data
      })
  }
  
  render() {
      return (
<div className="p-3 my-2 rounded bg-docs-transparent-grid">

  <Container> 

      <Row>
      
        <Col sm="12" md={{ size: 8, offset: 2 }}>

          <div className="pro-title">
              <h1>Account Profile</h1>
              <hr />

          </div>

          <div className="pro-img">
              <img src={this.state.img}/>
          </div>

          <div className="pro-info">
              <br />
          <h2>기본 정보</h2>
          <hr />

              <label><b>Full Name: </b></label><br />
              &nbsp;&nbsp;<input type="text" value={this.state.data.userid}></input><br /> <br />

              <label><b>Email:</b> </label><br />
              &nbsp;&nbsp;<input type="text" value={this.state.data.email}></input> <br /><br />

              <label><b>Password:</b> </label><br />
              &nbsp;&nbsp;<input type="text" value={this.state.data.password}></input><br /><br />

              <label><b>Created At</b></label><br />
              &nbsp;&nbsp;<input type="text" value={this.state.data.createdAt}></input><br /><br />

<br />
<br />
<br />

              <h2>추가 정보</h2>

             <hr />

              <label><b>성별: </b></label><br />
              &nbsp;&nbsp;<input type="text" value={this.state.data}></input><br /> <br />

              <label><b>키와 몸무게:</b> </label><br />
              &nbsp;&nbsp;<input type="text" value={this.state.data}></input> <br /><br />

              <label><b>활동량:</b> </label><br />
              &nbsp;&nbsp;<input type="text" value={this.state.data}></input><br /><br />

              <label><b>알러지 성분: </b></label><br />
              &nbsp;&nbsp;<input type="text" value={this.state.data}></input><br /><br />

          </div>
        </ Col>
      </Row>

<br />
<br />

      <Row className="button-row">
          <Col xs='6'>
              <ModalModify />
          </Col>
          <Col xs='6'>
              <ModalDelete />
          </Col>
      </Row> 

  </Container>
          
</div>          

      );
  };
}



class ModalModify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

update() {
 Axios.get('/users', {
      params: {
        id: 1
      }
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
    });
}

  

  render() {
    return (
      <div>
        <Button color="primary" onClick={this.toggle}>{this.props.buttonLabel}내 정보 수정하기</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>내 회원 정보 수정하기</ModalHeader>
          <ModalBody>
          <Form>
            <h3>나의 정보</h3>
            <hr />
            <div>
                <FormGroup>
                    <div className="picture">
                        <Label className="md2" for="exampleFile">프로필 이미지</Label>
                        <FormText className="muted" color="muted">
                            Select your profile image.
                </FormText>
                        <Input type="file" name="file" id="exampleFile" />
                    </div>
                </FormGroup>

                {/* <FormGroup>
                    <Label className="sm" for="exampleEmail">이름</Label>
                    <Input type="userid" name="userid" id="exampleEmail" value={userInfo.userid} />
                </FormGroup>

                <FormGroup>
                    <Label className="sm" for="exampleEmail">ID</Label>
                    <Input type="userid" name="userid" id="exampleEmail" value={userInfo.password} />
                </FormGroup>

                <FormGroup>
                    <Label className="sm" for="exampleEmail">비밀번호</Label>
                    <Input type="email" name="email" id="exampleEmail" value={userInfo.password} />
                </FormGroup>

                <FormGroup>
                    <Label className="sm" for="exampleEmail">핸드폰번호</Label>
                    <Input type="email" name="email" id="exampleEmail" />
                </FormGroup> */}

            </div>

       <br />

            <h3>추가 입력 정보</h3>
            <hr />
            <div>
                <FormGroup>
                    <Label for="exampleCheckbox">성별</Label>
                    <div>
                        <CustomInput type="radio" id="exampleCustomRadio" name="customRadio" label="여자" />
                        <CustomInput type="radio" id="exampleCustomRadio2" name="customRadio" label="남자" />
                        <CustomInput type="radio" id="exampleCustomRadio3" name="customRadio" label="미응답" />

                    </div>
                </FormGroup>

                <FormGroup>
                    <div className="dadan">
                        <Label className="md" for="exampleEmail" >신장 (cm)</Label>
                        <Input type="number" name="tall" id="exampleEmail" placeholder="(cm)" />
                        <Label className="md" for="exampleEmail" >체중 (kg)</Label>
                        <Input type="number" name="weight" id="exampleEmail" placeholder="(kg)" />
                    </div>
                </FormGroup>

                <FormGroup>
                    <Label className="md" for="exampleSelect">활동량</Label>
                    <Input type="select" name="select" id="exampleSelect">
                        <option default>자신의 활동량 선택</option>
                        <option >육체 활동이 거의 없는 경우</option>
                        <option>보통의 활동을 하는 경우</option>
                        <option>심한 육체 활동을 하는 경우</option>
                    </Input>
                </FormGroup>

                <FormGroup tag="fieldset">
                    <p className="md">알레르기 유발 요인</p>

                    <FormGroup check>
                        <div className="left-b">
                            <Label check>
                                <Input type="radio" name="milk" />{' '}
                                <p>우유</p>
                            </Label> <br />
                            <Label check>
                                <Input type="radio" name="bean" />{' '}
                                <p>콩</p>
                            </Label> <br />
                            <Label check>
                                <Input type="radio" name="wheat" />{' '}
                                <p>밀</p>
                            </Label> <br />
                            <Label check>
                                <Input type="radio" name="egg" />{' '}
                                <p>달걀</p>
                            </Label> <br />
                            <Label check>
                                <Input type="radio" name="pork" />{' '}
                                <p>돼지고기</p>
                            </Label> <br />
                        </div>
                        <div className="right-b">
                            <Label check>
                                <Input type="radio" name="fish" />{' '}
                                <p>생선</p>
                            </Label> <br />
                            <Label check>
                                <Input type="radio" name="shrimp" />{' '}
                                <p>새우</p>
                            </Label> <br />
                            <Label check>
                                <Input type="radio" name="peanut" />{' '}
                                <p>땅콩</p>
                            </Label> <br />
                            <Label check>
                                <Input type="radio" name="walnut" />{' '}
                                <p>호두</p>
                            </Label> <br />
                            <Label check>
                                <Input type="radio" name="salmon" />{' '}
                                <p>연어</p>
                            </Label>
                        </div>
                    </FormGroup>
                </FormGroup>
            </div>
        </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.update}>수정하기</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>취소</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}






class ModalDelete extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modal: false
      };
  
      this.toggle = this.toggle.bind(this);
    }


    delete() {
      Axios.delete('/user/delete/' + this.props.match.params.userid, {
        params: { 
          id: this.state.data.userid,
        }
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
      });
      console.log(this.props.data);
    }

  
    toggle() {
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
    }
  
    render() {
      return (
        <div>
          <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel} 회원 탈퇴하기</Button>
          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle}>탈퇴하기</ModalHeader>
            <ModalBody>
            <p>정말 탈퇴하시겠습니까??</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={this.delete}>탈퇴하기</Button>
              <Button color="secondary" onClick={this.toggle}>취소</Button>
            </ModalFooter>
          </Modal>

          {/* <Button color="danger" onClick={this.toggle}>탈퇴하기</Button> */}

        </div>
      );
    }
  }




export default Myinfo;