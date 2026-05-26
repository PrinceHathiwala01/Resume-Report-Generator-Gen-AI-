import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials: true
});

export async function getInterviewReport(id) {
    const response = await api.get(`/api/interview/report/${id}`);
    return response.data;
}

export async function generateInterviewReport({ jobDescription, selfDescription, resume }) {
    const formData = new FormData();

    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);

    if (resume) {
        formData.append("resume", resume);
    }

    const response = await api.post("/api/interview", formData);
    return response.data;
}
