function add(num){
  ds = num.reduce((numBefore,numNext)=>numBefore+numNext,0)
  return ds
}
let da= [1,2,3]
console.log(add(da))