function kahanSum(arr) {
    let sum = 0.0;
    let compensation = 0.0;

    for (let i = 0; i < arr.length; i++) {
        let y = arr[i] - compensation;
        let t = sum + y;
        compensation = (t - sum) - y;
        sum = t;
    }

    return sum;
}


console.log(kahanSum([43.30127018922192, -43.30127018922193]))