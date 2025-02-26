"use client";
import React, { useRef, useState } from "react";
import "./styles.scss";
import { Grow, Input, Modal } from "@mui/material";
import { GrClose } from "react-icons/gr";
import { useCheckEligiblityForTask } from "@/hooks/Rewards/useCheckEligibilityForTask";
import { CustomSpinner } from "@/components/common/CustomSpinner";
import Image from "next/image";
import { useSendRewardClaimTransaction } from "@/hooks/Rewards/useSendClaimRewardTransaction";
import { X_ICON } from "@/utils/images";
import useHandleToast from "@/hooks/common/useHandleToast";
import { REWARDS_TASK_LINK, VERIFICATION_FAILED } from "@/utils/toasts";
import { TOAST_NAMES, TOAST_TYPE } from "@/utils/enums";
import { useWindowSize } from "usehooks-ts";
import Confetti from 'react-confetti'
import { useSendSocialRewardClaimTransaction } from "@/hooks/Rewards/useSendSocialClaimReward";
import { DISCORD_LINK } from "@/utils/constants";

interface Props {
  open: boolean;
  handleClose: () => void;
  taskId:number;
  description:string;
  title:string;
  points:number;
  creative:string;
  category_id:number;
}

export const SprintCardModal = ({ open, handleClose,taskId, description, points, creative,title,category_id }: Props) => {
  const [link,setLink]=useState<string>("");
  const [claimed,setClaimed]=useState<null | boolean>(null);
  const [verify,setVerify]=useState<boolean>(true);
  const [verifyLoading,setVerifyLoading]=useState<boolean>(false); //boolean to show the loader if verifying
  const [showConfetti,setShowConfetti]=useState<boolean>(false);
  const [sendVerification,setSendVerification]=useState<boolean>(false);
  const [showSpinner,setShowSpinner]=useState<boolean>(false);
  const {width,height}=useWindowSize();
  const {handleToast}=useHandleToast();
  const {
    eligibility,
    loading
  }=useCheckEligiblityForTask(taskId,category_id);
  const {
    sendClaimTransaction
  }=useSendRewardClaimTransaction();
  const {
    sendSocialClaimTransaction
  }=useSendSocialRewardClaimTransaction();



  const handleVerifyTransaction=async()=>{
      setVerifyLoading(true)
      const result=await sendSocialClaimTransaction(taskId);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setVerify(false);
      setClaimed(false)
      setVerifyLoading(false);
      return true;

  }
  
  const handleClaimTransaction=async ()=>{
    const result=await sendClaimTransaction(taskId,category_id)
    if(result.status){
      setShowSpinner(true)
      await new Promise((resolve) => setTimeout(resolve, 4000));
      setShowSpinner(false)
      setClaimed(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  }
  /**
   * Function to check if a link is valid twitter url
   * @param link the submmission link
   * @returns boolean
   */
  const isValidTwitterLink = (link: string): boolean => {
    const twitterRegex = /^https?:\/\/(www\.)?x\.com\/[a-zA-Z0-9_]{1,15}(\/\S*)?$/;
    return twitterRegex.test(link);
  };
// const isValidDiscordLink=(link:string):boolean=>{
//   const discordRegex = /^https?:\/\/(www\.)?(discord\.gg|discord\.com\/invite)\/[a-zA-Z0-9]+$/;
//   return discordRegex.test(link);
// }
  /**
   * Function to paste destination address.
   * @param e Capture clipboard event.
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("text");
    if(isValidTwitterLink(pastedData)){
      setLink(pastedData);
    }else{
      handleToast(
       REWARDS_TASK_LINK.heading,
       REWARDS_TASK_LINK.subHeading,
        TOAST_TYPE.ERROR
      );
    }
    
  };
  const renderActionButton = () => {
    if (category_id === 1) {
      if (eligibility?.claimed || claimed===true) {
        return <div className="ActionBtn Inactive">Claimed</div>;
      }
      if (eligibility && !eligibility?.eligible) {
        return <div className="ActionBtn Inactive">Not Eligible</div>;
      } 
      if (verifyLoading || loading || showSpinner ) {
        return (
          <div className="ActionBtn">
            <CustomSpinner size="20" color="#000" />
          </div>
        );
      }
      if (eligibility?.socialTaskDone) {
        if (claimed) {
          return <div className="ActionBtn Inactive">Claimed</div>;
        }
        return (
          <div className="ActionBtn" onClick={() => handleClaimTransaction()}>
            Claim
          </div>
        );
      }
      
      return (
        <div 
          className="ActionBtn" 
          onClick={async (e)=>{
            if(verify){
              if(taskId===3){
                e.stopPropagation();
                setShowSpinner(true)
                window.open('https://x.com/eddy_protocol', '_blank', 'noopener,noreferrer');
                handleVerifyTransaction();
                await new Promise((resolve) => setTimeout(resolve, 4000));
                setShowSpinner(false)
                setVerify(false);
              }else if(taskId===6){
                e.stopPropagation();
                setShowSpinner(true)
                window.open('https://x.com/eddy_protocol/status/1891857209027412242?t=7bF-IBcqXGDb-5E72rhDAg&s=19', '_blank', 'noopener,noreferrer');
                handleVerifyTransaction();
                await new Promise((resolve) => setTimeout(resolve, 4000));
                setShowSpinner(false)
                setVerify(false);
               }else if(taskId===4){
                e.stopPropagation();
                setShowSpinner(true)
                window.open(DISCORD_LINK, '_blank', 'noopener,noreferrer');
                handleVerifyTransaction();
                await new Promise((resolve) => setTimeout(resolve, 4000));
                setShowSpinner(false)
                setVerify(false);
               }
            }else{
              e.stopPropagation()
              handleClaimTransaction()
            await new Promise((resolve) => setTimeout(resolve, 4000));
            }
          }}
        >
          {verify ? <div>
           {taskId===6? "Retweet" : taskId===4 ? "Join Discord" : "Follow"}
          </div> : 
          (
            <div>
              Claim
            </div>
          )}
        </div>
      );
    }else{
      if (eligibility?.claimed || claimed===true) {
        return <div className="ActionBtn Inactive">Claimed</div>;
      }
      if (eligibility && !eligibility?.eligible) {
        return <div className="ActionBtn Inactive">Not Eligible</div>;
      } 
      if (verifyLoading || loading || showSpinner ) {
        return (
          <div className="ActionBtn">
            <CustomSpinner size="20" color="#000" />
          </div>
        );
      }
    return (
      <div
        className={`ActionBtn ${
          claimed === null
            ? eligibility?.claimed || !eligibility?.eligible
              ? "Inactive"
              : ""
            : "Inactive"
        }`}
        onClick={async (e)=>{
            e.stopPropagation()
            setShowSpinner(true)
            handleClaimTransaction()
          setShowSpinner(false)
        }}
      >
        {claimed === null
          ? eligibility?.eligible
            ? eligibility?.claimed
              ? "Claimed"
              : "Claim"
            : "Not Eligible"
          : "Claimed"}
      </div>
    );
  }
  };
  
  return (
    <div className="SprintConfettiWrapper">
        <Modal
      open={open}
      onClose={()=>{
        setLink("")
        setVerify(false)
        handleClose()
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0,0,0,0.9)",
        },
      }}
    >
      <div className="SprintCardModalWrapper">
        <Grow in={open}>
          <div className="ModalWrapper">
            {showConfetti && <Confetti
             width={400}
             height={200}
             numberOfPieces={100}
             className="Confetti"
          drawShape={ctx => {
        ctx.beginPath()
        for(let i = 0; i < 22; i++) {
          const angle = 0.2*i
          const x = (0.5 + (1.5 * angle))
          const y = (0.5 + (1.5 * angle))
          ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.closePath()
      }}
    />}
          <div className="SprintCardModalContainer">
            <div className="ModalHeading">
              <span className="HeadingText">Sprint Details</span>
              <div className="HeadingBtn" onClick={handleClose}>
          <GrClose />
        </div>
            </div>
            <div className="SprintDetailsContainer">
              <div className="SprintLogo">
                <Image className="Logo" src={creative} height={30} width={30} alt="creative"/>
                <span className="Content">{title}</span>
              </div>
              <div className="SprintPoints">{points} points</div>
            </div>
            <span className="SprintText">
              Sprint details: {description}
            </span>
            {renderActionButton()}
       </div>
          </div>
          
        </Grow>
      </div>
    </Modal>
    </div>
    
  );
};
