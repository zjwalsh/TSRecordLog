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

            // Handle nested response structure: { success: true, data: { records: [...] } }
            let records = response.data;

            // Extract records array from nested structure if present
            if (records.data && records.data.records) {
                records = records.data.records;
            } else if (records.records) {
                records = records.records;
            } else if (!Array.isArray(records)) {
                records = [];
            }

            // Map API field names to frontend field names
            return records.map(record => ({
                TaskId: record.taskId,
                AgentName: record.agentName,
                FormName: record.formName,
                Program: record.program,
                DocumentumID: record.documentumId,
                CaseNumber: record.caseNumber,
                AppNumber: record.appNumber,
                CaseUUID: record.caseUUID,
                UploadedOn: record.updatedAt,
                Status: record.status || 4, // Default to Proccessing if not provided
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
