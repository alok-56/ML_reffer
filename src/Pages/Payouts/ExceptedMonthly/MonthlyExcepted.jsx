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
import {
  GetCommisionDetails,
  GetExceptedMonthlyDetails,
} from "../../../Api/Payout";

const MonthlyExcepted = () => {
  const [responseData, setResponseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Fetch Data from API
  const FetchTransaction = async () => {
    try {
      setLoading(true);
      if (!selectedMonth || !selectedYear) return;

      let res = await GetExceptedMonthlyDetails(
        Number(selectedMonth),
        Number(selectedYear)
      );

      if (res.status) {
        setResponseData(res.data);
        setFilteredData(res.data);
      } else {
        setResponseData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchTransaction();
  }, [selectedMonth, selectedYear]);

  // Month Names for Dropdown
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Table Columns
  const columns = useMemo(
    () => [
      { Header: "SL NO", accessor: "slno" },
      { Header: "USER NAME", accessor: "UserId.name" },
      { Header: "MEMBER ID", accessor: "UserId.code" },
      { Header: "RANK", accessor: "UserId.Rank" },
      {
        Header: "MONTH",
        accessor: "month",
        Cell: ({ value }) => monthNames[value - 1] || "NA",
      },
      { Header: "YEAR", accessor: "year" },
      { Header: "EARNING", accessor: "multipliedCommision" },
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
    "USER NAME": item?.UserId?.name || "NA",
    "MEMBER ID": item?.UserId?.code || "NA",
    RANK: item?.UserId?.Rank || "NA",
    MONTH: monthNames[item?.month - 1] || "NA",
    YEAR: item?.year || "NA",
    EARNING: item?.multipliedCommision || "NA",
  }));

  const exportToExcel = () => {
    const sheetName = "Excepted_Earning_report";
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

  const handleMonthFilterChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedMonth(selectedValue);
    filterDataByMonth(selectedValue);
  };

  return (
    <React.Fragment>
      <Container style={{ padding: 20, marginTop: 10 }}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center">
            <h1 className="card-title" style={{ fontSize: "20px" }}>
              COMMISION LIST
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

              <div className="col-md-3">
                <select
                  className="form-select"
                  value={selectedMonth}
                  onChange={handleMonthFilterChange}
                >
                  <option value="">Select Month</option>
                  {monthNames.map((month, index) => (
                    <option key={index} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <select
                  className="form-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">Select Year</option>
                  {[2023, 2024, 2025, 2026].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
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

export default MonthlyExcepted;
