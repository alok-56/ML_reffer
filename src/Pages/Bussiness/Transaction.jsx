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
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useParams } from "react-router";
import { GetAllTransaction } from "../../Api/Settings";
import Skeleton from "react-loading-skeleton";

const Transaction = () => {
  const [responseData, setResponseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    FetchTransaction();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [startDate, endDate, selectedMonth, selectedYear, responseData]);

  const FetchTransaction = async () => {
    try {
      setLoading(true);
      let res = await GetAllTransaction();
      if (res.status) {
        setResponseData(res.data);
      } else {
        setResponseData([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = responseData;

    if (startDate) {
      filtered = filtered.filter(
        (item) => new Date(item.createdAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (item) => new Date(item.createdAt) <= new Date(endDate)
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter(
        (item) =>
          new Date(item.createdAt).getMonth() + 1 === Number(selectedMonth)
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (item) =>
          new Date(item.createdAt).getFullYear() === Number(selectedYear)
      );
    }

    setFilteredData(filtered);
  };

  const columns = useMemo(
    () => [
      { Header: "SL NO", accessor: "slno" },
      { Header: "USER NAME", accessor: "UserId.Name" },
      { Header: "MEMBER ID", accessor: "UserId.referralCode" },
      { Header: "TRANSACTION TYPE", accessor: "type" },
      { Header: "AMOUNT", accessor: "amount" },
      { Header: "DATE", accessor: "createdAt" },
      { Header: "STATUS", accessor: "status" },
    ],
    []
  );

  const dataWithSlno = useMemo(() => {
    return filteredData.map((item, index) => ({
      ...item,
      slno: index + 1,
      createdAt: new Date(item.createdAt).toLocaleDateString(),
    }));
  }, [filteredData]);

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
    "USER NAME": item.UserId?.Name || "NA",
    "TRANSACTION TYPE": item.type || "NA",
    AMOUNT: item.amount || "NA",
    BALANCE: item.Balance || "NA",
    DATE: item.createdAt || "NA",
    STATUS: item.status || "NA",
  }));

  const exportToExcel = () => {
    const sheetName = "Transaction_Report";
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

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

  return (
    <React.Fragment>
      <Container style={{ padding: 20, marginTop: 10 }}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center">
            <h1 className="card-title" style={{ fontSize: "20px" }}>
              BUSINESS TRANSACTION
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
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  {" "}
                  <option value="10">SHOW 10</option>
                  <option value="20">SHOW 20</option>
                  <option value="30">SHOW 30</option>
                  <option value="40">SHOW 40</option>
                  <option value="50">SHOW 50</option>
                </select>
              </div>

              <div className="col-md-3">
                <div className="search-box me-xxl-2 my-3 my-xxl-0 d-inline-block">
                  <div className="position-relative">
                    <label htmlFor="search-bar-0" className="search-label">
                      <input
                        style={{ width: 270 }}
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
                    <label>Start Date</label>
                  </span>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <label>Select Month</label>
                  </span>
                  <select
                    className="form-select"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="">Select Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString("en", { month: "long" })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3 mt-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <label>Select Year</label>
                  </span>
                  <select
                    className="form-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
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

export default Transaction;
