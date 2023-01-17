import axios from 'axios'

const ApiService = {
    init(baseURL) {
        axios.defaults.baseURL = baseURL;
    },

    get(resource) {
        return axios.get(resource, {cache: false})
    },

    post(resource, data, callback) {
        return axios.post(resource, data, callback);
    },

    put(resource, data) {
        return axios.put(resource, data)
    },

    initTask(mode){
        return this.get("/init_task?mode="+mode).then(response=>{
            return response.data
        })
    },

    getInput(id){
        return this.get("/get_input?uid="+id).then(response=>{
            return response.data
        })
    },

    runFilter(payload){
        return this.post("/run_filter",payload)
    },

    runRemap(payload){
        return this.post("/run_remap",payload)
    },

    runReduce(payload){
        return this.post("/run_reduce",payload)
    },

    runOrtho(payload){
        return this.post("/run_ortho",payload)
    },

    runNetwork(payload){
        return this.post("/save_network", payload)
    },

    runIntersect(payload){
      return this.post("/run_intersect", payload)
    },

    getPreview(req){
        return this.get("/get_preview?"+req).then(response=>{
            return response.data
        })
    },

    getContent(req){
        return this.get("/get_file_content?"+req).then(response=>{
            return response.data
        })
    },


    getTaskStatus(taskID) {
        return this.get("/status?task=" + taskID).then(response => {
            return response.data
        })
    },
    getResultFiles(taskID) {
        return this.get("/result_file_list?task=" + taskID).then(response => {
            return response.data
        })
    }
}
export default ApiService
