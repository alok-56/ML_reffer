import React, { useMemo, useState, useEffect } from "react";
import { Container, Button, Card, CardHeader, Modal, ModalHeader, ModalBody, FormGroup, Label, Input, ModalFooter } from "reactstrap";
import {
    useTable,
    useSortBy,
    usePagination,
    useGlobalFilter,
} from "react-table";
import { CSVLink } from "react-csv";
import { saveAs } from "file-saver";
import { FaFileExcel, FaFileCsv, FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useParams } from "react-router";
import Skeleton from "react-loading-skeleton";
import {
    GenerateDirectPayoutApi,
    GetDirectPayoutApi,
    GetExceptedMonthlyDetails,
    TransferMoneyApi,
} from "../../../Api/Payout";
import { GetWalletTransaction } from "../../../Api/Wallet";
import Loader from "../../../Components/Loading/Loading";
import Swal from "sweetalert2";
import Select from "react-select";
import { GetAllUsers } from "../../../Api/Auth";

const DirectPayout = () => {
    const [responseData, setResponseData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [apiloader, setApiloader] = useState(false);
    const [amount, setAmount] = useState("")
    const [selectedUser, setSelectedUser] = useState("")
    const [modalOpen, setModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [type, setType] = useState("")
    const [publicurl, setPublicurl] = useState("")
    const [connected, setConnected] = useState(false)

    // Fetch Data from API
    const FetchTransaction = async () => {
        try {
            setLoading(true);
            let res = await GetDirectPayoutApi();
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
        FetchUsers()

    }, []);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.request({ method: "eth_accounts" })
                .then((accounts) => {
                    if (accounts.length > 0) {
                        accountChangeHandler(true)
                    } else {
                        accountChangeHandler(false)
                    }
                })
                .catch(err => Swal.fire("Error", err.message, "error"));
        }
    }, [])

    const accountChangeHandler = (status) => {
        setConnected(status)
    };


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
            }
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
        AMOUNT: item?.amount || "NA"
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
        filterDataByMonthAndYear(selectedValue, selectedYear);
    };

    const handleYearFilterChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedYear(selectedValue);
        filterDataByMonthAndYear(selectedMonth, selectedValue);
    };

    const filterDataByMonthAndYear = (month, year) => {
        const filtered = responseData.filter((item) => {
            const isMonthMatch = month ? item.month === parseInt(month) : true;
            const isYearMatch = year ? item.Year === parseInt(year) : true;
            return isMonthMatch && isYearMatch;
        });
        setFilteredData(filtered);
    };

    const sendTransaction = async () => {
        // Ensure MetaMask is available
        if (!window.ethereum) {
            Swal.fire('MetaMask not found!', 'Please install MetaMask.', 'warning');
            return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (!accounts || accounts.length === 0) {
            Swal.fire('MetaMask not connected!', 'Please connect your MetaMask wallet.', 'warning');
            return;
        }

        const connectedAddress = accounts[0];

        // Now proceed with the transaction
        if (window.ethereum && connectedAddress) {
            if (!amount) {
                Swal.fire('Error!', `Amount is required`, 'error');
                return;
            }
            if (!publicurl) {
                Swal.fire('Error!', `Receiver Address is required`, 'error');
                return;
            }

            if (publicurl === connectedAddress) {
                Swal.fire('Error!', `Sender Address and receiver address are the same`, 'error');
                return;
            }
            try {
                const ethToUsdRate = 1500;
                const ethAmount = amount / ethToUsdRate;
                const value = (ethAmount?.toFixed(5) * Math.pow(10, 18)).toString(16);

                const tx = {
                    from: connectedAddress,
                    to: publicurl,
                    value: value,
                    gasLimit: '0x5208',
                    gasPrice: '0x5208',
                };


                const txHash = await window.ethereum.request({
                    method: "eth_sendTransaction",
                    params: [tx],
                });

                return true
            } catch (error) {
                console.log(error)
                Swal.fire('Error!', `Transaction failed: ${error}`, 'error');
                return false
            }
        }
    };

    const HandleTranfer = async () => {
        if (!selectedUser) {
            Swal.fire("ERROR!", "User is required", "error");
            return
        } else if (!amount) {
            Swal.fire("ERROR!", "Amount is required", "error");
            return
        }
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
                if (type === "cash") {
                    try {
                        let res = await GenerateDirectPayoutApi({
                            amount: amount,
                            UserId: selectedUser.value,
                        });
                        if (res.status) {
                            Swal.fire(
                                "Transfer Success!",
                                "Money has been Transfered.",
                                "success"
                            );
                            setSelectedUser("")
                            setAmount("")
                            setPublicurl("")
                            setType("")
                            setModalOpen(false)
                            FetchTransaction();
                        } else {
                            Swal.fire("ERROR!", res.message, "error");
                        }
                    } catch (error) {
                        console.error(error);
                    } finally {
                        setApiloader(false);
                    }
                } else {
                    let apiresponse = await sendTransaction()
                    if (apiresponse) {
                        try {
                            let res = await GenerateDirectPayoutApi({
                                amount: amount,
                                UserId: selectedUser.value,
                            });
                            if (res.status) {
                                Swal.fire(
                                    "Transfer Success!",
                                    "Money has been Transfered.",
                                    "success"
                                );
                                setSelectedUser("")
                                setAmount("")
                                setPublicurl("")
                                setType("")
                                setModalOpen(false)
                                FetchTransaction();
                            } else {
                                Swal.fire("ERROR!", res.message, "error");
                            }
                        } catch (error) {
                            console.error(error);
                        } finally {
                            setApiloader(false);
                        }
                    } else {
                        Swal.fire("ERROR!", "Transaction failed", "error");
                        setApiloader(false);
                    }
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
                    publicurl: item.PublicKey || publicurl
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

    const totalAmount = useMemo(() => {
        return page
            .reduce(
                (sum, { original }) => sum + (parseFloat(original.amount) || 0),
                0
            )
            .toFixed(2);
    }, [page]);



    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                Swal.fire("Success!", "Connected to MetaMask", "success");
                accountChangeHandler(true)
                return accounts[0]
            } catch (err) {
                Swal.fire("Error!", err.message, "error");
            } finally {

            }
        } else {
            Swal.fire("Info", "Please install MetaMask extension!", "info");
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
                                    onChange={handleYearFilterChange}
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
                            <div className="col-12 mt-3">
                                <Button
                                    color="primary"
                                    onClick={() => setModalOpen(true)}
                                >
                                    Transfer Money
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
                    <div className="col-sm-6">
                        <p className="ps-2 font-weight-bold fs-3">
                            Total Amount: <span className="text-success">{totalAmount}</span>
                        </p>
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
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ margin: 0 }}>Add Direct Amount</p>
                        {
                            !connected && <Button style={{ marginLeft: 100 }} color="primary" onClick={connectWallet}>
                                Connect to Wallet
                            </Button>
                        }


                    </div>
                </ModalHeader>
                <ModalBody>

                    <FormGroup>
                        <Label className="fw-bold">
                            Select User (Search by Name or Code)
                        </Label>
                        <Select
                            options={users}
                            value={selectedUser}
                            onChange={(option) => {
                                setSelectedUser(option),
                                    setPublicurl(option.publicurl)
                            }}
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
                    <div >
                        <select
                            className="form-select"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="">Select Transaction Method</option>
                            <option value="cash">By Cash</option>
                            <option value="metamask">By Metamask</option>

                        </select>
                    </div>

                    {
                        type === "metamask" && <Input
                            className="mt-3"
                            type="textarea"
                            value={publicurl}
                            onChange={(e) => setPublicurl(e.target.value)}
                            placeholder="Enter Metamask address"
                        />
                    }

                    <Input
                        className="mt-3"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter Amount here"
                    />

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={HandleTranfer}>
                        Add Amount
                    </Button>
                    <Button color="secondary" onClick={() => setModalOpen(false)}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </React.Fragment>
    );
};

export default DirectPayout;
