import moment from 'moment';

export const RecordingStatus = {
    QUEUED: 1,
    SUCCESS: 2,
    FAILURE: 3,
    PROCESSING: 4,
    FAILURE_RETRY: 5,
};

export const formatDate = (date) => {
    return moment(date).format('MM/DD/YYYY HH:mm:ss');
};

export const formatDateInput = (date) => {
    return moment(date).format('YYYY-MM-DD');
};

export const htmlEncode = (str) => {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&#34;')
        .replace(/\n/g, '\\n');
};

export const getStatusDisplay = (status, taskId) => {
    switch (status) {
        case RecordingStatus.QUEUED:
            return (
                <span>
                    QUEUED &nbsp;
                    <i className="fa fa-plus-circle text-secondary" aria-hidden="true" title="Added to queue"></i>
                </span>
            );
        case RecordingStatus.SUCCESS:
            return (
                <span>
                    SUCCESS &nbsp;
                    <i className="fa fa-check-circle text-success" aria-hidden="true" title="Conversion succeeded"></i>
                </span>
            );
        case RecordingStatus.FAILURE:
            return (
                <span>
                    FAILURE &nbsp;
                    <i className="fa fa-times-circle text-danger" aria-hidden="true"></i>
                </span>
            );
        case RecordingStatus.PROCESSING:
            return (
                <span>
                    PROCESSING &nbsp;
                    <i className="fa fa-hourglass text-primary" aria-hidden="true" title="Conversion in progress"></i>
                </span>
            );
        default:
            return '';
    }
};
