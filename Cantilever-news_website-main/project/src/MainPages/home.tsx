import { useEffect, useState } from "react";
import { articles } from "../utils/schema";
import { fetchNews } from "../utils/handleApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";
import { getToken } from "../utils/token";
import LoginTemplate from "../Authentication/loginTemplate";

function home() {
  const arr: Array<string> = [
    "General",
    "Business",
    "Entertainment",
    "Health",
    "Science",
    "Technology",
    "Sports",
  ];
  const [category, setCategory] = useState<string>(arr[0]);
  const [login, setLogin] = useState<boolean>(false);
  const [newsData, setNewsData] = useState<articles[]>([]);
  const [suggestion1, setSuggestion1] = useState<articles[]>([]);
  const [suggestion2, setSuggestion2] = useState<articles[]>([]);
  const [screen, setScreen] = useState<boolean>(false);
  const [search] = useSearchParams();
  const findRandom = (arr: Array<string>): string => {
    return arr[Math.floor(Math.random() * arr.length)];
  };
  const handleLogin = () => {
    setLogin(!login);
  };
  const handleClick = (url: string) => {
    if (getToken() === "") {
      handleLogin();
      return;
    }
    window.location.href = url;
  };
  useEffect(() => {
    const fetch = async () => {
      const val1 = findRandom(arr.filter((a) => a !== category));
      const val2 = findRandom(arr.filter((a) => a !== category && a !== val1));
      const data = await fetchNews("", category.trim());
      if (!data.articles.length) {
        console.log("No News Found");
        toast.error("No News Found");
        setScreen(false);
        return;
      }
      setScreen(true);
      console.log(data);
      setNewsData(data.articles);
      const data2 = await fetchNews("", val1);
      const data3 = await fetchNews("", val2);
      // console.log(data);
      if (!data2.articles.length || !data3.articles.length) return;
      setSuggestion1(data2.articles);
      setSuggestion2(data3.articles);
    };
    fetch();
  }, [category]);

  useEffect(() => {
    const fetch = async () => {
      const str = search.get("search");
      if (str === undefined || str === null) return;
      const data = await fetchNews("", str);
      setNewsData(data.articles);
    };
    fetch();
  }, [search]);
  return (
    <div
      className={`w-full ${
        screen ? "h-full" : "h-screen"
      } text-white px-10 max-sm:px-5 pt-16 
    space-y-7 text-left bg-gradient-to-tr from-sky-200 to-black`}
    >
      <ToastContainer />
      <p className="text-4xl font-semibold">Latest News</p>
      <div className="flex space-x-5 max-sm:space-x-2 overflow-auto">
        {arr.map((item, i) => (
          <p
            onClick={() => setCategory(item)}
            key={i}
            className={`px-4 py-2 ${
              item === category ? "bg-black/10" : ""
            } rounded-xl hover:cursor-pointer`}
          >
            {item}
          </p>
        ))}
      </div>
      <div className="grid grid-cols-8 space-x-5 max-sm:space-x-0">
        <div className="col-span-2 p-5 space-y-5 max-sm:hidden">
          {[...suggestion1].map((s, i) => (
            <div
              key={i}
              onClick={() => handleClick(s.url)}
              className="space-y-2 hover:cursor-pointer w-full pb-5 border-b border-gray-400"
            >
              <img
                loading="lazy"
                className={`w-full h-auto object-cover`}
                src={s.urlToImage}
                alt=""
              />
              <p className="font-semibold text-xl">{s.title}</p>
              <p className="text-sm text-gray-200">{s.description}</p>
            </div>
          ))}
        </div>
        <div className="col-span-4 p-5 max-sm:p-0 space-y-14 max-sm:col-span-8">
          {[...newsData].map((news, i) => (
            <div
              onClick={() => handleClick(news.url)}
              key={i}
              className="space-y-2 w-full rounded-xl hover:cursor-pointer"
            >
              <img
                loading="lazy"
                className={`w-full object-cover`}
                src={news.urlToImage}
                alt=""
              />
              <p className="font-semibold text-xl">{news.title}</p>
              <p className="text-sm text-gray-200">{news.description}</p>
            </div>
          ))}
        </div>
        <div className="col-span-2 p-5 space-y-5 max-sm:hidden">
          {[...suggestion2].map((s, i) => (
            <div
              onClick={() => handleClick(s.url)}
              key={i}
              className="space-y-2 w-full hover:cursor-pointer pb-5 border-b border-gray-400"
            >
              <img
                loading="lazy"
                className={`w-full object-cover`}
                src={s.urlToImage}
                alt=""
              />
              <p className="font-semibold text-xl">{s.title}</p>
              <p className="text-sm text-gray-200">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
      {login ? <LoginTemplate setlogin={setLogin} /> : ""}
    </div>
  );
}

export default home;
