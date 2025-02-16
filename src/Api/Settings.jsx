import Cookies from "js-cookie";
import { BaseUrl } from "./BaseUrl";

// Get All transaction
export const GetAllTransaction = async (query) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/transaction/getfund?${query}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: token,
      },
    });

    response = await response.json();
    console.log(response);
    return response;
  } catch (error) {
    return error.message;
  }
};

// <!----------------------------NEWS API--------------------------!>

// Get All News
export const GetAllNews = async () => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/Appnews/news/get/all`, {
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
// Add News
export const AddNewsApi = async (payload) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/Appnews/news/add`, {
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
// Update News
export const UpdateNewsApi = async (payload, id) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/Appnews/update/${id}`, {
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
// Delete News
export const DeleteNewsApi = async (id) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/Appnews/delete/${id}`, {
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

// <!----------------------------RANK API--------------------------!>

export const GetAllRank = async () => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/ranking/get/all`, {
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
// Add News
export const AddRankApi = async (payload) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/ranking/add`, {
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
// Update News
export const UpdateRankApi = async (payload, id) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/ranking/update/${id}`, {
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
// Delete News
export const DeleteRankApi = async (id) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/ranking/delete/${id}`, {
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

// <!----------------------------Tickets API--------------------------!>

// get all ticket
export const GetAllTicket = async () => {
  try {
    let token = Cookies.get("token");
    try {
      let response = await fetch(`${BaseUrl}/ticket/admin/get`, {
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
  } catch (error) {
    return error.message;
  }
};

// resolve ticket
export const ResolveTicketApi = async (payload, id) => {
  let token = Cookies.get("token");
  try {
    let response = await fetch(`${BaseUrl}/ticket/admin/resolve/${id}`, {
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
