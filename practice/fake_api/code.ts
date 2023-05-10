
jsDesign.showUI(__html__, {
    width: 260,
    height: 393,
})

// API authentication parameters
const authentication = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer hEBPHU9ZzUiwY5WuhHklAZyhOXodkGCPfRxzNOFZ02o=',
        //Credential: 'omit',
        Referer: 'https://js.design'
    }
}

/**
 * this function only process API request based on user input
 * any webpage changes are made in GUI file
 */
jsDesign.ui.onmessage = (msg) => {
    // user input assume to have none empty string value

    // combine user input with API access URL
    const searchInput = 'https://api.brandfetch.io/v2/search/' + msg.val;
    let brandsInfo;

    // invoke API to gain the result
    // fetch(searchInput, authentication)
    //     .then(res => {
    //         brandsInfo = res.json()
    //         return brandsInfo;
    //     })
    //     .then(res => console.log(res))
    //     .catch(err => console.log(err))
    fetch('https://reqres.in/api/users')
        .then(res => console.log(res))
        .catch(err => console.log(err))
    
}
