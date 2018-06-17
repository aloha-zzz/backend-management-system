
export default function addKey(arr) {
    if ((Object.prototype.toString.call(arr)) !== "[object Array]") {
        return;
    }

    arr.map((item, index) => {
        item.key = index
    })
    return arr;
}