import PrimaryContainer from "../../components/layout/PrimaryContainer";
import riskScore from "../../assets/images/risk-score-image.png"

const riskDescription = "This is a high risk case and immediate action should be taken"

export default function RiskScore() {
    return (
        <PrimaryContainer className="items-center" disableHover={false}>
          <h3 className="text-font-tertiary font-light">Risk Score</h3>
          <img src={riskScore} alt="Risk Score Image" className="w-40"/>
            <span className="text-xsmall text-font-tertiary font-extralight">{riskDescription}</span>
        </PrimaryContainer>
    )
}