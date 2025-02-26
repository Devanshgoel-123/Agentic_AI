"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import "./styles.scss";
import TransactionNotification from './TransactionComponent';
import useTransferStore from '@/store/transfer-store';
import { useShallow } from 'zustand/react/shallow';
import { ActiveTransaction } from '@/store/types/transaction-type';
import { RxCross1 } from "react-icons/rx";


export const TransactionDrawer=()=>{
    const {
      openSideBar,
      activeTransactionArray
    }=useTransferStore(useShallow((state)=>({
        openSideBar:state.activeSidebar,
        activeTransactionArray:state.activeTransactionArray
    })))

  return (
    <div className='w-full h-full'>
      <Drawer open={openSideBar} onClose={()=>{
        useTransferStore.getState().setActiveSideBar(false)
      }} anchor='right'>
        <Box className="DrawerList">
          <Box className="sideDrawerHeader">
            <RxCross1 className="crossIcon GradientText" onClick={()=>{
               useTransferStore.getState().setActiveSideBar(false)
            }}/>
          <span className='GradientText headerText'>Active Transactions</span>
          </Box>
          <Box className="TransactionsContainer">
          {
        activeTransactionArray.map((transaction:ActiveTransaction,key:number)=>{
            return <TransactionNotification key={key} fromToken={transaction.fromToken} toToken={transaction.toToken} hash={transaction.hash} estimatedTime={transaction.estimatedTime.toString()} createdAt={transaction.createdAt} status={transaction.status}/>
        })
     }
          </Box>
     
    </Box>
      </Drawer>
    </div>
  );
}
