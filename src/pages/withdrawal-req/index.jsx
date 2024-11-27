import React, { useState } from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

import Table from "@/components/table/Table";
import {
    getKYCData,
    getKYCMetrics,
    manageKYC,
} from "@/services/api/kycService";

import { canEdit, downloadFile, isRequired } from "@/utils/helpers";
import usePagination from "@/hooks/usePagination";
import { abandonedKycColumns, submittedKycColumns, withdrawalRequestsColumns } from "@/config/tableConfig";
import useTableSorting from "@/hooks/useTableSort";
import useSearch from "@/hooks/useSearch";
import {
    getSubmittedKycDropdownItems,
    getAbandonedKycDropdownItems,
    getWithdrawalRequestsDropdownItems,
} from "@/config/dropdownConfig";
import { getWithdrawalRequest } from "@/services/api/withdrawalRequestService";

export default function Kyc() {
    const [withdrawalRequests, setWithdrawalRequests] = React.useState([]);
    const [totalPages, setTotalPages] = React.useState(0);
    const [values, setValues] = React.useState(null);
    const [verificationData, setVerificationData] = React.useState({
        type: null,
        userId: null,
        csdNo: "",
    });

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const { sortField, sortOrder, handleSort } = useTableSorting();
    const { searchValue, onSearch } = useSearch();
    const [status, setStatus] = React.useState('')
    const { limit, page, handleLimitChange, handlePageChange } = usePagination();
    const fetchWithdrawalRequests = async (startDate = "", endDate = "") => {
        try {
            const payload = {
                value: searchValue,
                page: page,
                limit: limit,
                status:status,
                startDate: startDate,
                endDate: endDate,
            };

            const result = await getWithdrawalRequest(payload);
            setWithdrawalRequests(result.data.results);
            console.log("WR",result.data)
        } catch (error) {
            // Handle any errors that may occur during the API call
            setError(error);
            console.error("Error fetching withdrawal requests:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        setLoading(true);
        if (values) {
            fetchWithdrawalRequests(values[0], values[1]);
            return;
          }
        fetchWithdrawalRequests();
    }, [limit, page, searchValue, values, status]);



    const breadCrumbItems = [
        { name: "Home", link: "/" },
        { name: "Withdrawals" },
    ];


    return (
        <div className="flex flex-col gap-6">

            <Breadcrumb items={breadCrumbItems} />
            <div className="flex flex-col gap-6">

                <Table
                    searchBar
                    datePicker
                    exportToCSV
                    columns={withdrawalRequestsColumns()}
                    data={withdrawalRequests}
                    isDropdown={canEdit("Withdrawal")}
                    dropdownItems={(row) =>
                        getWithdrawalRequestsDropdownItems({ row })

                    }
                    filter
                    isLoading={loading}
                    onFilter={(item)=>setStatus(item.toLowerCase())}
                    paginationProps={{
                        currentPage: page,
                        totalPages,
                        onPageChange: handlePageChange,
                    }}
                    limitProps={{
                        selectedLimit: limit,
                        onLimitChange: handleLimitChange,
                    }}
                    searchValue={searchValue}
                    onSearch={onSearch}
                    dateValue={values}
                    dateOnChange={setValues}
                />
            </div>
        </div>
    );
}
