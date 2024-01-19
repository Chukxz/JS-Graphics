const time = new Date().getTime();
const log = (_) => { console.log(`${_}\nElapsed : ${new Date().getTime() - time} ms`); };
// // L1
// log("😀 Synchronous 1");
// // L2
// setTimeout((_: any) => log(`🍅 Timeout 2`),0);
// // L3
// Promise.resolve().then(_ => log("🍍 Promise 3"));
// // L4
// log("😎 Synchronous 4");
// import fetch from 'node-fetch';
// const promise = fetch('https://jsonplaceholder.typicode.com/todos/1');
// promise.then(res => res.json())
//        .then(user => {
//        //throw new Error("uh oh");
//         log("😂 " + user.title)
//        })
//        .catch(err => log("😭 " + err));
// log("🍰 Synchronous");
// const codeBlocker = () => { 
//   /*
//   let i = 0;
//   while (i < 1_000_000_000){i++;};
//    return "billion loops done 🐷";
//    */
//   return new Promise((resolve, reject) => {
//     let i = 0;
//     while( i < 1_000_000_000){i++};
//     resolve('billion loops done 🐷');
//   });
// }
// log("😀 Synchronous 1");
// codeBlocker().then(log);
// log("😎 Synchronous 2");
// const codeBlocker = () => {  
//   return Promise.resolve().then(v => {
//     let i = 0;
//   while (i < 1_000_000_000){i++;};
//    return "billion loops done 🐷";
//   })
// }
//as async
// const codeBlocker = async () => {   
//    await Promise.resolve();
//    let i = 0;
//    while(i < 1000000000) { i++; }
//    ;
//    return "billion loops done 🐷";
//  }
// log("😀 Synchronous 1");
// codeBlocker().then(log);
// log("😎 Synchronous 2");
// Basic
/*
const getFruit = async (name: string) => {
  const fruits: { [name: string]: string } = {
    pineapple: "🍍",
    peach: "🍑",
    strawberry: "🍓"
  }

  return fruits[name];
  // const fruit_emoji = await Promise.resolve(fruits[name]);
  // return `What a cool ${name} ${fruit_emoji} fruit`;
}
*/
// const getFruit = (name : string) => {
// const fruits : {[name : string] : string} = {
//     pineapple:  "🍍",
//     peach:      "🍑",
//     strawberry: "🍓"
//   }
//   return Promise.resolve(fruits[name]);
//   // return Promise.resolve(fruits[name]).then(fruit_emoji => {
//   //   return `What a cool ${name} ${fruit_emoji} fruit`;
//   // });
// }
// const make_smoothie1 = async () => {
//   const a = await getFruit('pineapple');
//   const b = await getFruit('strawberry');
//   return [a,b];
// }
// const make_smoothie2 = () => {
//   let a : any;
//   return getFruit('pineapple')
//   .then( v => {
//     a = v;
//     return getFruit('strawberry')
//   })
//   .then(v => [a, v]);
// }
/*
const make_smoothie = async () => {
  try {

    const a = await getFruit('pineapple');
    const b = await getFruit('strawberry');
    const smoothie = Promise.all([a,b]);

    // throw 'broken!';

    return smoothie;
  }
  catch(err) {
    log(err);
    // return "😀 we are going to be fine..."
    // throw 'broken!';
  }
}

make_smoothie().then(log);
//make_smoothie().then(log).catch((err)=>log(err));
*/
// const fruits = ['peach', 'pineapple', 'strawberry'];
// pauses at each iteration until the promise is resolved
// const fruitLoop = async() => {
//   for (const f of fruits) {
//     const emoji = await getFruit(f);
//     log(emoji);
//   }
// }
// runs everything concurrently
// const smoothie = fruits.map(v => getFruit(v));
// const fruitLoop = async() => {
//   for await(const emoji of smoothie) {
//     log(emoji);
//   }
// }
// const fruitInspection = async () => {
//   if(await getFruit('peach') === '🍑') {
//     log('looks peachy');
//   }
// }
// fruitLoop();
// fruitInspection();
// log("Everything is okay right?");
// function resolveAfter2Seconds() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve('resolved');
//     }, 2000);
//   });
// }
// async function asyncCall() {
//   log('calling');
//   const result = await resolveAfter2Seconds();
//   log(result);
//   // Expected output: "resolved"
// }
// asyncCall();
// log("Hey everyone , how are y'all doing?");
function resolveAfter2Seconds() {
    log("starting slow promise");
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("slow");
            log("slow promise is done");
        }, 2000);
    });
}
function resolveAfter1Second() {
    log("starting fast promise");
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("fast");
            log("fast promise is done");
        }, 1000);
    });
}
async function sequentialStart() {
    log("== sequentialStart starts ==");
    // 1. Start a timer, log after it's done
    const slow = resolveAfter2Seconds();
    log(await slow);
    // 2. Start the next timer after waiting for the previous one
    const fast = resolveAfter1Second();
    log(await fast);
    log("== sequentialStart done ==");
}
async function sequentialWait() {
    log("== sequentialWait starts ==");
    // 1. Start two timers without waiting for each other
    const slow = resolveAfter2Seconds();
    const fast = resolveAfter1Second();
    // 2. Wait for the slow timer to complete, and then log the result
    log(await slow);
    // 3. Wait for the fast timer to complete, and then log the result
    log(await fast);
    log("== sequentialWait done ==");
}
async function concurrent1() {
    log("== concurrent1 starts ==");
    // 1. Start two timers concurrently and wait for both to complete
    const results = await Promise.all([
        resolveAfter2Seconds(),
        resolveAfter1Second(),
    ]);
    // 2. Log the results together
    log(results[0]);
    log(results[1]);
    log("== concurrent1 done ==");
}
async function concurrent2() {
    log("== concurrent2 starts ==");
    // 1. Start two timers concurrently, log immediately after each one is done
    await Promise.all([
        (async () => log(await resolveAfter2Seconds()))(),
        (async () => log(await resolveAfter1Second()))(),
    ]);
    log("== concurrent2 done ==");
}
sequentialStart(); // after 2 seconds, logs "slow", then after 1 more second, "fast"
// wait above to finish
setTimeout(sequentialWait, 4000); // after 2 seconds, logs "slow" and then "fast"
// wait again
setTimeout(concurrent1, 7000); // same as sequentialWait
// wait again
setTimeout(concurrent2, 10000); // after 1 second, logs "fast", then after 1 more second, "slow"
