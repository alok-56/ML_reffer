import Cookies from "js-cookie";
import { BaseUrl } from "./BaseUrl";

// Get All Member

export const GetAllMember = async () => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/admin/alluser`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: token,
      },
    });

    response = await response.json();
    return response;
  } catch (error) {
    return error.message;
  }
};

// Add New Member

export const AddNewMemberApi = async (payload) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/admin/add/user`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json",
        token: token,
      },
    });

    response = await response.json();
    return response;
  } catch (error) {
    return error.message;
  }
};

// Update New Member

export const UpdateNewMemberApi = async (payload, id) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/admin/update/user/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json",
        token: token,
      },
    });

    response = await response.json();
    return response;
  } catch (error) {
    return error.message;
  }
};

export const DeleteMemberApi = async (id) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/admin/blockuser/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        token: token,
      },
    });

    response = await response.json();
    return response;
  } catch (error) {
    return error.message;
  }
};

export const DownlineTree = async (id) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/admin/downline/tree/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: token,
      },
    });

    response = await response.json();
    return response;
  } catch (error) {
    return error.message;
  }
};

export const SponserTeam = async (code, start, end) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(
      `${BaseUrl}/admin/users/sponserteam?referralCode=${code}&startDate=${start}&endDate=${end}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          token: token,
        },
      }
    );

    response = await response.json();
    return response;
  } catch (error) {
    return error.message;
  }
};
