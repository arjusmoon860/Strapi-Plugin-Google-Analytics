import React from "react";
import { Alert } from "@strapi/design-system";

const AccountAlert = (props) => {
    if (props.connected) {
        return (<Alert closeLabel="Close alert" onClose={() => { console.log("Closed") }} title="Title" variant="success">Your Google Analytics account is connected.</Alert>)
    } else {
        return (<Alert closeLabel="Close alert" onClose={() => { console.log("Closed") }} title="Title" variant="danger">Please connect your Google Analytics account.</Alert>)
    }
}

export default AccountAlert;