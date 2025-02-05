import React, { useEffect, useState } from "react";
import { Tree } from "react-tree-graph";
import "./Downline.css";

const Downline = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(""); // State to hold selected userId
  const [users, setUsers] = useState([]); // List of users for dropdown

  // Fetching list of users for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      let token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "https://wallet-seven-fawn.vercel.app/api/v1/users/alluser",
          {
            method: "GET",
            headers: {
              token: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const result = await response.json();
        if (result.status === true) {
          setUsers(result.data); // Store users in state
        } else {
          throw new Error("Error fetching users");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUsers();
  }, []); // Only fetch once when the component mounts

  // Fetching data for selected user
  useEffect(() => {
    if (!userId) return;

    let token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://wallet-seven-fawn.vercel.app/api/v1/admin/downline/tree/${userId}`,
          {
            method: "GET",
            headers: {
              token: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        if (result.status === true) {
          setData(result.data); // Set data for the selected user
        } else {
          throw new Error("Error fetching data");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]); // Trigger the fetch when the selected userId changes

  // Transform data into the required format for react-tree-graph
  const transformData = (user) => {
    return {
      name: user.name,
      label: (
        <g>
          <circle r="20" fill={user.Rank === 1 ? "#FFD700" : "#76C7C0"} />
          <text dx="25" dy="-25" fontSize="14" fill="black" textAnchor="middle">
            {user.name}
          </text>
          <text dx="25" dy="-10" fontSize="12" fill="black" textAnchor="middle">
            Rank: {user.Rank}
          </text>
          <text dx="25" dy="5" fontSize="12" fill="black" textAnchor="middle">
            Amount: {user.amount}
          </text>
        </g>
      ),
      attributes: {
        amount: user.amount,
        rank: user.Rank,
      },
      children: user.downline.length ? user.downline.map(transformData) : [],
    };
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const treeData = data ? transformData(data) : {};

  return (
    <div className="tree-container text-center">
      <h1>User Downline Tree</h1>

      {/* Dropdown to select user */}
      <div className="dropdown">
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)} // Update userId when selection changes
        >
          <option value="">Select a User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.Name}
            </option>
          ))}
        </select>
      </div>

      {/* Render the tree for the selected user */}
      {data && (
        <div className="tree">
          <Tree
            data={treeData}
            width={1000}
            height={700} // Adjust the height as needed
            svgProps={{
              style: {
                border: "1px solid lightgray",
                backgroundColor: "#f9f9f9",
              },
            }}
            pathProps={{
              stroke: "#3498db", // Path color changed to a blue shade
              strokeWidth: 2, // Path width increased
              strokeDasharray: "5,5", // Dashed path
            }}
            labelProp="label" // Custom label
            direction="tb" // Set the tree layout to top-to-bottom
            nodeShape="circle"
            duration={5000}
          />
        </div>
      )}
    </div>
  );
};

export default Downline;
