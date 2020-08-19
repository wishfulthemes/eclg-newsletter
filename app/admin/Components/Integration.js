/**
 * Admin integration page component.
 *
 * @package email-capture-lead-generation
 * @since 1.0.2
 */

import { useState, useEffect } from '@wordpress/element'
import { Panel, PanelBody, PanelRow, ToggleControl, TextControl, Spinner, SelectControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';


const integrationDefault = () => {
    return {
        useOwnList: 'yes',
        selectedProvider: null,
        apiKeys: {},
    }
}


const providerOptions = () => {
    return [
        { label: __('Select One', 'email-capture-lead-generation'), value: null, disabled: true },
        { label: 'MailChimp', value: 'mailchimp' },
        { label: 'ActiveCampaign', value: 'activecampaign' }
    ];
}

const providerLists = () => {
    return [
        { label: __('Select List', 'email-capture-lead-generation'), value: null, disabled: true },
        { label: 'List One', value: 'listOne' },
        { label: 'List Two', value: 'listTwo' }
    ]
}

const Integration = () => {

    const { eclg_options } = eclg_data;

    const { eclg_integration } = eclg_options;

    const providers = providerOptions();

    const lists = providerLists();

    const [isLoading, setIsLoading] = useState(true);

    const [integrationData, setIntegrationData] = useState({});

    const [isSaving, setIsSaving] = useState(false);


    useEffect(function () {

        let data = {};
        data = 'undefined' !== typeof eclg_integration ? eclg_integration : integrationDefault();

        setIntegrationData(data);
        setIsLoading(false);
    }, []);


    const { useOwnList, selectedProvider, apiKeys } = integrationData;

    let providerLabel = '';

    if (null !== selectedProvider && 'undefined' !== typeof providers) {
        providers.filter(function (provider) {
            if (provider.value == selectedProvider) {
                providerLabel = provider.label;
            }
        });
    }

    let panelBodyTitle = null !== providerLabel ? providerLabel + ' ' + __('configurations', 'email-capture-lead-generation') : null;

    const apiKey = 'undefined' !== typeof apiKeys && 'undefined' !== typeof apiKeys[selectedProvider] ? apiKeys[selectedProvider] : '';

    let activeCampaignUrl = '';
    let activeCampaignKey = '';
    if ('activecampaign' == selectedProvider) {
        activeCampaignUrl = 'undefined' !== typeof apiKey && 'undefined' !== typeof apiKey.url ? apiKey.url : '';
        activeCampaignKey = 'undefined' !== typeof apiKey && 'undefined' !== typeof apiKey.key ? apiKey.key : '';
    }

    const onSaveButtonClicked = () => {

        setIsSaving(true);

        let data = new FormData();

        data.append('eclg_integration[useOwnList]', useOwnList);

        if ('yes' !== useOwnList && null !== selectedProvider) {
            data.append('eclg_integration[selectedProvider]', selectedProvider);
            if ( 'activecampaign' == selectedProvider ) {
                data.append(`eclg_integration[apiKeys][${selectedProvider}][url]`, activeCampaignUrl);
                data.append(`eclg_integration[apiKeys][${selectedProvider}][key]`, activeCampaignKey);
            } else {
                data.append(`eclg_integration[apiKeys][${selectedProvider}]`, apiKey);
            }
        }
        data.append('eclg_doing_ajax', 'yes');

        // POST
        apiFetch({
            url: `${ajaxurl}?action=eclg_save_data`,
            method: 'post',
            body: data,
        }).then(res => {
            setIsSaving(false);
        });

    }


    return (


        <div className="eclg-fields-container">

            <div className="eclg-fields-left">

                <Panel header={__('Integration and Newsletters', 'email-capture-lead-generation')}>

                    {
                        isLoading ?

                            <Spinner />

                            :

                            <>
                                <PanelBody title={__('Listing Providers', 'email-capture-lead-generation')}>

                                    <PanelRow>
                                        <label>{__('Use default own list', 'email-capture-lead-generation')}</label>
                                        <div className="email-capture-lead-generation-field-wrapper">
                                            <ToggleControl
                                                checked={useOwnList == 'yes'}
                                                onChange={
                                                    () => {
                                                        let isChecked = useOwnList == 'yes' ? 'no' : 'yes';
                                                        setIntegrationData({
                                                            ...integrationData,
                                                            useOwnList: isChecked
                                                        });
                                                    }
                                                }
                                            />
                                        </div>
                                    </PanelRow>


                                    {
                                        useOwnList == 'no' &&
                                        <PanelRow>
                                            <label>{__('Select your provider', 'email-capture-lead-generation')}</label>
                                            <div className="email-capture-lead-generation-field-wrapper">
                                                <SelectControl
                                                    options={providers}
                                                    value={selectedProvider ? selectedProvider : ''}
                                                    onChange={
                                                        (value) => {
                                                            setIntegrationData({
                                                                ...integrationData,
                                                                selectedProvider: value
                                                            });

                                                        }
                                                    }
                                                />
                                            </div>
                                        </PanelRow>
                                    }

                                </PanelBody>


                                {
                                    useOwnList == 'no' && null !== selectedProvider ?
                                        <>

                                            <PanelBody title={panelBodyTitle}>

                                                {
                                                    'activecampaign' == selectedProvider ?

                                                        <>

                                                            <PanelRow>
                                                                <label>{__('URL', 'email-capture-lead-generation')}</label>
                                                                <div className="email-capture-lead-generation-field-wrapper">
                                                                    <TextControl
                                                                        value={activeCampaignUrl ? activeCampaignUrl : ''}
                                                                        onChange={
                                                                            (value) => {
                                                                                let api = {};
                                                                                api = integrationData.apiKeys;

                                                                                if ( 'undefined' == typeof api[selectedProvider] ) {
                                                                                    api[selectedProvider] = {};
                                                                                }
                                                                                api[selectedProvider]['url'] = value;
                                                                                setIntegrationData({
                                                                                    ...integrationData,
                                                                                    apiKeys: api
                                                                                });
                                                                            }
                                                                        }
                                                                    />
                                                                </div>
                                                            </PanelRow>


                                                            <PanelRow>
                                                                <label>{__('Key', 'email-capture-lead-generation')}</label>
                                                                <div className="email-capture-lead-generation-field-wrapper">
                                                                    <TextControl
                                                                        value={activeCampaignKey ? activeCampaignKey : ''}
                                                                        onChange={
                                                                            (value) => {
                                                                                let api = {};
                                                                                api = integrationData.apiKeys;

                                                                                if ( 'undefined' == typeof api[selectedProvider] ) {
                                                                                    api[selectedProvider] = {};
                                                                                }
                                                                                api[selectedProvider]['key'] = value;
                                                                                setIntegrationData({
                                                                                    ...integrationData,
                                                                                    apiKeys: api
                                                                                });
                                                                            }
                                                                        }
                                                                    />
                                                                </div>
                                                            </PanelRow>


                                                        </>

                                                        :

                                                        <>

                                                            <PanelRow>
                                                                <label>{__('API Key', 'email-capture-lead-generation')}</label>
                                                                <div className="email-capture-lead-generation-field-wrapper">
                                                                    <TextControl
                                                                        value={apiKey ? apiKey : ''}
                                                                        onChange={
                                                                            (value) => {
                                                                                let api = {};
                                                                                api = integrationData.apiKeys;
                                                                                api[selectedProvider] = value;
                                                                                setIntegrationData({
                                                                                    ...integrationData,
                                                                                    apiKeys: api
                                                                                });
                                                                            }
                                                                        }
                                                                    />
                                                                </div>
                                                            </PanelRow>

                                                        </>

                                                }


                                                <PanelRow>
                                                    <label>{__('Lists', 'email-capture-lead-generation')}</label>
                                                    <div className="email-capture-lead-generation-field-wrapper">
                                                        <SelectControl
                                                            options={lists}
                                                            onChange={
                                                                (value) => {
                                                                    console.log(value);
                                                                }
                                                            }
                                                        />
                                                    </div>
                                                </PanelRow>


                                            </PanelBody>

                                        </>

                                        :

                                        null
                                }

                            </>
                    }

                </Panel>

            </div>

            <div className="eclg-fields-right">

                <Panel header="">

                    <PanelBody title={__('Save Settings', 'email-capture-lead-generation')}>

                        <PanelRow>

                            <Button
                                isBusy={isSaving}
                                disabled={isSaving || isLoading || ('no' == useOwnList && null == selectedProvider)}
                                onClick={() => onSaveButtonClicked()}
                                className="eclg-save-button"
                                isPrimary>
                                {isSaving ? __('Saving', 'email-capture-lead-generation') : __('Save', 'email-capture-lead-generation')}
                            </Button>

                        </PanelRow>

                    </PanelBody>

                </Panel>

            </div>

        </div>

    );
}



export default Integration;