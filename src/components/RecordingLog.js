import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import { toast } from 'react-toastify';
import { recordingLogService } from '../services/api';
import { formatDate, formatDateInput, getStatusDisplay, htmlEncode } from '../utils/helpers';
import FailureModal from './FailureModal';
import './RecordingLog.css';

const RecordingLog = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(formatDateInput(moment().subtract(7, 'days')));
    const [endDate, setEndDate] = useState(formatDateInput(moment()));
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({ calabrioId: '', failureMessage: '' });

    // Fetch data on component mount
    useEffect(() => {
        fetchRecordingLogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchRecordingLogs = async (start = startDate, end = endDate) => {
        setLoading(true);
        try {
            const result = await recordingLogService.getRecordingLogs(start, end);
            setData(Array.isArray(result) ? result : []);
        } catch (error) {
            toast.error('Failed to load recording logs');
            console.error('Error fetching logs:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!startDate || !endDate) {
            toast.warning('Please select both start and end dates');
            return;
        }
        fetchRecordingLogs(startDate, endDate);
    };

    const handleRefresh = () => {
        fetchRecordingLogs();
        toast.success('Recording log table data refreshed.');
    };

    const columns = useMemo(
        () => [
            {
                name: 'Task ID',
                selector: (row) => row.TaskId,
                sortable: true,
                minWidth: '120px',
            },
            {
                name: 'Form Name',
                selector: (row) => row.FormName,
                sortable: true,
                minWidth: '180px',
                wrap: true,
            },
            {
                name: 'Program',
                selector: (row) => row.Program,
                sortable: true,
                minWidth: '120px',
            },
            {
                name: 'Case Number',
                selector: (row) => row.CaseNumber,
                sortable: true,
                minWidth: '130px',
            },
            {
                name: 'Application Number',
                selector: (row) => row.AppNumber,
                sortable: true,
                minWidth: '150px',
            },
            {
                name: 'Documentum ID',
                selector: (row) => row.DocumentumID,
                sortable: true,
                minWidth: '150px',
            },
            {
                name: 'Uploaded On',
                selector: (row) => row.UploadedOn,
                sortable: true,
                format: (row) => formatDate(row.UploadedOn),
                minWidth: '180px',
            },
            {
                name: 'Status',
                cell: (row) =>
                    getStatusDisplay(
                        row.Status,
                        row.TaskId,
                    ),
                minWidth: '150px',
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const customStyles = {
        table: {
            style: {
                marginTop: '10px',
            },
        },
        headRow: {
            style: {
                backgroundColor: '#f8f9fa',
                fontWeight: 'bold',
                fontSize: '14px',
            },
        },
    };

    return (
        <div id="rec-container" className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="panel panel-service mb-2">
                        <div className="panel-heading">
                            <b style={{ fontSize: '20px' }}>Recording logs</b>
                        </div>
                    </div>

                    <div className="container-fluid mb-3">
                        <div className="row align-items-center">
                            <div className="col-md-8">
                                <div className="d-flex align-items-center flex-wrap">
                                    <label htmlFor="start-date" className="me-2 mb-0">
                                        Start Date:
                                    </label>
                                    <input
                                        id="start-date"
                                        type="date"
                                        className="form-control me-3"
                                        style={{ width: 'auto' }}
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    <label htmlFor="end-date" className="me-2 mb-0">
                                        End Date:
                                    </label>
                                    <input
                                        id="end-date"
                                        type="date"
                                        className="form-control me-3"
                                        style={{ width: 'auto' }}
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                    <button
                                        id="search-logs-btn"
                                        className="btn btn-primary"
                                        onClick={handleSearch}
                                    >
                                        Search &nbsp;
                                        <i className="fa fa-search" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-4 text-end">
                                <button className="btn btn-primary" onClick={handleRefresh}>
                                    Refresh &nbsp;
                                    <i className="fa fa-refresh" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={data}
                        progressPending={loading}
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                        striped
                        highlightOnHover
                        responsive
                        customStyles={customStyles}
                        defaultSortFieldId={1}
                        defaultSortAsc={false}
                    />
                </div>
            </div>

            <FailureModal
                show={showModal}
                onHide={() => setShowModal(false)}
                calabrioId={modalData.calabrioId}
                failureMessage={modalData.failureMessage}
            />
        </div>
    );
};

export default RecordingLog;
