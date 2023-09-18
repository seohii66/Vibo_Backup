
var mergedList = []; //병합된 결과를 담을 변수
mergedList = arr.map(function(item1){
	//arr2에서 arr1의 요소인 item1과 id값이 같은 항목을 return;
    var obj = arr2.find(function(item2){
        return item1.id == item2.id;
    })
    //기준이 되는 arr1의 요소인 item1
    //item1에 새로운 속성인 "job"을 생성하고, obj(arr2의 요소)의 "job"의 값을 셋팅
    item1.job = obj.job;
    return item1;
});
