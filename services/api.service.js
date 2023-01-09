import axios from 'axios'

const ApiService = {
    init(baseURL) {
        axios.defaults.baseURL = baseURL;
    },

    get(resource) {
        return axios.get(resource)
    },

    post(resource, data, callback) {
        return axios.post(resource, data, callback);
    },

    put(resource, data) {
        return axios.put(resource, data)
    },

    validate_set(id_type, set, runs, replace, distance, background, type, sigCont, mail, sigContTargets) {
        let data = {
            target: set,
            target_id: id_type,
            runs: runs,
            replace: replace,
            distance: distance,
            background_model: background,
            type: type,
            sigCont: sigCont,
            sigContTarget: sigContTargets
        }
        if (mail)
            data.mail = mail
        return this.post("/set", data).then(response => {
            return response.data
        })

    },

    validate_subnetwork(id_type, set, runs, replace, distance, background, network, type, sigCont, mail, sigContTargets) {
        let data = {
            target: set,
            target_id: id_type,
            runs: runs,
            replace: replace,
            distance: distance,
            background_model: background,
            network_data: network,
            type: type,
            sigCont: sigCont,
            sigContTarget: sigContTargets
        };
        if (mail)
            data.mail = mail
        return this.post("/subnetwork", data).then(response => {
            return response.data
        })
    },

    validate_subnetwork_set(id_type, set, ref_id, ref, runs, replace, distance, background, network, type, sigCont, mail, sigContTargets) {
        let data = {
            target: set,
            target_id: id_type,
            reference: ref,
            reference_id: ref_id,
            runs: runs,
            replace: replace,
            distance: distance,
            background_model: background,
            network_data: network,
            type: type,
            sigCont: sigCont,
            sigContTarget: sigContTargets
        };
        if (mail)
            data.mail = mail
        return this.post("/subnetwork_set", data).then(response => {
            return response.data
        })
    },

    validate_set_set(target_id, target, ref_id, ref, runs, replace, enriched, distance, background, type, sigCont, mail, sigContTargets) {
        let data = {
            target: target,
            target_id: target_id,
            reference: ref,
            reference_id: ref_id,
            runs: runs,
            replace: replace,
            enriched: enriched,
            distance: distance,
            background_model: background,
            type: type,
            sigCont: sigCont,
            sigContTarget: sigContTargets
        }
        if (mail)
            data.mail = mail
        return this.post("/set_set", data).then(response => {
            return response.data
        })
    },

    validate_id_set(target_id, target, ref_id, ref, runs, replace, enriched, distance, background, type, sigCont, mail, sigContTargets) {
        let data = {
            target: target,
            target_id: target_id,
            reference: ref,
            reference_id: ref_id,
            runs: runs,
            replace: replace,
            enriched: enriched,
            distance: distance,
            background_model: background,
            type: type,
            sigCont: sigCont,
            sigContTarget: sigContTargets
        }
        if (mail)
            data.mail = mail
        return this.post("/id_set", data).then(response => {
            return response.data
        })
    },

    validate_cluster(target_id, target, runs, replace, distance, background, type, sigCont,mail, sigContTargets) {
        let data = {
            target: target,
            target_id: target_id,
            runs: runs,
            replace: replace,
            distance: distance,
            background_model: background,
            type: type,
            sigCont: sigCont,
            sigContTarget: sigContTargets
        }
        if (mail)
            data.mail = mail
        return this.post("/clustering", data).then(response => {
            return response.data
        })
    },


    getTaskStatus(taskID) {
        return this.get("/status?task=" + taskID).then(response => {
            return response.data
        })
    },
    getTaskResult(taskID) {
        return this.get("/result?task=" + taskID).then(response => {
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
