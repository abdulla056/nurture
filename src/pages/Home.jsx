import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DashboardButton from "../components/Home/DashboardButton";
import Logo from "../components/common/Logo";
import dashboardImage from "../assets/images/dashboard-image.png";
import Features from "../components/Home/Features";
import ellipse from "../assets/images/ellipse-home-screen.png";
import HomeFooter from "../components/Home/HomeFooter";

export default function Home() {
  return (
    <div className="flex flex-col bg-custom-gradient px-16 py-8 w-full h-full gap-16">
      {/* Navbar */}
      <motion.div
        className="flex flex-row items-center justify-between"
        id="homeNavBar"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Logo color={"white"} />
        <div className="flex flex-row items-center gap-6">
          <a href="" className="text-white text-3xl font-thin">
            Sign in
          </a>
          <Link to={"/selection-dashboard"}>
            <DashboardButton>Go to Prediction Dashboard</DashboardButton>
          </Link>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        className="flex flex-row justify-between"
        id="firstSection"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col w-3/6 gap-8" id="splash">
          <motion.span
            className="text-7xl text-white tracking-wide"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Predict Fetal Mortality with Machine Learning.
          </motion.span>
          <motion.div
            className="flex flex-row gap-2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <DashboardButton>Go to Dashboard</DashboardButton>
            <button className="opacity-90 text-2xl flex justify-center items-center gap-2 rounded-lg border-white border py-6 px-10 text-white">
              Learn more
            </button>
          </motion.div>
        </div>
        <motion.img
          src={dashboardImage}
          alt="Dashboard Image"
          className="h-96 -mr-16"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="flex flex-col justify-center gap-12 items-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <span className="text-5xl text-white w-1/2 text-center">
          From predicting, to visualizing, to explaining
        </span>
        <Features />
      </motion.div>

      {/* Footer Section */}
      <motion.div
        className="-mx-16 w-screen"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <img src={ellipse} alt="" className="invisible" />
      </motion.div>
      <HomeFooter />
    </div>
  );
}
