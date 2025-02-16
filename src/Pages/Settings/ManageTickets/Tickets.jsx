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
} from "reactstrap";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import { CSVLink } from "react-csv";
import { saveAs } from "file-saver";
import { FaFileExcel, FaFileCsv, FaTrash, FaEdit, FaEye } from "react-icons/fa";
import * as XLSX from "xlsx";

import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import Loader from "../../../Components/Loading/Loading";
import { GetAllTicket, ResolveTicketApi } from "../../../Api/Settings";

const TicketList = () => {
  const [responseData, setResponseData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [editTicket, setEditTicket] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [apiloader, setApiloader] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicketData();
  }, []);

  const fetchTicketData = async () => {
    try {
      const res = await GetAllTicket();
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
      { Header: "SL NO", accessor: "slno" },
      { Header: "TICKET NO", accessor: "ticketNo" },
      { Header: "CREATED BY", accessor: "createdBy.Name" },
      { Header: "CREATOR ID", accessor: "createdBy.referralCode" },
      { Header: "DATE", accessor: "createdAt" },
      { Header: "TITLE", accessor: "title" },
      { Header: "RESOLUTION", accessor: "remarks" },
      {
        Header: "STATUS",
        accessor: "status",
      },
      {
        Header: "ACTION",
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">
            <FaEdit
              onClick={() => {
                setSelectedTicketId(row.original._id);
                setEditModalOpen(true);
              }}
              style={{
                cursor: "pointer",
                margin: "0 10px",
                fontSize: "20px",
                color: "#007bff",
              }}
            />
            <FaEye
              onClick={() => {
                setDescription(row.original.description);
                setModalOpen(true);
              }}
              style={{
                cursor: "pointer",
                margin: "0 10px",
                fontSize: "20px",
                color: "green",
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
    "TICKET NO": item.Ticket,
    "CREATED BY": item.Commision,
    "CREATOR ID": item.Active,
    DATE: item?.createdAt,
    TITLE: item?.title,
    DESCRIPTION: item?.description,
    STATUS: item?.status,
  }));

  const exportToExcel = () => {
    const sheetName = "Ticket_Report";
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const formattedData = responseData.map((item, index) => ({
      "SL NO": index + 1,
      "TICKET NO": item.Ticket,
      "CREATED BY": item.Commision,
      "CREATOR ID": item.Active,
      DATE: item?.createdAt,
      TITLE: item?.title,
      DESCRIPTION: item?.description,
      STATUS: item?.status,
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

  const handleEditTicket = async () => {
    if (!editTicket) {
      Swal.fire("ERROR!", "Ticket content is required", "error");
      return;
    }
    setApiloader(true);
    try {
      let res = await ResolveTicketApi(
        {
          remarks: editTicket,
        },
        selectedTicketId
      );
      if (res.status) {
        Swal.fire("Success!", "Ticket Updated successfully", "success");
        setEditModalOpen(false);
        setEditTicket("");
        fetchTicketData();
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
              TICKET LIST
            </h1>
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
          Ticket Details
        </ModalHeader>
        <ModalBody>
          <p>{description}</p>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={editModalOpen}
        toggle={() => setEditModalOpen(!editModalOpen)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setEditModalOpen(!editModalOpen)}>
          Resolve Ticket
        </ModalHeader>
        <ModalBody>
          <Input
            type="textarea"
            value={editTicket}
            onChange={(e) => setEditTicket(e.target.value)}
            placeholder="Resolution Remarks"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleEditTicket}>
            Resolve Ticket
          </Button>
          <Button color="secondary" onClick={() => setEditModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default TicketList;
