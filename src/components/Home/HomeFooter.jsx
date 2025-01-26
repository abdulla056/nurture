import logo from "../../assets/images/logo-icon.png";

export default function HomeFooter() {
  return (
    <div className="flex flex-col w-full items-end">
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-col">
          <img src={logo} alt="" className="w-12 pb-8" />
          <span className="text-small text-white font-bold">
            Subscribe to our newsletter
          </span>
          <span className="text-small text-white font-light">
            The latest news, articles, and resources, sent to your inbox weekly.
          </span>
        </div>
        <form className="flex flex-row h-8 gap-2">
          <input
            id="emailAddress"
            type="email"
            placeholder="Enter your email"
            className="pr-2 pl-2 w-full text-font-tertiary bg-white rounded-xl border border-solid border-stone-300"
          />
          <button type="submit" className="bg-secondary text-white flex items-center px-4 rounded-xl"> 
            Subscribe
          </button>
        </form>
      </div>
      <span className="text-small text-white font-light">© 2024 Nurture. All rights reserved.</span>
    </div>
  );
}
