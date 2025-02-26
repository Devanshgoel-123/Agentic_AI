import React from "react";
import { Modal, Grow} from "@mui/material";
import "./styles.scss";
import { GrClose } from "react-icons/gr";
interface Props{
  open:boolean;
  handleClose:()=>void;
}
export const EddyJourney=({open,handleClose}:Props)=>{
    return (
      <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0,0,0,0.9)",
        },
      }}
    >
      <div className="EddyJourneyWrapper">
        <Grow in={open}>
          <div className="EddyJourneyWrapperContainer">
          <div className="Season1CampaignContainerEddyJourney">
          <span>How to earn <span style={{
            color:"#7bf179"
          }}> Nori</span> points?</span>
          <div className="HeadingBtn" onClick={handleClose}>
          <GrClose />
        </div>
          </div>
          <div className="TableContainer">
            <div className="TableHeading">
              <span className="Header">Tasks</span>
              <span className="Header">Points Earned</span>
            </div>
            <div className="TableContent">
            <ul className="TableColumnLeft">
                <li className="eddyScore">Social Task</li>
                <li className="eddyScore">{"Min $20 from Solana <> Base"}</li>
                {/* <li className="eddyScore">Deposit $10 in LP for 1 week</li>
                <li className="eddyScore">Deposit $100 in LP for 1 week</li>
                <li className="eddyScore">Deposit $100 in LP for 2 week</li>
                <li className="eddyScore">Deposit $100 in LP for 4 week</li> */}
              </ul>
              <ul className="TableColumnRight">
                <li className="pointsText"><span>1</span>Nori Point</li>
                <li className="pointsText"><span>2</span>Nori Point</li>
                {/* <li className="pointsText"><span>0.1</span>Nori Point</li>
                <li className="pointsText"><span>1</span>Nori Point</li>
                <li className="pointsText"><span>2</span>Nori Point</li>
                <li className="pointsText"><span>4</span>Nori Point</li> */}
              </ul>
            </div>
     
            </div>
          </div>
        </Grow>
      </div>
    </Modal>
    )
}
