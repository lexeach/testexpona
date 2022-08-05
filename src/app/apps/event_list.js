import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Web3 from "web3";
import { ICU, BEP20 } from "../../utils/web3.js";
import { baseUrl } from "../../utils/confix";
import Event from "./event";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px dotted pink',
    color: state.isSelected ? 'red' : 'blue',
    padding: 20,
  }),
  control: () => ({
    width: 200,
    position:'relative'
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    const color = 'white'
    return { ...provided, opacity, transition, color};
  }
}

const BasicTable = () => {
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const [eventData, setEventData] = useState();
  const [totalCount, setTotalCount] = useState();
  const [levelPrice, setLevelPrice] = useState();
  const [userList, setUserList] = useState();
  const [users_, setUsers] = useState([]);
  
  const [users_autoPoolPayReceived, setUsersAutoPoolPayReceived] = useState();
  const [users_autopoolPayReciever, setUsersAutopoolPayReciever] = useState();
  const [users_batchPaid, setUsesBatchpaid] = useState();
  const [users_id, setUsersId] = useState();
  const [users_income, setUsersIncome] = useState();
  const [users_isExist, setUsersIsExist] = useState();
  const [users_levelIncomeReceived, setUsersLevelIncomeReceived] = useState();
  const [users_missedPoolPayment, setUsersMIssedPoolPayment] = useState();
  const [users_referredUsers, setUsersreffered] = useState();
  const [users_referrerID, setUsersReffereId] = useState();

  // 

  // const [users_, setUsers] = useState({ autoPoolPayReceived:'', autopoolPayReciever:'',batchPaid:'', id:'', income:'', isExist:'', levelIncomeReceived:'',missedPoolPayment:'', referredUsers:'', referrerID:''});

  const [search, setSearch] = useState({ data: "" });
  const [type, setType] = useState();


const [readData, setReadData] = useState({user_list:'', users:'', level_price:''})

  useEffect(() => {
    let data = null;
    eventList(data).then((res) => {
      let { event, totalCount } = res.data.body;
      setTotalCount(totalCount);
      setEventData(event);
    });
  }, []);

  // useEffect(() => {
  //   async function load() {
  //     const accounts = await web3.eth.requestAccounts();

  //     let BEP20_ = new web3.eth.Contract(BEP20.ABI, BEP20.address);
  //     let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
  //     // let level_income = await ICU_.methods.LEVEL_PRICE(accounts[0]).call();
  //     // let usser_list = await ICU_.methods.userList(accounts[0]).call();
  //     // let users = await ICU_.methods.users().call();
  //     // setLevelPrice("level_income");
  //     // setUserList("usser_list");
  //     // setUsers("users");
  //   }
  //   load();
  // }, []);

  async function eventList(data) {
    try {
      console.log("the api call data", data);
      console.log('the URL ..', `${baseUrl}/api/event?${data}`)
      if (data) {
        let response = await axios.get(
          `${baseUrl}/api/event?${data}`
          // `${baseUrl}/api/event?sender=${data.sender}&tokenType=${data.type}&name=${data.name}&_user=${data.user}`
        );

        console.log("***** the respone", response);
        return response;
      } else {
        let response = await axios.get(`${baseUrl}/api/event?`);
        return response;
      }
    } catch (error) {
      console.log("the error in event list called", error);
    }
  }

  const handleChange = (event) => {
    let { name, value } = event.target;
    setSearch({ ...search, [name]: value });
  };
  const handleChangeRead = (event) => {
    let { name, value } = event.target;
    setReadData({ ...readData, [name]: value });
  };

  const handleSubmit1 = async (event) => {
    event.preventDefault();
    if(type === undefined){
      setType({value:'name'})
      let data = `name=${search.data}`;
      console.log("form data", data);
      eventList(data).then((res) => {
        let { event, totalCount } = res.data.body;
        setTotalCount(totalCount);
        setEventData(event);
      });
    } else {
      let data = `${type.value}=${search.data}`;
      console.log("form data", data);
      eventList(data).then((res) => {
        let { event, totalCount } = res.data.body;
        setTotalCount(totalCount);
        setEventData(event);
      });
    }
  };

  const nameOptionChange = (event)=>{
    console.log("form submited");
      console.log('the evebt', event.value)
      let data = `name=${event.value}`
      console.log('data', data)
      eventList(data).then((res) => {
        let { event, totalCount } = res.data.body;
        setTotalCount(totalCount);
        setEventData(event);
      });

  }

  const handleSubmitUserList = async event => {
    event.preventDefault()

    let user_list_data = readData.user_list
    user_list_data = parseInt(user_list_data)
    console.log('the usr list data', user_list_data)
    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address)
    let userlist = await ICU_.methods.userList(user_list_data).call();
    console.log('user list', userlist)
    setUserList(userlist);
  }

  const handleSubmitLevelPrice = async event => {
    event.preventDefault()

    let level_price_data = readData.level_price
    level_price_data = parseInt(level_price_data)
    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address)
    let level_income = await ICU_.methods.LEVEL_PRICE(level_price_data).call();
    const convert_income = web3.utils.fromWei(level_income, 'ether');
    setLevelPrice(convert_income);
  }


  const handleSubmitUser = async event => {
    event.preventDefault()

    let users_ = readData.users
    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address)
    let userDetail = await ICU_.methods.users(users_).call();
    console.log('the user data', userDetail)
  
    setUsersAutoPoolPayReceived(userDetail.autoPoolPayReceived)
    setUsersAutopoolPayReciever(userDetail.autopoolPayReciever)
    setUsesBatchpaid(userDetail.batchPaid)
    setUsersId(userDetail.id)
    setUsersIncome(userDetail.income)
    setUsersIsExist(userDetail.isExist)
    setUsersLevelIncomeReceived(userDetail.levelIncomeReceived)
    setUsersMIssedPoolPayment(userDetail.missedPoolPayment)
    setUsersreffered(userDetail.referredUsers)
    setUsersReffereId(userDetail.referrerID)
 
  }

  const nameTypeOptions = [
    { value: "name", label: "Name" },
    { value: "sender", label: "Sender" },
    { value: "_referrer", label: "Referrer" },
    { value: "_referral", label: "Referral" },
    { value: "tokenType", label: "TokenType" },
    { value: "height", label: "Height" },
  ];

  const nameOptions = [
    { value: "AutopoolIncome", label: "AutoPool Income" },
    { value: "LevelsIncome", label: "LevelsIncome" },
    { value: "Autopool_Level_Income", label: "Autopool_Level_Income" },
    { value: "EXPONA", label: "EXPONA" },
    { value: "SponsorIncome", label: "SponsorIncome" },
  ];

  // autoPoolEvent -  AutopoolIncome
  // getMoneyForLevelEvent – LevelsIncome
  // pay_autopool -  Autopool_Level_Income
  // ERC-20-COIN  -  EXPONA
  // regLevelEvent 	- SponsorIncome

  return (
    <div className=" custom-eventlist">
      <div className="page-header">
        <h3 className="page-title">
          Events :-{" "}
          <span className="totalCount">
            ( {totalCount ? totalCount : 0} )
          </span>{" "}
        </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Event
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              List
            </li>
          </ol>
        </nav>
      </div>
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>User List </h5>
              <div className="row">
                <div className="col-12 col-sm-12 col-xl-12 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <form  className="forms-sample w-100"  onSubmit={handleSubmitUserList}>
                          <div className='form-group w-100 d-flex justify-content-between'>
                              <input className='form-control mt-2'
                                type='number'
                                required
                                name='user_list'
                                onChange={handleChangeRead}
                                value={readData.user_list}
                                />
                              <input className='btn btn-primary mt-2' type='submit' value='Submit' />
                          </div>
                      </form>
                  </div>
                    <h4 style={{ fontSize: "15px" }} className="mb-0">
                      {userList ? userList : 0}
                    </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Level Price</h5>
              <div className="row">
                <div className="col-12 col-sm-12 col-xl-12 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <form  className="forms-sample w-100"  onSubmit={handleSubmitLevelPrice}>
                          <div className='form-group w-100   d-flex justify-content-between'>
                              <input className='form-control mt-2'
                                type='number'
                                required
                                name='level_price'
                                onChange={handleChangeRead}
                                value={readData.level_price}
                                />
                              <input className='btn btn-primary mt-2' type='submit' value='Submit' />
                          </div>
                      </form>
                  </div>
                  <h4 className="mb-0">{ levelPrice ? levelPrice : 0 }</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-12 col-md-12 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Users</h5>
              <div className="row">
                <div className="col-12 col-sm-12 col-xl-12 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <form  className="forms-sample w-100"  onSubmit={handleSubmitUser}>
                          <div className='form-group w-100   d-flex justify-content-between'>
                              <input className='form-control mt-2'
                                type='text'
                                required
                                name='users'
                                onChange={handleChangeRead}
                                value={readData.users}
                                />
                              <input className='btn btn-primary mt-2' type='submit' value='Submit' />
                          </div>
                      </form>
                  </div>

                  {users_autoPoolPayReceived ?(
                    <>
                    <div className="d-flex"> <h4> Auto Pool Pay Recived :- </h4> <p className="pl-2"> {users_autoPoolPayReceived}</p>  </div>
                    <div className="d-flex"> <h4> Auto Pool Pay Reciver :- </h4>   <p className="pl-2"> {users_autopoolPayReciever}</p> </div>
                    <div className="d-flex"> <h4> Batch Paid :- </h4>   <p className="pl-2"> {users_batchPaid}</p> </div>
                    <div className="d-flex"> <h4> ID :- </h4>   <p className="pl-2"> {users_id}</p> </div>
                    <div className="d-flex"> <h4> Income :- </h4>   <p className="pl-2"> {users_income}</p> </div>
                    <div className="d-flex"> <h4> is Exist :- </h4>   <p className="pl-2"> {users_isExist}</p> </div>
                    <div className="d-flex"> <h4> Level Income Recived :- </h4>   <p className="pl-2"> {users_levelIncomeReceived}</p> </div>
                    <div className="d-flex"> <h4> Missed Pool Payment :- </h4>   <p className="pl-2"> {users_missedPoolPayment}</p> </div>
                    <div className="d-flex"> <h4> Reffered User :- </h4>   <p className="pl-2"> {users_referredUsers}</p> </div>
                    <div className="d-flex"> <h4> Refferrer ID :- </h4>   <p className="pl-2"> {users_referrerID}</p> </div>
                    </>
                  )
                   : 0}
                 
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h4 className="card-title">Events</h4>
                {/* <form  className="forms-sample"> */}
                <div className="d-flex">
                  <form className="forms-sample" onSubmit={handleSubmit1}>
                    <div className="form-group d-flex event-custom-select">
                    <Select
                      styles={customStyles}
                      required
                      options={nameOptions}
                      placeholder="Name"
                      className="form-control custom-select1 m-0 p-0 mr-2"
                      onChange={nameOptionChange}
                    />

                      <Select

                        styles={customStyles}
                        required
                        options={nameTypeOptions}
                        placeholder="Token Type"
                        className="form-control custom-select1 m-0 p-0 mr-2"
                        onChange={setType}
                      />

                   
                      <input
                        className="form-control ml-1 mr-1"
                        type="text"
                        name="data"
                        placeholder="Enter Sender .... "
                        onChange={handleChange}
                        value={search.data}
                      />

                      <input
                        className="btn btn-primary"
                        type="submit"
                        value="Search"
                      />
                    </div>
                  </form>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>User / Sender </th>
                      <th>Referrer / Referral</th>
                      <th>Token Type</th>
                      <th>Height</th>
                    </tr>
                  </thead>

                  {eventData && eventData.length
                    ? eventData.map((event) => (
                        <Event
                          key={event._id}
                          id={event._id}
                          name={event.name}
                          user={event._user}
                          sender={event.sender}
                          referrer={event._referrer}
                          referral={event._referral}
                          tokenType={event.tokenType}
                          height={event.height}
                        />
                      ))
                    : "Event Data comming soon..."}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicTable;
