import React from 'react';
import { Box, Button, Flex, Textarea, Tooltip } from '@strapi/design-system';
import { Typography } from '@strapi/design-system/Typography';
import { GridLayout } from '@strapi/design-system/Layout';
import { TextInput } from '@strapi/design-system/TextInput';
import { Write, Lock, Information } from '@strapi/icons';

const CredentialScreen = (props) => {
    return (
        <div>
            <Box padding={0} background="neutral0">
                <Box padding={4}>
                    <Typography variant="beta">Add/Update your Google Project Details.</Typography>
                </Box>
                <GridLayout>
                    <Box padding={4} hasRadius background="neutral0" shadow="tableShadow">
                        <TextInput name="client_id" required disabled={!props.editable} placeholder="This is a content placeholder" label="Google Client ID" hint="Ends with apps.googleusercontent.com" onChange={e => props.handleClientID(e.target.value)} value={props.creds.creds.clientID} />
                    </Box>
                    <Box padding={4} hasRadius background="neutral0" shadow="tableShadow">
                        <TextInput name="client_secret" required type="password" disabled={!props.editable} placeholder="This is a content placeholder" label="Google Client Secret" hint="Available in your google project" onChange={e => props.handleClientSecret(e.target.value)} value={props.creds.creds.clientSecret} />
                    </Box>
                    <Box padding={4} hasRadius background="neutral0" shadow="tableShadow">
                        <TextInput name="redirect_url" required disabled={!props.editable} placeholder="This is a content placeholder" label="Redirect URL" hint={`STRAPI_ADMIN_BACKEND_URL/strapi-plugin-google-analytics/google/redirect.`} onChange={e => props.handleRedirectURL(e.target.value)} value={props.creds.creds.redirectURL} labelAction={<Tooltip description={`Example: ${process.env.STRAPI_ADMIN_BACKEND_URL}/strapi-plugin-google-analytics/google/redirect`}>
                            <button aria-label="Information about the field" style={{
                                border: 'none',
                                padding: 0,
                                background: 'transparent'
                            }}>
                                <Information aria-hidden={true} />
                            </button>
                        </Tooltip>} />
                    </Box>
                </GridLayout>
                <GridLayout>
                    <Box padding={4} marginTop={4} hasRadius background="neutral0" shadow="tableShadow">
                        <Textarea name="json_data" required disabled={!props.editable} placeholder="" label="Default Scopes" hint='{"scopes":["https://www.googleapis.com/auth/userinfo.email","https://www.googleapis.com/auth/userinfo.profile"]}' onChange={e => props.handleDefaultScopes(e.target.value)} value={props.creds.creds.defaultScopes} />
                    </Box>
                </GridLayout>
                <Flex marginTop={4} justifyContent="space-between">
                    <Button onClick={props.handleEdit} size="L" endIcon={<Write />} variant='secondary'>{props.editable ? 'Cancel Edit' : 'Edit'}</Button>
                    <Button loading={props.saving} onClick={props.handleSubmit} size="L" endIcon={<Lock />} variant='default'>Save Credentials</Button>
                </Flex>
            </Box>
        </div>
    )
}

export default CredentialScreen;