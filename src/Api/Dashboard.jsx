import { BaseUrl } from "./BaseUrl";
import Cookies from "js-cookie";

// Get dashboard Count
export const DashboardApi = async () => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/admin/dashboard/count`, {
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

// Get Commision By  Month
export const GetCommisionByMonthApi = async () => {
    let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/admin/dashboard/commision/month`, {
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

// Get Member By  Month
export const GetMemberByMonthApi = async () => {
    let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/admin/dashboard/member/month`, {
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

// Get Commision By  Month
export const GetTransactionByMonthApi = async () => {
    let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/admin/dashboard/transaction/month`, {
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
