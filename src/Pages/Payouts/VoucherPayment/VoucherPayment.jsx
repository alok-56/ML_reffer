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
import { FaFileExcel, FaFileCsv, FaEdit, FaEthereum } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useParams } from "react-router";
import Skeleton from "react-loading-skeleton";
import {
  GetExceptedMonthlyDetails,
  TransferMoneyApi,
} from "../../../Api/Payout";
import { GetWalletTransaction } from "../../../Api/Wallet";
import Loader from "../../../Components/Loading/Loading";
import Swal from "sweetalert2";
import MetaMaskApp from "../../metamask";

const VoucherPayment = () => {
  const [responseData, setResponseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [apiloader, setApiloader] = useState(false);
  const [meta, setMeta] = useState(false)
  const [amount, setAmount] = useState("")
  const [selectedId, setSelectedId] = useState("")
  const [publics, setPulic] = useState("")


  // Fetch Data from API
  const FetchTransaction = async (selectedMonth, selectedYear) => {
    try {
      setLoading(true);
      if (!selectedMonth || !selectedYear) return;
      const query = `?status=Paid&month=${selectedMonth}&year=${selectedYear}`;
      let res = await GetWalletTransaction(query);

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
    FetchTransaction(selectedMonth, selectedYear);
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
      { Header: "USER NAME", accessor: "UserId.Name" },
      { Header: "MEMBER ID", accessor: "UserId.referralCode" },
      {
        Header: "MONTH",
        accessor: "month",
        Cell: ({ value }) => monthNames[value - 1] || "NA",
      },
      { Header: "YEAR", accessor: "Year" },
      { Header: "AMOUNT", accessor: "amount" },
      {
        Header: "DATE",
        accessor: "createdAt",
      },
      {
        Header: "STATUS",
        accessor: "status",
        Cell: ({ value }) => {
          return "Due"
        },
      },
      {
        Header: "ACTION",
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">
            <FaEdit
              onClick={() => {
                HandleTranfer(row.original._id);
              }}
              style={{
                cursor: "pointer",
                margin: "0 10px",
                fontSize: "20px",
                color: "#007bff",
              }}
            />
            <FaEthereum
              onClick={() => {
                setSelectedId(row.original._id)
                setPulic(row.original.PublicKey)
                setAmount(row.original.amount)
                setMeta(true)
              }}
              style={{
                cursor: "pointer",
                margin: "0 10px",
                fontSize: "20px",
                color: "#007bff",
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
    "USER NAME": item?.UserId?.Name || "NA",
    "MEMBER ID": item?.UserId?.referralCode || "NA",
    MONTH: monthNames[item?.month - 1] || "NA",
    YEAR: item?.Year || "NA",
    AMOUNT: item?.amount || "NA",
    STATUS: "Due" || "NA",
  }));

  const exportToExcel = () => {
    const sheetName = "Voucher_report";
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
  };

  const HandleTranfer = async (id) => {
    Swal.fire({
      title: "Are you sure To Transfer?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Transfer it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setApiloader(true);
        try {
          let res = await TransferMoneyApi(id);
          if (res.status) {
            Swal.fire(
              "Transfer Success!",
              "Money has been Transfered.",
              "success"
            );
            setSelectedId("")
            setPulic("")
            setAmount("")
            setMeta(false)
            await FetchTransaction(selectedMonth, selectedYear);
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

  const HandleUpdate = async (hash) => {
    setMeta(false)
    setApiloader(true);
    try {
      let res = await TransferMoneyApi(selectedId);
      if (res.status) {
        Swal.fire(
          "Transfer Success!",
          "Money has been Transfered.",
          "success"
        );
        setSelectedId("")
        setPulic("")
        setAmount("")
        setMeta(false)
        await FetchTransaction(selectedMonth, selectedYear);
      } else {
        Swal.fire("ERROR!", res.message, "error");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setApiloader(false);
    }


  };

  return (
    <React.Fragment>
      {apiloader && <Loader></Loader>}
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
                  {[2023, 2024, 2025, 2026, 2027, 2028, 2029, 3000].map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  )}
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

      <MetaMaskApp publicAddress={publics} HandleUpdate={HandleUpdate} chanepublic={(e) => setPulic(e.target.value)} amount={amount} isvisible={meta} onClose={() => setMeta(false)}></MetaMaskApp>


    </React.Fragment>
  );
};

export default VoucherPayment;
