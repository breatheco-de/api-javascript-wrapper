/* global fetch, localStorage */
class Wrapper{
    
    constructor(){
        this.assetsPath = process.env.ASSETS_URL+'/apis';
        this.apiPath = process.env.API_URL;
        this.token = null;
        this.pending = {
            get: {}, post: {}, put: {}, delete: {}
        };
    }
    
    setOptions(options){
        this.assetsPath = (typeof options.assetsPath !== 'undefined') ? options.assetsPath : this.assetsPath;
        this.apiPath = (typeof options.apiPath !== 'undefined') ? options.apiPath : this.apiPath;
    }
    
    setToken(token){
        this.token = token;
        if(typeof localStorage !== 'undefined') localStorage.setItem('bc_token', token);
    }
    getToken(data){
        if(this.token) return this.token;
        else{
            if(typeof localStorage !== 'undefined') return localStorage.getItem('bc_token');
            else null;
        } 
    }
    fetch(...args){
        return fetch(...args);
    }
    
    req(method, path, args){
        
        let opts = { 
            method, 
            headers: {'Content-Type': 'application/json'}
        };
        if(method === 'get'){
            path += this.serialize(args).toStr();
            this.token = this.getToken();
            if(this.token) path += `?access_token=${this.token}`;
        } 
        else
        {
            this.token = this.getToken();
            if(this.token) path += `?access_token=${this.token}`;
            //if(this.token) args.access_token = this.token;
            opts.body = this.serialize(args).toJSON();
        } 
        
        return new Promise((resolve, reject) => {
            
            if(typeof this.pending[method][path] !== 'undefined' && this.pending[method][path])
                reject({ pending: true, msg: `Request ${method}: ${path} was ignored because a previous one was already pending` });
            else this.pending[method][path] = true;
            
            this.fetch( path, opts)
            .then((resp) => {
                this.pending[method][path] = false;
                if(resp.status == 200) return resp.json();
                else if(resp.status == 403) reject({ msg: 'Invalid username or password', code: 403 }); 
                else if(resp.status == 401) reject({ msg: 'Unauthorized', code: 401 }); 
                else if(resp.status == 400) reject({ msg: 'Invalid Argument', code: 400 }); 
                else reject({ msg: 'Invalid username or password', code: 500 });
                return false;
            })
            .then((json) => { 
                if(!json) throw new Error('There was a problem processing the request');
                if(json.access_token) this.setToken(json.access_token);
                resolve(json);
                return json;
            })
            .catch((error) => {
                this.pending[method][path] = false;
                console.error(error.message);
                reject(error.message);
            });
        });
                
    }
    post(...args){ return this.req('post', ...args); }
    get(...args){ return this.req('get', ...args); }
    put(...args){ return this.req('put', ...args); }
    delete(...args){ return this.req('delete', ...args); }
    serialize(obj){
        return {
            obj,
            toStr: function(){
                var str = "";
                for (var key in this.obj) {
                    if (str != "") {
                        str += "&";
                    }
                    str += key + "=" + encodeURIComponent(this.obj[key]);
                }
                return str;
            },
            toJSON: function(){
                return JSON.stringify(this.obj);
            }
        }
    }
    
    credentials(){
        let url = this.assetsPath+'/credentials';
        return {
            autenticate: (username, password) => {
                return this.post(url+'/auth', { username, password });
            },
            remind: (username) => {
                return this.post(this.apiPath+'/remind/user/'+encodeURIComponent(username), { username });
            }
        };
    }
    syllabus(){
        let url = this.assetsPath+'/syllabus';
        return {
            get: (slug) => {
                if(!slug) throw new Error('Missing slug');
                else return this.get(url+'/'+slug);
            }
        };
    }
    todos(){
        let url = this.apiPath;
        return {
            getByStudent: (id) => {
                return this.get(url+'/student/'+id+'/task/');
            },
            add: (id, args) => {
                return this.post(url+'/student/'+id+'/task/', args);
            },
            update: (args) => {
                return this.post(url+'/task/'+args.id, args);
            }
        };
    }
    projects(){
        let url = this.assetsPath;
        return {
            all: (syllabus_slug) => {
                return this.get(url+'/project/all');
            }
        };
    }
    user(){
        let url = this.apiPath;
        return {
            all: () => {
                return this.get(url+'/user/');
            },
            add: (args) => {
                return this.put(url+'/user/', args);
            },
            update: (id, args) => {
                return this.post(url+'/user/'+id, args);
            },
            delete: (id) => {
                return this.delete(url+'/user/'+id);
            }
        };
    }
    student(){
        let url = this.apiPath;
        return {
            all: () => {
                return this.get(url+'/students/');
            },
            add: (args) => {
                return this.put(url+'/student/', args);
            },
            update: (id, args) => {
                return this.post(url+'/student/'+id, args);
            },
            delete: (id) => {
                return this.delete(url+'/student/'+id);
            }
        };
    }
    cohort(){
        let url = this.apiPath;
        return {
            all: () => {
                return this.get(url+'/cohorts/');
            },
            add: (args) => {
                return this.put(url+'/cohort/', args);
            },
            update: (id, args) => {
                return this.post(url+'/cohort/'+id, args);
            },
            delete: (id) => {
                return this.delete(url+'/cohort/'+id);
            }
        };
    }
    cohorts(){
        let url = this.apiPath;
        return {
            get: (id) => {
                return this.get(url+'cohort/'+id);
            }
        };
    }
}
module.exports = new Wrapper();