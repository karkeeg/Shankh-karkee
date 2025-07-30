import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/appContext";
import axios from "axios";
import toast from "react-hot-toast";

const Activity = ({ setStatus }) => {
  const { userDetails, setUserDetails } = useAppContext();

  const [data, setData] = useState([]);

  const [temp, setTemp] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/getAllTests`,
          userDetails
        );
        console.log(res.data.data);

        setTemp(res.data.data);
        setData(res.data.data);
      } catch (error) {
        console.error("Error fetching test data :", error);
      }
    };

    fetchData();
  }, []);

  const handleView = (item) => {
    setStatus("results");
  };

  const handlePractice = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("No voice recorded!");
      return;
    }

    if (userDetails.credits <= 0) {
      toast.error("Credits not enough !");
      return;
    }

    setStatus("practice");
  };

  return (
    <div className="bg-[#F8FAFA] overflow-y-scroll p-4 sm:p-8 h-[89svh] space-y-4 sm:space-y-8">
      <h1
        style={{ fontFamily: "Poppins" }}
        className="font-semibold text-[24px] sm:text-[32px]"
      >
        Activity
      </h1>
      <div className="p-[20px] sm:p-[40px] space-y-[30px] bg-white rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <h1
            style={{ fontFamily: "Poppins" }}
            className="text-[20px] sm:text-[24px] font-semibold"
          >
            Recent Tests
          </h1>
          <button
            onClick={handlePractice}
            style={{ fontFamily: "Poppins" }}
            className="w-full sm:w-auto pt-[10px] pr-[30px] sm:pr-[53px] pb-[10px] pl-[30px] sm:pl-[53px] rounded-lg text-white bg-[#34856C] text-sm sm:text-base"
          >
            Practice Now
          </button>
        </div>
        <div className="overflow-x-auto">
          <table
            style={{ fontFamily: "Inter" }}
            className="w-full text-[14px] sm:text-[18px] min-w-[600px]"
          >
            <thead>
              <tr className="pt-8 pr-8 pl-8 pb-4 text-gray-700 w-full bg-[#E7F0F0] ">
                <th className="p-[10px] font-medium">Test ID</th>
                <th className="p-[10px] font-medium">Language</th>
                <th className="p-[10px] font-medium">Date</th>
                <th className="p-[10px] font-medium">Overall Score</th>
                <th className="p-[10px] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data
                ? data
                    .filter((item) => item.userId == userDetails._id)
                    .map((item, index) => {
                      return (
                        <tr
                          key={index}
                          className="pt-2 border-b-[1px] border-gray-300 text-center pr-8 pl-8 pb-2 w-full "
                        >
                          <td className="p-[10px] ">{item._id}</td>
                          <td className="p-[10px] ">{item.language}</td>
                          <td className="p-[10px] ">{item.date}</td>
                          <td className="p-[10px] ">
                            {Math.floor(item.overallScore)}
                          </td>
                          <td className="p-[10px] ">
                            <button
                              onClick={() => handleView(item)}
                              className="p-[10px] cursor-pointer text-white rounded-lg bg-[#34856C]"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Activity;
