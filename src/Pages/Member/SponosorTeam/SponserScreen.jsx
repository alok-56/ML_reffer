import React, { useMemo, useState, useEffect } from "react";
import { Container, Button, Card, CardHeader } from "reactstrap";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import { CSVLink } from "react-csv";
import { saveAs } from "file-saver";
import { FaFileExcel, FaFileCsv, FaEdit } from "react-icons/fa";
import { useParams } from "react-router";
import Skeleton from "react-loading-skeleton";
import {
  GetWalletTransaction
} from "../../../Api/Wallet";
import Loader from "../../../Components/Loading/Loading";
import Swal from "sweetalert2";
import { GetAllUsers } from "../../../Api/Auth";
import { SponserTeam } from "../../../Api/Member";

const SponserScreen = () => {
  const [responseData, setResponseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [apiloader, setApiloader] = useState(false);
  const [users, setUsers] = useState([])



  useEffect(() => {
    FetchUsers();
  }, []);

  const FetchUsers = async () => {
    try {
      let res = await GetAllUsers();
      console.log(res)
      if (res.status) {
        setUsers(res.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const FetchTransaction = async () => {
    try {
      setLoading(true);
      let res = await SponserTeam(selectedUser, startDate, endDate);
      if (res.status) {
        setResponseData(res.data);
      } else {
        setResponseData([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  // Table Columns
  const columns = useMemo(
    () => [
      { Header: "SL NO", accessor: "slno" },
      { Header: "USER NAME", accessor: "Name" },
      { Header: "MEMBER ID", accessor: "referralCode" },
      {
        Header: "RANK",
        accessor: "Rank",
      },
      { Header: "BALANCE", accessor: "balance" },
      {
        Header: "JOIN DATE",
        accessor: "createdAt",
      }
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
    "USER NAME": item?.Name || "NA",
    "MEMBER ID": item?.referralCode || "NA",
    RANK: item?.Rank || "NA",
    BALANCE: item?.balance || "NA",
    "JOIN DATE": item?.createdAt || "NA",
  }));

  const exportToExcel = () => {
    const sheetName = "Voucher_Payment_report";
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = { Sheets: { [sheetName]: ws }, SheetNames: [sheetName] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    saveAs(data, sheetName + fileExtension);
  };

  return (
    <React.Fragment>
      {apiloader && <Loader />}
      <Container style={{ padding: 20, marginTop: 10 }}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center">
            <h1 className="card-title" style={{ fontSize: "20px" }}>
              VOUCHER PAYMENT LIST
            </h1>
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
          </CardHeader>

          <div className="container mt-4">
            <div className="rmb-2 row">
              {/* User Dropdown */}
              <div className="col-md-3">
                <div className="search-box w-100">
                  <div>
                    <select
                      className="form-select"
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                    >
                      <option value="">Select User</option>
                      {users && users.map((user) => (
                        <option key={user._id} value={user.referralCode}>
                          {user.Name} ({user.referralCode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Date Range Filters */}
              <div className="col-md-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <label>Start Date</label>
                  </span>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <label>End Date</label>
                  </span>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-3">
                <Button
                  className="btn btn-primary"
                  onClick={() => FetchTransaction()}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>

          {/* Table Section with Skeleton Loader */}
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

          {/* Pagination */}
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
    </React.Fragment>
  );
};

export default SponserScreen;
