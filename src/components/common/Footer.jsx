import * as React from "react";

export function Footer() {
  return (
    <div className="flex flex-wrap gap-10 justify-between items-center mt-44 w-full text-lg max-md:mt-10 max-md:max-w-full">
      <div className="self-stretch my-auto text-white">
        © 2024 Nurture. All rights reserved.
      </div>
      <div className="flex gap-7 items-center self-stretch my-auto text-white">
        <button className="self-stretch my-auto">Support</button>
        <button className="self-stretch my-auto">Privacy</button>
        <button className="self-stretch my-auto">Terms</button>
      </div>
    </div>
  );
}
