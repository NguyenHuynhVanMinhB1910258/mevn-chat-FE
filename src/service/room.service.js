import createApiClient from "./api.service";

class RoomService {
    constructor(baseUrl = "/") {
        this.api = createApiClient(baseUrl);
    }
    async getAll() {
        return (await this.api.get("/api/room")).data;
    }
    async getAllChat(roomid) {
        return (await this.api.get(`/api/chat/${roomid}`)).data;
    }
    async createroom(data) {
        return (await this.api.post("/api/room", data)).data;
    }
    async createchat(data) {
        return (await this.api.post("/api/chat", data)).data;
    }
    async get(id) {
        return (await this.api.get(`api/room/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`api/room/${id}`, data)).data;
    }
    async updateChat(id, data) {
        return (await this.api.put(`api/chat/${id}`, data)).data;
    }
    async DeleteAllChatRoom(id) {
        return (await this.api.delete(`api/chat/room/${id}`)).data;
    }
    async deleteRoom(id) {
        return (await this.api.delete(`api/room/${id}`)).data;
    }
    async deleteChat(id) {
        return (await this.api.delete(`api/chat/${id}`)).data;
    }
}
export default new RoomService();