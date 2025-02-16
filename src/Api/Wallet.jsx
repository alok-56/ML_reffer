import { BaseUrl } from "./BaseUrl";
import Cookies from "js-cookie";

// Add Fund
export const AddFundApi = async (payload) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/transaction/addfund/admin`, {
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

// Get Wallet Transaction
export const GetWalletTransaction = async (query = "") => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(
      `${BaseUrl}/transaction/admin/getprofit${query}`,
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

// Balance Report

export const GetBalanceReport = async (query = "") => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/admin/balance/report`, {
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

// Withdraw request

export const GetWithdwaralrequest = async (query = "") => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(
      `${BaseUrl}/transaction/admin/getprofit${query}`,
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

// Approve withdraw


export const UpdateWithdrawl = async (payload,id) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/transaction/withdraw/approve/${id}`, {
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
