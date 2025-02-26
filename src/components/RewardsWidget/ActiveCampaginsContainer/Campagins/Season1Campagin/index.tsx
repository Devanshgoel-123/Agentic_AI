import React from "react";
import "./styles.scss";
import CustomIcon from "@/components/common/CustomIcon";
import { EDDY_LOGO, EDDY_LOGO_TEXT } from "@/utils/images";
import useCustomModal from "@/hooks/common/useCustomModal";
import { EddyJourney } from "./Season1Journey";
import { motion } from "framer-motion";
export const Season1Campaign = () => {
  const { open, handleClose, handleOpen } = useCustomModal();
  
  return (
    <motion.div 
    transition={{
      delay:0.2,
    }}
    initial={{
      opacity:0
    }}
    animate={{
      opacity:1
    }}
       className="Season1CampaignContainer">
      <div className="CampaignDetailsContainer">
        <div className="CampaignDetailsHeading">
        <span>How to Earn Nori Points?</span>   
        </div>
        <div className="ActionBtn" onClick={()=>{
          handleOpen()
        }}>See Details</div>
      </div>
    <EddyJourney open={open} handleClose={handleClose}/>
    </motion.div>
  );
};

