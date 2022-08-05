import React, { useEffect, useState } from 'react';
import Select from 'react-select'
import axios from "axios";
import Web3 from 'web3';
import { ICU, BEP20 } from '../../utils/web3.js'
import { baseUrl } from "../../utils/confix";

const Dashboard = () => {
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');

  const [account, setAccount] = useState(); 
  const [balance, setBalance] = useState(); 
  const [frznBalance, setFrznBalance] = useState(); 
  const [registration_Free, setRegistrationFee] = useState(); 
  const [tokenBalance, setTokenBalance] = useState(); 
  const [current_id, setCurrentId] = useState(); 
  const [current_tokenAccepting, setCurrentTokenAccepting] = useState(); 
  const [tokenRewarded, setTokenRewarded] = useState(); 
  const [payAutoPool, setPayAutoPool] = useState(); 
  const [levelPrice, setLevelPrice] = useState(); 

  const [referrerID, setReferrerID ] = useState({ id :''})
  const [tokenReword, setTokenReword ] = useState({ amount :''})
  const [regFess, setRegFess ] = useState({ amount :''})
  const [tkAcc, settkAcc] = useState(null)



  
  
  useEffect(() => {
    async function load() {
      const accounts = await web3.eth.requestAccounts();
      let balance = await web3.eth.getBalance(accounts[0])
      const etherValue = web3.utils.fromWei(balance, 'ether');
      setBalance(etherValue)
      setAccount(accounts[0]);
      let BEP20_ = new web3.eth.Contract(BEP20.ABI, BEP20.address)
      let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address)
      let frozenBalance = await BEP20_.methods._frozenBalance(accounts[0]).call();
      let RegistrationFee = await ICU_.methods.getRegistrationFess().call();
      let currentId = await ICU_.methods.currUserID().call();
      let currentTokenAccepting = await ICU_.methods.currentTokenAccepting().call();
      let token_rewared = await ICU_.methods.tokenReward().call();
      let pay_auto_pool = await ICU_.methods.Autopool_Level_Income().call();
      let level_income = await ICU_.methods.LEVEL_PRICE(1).call();
 
      const convert_pay_auto_pool = web3.utils.fromWei(pay_auto_pool, 'ether');

      setFrznBalance(frozenBalance)
      const convert_regfee = web3.utils.fromWei(RegistrationFee, 'ether');
      setRegistrationFee(convert_regfee)
      setCurrentId(currentId)
      
      setCurrentTokenAccepting(currentTokenAccepting)
      setTokenRewarded(token_rewared)
      setPayAutoPool(convert_pay_auto_pool)
      const convert_levelincome = web3.utils.fromWei(level_income, 'ether');
      setLevelPrice(convert_levelincome)

      // token balance
      let token_balance = await BEP20_.methods.balanceOf(accounts[0]).call();

      const convert_tokenBal = web3.utils.fromWei(token_balance, 'ether');
        setTokenBalance(convert_tokenBal)

    }
    load();
   }, []);

   window.ethereum.on('accountsChanged', async (account)=>{
    setAccount(account[0])
    let balance = await web3.eth.getBalance(account[0])

    const etherValue = web3.utils.fromWei(balance, 'ether');
    setBalance(etherValue)
  })

  const handleChange = event => {
    let {name, value} = event.target
    setReferrerID({...referrerID, [name]:value})
  };

  const handleChangeTkReword = event => {
    let {name, value} = event.target
    setTokenReword({...tokenReword, [name]:value})
  };

  const handleChangeRegFess = event => {
    let {name, value} = event.target
    setRegFess({...regFess, [name]:value})
  };

  const handleSubmit = async event => {
    event.preventDefault()

    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address)
    let value_ = await ICU_.methods.REGESTRATION_FESS().call();
    let currentTokenAccepting = await ICU_.methods.currentTokenAccepting().call();
  
    if(currentTokenAccepting === 'Native-Coin-Accepting'){
        let reg_user = await ICU_.methods.Registration(referrerID.id, value_).send({ from:account, value:value_})
        if(reg_user.status){
            let response = await axios.post(`${baseUrl}/api/event`, {txHx:reg_user.transactionHash});
            window.location.reload();
        } else {
          alert('Registerd Failed !!!!')
        }
    } else {
    let BEP20_ = new web3.eth.Contract(BEP20.ABI, BEP20.address)
    let approve = await BEP20_.methods.approve(ICU.address, value_).send({ from:account})
  
      if(approve.status === true){
        let reg_user = await ICU_.methods.Registration(referrerID.id, value_).send({ from:account, value:0})
          if(reg_user.status){
          let response = await axios.post(`${baseUrl}/api/event`, {txHx:reg_user.transactionHash});
          window.location.reload();
          } else {
            alert('Registerd Failed !!!!')
          }
      }
    }
  }

  const handleSubmitTKRword = async event => {
    event.preventDefault()
    console.log('Token Reword Called', tokenReword)

    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address)
    let tkrword = await ICU_.methods.changeTokenReward(tokenReword.amount).send({from:account});
    if(tkrword.status){
      let response = await axios.post(`${baseUrl}/api/event`, {txHx:tkrword.transactionHash});
      window.location.reload();
      alert('Reworded')
    } else{
      alert('Failed')
    }
  }

  const handleSubmitRegFee = async event => {
    event.preventDefault()
    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address)
    let regfess = await ICU_.methods.setRegistrationFess(regFess.amount).send({from:account});
    if(regfess.status){
      let response = await axios.post(`${baseUrl}/api/event`, {txHx:regfess.transactionHash});
      window.location.reload();
    } else{
      alert('Failed')
    }
  }
  
  const handleSubmitAcceptance = async event => {
    event.preventDefault()
    console.log('reg fess Called', tkAcc.value)

    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address)
    let tkAccept = await ICU_.methods.setTokenAcceptance(tkAcc.value).send({from:account});
    if(tkAccept.status){
      let response = await axios.post(`${baseUrl}/api/event`, {txHx:tkAccept.transactionHash});
      window.location.reload();
    } else{
      alert('Failed')
    }
  }
  
  const tokenAcceptanceOption =[
    {value:'true', label:'True'},
    {value:'false', label:'False'}
  ]


 

    return (
      <div>
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>Frozen Balance </h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h4 className="mb-0">{frznBalance ? frznBalance / 10 **18 : 0 }</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>Token Balance</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h4 className="mb-0">{tokenBalance ? tokenBalance : 0 }</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>Metamask Balance</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h4 className="mb-0">{balance ? balance : 0 }</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* reg fee  */}
          <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>Registration Fee</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h4 className="mb-0">{registration_Free ? registration_Free : 0 }</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>Current ID</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h4 className="mb-0">{current_id ? current_id : 0 }</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>Token Accepted</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h4 className="mb-0" style={{fontSize:'15px'}}>{current_tokenAccepting ? current_tokenAccepting : 0}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>Token reward</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h4 className="mb-0">{tokenRewarded ?   tokenRewarded / 10 **18 : 0 }</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body text-center">
                User
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>Pay autopool</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h2 className="mb-0">{payAutoPool ? payAutoPool : 0 }</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>Level Income</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h2 className="mb-0">{levelPrice ? levelPrice : 0 }</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>Referrel ID</h5>
                <div className="row">
                  <div className="col-sm-12 my-auto">
                      <form  className="forms-sample"  onSubmit={handleSubmit}>
                          <div className='form-group w-100'>
                              <input className='form-control mt-2'
                                type='number'
                                required
                                name='id'
                                onChange={handleChange}
                                value={referrerID.id}
                                />
                              <input className='btn btn-primary mt-3' type='submit' value='Submit' />
                          </div>
                      </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body text-center">
                Admin
              </div>
            </div>
          </div>
          {/* <div className="col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>Token Reword</h5>
                <div className="row">
                  <div className="col-sm-12 my-auto">
                      <form  className="forms-sample"  onSubmit={handleSubmitTKRword}>
                          <div className='form-group w-100'>
                              <input className='form-control mt-2'
                                type='number'
                                required
                                name='amount'
                                onChange={handleChangeTkReword}
                                value={tokenReword.amount}
                                />
                              <input className='btn btn-primary mt-3' type='submit' value='Submit' />
                          </div>
                      </form>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {/* <div className="col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>Set Registration Fess</h5>
                <div className="row">
                  <div className="col-sm-12 my-auto">
                      <form  className="forms-sample"  onSubmit={handleSubmitRegFee}>
                          <div className='form-group w-100'>
                              <input className='form-control mt-2'
                                type='number'
                                required
                                name='amount'
                                onChange={handleChangeRegFess}
                                value={regFess.amount}
                                />
                              <input className='btn btn-primary mt-3' type='submit' value='Submit' />
                          </div>
                      </form>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {/* <div className="col-sm-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>Set Token Acceptance</h5>
                <div className="row">
                  <div className="col-sm-12 my-auto">
                      <form  className="forms-sample"  onSubmit={handleSubmitAcceptance}>
                          <div className='form-group w-100'>
                                <Select
                                  style={{color:'black'}}
                                  required
                                  options={tokenAcceptanceOption}
                                  placeholder='Select Acceptance'
                                  className='mb-3'
                                  onChange={settkAcc}
                                  />
                              <input className='btn btn-primary mt-3' type='submit' value='Submit' />
                          </div>
                      </form>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div> 
    );
  }
// }  7. setTokenAcceptance



export default Dashboard;