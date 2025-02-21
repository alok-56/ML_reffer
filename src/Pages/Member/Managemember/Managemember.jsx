import React, { useMemo, useState, useEffect } from "react";
import {
  Container,
  Button,
  Card,
  CardHeader,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  FormGroup,
} from "reactstrap";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import { CSVLink } from "react-csv";
import { saveAs } from "file-saver";
import { FaFileExcel, FaFileCsv, FaTrash, FaEdit } from "react-icons/fa";
import * as XLSX from "xlsx";

import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import Loader from "../../../Components/Loading/Loading";
import {
  AddNewMemberApi,
  DeleteMemberApi,
  GetAllMember,
  UpdateNewMemberApi,
} from "../../../Api/Member";
import Select from "react-select";
import { GetAllUsers } from "../../../Api/Auth";

const ManageMember = () => {
  const [responseData, setResponseData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [apiloader, setApiloader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [rank, setRank] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  console.log(selectedUser)

  useEffect(() => {
    FetchUsers();
  }, []);

  useEffect(() => {
    fetchMemberData();
  }, []);

  const fetchMemberData = async () => {
    try {
      const res = await GetAllMember();
      if (res.status) {
        setResponseData(res?.data?.reverse());
      } else {
        setResponseData([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      { Header: "USER NAME", accessor: "Name" },
      { Header: "EMAIL", accessor: "Email" },
      { Header: "PASSWORD", accessor: "Password" },
      { Header: "MEMBER ID", accessor: "referralCode" },
      { Header: "RANK", accessor: "Rank" },
      { Header: "SPONSER ID", accessor: "referredBy" },
      { Header: "JOIN DATE", accessor: "createdAt" },

      {
        Header: "STATUS",
        accessor: (row) => (row.active ? "Active" : "Not Active"),
      },
      {
        Header: "ACTION",
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">
            <FaEdit
              onClick={() => {
                setSelectedMemberId(row.original._id);
                setName(row.original.Name);
                setEmail(row.original.Email);
                setPassword(row.original.Password);
                setRank(row.original.Rank);
                setPublicKey(row.original.PublicKey);
                setEditModalOpen(true);
              }}
              style={{
                cursor: "pointer",
                margin: "0 10px",
                fontSize: "20px",
                color: "#007bff",
              }}
            />
            <FaTrash
              onClick={() => handleDeleteMember(row.original._id)}
              style={{
                cursor: "pointer",
                margin: "0 10px",
                fontSize: "20px",
                color: "red",
              }}
            />
          </div>
        ),
      },
    ],
    []
  );

  const dataWithSlno = useMemo(() => {
    return (
      responseData?.map((item, index) => ({
        ...item,
        slno: index + 1,
        createdAt: new Date(item.createdAt).toLocaleDateString(),
      })) || []
    );
  }, [responseData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    state: { pageIndex, globalFilter },
    pageCount,
    gotoPage,
    setPageSize: setTablePageSize,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: dataWithSlno,
      initialState: { pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const formattedData = responseData.map((item, index) => ({
    "SL NO": index + 1,
    "USER NAME": item.Name,
    EMAIL: item.Email,
    PASSWORD: item.Password,
    "MEMBER ID": item.referralCode,
    RANK: item.Rank,
    "SPONSER ID": item.referredBy,
    "JOIN DATE": item.createdAt,
    ACTIVE: item.Active,
  }));

  const exportToExcel = () => {
    const sheetName = "Member_Report";
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const formattedData = responseData.map((item, index) => ({
      "SL NO": index + 1,
      RANK: item.Member,
      COMMISION: item.Commision,
      ACTIVE: item.Active,
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = { Sheets: { [sheetName]: ws }, SheetNames: [sheetName] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    saveAs(data, sheetName + fileExtension);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setTablePageSize(newSize);
  };

  const handleAddMember = async () => {
    // Trim values to remove accidental spaces
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedRank = rank;
    const trimmedPublicKey = publicKey.trim();

    // Basic Validations
    if (
      !trimmedName ||
      !trimmedEmail ||
      !trimmedPassword ||
      !selectedUser ||
      !trimmedRank ||
      !trimmedPublicKey
    ) {
      return Swal.fire({
        title: "Validation Error!",
        text: "All fields are required.",
        icon: "warning",
      });
    }

    // // Email Validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(trimmedEmail)) {
    //   return Swal.fire({
    //     title: "Validation Error!",
    //     text: "Invalid email format.",
    //     icon: "warning",
    //   });
    // }

    // // Password Validation (Min length 6)
    // if (trimmedPassword.length < 6) {
    //   return Swal.fire({
    //     title: "Validation Error!",
    //     text: "Password must be at least 6 characters long.",
    //     icon: "warning",
    //   });
    // }

    setApiloader(true);
    try {
      let res = await AddNewMemberApi({
        Name: trimmedName,
        Email: trimmedEmail,
        Password: trimmedPassword,
        referralCode: selectedUser?.referralCode,
        Rank: trimmedRank,
        PublicKey: trimmedPublicKey,
      });

      if (res.status) {
        Swal.fire({
          title: "Success!",
          text: "Member created successfully.",
          icon: "success",
        });
        setModalOpen(false);
        setName("");
        setEmail("");
        setPassword("");
        setReferralCode("");
        setRank("");
        setPublicKey("");
        setSelectedUser(null)
        fetchMemberData();
        FetchUsers()
      } else {
        Swal.fire({
          title: "Error!",
          text: res.message,
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again.",
        icon: "error",
      });
    } finally {
      setApiloader(false);
    }
  };

  const handleEditMember = async () => {

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const trimmedRank = rank;
    const trimmedPublicKey = publicKey.trim();

    if (
      !trimmedName ||
      !trimmedEmail ||
      !trimmedPassword ||
      !trimmedRank ||
      !trimmedPublicKey
    ) {
      return Swal.fire({
        title: "Validation Error!",
        text: "All fields are required.",
        icon: "warning",
      });
    }

    setApiloader(true);
    try {
      let res = await UpdateNewMemberApi(
        {
          Name: trimmedName,
          Email: trimmedEmail,
          Password: trimmedPassword,
          Rank: trimmedRank,
          PublicKey: trimmedPublicKey,
        },
        selectedMemberId
      );

      if (res.status) {
        Swal.fire({
          title: "Success!",
          text: "Member Updated successfully.",
          icon: "success",
        });

        setEditModalOpen(false);
        setName("");
        setEmail("");
        setPassword("");
        setReferralCode("");
        setRank("");
        setPublicKey("");
        fetchMemberData();
      } else {
        Swal.fire({
          title: "Error!",
          text: res.message,
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again.",
        icon: "error",
      });
    } finally {
      setApiloader(false);
    }
  };

  const handleDeleteMember = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setApiloader(true);
        try {
          let res = await DeleteMemberApi(id);
          if (res.status) {
            Swal.fire("Deleted!", "Member has been deleted.", "success");
            fetchMemberData();
            FetchUsers()
          } else {
            Swal.fire("ERROR!", res.message, "error");
          }
        } catch (error) {
          console.error(error);
        } finally {
          setApiloader(false);
        }
      } else {
        setApiloader(false);
      }
    });
  };

  const FetchUsers = async () => {
    try {
      let res = await GetAllUsers();
      if (res.status) {
        let newdata = res.data.map((item) => ({
          value: item?._id,
          label: `${item?.Name} - ${item?.referralCode || "N/A"}`,
          referralCode: item?.referralCode,
        }));
        setUsers(newdata);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const filterOption = (inputValue, option) => {
    return (
      inputValue.data.label.includes(option) ||
      inputValue.data.referralCode.includes(option)
    );
  };

  return (
    <React.Fragment>
      {apiloader && <Loader></Loader>}
      <Container style={{ padding: 20, marginTop: 10 }}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center">
            <h1 className="card-title" style={{ fontSize: "20px" }}>
              MANAGE MEMBER
            </h1>
            <Button color="primary" onClick={() => setModalOpen(true)}>
              ADD NEW MEMBER
            </Button>
          </CardHeader>
          <div className="container mt-4">
            <div className="rmb-2 row">
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value="10">SHOW 10</option>
                  <option value="20">SHOW 20</option>
                  <option value="30">SHOW 30</option>
                  <option value="40">SHOW 40</option>
                  <option value="50">SHOW 50</option>
                </select>
              </div>

              <div className="col-md-4">
                <div className="search-box me-xxl-2 my-3 my-xxl-0 d-inline-block">
                  <div className="position-relative">
                    <label htmlFor="search-bar-0" className="search-label">
                      <input
                        id="search-bar-0"
                        type="text"
                        className="form-control"
                        placeholder="SEARCH ..."
                        value={globalFilter || ""}
                        onChange={(e) =>
                          setGlobalFilter(e.target.value.toUpperCase())
                        }
                      />
                      <i className="bx bx-search-alt search-icon"></i>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex justify-content-end">
                  <Button
                    className="btn btn-secondary-subtle border border-secondary"
                    onClick={exportToExcel}
                  >
                    <FaFileExcel />
                    EXCEL
                  </Button>
                  <CSVLink data={formattedData} style={{ marginLeft: 10 }}>
                    <Button className="btn btn-secondary-subtle border border-secondary">
                      <FaFileCsv />
                      CSV
                    </Button>
                  </CSVLink>
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive react-table mt-4">
            <div className="table-responsive react-table mt-4">
              {loading ? (
                <Skeleton count={5} height={30} width="100%" />
              ) : (
                <table className="table table-bordered table-hover">
                  <thead className="table-light table-nowrap">
                    {headerGroups.map((headerGroup) => (
                      <tr
                        key={headerGroup.id}
                        {...headerGroup.getHeaderGroupProps()}
                      >
                        {headerGroup.headers.map((column) => (
                          <th
                            key={column.id}
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                            style={
                              column.id === "slno"
                                ? { width: "6%" }
                                : { backgroundColor: "" }
                            }
                          >
                            <div className="d-flex justify-content-between">
                              <span className="font-weight-bold">
                                {column.render("Header")}
                              </span>
                              <span>
                                {column.isSorted
                                  ? column.isSortedDesc
                                    ? " 🔽"
                                    : " 🔼"
                                  : ""}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {page.length > 0 ? (
                      page.map((row) => {
                        prepareRow(row);
                        return (
                          <tr key={row.id} {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                              <td key={cell.column.id} {...cell.getCellProps()}>
                                {cell.render("Cell")}
                              </td>
                            ))}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={headerGroups[0].headers.length}
                          style={{ textAlign: "center" }}
                        >
                          NO RESULTS FOUND
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              {pageCount === 0 ? (
                <p className="ps-2">Showing 0 of 0 pages</p>
              ) : (
                <p className="ps-2">
                  Showing {pageIndex + 1} of {pageCount} pages
                </p>
              )}
            </div>
            <div className="col-sm-6">
              <div className="pagination justify-content-end pb-2 pe-2">
                <button
                  className="btn btn-info"
                  disabled={pageIndex === 0}
                  onClick={() => gotoPage(0)}
                >
                  FIRST
                </button>
                <button
                  className="btn btn-primary"
                  style={{ marginLeft: 2 }}
                  disabled={!canPreviousPage}
                  onClick={previousPage}
                >
                  PRE
                </button>
                <span
                  style={{ marginLeft: 10, marginRight: 10 }}
                  className="btn btn-light"
                >
                  {pageIndex + 1}
                </span>
                <button
                  className="btn btn-primary"
                  disabled={!canNextPage}
                  onClick={nextPage}
                >
                  NEXT
                </button>
                <button
                  style={{ marginLeft: 2 }}
                  className="btn btn-info"
                  disabled={pageIndex >= pageCount - 1}
                  onClick={() => gotoPage(pageCount - 1)}
                >
                  LAST
                </button>
              </div>
            </div>
          </div>
        </Card>
      </Container>

      <Modal
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          Add New Member
        </ModalHeader>
        <ModalBody>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Name here"
          />
          <Input
            className="mt-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email here"
          />
          <Input
            className="mt-2"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password here"
          />
          <FormGroup>
            <Label className="fw-bold">
              Select User (Search by Name or Code)
            </Label>
            <Select
              options={users}
              value={selectedUser}
              onChange={(option) => setSelectedUser(option)}
              placeholder="Search by name or code..."
              className="fs-10"
              filterOption={filterOption}
              styles={{
                control: (base) => ({
                  ...base,
                  padding: "10px",
                  borderRadius: "5px",
                  fontSize: "1rem",
                  width: "100%",
                }),
              }}
            />
          </FormGroup>

          <Input
            className="mt-2"
            type="number"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            placeholder="Enter Rank here"
          />
          <Input
            className="mt-2"
            type="text"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="Enter Public Key here"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddMember}>
            Add Member
          </Button>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={editModalOpen}
        toggle={() => setEditModalOpen(!editModalOpen)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setEditModalOpen(!editModalOpen)}>
          Edit Member
        </ModalHeader>
        <ModalBody>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Name here"
          />
          <Input
            className="mt-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email here"
          />
          <Input
            className="mt-2"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password here"
          />

          <Input
            className="mt-2"
            type="number"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            placeholder="Enter Rank here"
          />
          <Input
            className="mt-2"
            type="text"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="Enter Public Key here"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleEditMember}>
            Update Member
          </Button>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default ManageMember;
