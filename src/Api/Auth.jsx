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
