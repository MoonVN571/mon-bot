
module.exports.getCardValue = data => {
    // check first and second
    if(!data) throw new Error("Thiếu data");
    let dataChinh = data.split("<:")[1].split(":")[0];

    let slice = dataChinh.slice(0,2);
    if(!isNaN(slice)) return +slice;
    else if(isNaN(slice.slice(0) == "a")) return 1;
    else if(!isNaN(slice.slice(0,1))) return +slice.slice(0,1);
    else return 10;
}