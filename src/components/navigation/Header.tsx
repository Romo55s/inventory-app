import React from "react";
import Link from "next/link";
import { MdOutlineArrowOutward } from "react-icons/md";

const Header: React.FC = () => {
  return (
    <header className="text-white w-full flex justify-between items-center md:px-20 py-5 px-5 sticky top-0 left-0 backdrop-blur-xl">
      <div>
        <Link href={"/"} className="font-[800] text-2xl">
          {" "}
            Inventario App
        </Link>
      </div>
      <div>
        <a href="" className="flex items-center justify-center bg-white text-black text-base font-[600] px-5 py-2 rounded-md">
          <span>GitHub</span>
          <span>
            <MdOutlineArrowOutward />
          </span>
        </a>
      </div>
    </header>
  );
};

export default Header;
