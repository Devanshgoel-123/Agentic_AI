import { motion } from "framer-motion"
import { Box } from "@mui/material"
import CustomIcon from "@/components/common/CustomIcon"
import { Token } from "@/store/types/token-type"
import { ETH_LOGO } from "@/utils/images"
import "./styles.scss"
interface Props{
    tokenDetails:Token
}
export const TokenDetailsContainer=({tokenDetails}:Props)=>{
    return (
        <Box className="TokenDetailsWrapperContainerAgent">
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="TokenLogoAgent"
          >
            <CustomIcon src={tokenDetails?.tokenLogo || ETH_LOGO}/>
            <motion.div
              transition={{ delay: 0.2 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ChainLogoAgent"
            >
              <CustomIcon src={tokenDetails?.chain.chainLogo || ETH_LOGO} />
            </motion.div>
          </motion.div>
          <Box className="TokenDetailsContainerAgent">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="TokenNameAgentSummary"
            >
              {tokenDetails?.name}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ChainNameAgentSummary"
            >
              on {tokenDetails?.chain.name==="Binance Smart Chain"? "BNB":tokenDetails?.chain.name}
            </motion.div>
          </Box>
        </>
    </Box>
    )
}