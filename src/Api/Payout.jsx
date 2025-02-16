import Cookies from "js-cookie";
import { BaseUrl } from "./BaseUrl";

// Get Commision Details
export const GetCommisionDetails = async (query = "") => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/transaction/getcommision`, {
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

// Get Excepted Details
export const GetExceptedMonthlyDetails = async (month,year) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(
      `${BaseUrl}/transaction/admin/excepted/earning/${month}/${year}`,
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

// Transfer Money

export const TransferMoneyApi = async (id) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/transaction/admin/updateprofit/${id}`, {
      method: "PATCH",
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

// Generate Voucher

export const GenerateVoucherApi = async (payload) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/transaction/admin/addprofit`, {
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