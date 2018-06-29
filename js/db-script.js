 // this is our idb script
 (function () {
     'use strict';
     const currencyconverterapiURL = `https://free.currencyconverterapi.com/api/v5/currencies`
     const idbPromise = _openDatabase();
     fetch(currencyconverterapiURL).then(response => {
         response.json().then(data => {
             console.log('this is the data', data)
             idbPromise.then(db => {
                 const currencies = data.results;
                 console.log(`fetching the data from the api ${currencies}`)
                 // create currency transaction
                 const tx = db.transaction(`currencies`, `readwrite`);
                 // currency objectstore
                 const store = tx.objectStore(`currencies`);
                 // limit the store to 50 
                 for (const currency in currencies) {
                     // save all the data
                    store.put(currencies[currency])
                    
                }
                return tx.complete
             }).catch(error=>console.log('Something went wrong', error))
         })
     })
    function _openDatabase() {
        if (!navigator.serviceWorker) {
             return Promise.resolve();
        }
        return idb.open('currencydb', 1, upgradeDb => {
            const store = upgradeDb.createObjectStore('currencies', {keyPath: 'id' });
            const conversion = upgradeDb.createObjectStore('conversion', {keyPath: 'id'})
            const curreyIndex = store.createIndex('currency','id');
        });
     }

     // The following function stores all the conversions that we have made previously
    function storeConvertedCurrency(to,fr){
        // call the function that converstes the results
        const BASE_API_URL = `https://free.currencyconverterapi.com/api/v5/convert?q=${fr}_${to}`
        const conversionPromise = fetch(BASE_API_URL).then(response => response.json().then(data => {return data}))
        conversionPromise.then(data=>{
            console.log('data to be stored',Object.entries(data.results)[0][1])
            idbPromise.then(db=>{
                // access the database
                const tx  = db.transaction('conversion','readwrite');
                const store  = tx.objectStore('conversion');
                // save api results on the idbstore for offline use.
                const apiConvetedCurrency  = data.results;
                store.put(Object.entries(apiConvetedCurrency)[0][1]);
                return tx.complete;
            }).catch(error=>console.log('Something went wrong could not save api results', error))
        })
    }

     // experimental region
    function readCurrency(){
        idbPromise.then(db=>{
            console.log('reading db data ...');
            // we're going to read using a Cursor
            const tx  = db.transaction('currencies');
            const currencyIndexStore = tx.objectStore('currencies');
            const curreyIndex = currencyIndexStore.index('currency');
            // read all the data out
            return curreyIndex.getAll();
         }).then(currencies =>{
            console.log('all currencies logged', currencies);
        });
    }
    readCurrencyData();
})();