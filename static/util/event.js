class EventEmeitter {
    constructor() {
        this.map = new Map(); // 储存事件/回调键值对   
    }
}
EventEmeitter.prototype.addListener = function (name, fn) {

    if (typeof fn !== 'function'){
        throw new Error('add fn need to be a function')
    }
    if(this.map[name] === undefined) {
        this.map[name] = [fn]
    } else {
        this.map[name].push(fn)
    }
};

EventEmeitter.prototype.emit = function (type, ...args) {

    let funcList = this.map[type];
    if(Object.prototype.toString.call(funcList) !== "[object Array]"){
        return;
    }
  
    funcList.map(item => {
        if (args.length === 0) {
            item.apply(null);
        } else {
            item.apply(null, args)
        }
    })
};

EventEmeitter.prototype.remove = function (type, fn) {
    let funcList = this.map[type];
    if(Object.prototype.toString.call(funcList) !== "[object Array]"){
        return;
    }
    funcList.map((item, index) => {
        if(item.name === fn.name){
            funcList.splice(index, 1)
            return;
        }
    })
};

const dep = new EventEmeitter();
export default dep;

