import axios from "axios";
import React, { useEffect, useState } from "react";
import Displaybar from "../Display/Displaybar";
import { API_BASE_URL } from "../../config/api";

const UserDashboard = ({ currentUser, setFilters }) => {
  const [complaintList, setComplaintList] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      if (!currentUser || !currentUser._id) return;
      try {
        const result = await axios.post(
          `${API_BASE_URL}/complaints/fetchComplaint`,
          {
            userId: currentUser._id,
          }
        );
        console.log(result);

        if (result) {
          setComplaintList({
            complaints: result.data.fir,
          });
        }
      } catch (err) {}
    };
    fetch();
  }, [currentUser]);
  useEffect(() => {
    console.log("Complaint list", complaintList);
  }, [complaintList]);

  return (
      (<div className="w-[99%]">
       <Displaybar
         complaints={complaintList}
         setComplaintList={setComplaintList}
         setFilters={setFilters}
         heading={"My Complaints"}
         myComplaints={true}
       />
     </div>)

    
  );
};

export default UserDashboard;
