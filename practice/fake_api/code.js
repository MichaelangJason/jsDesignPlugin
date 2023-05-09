"use strict";
jsDesign.showUI(__html__, {
    width: 260,
    height: 393,
});
jsDesign.ui.onmessage = (msg) => {
    const fakeAPI = 'https://reqres.in/api/users';
    // fetch creates a Promise object
    fetch(fakeAPI)
        .then(res => {
        if (!res.ok) {
            console.log("Incorrect");
            return;
        }
        console.log("Success");
        return res.json();
    }).then(data => {
        console.log(data.data[2].email);
    });
};
