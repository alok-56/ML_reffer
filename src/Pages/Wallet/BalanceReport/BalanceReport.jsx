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
import Skeleton from "react-loading-skeleton";
import { GetAllUsers } from "../../../Api/Auth";
import { GetBalanceReport } from "../../../Api/Wallet";

const BalanceReport = () => {
  const [responseData, setResponseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    FetchTransaction();
  }, []);

  const FetchTransaction = async () => {
    try {
      setLoading(true);
      let res = await GetBalanceReport();
      if (res.status) {
        setResponseData(res.data);
        setFilteredData(res.data);
      } else {
        setResponseData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterDataByDate = () => {
    if (!startDate || !endDate) {
      setFilteredData(responseData);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const filtered = responseData.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= start && itemDate <= end;
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    filterDataByDate();
  }, [startDate, endDate, responseData]);

  const columns = useMemo(
    () => [
      { Header: "SL NO", accessor: "slno" },
      { Header: "USER NAME", accessor: "user.Name" },
      { Header: "MEMBER ID", accessor: "user.referralCode" },
      {
        Header: "TOTAL CREDIT",
        accessor: "totalCredit",
        Cell: ({ value }) => value.toFixed(2),
      },
      {
        Header: "TOTAL EARNED",
        accessor: "totalTransferred",
        Cell: ({ value }) => value.toFixed(2),
      },
      {
        Header: "TOTAL DUE",
        accessor: "totalPaid",
        Cell: ({ value }) => value.toFixed(2),
      },
      {
        Header: "TOTAL BALANCE",
        accessor: "totalBalance",
        Cell: ({ row }) => {
          const totalBalance = (
            row.original.totalCredit + row.original.totalTransferred
          ).toFixed(2);
          return totalBalance;
        },
      },
    ],
    []
  );

  const dataWithSlno = useMemo(() => {
    return (
      filteredData?.map((item, index) => ({
        ...item,
        slno: index + 1,
        createdAt: new Date(item.createdAt).toLocaleDateString(),
      })) || []
    );
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
    "USER NAME": item?.Name || "NA",
    "MEMBER ID": item?.referralCode || "NA",
    "TOTAL CREDIT": item.totalCredit?.toFixed(2) || "0.00",
    "TOTAL EARNED": item.totalTransferred?.toFixed(2) || "0.00",
    "TOTAL DUE": item.totalPaid?.toFixed(2) || "0.00",
    "TOTAL BALANCE": (
      (item.totalCredit || 0) + (item.totalTransferred || 0)
    ).toFixed(2),
  }));

  const exportToExcel = () => {
    const sheetName = "Balance_Report";
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
              BALANCE REPORT
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
                <div className="search-box w-100">
                  <div>
                    <label
                      htmlFor="search-bar-0"
                      className="search-label w-100"
                    >
                      <input
                        id="search-bar-0"
                        type="text"
                        className="form-control w-100"
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

              {/* <div className="col-md-3">
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
              </div> */}
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

export default BalanceReport;
