/* global fetch, localStorage, window */
class Wrapper{
    
    constructor(){
        this.assetsPath = (typeof process != 'undefined') ? process.env.ASSETS_URL+'/apis' : null;
        this.apiPath = (typeof process != 'undefined') ? process.env.API_URL : null;
        this.token = (typeof process != 'undefined') ? process.env.API_TOKEN : null;
        this.assetsToken = (typeof process != 'undefined') ? process.env.ASSETS_TOKEN : null;
        this._debug = false;
        this.automaticLogout = true;
        this.pending = {
            get: {}, post: {}, put: {}, delete: {}
        };
    }
    _logError(error){ if(this._debug) console.error(error); }
    
    setOptions(options){
        this.assetsPath = (typeof options.assetsPath !== 'undefined') ? options.assetsPath : this.assetsPath;
        this.apiPath = (typeof options.apiPath !== 'undefined') ? options.apiPath : this.apiPath;
        this.automaticLogout = (typeof options.automaticLogout !== 'undefined') ? options.automaticLogout : this.automaticLogout;
        this._debug = (typeof options.debug !== 'undefined') ? options.debug : this._debug;
        if(typeof options.token !== 'undefined') this.setToken({bc_token: options.token});
        if(typeof options.assetsToken !== 'undefined') this.setToken({assets_token: options.assetsToken});
    }
    
    setToken({bc_token, assets_token}){
        if(typeof bc_token != 'undefined')
        {
            this.token = bc_token;
            if(typeof localStorage !== 'undefined') localStorage.setItem('bc_token', bc_token);
        }
        if(typeof assets_token != 'undefined')
        {
            this.assetsToken = assets_token;
            if(typeof localStorage !== 'undefined') localStorage.setItem('bc_assets_token', assets_token);
        }
    }
    getToken(key=''){
        const tokens = {
            bc_token: (this.token) ? this.token : (typeof localStorage !== 'undefined') ? localStorage.getItem('bc_token') : null,
            assets_token: (this.assetsToken) ? this.assetsToken : (typeof localStorage !== 'undefined') ? localStorage.getItem('bc_assets_token') : null
        };
        if(key=='assets') return tokens.assets_token;
        else if(key=='api') return tokens.bc_token;
        else return tokens;
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
            path += `?access_token=${this.getToken((path.indexOf('//assets') == -1) ? 'api':'assets')}`;
        } 
        else
        {
            path += `?access_token=${this.getToken((path.indexOf('//assets') == -1) ? 'api':'assets')}`;
            //if(this.token) args.access_token = this.token;
            if((method=='post' || method=='put') && !args) throw new Error('Missing request body');
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
                    else{
                        this._logError(resp);
                        if(resp.status == 403) reject({ msg: 'Invalid username or password', code: 403 }); 
                        else if(resp.status == 401){
                            reject({ msg: 'Unauthorized', code: 401 }); 
                            if(this.automaticLogout) window.location.href="/login";
                        } 
                        else if(resp.status == 400) reject({ msg: 'Invalid Argument', code: 400 }); 
                        else reject({ msg: 'There was an error, try again later', code: 500 });
                    } 
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
    _encodeKeys(obj){
        for(let key in obj){
            let newkey = key.replace('-','_');
            
            let temp = obj[key];
            delete obj[key];
            obj[newkey] = temp;
        }
        return obj;
    }
    _decodeKeys(obj){
        for(let key in obj){
            let newkey = key.replace('_','-');
            
            let temp = obj[key];
            delete obj[key];
            obj[newkey] = temp;
        }
        return obj;
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
        };
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
    todo(){
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
    project(){
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
    event(){
        let url = this.assetsPath;
        this.token
        return {
            all: () => {
                return this.get(url+'/event/all');
            },
            get: (id) => {
                return this.get(url+'/event/'+id);
            },
            add: (args) => {
                return this.put(url+'/event/', args);
            },
            update: (id, args) => {
                return this.post(url+'/event/'+id, args);
            },
            delete: (id) => {
                return this.delete(url+'/event/'+id);
            }
        };
    }
    student(){
        let url = this.apiPath;
        let assetsURL = this.assetsPath;
        return {
            all: () => {
                return this.get(url+'/students/');
            },
            add: (args) => {
                return this.put(assetsURL+'/credentials/signup', args);
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
            get: (id) => {
                return this.get(url+'/cohort/'+id);
            },
            add: (args) => {
                return this.put(url+'/cohort/', args);
            },
            update: (id, args) => {
                return this.post(url+'/cohort/'+id, args);
            },
            delete: (id) => {
                return this.delete(url+'/cohort/'+id);
            },
            addStudents: (cohortId, studentsArray) => {
                studentsArray = studentsArray.map(id => {
                    return { student_id: id };
                });
                return this.post(url+'/student/cohort/'+cohortId, studentsArray);
            },
            removeStudents: (cohortId, studentsArray) => {
                studentsArray = studentsArray.map(id => {
                    return { student_id: id };
                });
                return this.delete(url+'/student/cohort/'+cohortId, studentsArray);
            }
        };
    }
    location(){
        let url = this.apiPath;
        return {
            all: () => {
                return this.get(url+'/locations/');
            },
            get: (id) => {
                return this.get(url+'/location/'+id);
            },
            add: (args) => {
                return this.put(url+'/location/', args);
            },
            update: (id, args) => {
                return this.post(url+'/location/'+id, args);
            },
            delete: (id) => {
                return this.delete(url+'/location/'+id);
            }
        };
    }
    profile(){
        let url = this.apiPath;
        return {
            all: () => {
                return this.get(url+'/profiles/');
            },
            get: (id) => {
                return this.get(url+'/profile/'+id);
            },
            add: (args) => {
                return this.put(url+'/profile/', args);
            },
            update: (id, args) => {
                return this.post(url+'/profile/'+id, args);
            },
            delete: (id) => {
                return this.delete(url+'/profile/'+id);
            }
        };
    }
}
if(typeof module != 'undefined') module.exports = new Wrapper();
window.BC = new Wrapper();