import React from "react";

import { Flex, Button } from '@strapi/design-system';
import { Trash, Refresh, Plus } from '@strapi/icons';
import './Common.css';

const AccountActions = (props) => {
    const removeAccountButton = (
        <div>
            <Button size="L" startIcon={<Trash />} marginTop={2} variant='danger'>Remove Account</Button>
        </div>
    )

    return (
        <div>
            <div className='marTop10'>
                <Flex justifyContent="center">
                    <div className="marRight10">
                        <Button loading={props.isConnecting} onClick={props.handleConnectAccount} size="L" startIcon={props.connected ? <Refresh /> : <Plus />} marginTop={2} variant='default'>{props.connected ? "Reconnect Account" : "Connect Account"}</Button>
                    </div>
                    {props.connected ? removeAccountButton : ""}
                </Flex>
            </div>
        </div>
    )
}

export default AccountActions;