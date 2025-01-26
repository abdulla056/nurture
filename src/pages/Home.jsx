import DashboardButton from "../components/Home/DashboardButton";
import Logo from "../components/common/Logo";
import dashboardImage from "../assets/images/dashboard-image.png";
import Features from "../components/Home/Features";
import ellipse from "../assets/images/ellipse-home-screen.png";
import HomeFooter from "../components/Home/HomeFooter";

export function Home() {
  return (
    <div className="flex flex-col bg-custom-gradient px-16 py-8 w-full h-full gap-16">
      <div
        className="flex flex-row items-center justify-between"
        id="homeNavBar"
      >
        <Logo color={"white"} />
        <div className="flex flex-row items-center gap-6">
          <a href="" className="text-white text-3xl font-thin">
            Sign in
          </a>
          <DashboardButton>Go to Prediction Dashboard</DashboardButton>
        </div>
      </div>
      <div className="flex flex-row justify-between" id="firstSection">
        <div className="flex flex-col w-3/6 gap-8" id="splash">
          <span className="text-7xl text-white tracking-wide">
            Predict Fetal Mortality with Machine Learning.
          </span>
          <div className="flex flex-row gap-2">
            <DashboardButton>Go to Dashboard</DashboardButton>
            <button className="opacity-90 text-2xl flex justify-center items-center gap-2 rounded-lg border-white border py-6 px-10 text-white">
              Learn more
            </button>
          </div>
        </div>
        <img
          src={dashboardImage}
          alt="Dashboard Image"
          className="h-96 -mr-16"
        />
      </div>
      <div
        className="flex flex-col justify-center gap-12 items-center"
        id="features"
      >
        <span className="text-5xl text-white w-1/2 text-center">
          From predicting, to visualizing, to explaining
        </span>
        <Features />
      </div>
      <div  className="-mx-16 w-screen">
        <img src={ellipse} alt="" className="invisible"/>
      </div>
      <HomeFooter/>
    </div>
  );
}

// backgroundImage: `url(${ellipse})`, backgroundSize: 'contain',
