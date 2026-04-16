import axios from 'axios';

// Configure your API base URL here
// For AWS deployment with DynamoDB backend, use environment variable
// This should point to your API Gateway endpoint
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const recordingLogService = {
    // Get recording logs with date range from DynamoDB
    // Backend should handle DynamoDB query/scan with date filtering
    getRecordingLogs: async (startDate, endDate) => {
        try {
            const response = await api.get(`/recording-log?startDate=${startDate}&endDate=${endDate}`);

            // Normalize possible response envelopes from API Gateway/Lambda and app backends.
            let payload = response.data;

            // Lambda proxy integrations can return data in a serialized body.
            if (payload && typeof payload.body === 'string') {
                try {
                    payload = JSON.parse(payload.body);
                } catch (parseError) {
                    console.error('Failed to parse response body JSON:', parseError);
                    payload = [];
                }
            }

            // Extract records array from known response shapes.
            let records = payload;
            if (records && records.data && Array.isArray(records.data.records)) {
                records = records.data.records;
            } else if (records && Array.isArray(records.records)) {
                records = records.records;
            } else if (!Array.isArray(records)) {
                records = [];
            }

            // Support both PascalCase (DynamoDB) and camelCase (existing API) field names.
            return records.map((record) => ({
                TaskId: record.TaskId ?? record.taskId ?? '',
                AgentName: record.AgentName ?? record.agentName ?? '',
                FormName: record.FormName ?? record.formName ?? '',
                Program: record.Program ?? record.program ?? '',
                DocumentumID: record.DocumentumID ?? record.documentumId ?? '',
                CaseNumber: record.CaseNum ?? record.caseNum ?? record.CaseNumber ?? record.caseNumber ?? '',
                AppNumber: record.AppNum ?? record.appNum ?? record.AppNumber ?? record.appNumber ?? '',
                CaseUUID: record.CaseUUID ?? record.caseUUID ?? '',
                UploadedOn: record.CreatedOn ?? record.createdOn ?? record.UpdatedAt ?? record.updatedAt ?? '',
                Status: Number(record.Status ?? record.status ?? 4), // Default to PROCESSING if missing
            }));
        } catch (error) {
            console.error('Error fetching recording logs from DynamoDB:', error);
            throw error;
        }
    },

    // Requeue a failed recording
    // TaskId is used as the primary key for DynamoDB
    requeueRecording: async (taskId) => {
        try {
            const response = await api.post('/recording', { taskId });
            return response.data;
        } catch (error) {
            console.error('Error requeuing recording:', error);
            throw error;
        }
    },
};

export default api;
