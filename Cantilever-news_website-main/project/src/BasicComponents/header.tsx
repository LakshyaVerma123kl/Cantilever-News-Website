import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { faSearch, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../utils/token";
import { articles, user } from "../utils/schema";
import { useEffect, useState } from "react";
import { fetchNews, getRequest } from "../utils/handleApi";

function Header({ head }: { head: boolean }) {
  const navigate = useNavigate();
  const [searchItem, setSearch] = useState<articles[]>([]);
  const [profile, setProfile] = useState<user>();
  const [hide, setHide] = useState<boolean>(false);

  const handleHide = () => {
    if (getToken() === "") {
      navigate("/login");
      return;
    }
    setHide(!hide);
  };

  useEffect(() => {
    const fetch = async () => {
      const data = await getRequest("user");
      if (data.err) {
        return;
      }
      console.log(data);

      setProfile(data);
    };
    fetch();
  }, []);

  const debounce = (cb: (word: any) => void, delay: number = 1000) => {
    return (...args: [string]) => {
      setTimeout(() => {
        cb(...args);
      }, delay);
    };
  };

  const handleupdate = debounce(async (text) => {
    const data = await fetchNews("", text);
    console.log(data);
    setSearch(data.articles);
    // console.log(text);
  });

  const handleChange = (val: string) => {
    if (val.trim() === "") {
      setSearch([]);
      return;
    }
    handleupdate(val);
    // console.log(e.target.value);
  };
  return (
    <div
      className={`w-full px-8 ${
        head
          ? "bg-[#1a1a1a] border-gray-500 border-b-[0.5px] py-2"
          : "bg-transparent py-3.5"
      } fixed top-0 z-20 flex justify-between text-white font-semibold max-sm:hidden`}
    >
      <div className="space-x-5 flex items-center justify-center">
        <p className="text-3xl font-bold">eNews</p>
        <p className="font-light text-2xl text-gray-400">|</p>
        <NavLink to="/">Home</NavLink>
        {/* <NavLink to="/searchPage?search=">Latest</NavLink> */}
        <NavLink to="/about">About</NavLink>
      </div>
      <div
        className="relative space-x-3 px-6 py-3.5 bg-transparent/15 rounded-2xl 
      hover:bg-transparent/40 flex items-center active:bg-transparent/35 w-[30%]"
      >
        <FontAwesomeIcon icon={faSearch} color="gray" />
        <input
          type="text"
          onChange={(e) => handleChange(e.target.value)}
          className="bg-transparent w-full placeholder:text-gray-400/60 outline-none"
          placeholder="Search"
        />
        <div
          className=" absolute w-full max-h-[25rem] overflow-auto
        z-20 right-0 top-14 rounded-lg backdrop-blur-md backdrop-brightness-50"
        >
          {searchItem &&
            searchItem.map((item, i) => (
              <p
                key={i}
                onClick={() => {
                  setSearch([]);
                  navigate(`/?search=${item.title}`);
                }}
                className="text-sm py-2 hover:cursor-pointer"
              >
                {item.title}
              </p>
            ))}
        </div>
      </div>
      <div className="flex space-x-3">
        {getToken() === "" ? (
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-3.5 font-semibold rounded-xl bg-transparent/10 hover:bg-transparent/20"
          >
            <FontAwesomeIcon className="pr-2.5" icon={faWallet} />
            Login
          </button>
        ) : (
          ""
        )}
        <div className="relative p-3.5 rounded-xl bg-transparent/10 hover:bg-transparent/20 hover:cursor-pointer">
          <FontAwesomeIcon icon={faCircleUser} onClick={handleHide} size="xl" />
          {hide ? (
            <div
              className="absolute w-[15rem] rounded-xl h-auto top-12 bg-white 
          text-gray-400 text-sm font-semibold p-4 space-y-2.5 right-0 text-left"
            >
              <p>{profile?.username}</p>
              <p>{profile?.email}</p>
              <p>{profile?.name}</p>
              <button
                onClick={() => removeToken()}
                className="px-4 py-2 rounded-xl text-white bg-sky-600"
              >
                Logout
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
