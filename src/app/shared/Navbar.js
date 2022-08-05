import React from 'react';
import {  Link } from "react-router-dom";
import Web3 from 'web3';

const Navbar = () => {

  const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
  const [account, setAccount] = React.useState(); 
    
  React.useEffect(() => {
    async function load() {
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
    }
    load();
   }, []);
   window.ethereum.on('accountsChanged', async (account)=>{
    setAccount(account[0])
  })

    return (
      <nav className="navbar p-0 fixed-top d-flex flex-row custom-nav ">
        <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
          <ul  style={{display :" flex" , flexDirection :"column" }} className="navbar-nav navbar-nav-right ">
            <li>{account}</li>

            <li><h5> <Link to="/">Home</Link> </h5> </li>
            <li><h5> <Link to="/event">Event</Link></h5> </li>
            
           
          </ul>

         
          
        </div>

        
      </nav>
    );
}

export default Navbar;
