import Login from "../Pages/Auth/Login/Login";
import Transaction from "../Pages/Bussiness/Transaction";
import Home from "../Pages/Home/Home";
import LivelWiseTeam from "../Pages/Member/LevelWiseTeam/LivelWiseTeam";
import ManageMember from "../Pages/Member/Managemember/Managemember";
import SponserScreen from "../Pages/Member/SponosorTeam/SponserScreen";
import Withdrawals from "../Pages/Member/Withdrawals/Withdrawals";
import CommisionDetails from "../Pages/Payouts/CommisionDetails/CommisionDetails";
import DirectPayout from "../Pages/Payouts/DirectPayout/DirectPayout";
import MonthlyExcepted from "../Pages/Payouts/ExceptedMonthly/MonthlyExcepted";
import GenerateVoucher from "../Pages/Payouts/GenerateVoucher/GenerateVoucher";
import VoucherPayment from "../Pages/Payouts/VoucherPayment/VoucherPayment";
import Profile from "../Pages/Profile";
import TicketList from "../Pages/Settings/ManageTickets/Tickets";
import News from "../Pages/Settings/MemberNews/News";
import Rank from "../Pages/Settings/Rank/Rank";

import BalanceReport from "../Pages/Wallet/BalanceReport/BalanceReport";
import AddFund from "../Pages/Wallet/FundAdd/AddFund";
import WalletPaid from "../Pages/Wallet/WalletPaid/WalletPaid";
import WalletPrincipal from "../Pages/Wallet/WalletPrincipal/WalletPrincipal";
import WalletTransaction from "../Pages/Wallet/WalletTransaction/WalletTransaction";
import WalletTransfer from "../Pages/Wallet/WalletTransfer/WalletTransfer";


const AppRoute = [
  {
    name: "Login",
    Component: Login,
    route: "/login",
    private: false,
  },
  {
    name: "Home",
    Component: Home,
    route: "/",
    private: true,
  },
  {
    name: "bussiness",
    Component: Transaction,
    route: "/transaction",
    private: true,
  },
  {
    name: "Rank",
    Component: Rank,
    route: "/setting/ranks",
    private: true,
  },
  {
    name: "News",
    Component: News,
    route: "/setting/news",
    private: true,
  },
  {
    name: "Tickets",
    Component: TicketList,
    route: "/setting/ticket",
    private: true,
  },
  {
    name: "Add Fund",
    Component: AddFund,
    route: "/wallet/addfund",
    private: true,
  },
  {
    name: "Wallet Balance",
    Component: BalanceReport,
    route: "/wallet/balance",
    private: true,
  },
  {
    name: "Wallet Transaction",
    Component: WalletTransaction,
    route: "/wallet/transaction",
    private: true,
  },
  {
    name: "Wallet Paid",
    Component: WalletPaid,
    route: "/wallet/paid",
    private: true,
  },
  {
    name: "Wallet Paid",
    Component: WalletTransfer,
    route: "/wallet/transfer",
    private: true,
  },
  {
    name: "Payout Commision",
    Component: CommisionDetails,
    route: "/Payout/commision/details",
    private: true,
  },
  {
    name: "Payout Excepted",
    Component: MonthlyExcepted,
    route: "/Payout/Excepted/monthly/income",
    private: true,
  },
  {
    name: "Payout Payment",
    Component: VoucherPayment,
    route: "/Payout/voucher/list",
    private: true,
  },
  {
    name: "Payout Voucher generate",
    Component: GenerateVoucher,
    route: "/Payout/voucher/generate",
    private: true,
  },
  {
    name: "Wallet Principal ",
    Component: WalletPrincipal,
    route: "/wallet/prinicipal/wallet",
    private: true,
  },
  {
    name: "Member Manage",
    Component: ManageMember,
    route: "/member/managemember",
    private: true,
  },
  {
    name: "Member Level",
    Component: LivelWiseTeam,
    route: "/member/LevelWiseTeam",
    private: true,
  },
  {
    name: "Member withdrawal",
    Component: Withdrawals,
    route: "/member/withdraw",
    private: true,
  },
  {
    name: "Member Sponsser",
    Component: SponserScreen,
    route: "/member/SponserTeam",
    private: true,
  },
  {
    name: "Profile",
    Component: Profile,
    route: "/profile",
    private: true,
  },
  {
    name: "Direct payout",
    Component: DirectPayout,
    route: "/direct/Payout",
    private: true,
  },
];

export default AppRoute;
