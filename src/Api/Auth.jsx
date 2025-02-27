import { BaseUrl } from "./BaseUrl";
import Cookies from "js-cookie";

// Login Api
export const LoginApi = async (payload) => {
  console.log(payload)
  try {
    let response = await fetch(`${BaseUrl}/admin/signin`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json",
      },
    });

    response = await response.json();
    return response;
  } catch (error) {
    return error.message;
  }
};

// Get All Users

export const GetAllUsers = async () => {
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

// change password

export const ChangepasswordApi = async (payload) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/admin/admin/changepassword`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json",
        "token": token
      },
    });

    response = await response.json();
    return response;
  } catch (error) {
    return error.message;
  }
};

// Update Address

export const UpdatePubicaddressApi = async (payload) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/admin/update/details`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json",
        "token": token
      },
    });

    response = await response.json();
    return response;
  } catch (error) {
    return error.message;
  }
};
