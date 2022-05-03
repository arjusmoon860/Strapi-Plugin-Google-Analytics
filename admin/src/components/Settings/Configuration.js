/*
 *
 * SettingsPage
 *
 */

import React, { useState, useEffect } from 'react';
import pluginId from '../../pluginId';

import { Box, Link, LinkButton, Flex, Button } from '@strapi/design-system';
import { BaseHeaderLayout } from '@strapi/design-system/Layout';
import { Tabs, Tab, TabGroup, TabPanels, TabPanel } from '@strapi/design-system/Tabs';
import { Plus } from '@strapi/icons';
import axiosInstance from "../../utils/axiosInstance";

import CredentialScreen from './CredentialScreen';
import TutorialScreen from './TutorialScreen';
import AccountAlert from './Alert';
import AccountActions from './AccountActions';

const ConfigurationPage = () => {

    const [creds, setCreds] = useState({
        creds: {
            clientID: "",
            clientSecret: "",
            redirectURL: "",
            defaultScopes: "",
            accountConnected: false
        }
    });

    const [saving, setSaving] = useState(false);
    const [editable, setEditable] = useState(true);
    const [isConnecting, setIsConnecting] = useState(false);

    function handleClientID(clientID) {
        setCreds({
            creds: {
                clientID: clientID,
                clientSecret: creds.creds.clientSecret,
                redirectURL: creds.creds.redirectURL,
                defaultScopes: creds.creds.defaultScopes,
                accountConnected: creds.creds.accountConnected
            }
        })
    }

    function handleClientSecret(clientSecret) {
        setCreds({
            creds: {
                clientID: creds.creds.clientID,
                clientSecret: clientSecret,
                redirectURL: creds.creds.redirectURL,
                defaultScopes: creds.creds.defaultScopes,
                accountConnected: creds.creds.accountConnected
            }
        })
    }

    function handleRedirectURL(redirectURL) {
        setCreds({
            creds: {
                clientID: creds.creds.clientID,
                clientSecret: creds.creds.clientSecret,
                redirectURL: redirectURL,
                defaultScopes: creds.creds.defaultScopes,
                accountConnected: creds.creds.accountConnected
            }
        })
    }

    function handleDefaultScopes(defaultScopes) {
        setCreds({
            creds: {
                clientID: creds.creds.clientID,
                clientSecret: creds.creds.clientSecret,
                redirectURL: creds.creds.redirectURL,
                defaultScopes: defaultScopes,
                accountConnected: creds.creds.accountConnected
            }
        })
    }

    async function fetchData() {
        try {
            const { data } = await axiosInstance.get(`/strapi-plugin-google-analytics/credentials`);
            setCreds({
                creds: {
                    clientID: data.google_client_id ? data.google_client_id : "",
                    clientSecret: data.google_client_secret ? data.google_client_secret : "",
                    redirectURL: data.google_redirect_url ? data.google_redirect_url : "",
                    defaultScopes: data.google_scopes ? data.google_scopes : "",
                    accountConnected: data.access_token && data.refresh_token ? true : false
                }
            })
            if (data) {
                if (data.google_client_id && data.google_client_secret && data.google_redirect_url && data.google_scopes) {
                    setEditable(false);
                } else {
                    setEditable(true);
                }
            } else {
                setEditable(true);
            }
        } catch (error) {
            console.log(error);
            setCreds({
                creds: {
                    clientID: "",
                    clientSecret: "",
                    redirectURL: "",
                    defaultScopes: ""
                }
            })
            setEditable(true);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        setSaving(true);

        if (!creds.creds.clientID || !creds.creds.clientSecret || !creds.creds.redirectURL || !creds.creds.defaultScopes) {
            return;
        }

        try {
            await axiosInstance.post(`/strapi-plugin-google-analytics/credentials/add`, {
                google_client_id: creds.creds.clientID,
                google_client_secret: creds.creds.clientSecret,
                google_redirect_url: creds.creds.redirectURL,
                google_scopes: creds.creds.defaultScopes,
            })
            await fetchData();
            setSaving(false);
        } catch (error) {
            setSaving(false);
            console.log(error)
        }
    }

    function handleEdit() {
        setEditable(!editable);
    }

    async function handleConnectAccount() {
        try {
            setIsConnecting(true);
            const { data } = await axiosInstance.get(`/strapi-plugin-google-analytics/init`);
            window.location.replace(data.url);
        } catch (error) {
            console.log(error);
            setIsConnecting(false);
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <div>
            <Box padding={8} background="primary100">
                <BaseHeaderLayout
                    navigationAction={
                        <Link isExternal href="https://schbang.com">
                            Schbang.
                        </Link>
                    }
                    primaryAction={<LinkButton startIcon={<Plus />} size="L" variant="default" href="https://console.developers.google.com/start/api?id=analyticsreporting.googleapis.com&credential=client_key">
                        Enable Analytics API
                    </LinkButton>}
                    title="Google Analytics" subtitle="By Schbang." as="h2" />
            </Box>

            <Box paddingLeft={8} paddingRight={8} paddingTop={8}>
                <AccountAlert connected={creds.creds.accountConnected}></AccountAlert>
                <AccountActions isConnecting={isConnecting} handleConnectAccount={handleConnectAccount} connected={creds.creds.accountConnected} />
            </Box>

            <Box padding={8}>
                <TabGroup label="Google Analytics configuration" id="google-analytics-configuration-tabs" onTabChange={selected => console.log(selected)}>
                    <Tabs>
                        <Tab>OAuth Credentials</Tab>
                        <Tab>How to?</Tab>
                    </Tabs>
                    <TabPanels>
                        <TabPanel>
                            <Box color="neutral800" padding={4} background="neutral0">
                                <CredentialScreen
                                    creds={creds}
                                    handleClientID={handleClientID}
                                    handleClientSecret={handleClientSecret}
                                    handleRedirectURL={handleRedirectURL}
                                    handleDefaultScopes={handleDefaultScopes}
                                    handleSubmit={handleSubmit}
                                    saving={saving}
                                    editable={editable}
                                    handleEdit={handleEdit}
                                />
                            </Box>
                        </TabPanel>
                        <TabPanel>
                            <Box color="neutral800" padding={4} background="neutral0">
                                <TutorialScreen />
                            </Box>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </Box>
        </div>
    );
};

export default ConfigurationPage;
