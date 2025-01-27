import infoIcon from "../../assets/images/info-icon.png"

export default function InfoButton({main}) {
    return <img src={infoIcon} alt="" className={main ? "w-8" : "w-6"}/>
}