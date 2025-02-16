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
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useParams } from "react-router";
import Skeleton from "react-loading-skeleton";
import {
  GenerateVoucherApi,
  GetExceptedMonthlyDetails,
  TransferMoneyApi,
} from "../../../Api/Payout";
import { GetWalletTransaction } from "../../../Api/Wallet";
import Loader from "../../../Components/Loading/Loading";
import Swal from "sweetalert2";

const GenerateVoucher = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [apiloader, setApiloader] = useState(false);

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

  const handleMonthFilterChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedMonth(selectedValue);
    filterDataByMonth(selectedValue);
  };

  const GenerateVoucher = async () => {
    if (!selectedMonth) {
      Swal.fire("ERROR!", "Month is required", "error");
      return;
    } else if (!selectedYear) {
      Swal.fire("ERROR!", "Year is required", "error");
      return;
    }
    Swal.fire({
      title: "Are you sure To Generate Voucher?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Generate it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setApiloader(true);
        try {
          let res = await GenerateVoucherApi({
            month: selectedMonth,
            year: selectedYear,
          });
          if (res.status) {
            Swal.fire(
              "Voucher Generate Success!",
              "Voucher Has been generated.",
              "success"
            );
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

  return (
    <React.Fragment>
      {apiloader && <Loader></Loader>}
      <Container style={{ padding: 20, marginTop: 10 }}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center">
            <h1 className="card-title" style={{ fontSize: "20px" }}>
              GENERATE VOUCHER
            </h1>
          </CardHeader>
          <div className="container mt-4" style={{ marginBottom: 20 }}>
            <div className="rmb-2 row">
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
              <div className="col-md-3">
                <Button
                  onClick={GenerateVoucher}
                  style={{ width: 200 }}
                  color="primary"
                >
                  Generate
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </React.Fragment>
  );
};

export default GenerateVoucher;
