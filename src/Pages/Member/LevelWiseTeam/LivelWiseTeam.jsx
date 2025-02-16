import React, { useState, useEffect } from "react";
import { Tree } from "react-tree-graph";
import Select from "react-select";
import "react-tree-graph/dist/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "reactstrap";
import { DownlineTree, GetAllMember } from "../../../Api/Member";
import Swal from "sweetalert2";
import Loader from "../../../Components/Loading/Loading";

const LivelWiseTeam = () => {
  const [users, setUsers] = useState([]); 
  const [userName, setUserName] = useState(null);
  const [level, setLevel] = useState("");
  const [data, setData] = useState(null);
  const [loading,setLoading]=useState(false)

  // Fetch all members on mount
  useEffect(() => {
    fetchMemberData();
  }, []);

  const fetchMemberData = async () => {
    try {
      const res = await GetAllMember();
      if (res.status) {
        console.log(res)
        const formattedUsers = res.data.reverse().map((user) => ({
          value: user._id,
          label: user.Name,
        }));
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  // Fetch downline tree based on selected user
  const fetchDownlineTree = async () => {
   
    if (!userName) {
      Swal.fire("Error!", "Please Select User.", "error");
      return;
    }
    setLoading(true)
    try {
      const res = await DownlineTree(userName.value);
      if (res.status) {
        let treeData = res.data;
        if (level) {
          treeData = filterTreeByLevel(treeData, parseInt(level));
        }
        setData(transformData(treeData));
        
      }
    } catch (error) {
      console.error("Error fetching downline tree:", error);
    }finally{
        setLoading(false)
    }
  };

  // Function to filter tree based on level selection
  const filterTreeByLevel = (node, maxLevel, currentLevel = 0) => {
    if (currentLevel >= maxLevel) return { ...node, downline: [] };
    return {
      ...node,
      downline: node.downline.map((child) =>
        filterTreeByLevel(child, maxLevel, currentLevel + 1)
      ),
    };
  };

  // Transform data for react-tree-graph
  const transformData = (user) => ({
    name: user.name,
    label: (
      <g>
        <circle r="20" fill={user.Rank >= 8 ? "#FFD700" : "#76C7C0"} />
        <text
          dx="25"
          dy="-25"
          fontSize="16"
          fill="blue"
          fontWeight="bold"
          textAnchor="middle"
        >
          {user.name}
        </text>
        <text dx="25" dy="-10" fontSize="12" fill="black" textAnchor="middle">
          Rank: {user.Rank}
        </text>
      </g>
    ),
    children: user.downline.map(transformData),
  });

  return (
    <div className="container mt-5 text-center">
         {loading && <Loader></Loader>}
      <Card className="p-4">
        <h1 className="mb-4">User Downline Tree</h1>
        {/* Dropdown Inputs */}
        <div className="row justify-content-center">
          {/* Searchable Username Dropdown */}
          <div className="col-md-4">
            <Select
              options={users}
              placeholder="Select Username"
              isSearchable
              onChange={(selected) => setUserName(selected)}
            />
          </div>

          {/* Level Dropdown */}
          <div className="col-md-3">
            <select
              className="form-select"
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="">All Levels</option>
              {[1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,14,15].map((lvl) => (
                <option key={lvl} value={lvl}>
                  Level {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Generate Button */}
          <div className="col-md-3">
            <button className="btn btn-primary" onClick={fetchDownlineTree}>
              Generate Tree
            </button>
          </div>
        </div>
      </Card>

      {/* Render the tree */}
      {data && (
        <div className="tree mt-4 d-flex justify-content-center">
          <Tree
            data={data}
            width={1200}
            height={500}
            svgProps={{
              style: {
                border: "1px solid lightgray",
                backgroundColor: "#f9f9f9",
                borderRadius: "10px",
              },
            }}
            pathProps={{
              stroke: "#3498db",
              strokeWidth: 2,
              strokeDasharray: "4,4",
            }}
            labelProp="label"
            direction="tb"
            nodeShape="circle"
            duration={1000}
          />
        </div>
      )}
    </div>
  );
};

export default LivelWiseTeam;
